import React, { useRef, useEffect } from 'react';
import {
  Player,
  Bullet,
  Platform,
  QuestionBlock,
  SealGate,
  SupplyPod,
  DroppedItem,
  Enemy,
  Particle,
  FloatingText,
  WeaponType
} from '../types/game';
import { soundEngine } from '../utils/audio';

interface GameCanvasProps {
  stageId: number;
  stageName: string;
  levelWidth: number;
  skyColorTop: string;
  skyColorBottom: string;
  backgroundTheme: 'candy_kingdom' | 'crystal_lake' | 'celestial_temple';
  platforms: Platform[];
  questionBlocks: QuestionBlock[];
  sealGates: SealGate[];
  supplyPods: SupplyPod[];
  enemies: Enemy[];
  playerLives: number;
  playerHp: number;
  playerMaxHp: number;
  playerMana: number;
  playerMaxMana: number;
  playerWeapon: WeaponType;
  invincibleTimer: number;
  score: number;
  isPaused: boolean;
  activeGateId: string | null;
  onPlayerHpManaChange: (hp: number, mana: number, lives: number) => void;
  onPlayerWeaponChange: (weapon: WeaponType) => void;
  onAddScore: (points: number) => void;
  onTriggerQuestion: (sourceId: string, rewardWeapon?: WeaponType, isGate?: boolean) => void;
  onStageClear: () => void;
  onGameOver: () => void;
  onBossHpUpdate: (hp: number | null, maxHp: number | null) => void;
  onDayPhaseChange?: (phase: 'day' | 'sunset' | 'night') => void;
  touchInput: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
    shoot: boolean;
  };
  skillTriggerTime?: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stageId,
  levelWidth,
  skyColorTop,
  skyColorBottom,
  backgroundTheme,
  platforms,
  questionBlocks,
  sealGates: initialGates,
  supplyPods: initialPods,
  enemies: initialEnemies,
  playerLives,
  playerHp,
  playerMaxHp,
  playerMana,
  playerMaxMana,
  playerWeapon,
  invincibleTimer,
  score,
  isPaused,
  activeGateId,
  onPlayerHpManaChange,
  onPlayerWeaponChange,
  onAddScore,
  onTriggerQuestion,
  onStageClear,
  onGameOver,
  onBossHpUpdate,
  onDayPhaseChange,
  touchInput,
  skillTriggerTime = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable Game State refs for smooth 60fps loop
  const playerRef = useRef<Player>({
    x: 80,
    y: 300,
    vx: 0,
    vy: 0,
    width: 28,
    height: 44,
    isGrounded: false,
    facing: 'right',
    aimDirection: 'horizontal',
    isCrouching: false,
    weapon: playerWeapon,
    lives: playerLives,
    maxHp: playerMaxHp,
    hp: playerHp,
    maxMana: playerMaxMana,
    mana: playerMana,
    invincibleTimer: 0,
    barrierTimer: 0,
    rapidCooldown: 0
  });

  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const blocksRef = useRef<QuestionBlock[]>([]);
  const gatesRef = useRef<SealGate[]>([]);
  const podsRef = useRef<SupplyPod[]>([]);
  const droppedItemsRef = useRef<DroppedItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const cameraXRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number | null>(null);
  const animTimeRef = useRef<number>(0);
  const lastSkillTimeRef = useRef<number>(0);

  // Mascot Pet Crocodile (Bé Cá Sấu Wani 🐊) state
  const crocRef = useRef({
    x: 48,
    y: 300,
    vx: 0,
    vy: 0,
    width: 24,
    height: 18,
    facing: 'right' as 'left' | 'right',
    isGrounded: true,
    tailAngle: 0,
    waddleCycle: 0
  });

  // Keep state synced with props
  useEffect(() => {
    playerRef.current.weapon = playerWeapon;
  }, [playerWeapon]);

  useEffect(() => {
    playerRef.current.hp = playerHp;
    playerRef.current.mana = playerMana;
    playerRef.current.lives = playerLives;
  }, [playerHp, playerMana, playerLives]);

  // Initial stage elements
  useEffect(() => {
    enemiesRef.current = JSON.parse(JSON.stringify(initialEnemies));
    blocksRef.current = JSON.parse(JSON.stringify(questionBlocks));
    gatesRef.current = JSON.parse(JSON.stringify(initialGates));
    podsRef.current = JSON.parse(JSON.stringify(initialPods));
    bulletsRef.current = [];
    droppedItemsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    cameraXRef.current = 0;
    playerRef.current.x = 80;
    playerRef.current.y = 300;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.barrierTimer = 0;
    crocRef.current.x = 48;
    crocRef.current.y = 300;
    crocRef.current.vx = 0;
    crocRef.current.vy = 0;
  }, [stageId, initialEnemies, questionBlocks, initialGates, initialPods]);

  // Handle activeGateId unlock (when player answered correctly)
  useEffect(() => {
    if (activeGateId) {
      const g = gatesRef.current.find(gate => gate.id === activeGateId);
      if (g && !g.unlocked) {
        g.unlocked = true;
        g.shattering = true;
        g.shatterTimer = 40;
        soundEngine.playGateShatter();
        addExplosion(g.x + g.width / 2, g.y + g.height / 2, '#38bdf8', 35, 'star');
        addFloatingText(g.x + 10, g.y - 15, 'CỔNG PHONG ẤN ĐÃ PHÁ HỦY! ✓', '#34d399');
      }
    }
  }, [activeGateId]);

  // Trigger Mana Skill when button pressed
  const executeManaSkill = () => {
    const p = playerRef.current;
    if (p.mana >= 35) {
      p.mana -= 35;
      p.barrierTimer = 300; // 5s barrier
      soundEngine.playManaSkill();
      addFloatingText(p.x, p.y - 30, 'KHIÊN HỘ THỂ & BÃO NỔ TINH TÚ!', '#38bdf8');

      // Clear dark bullets
      bulletsRef.current = bulletsRef.current.filter(b => b.fromPlayer);

      // Supernova damage to nearby enemies
      enemiesRef.current.forEach(e => {
        if (Math.abs(e.x - p.x) < 550) {
          e.hp -= 10;
          addExplosion(e.x + e.width / 2, e.y + e.height / 2, '#38bdf8', 14, 'star');
        }
      });
      // Screen blast effect
      addExplosion(p.x + p.width / 2, p.y + p.height / 2, '#a855f7', 40, 'star');
      onPlayerHpManaChange(p.hp, p.mana, p.lives);
    } else {
      addFloatingText(p.x, p.y - 20, 'KHÔNG ĐỦ MANA (Cần 35)!', '#f87171');
      soundEngine.playWrong();
    }
  };

  useEffect(() => {
    if (skillTriggerTime > 0 && skillTriggerTime !== lastSkillTimeRef.current) {
      lastSkillTimeRef.current = skillTriggerTime;
      executeManaSkill();
    }
  }, [skillTriggerTime]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      keysRef.current[e.code] = true;

      // Mana skill key: K
      if ((e.key === 'k' || e.key === 'K') && !keysRef.current['_k_locked']) {
        keysRef.current['_k_locked'] = true;
        executeManaSkill();
      }

      // Prevent scroll on space/arrows
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
      keysRef.current[e.code] = false;
      if (e.key === 'k' || e.key === 'K') {
        keysRef.current['_k_locked'] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Helper for adding sparkles & magical particles
  const addExplosion = (
    x: number,
    y: number,
    color: string = '#f472b6',
    count: number = 14,
    shape: 'circle' | 'star' | 'heart' = 'star'
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.floor(Math.random() * 18 + 14),
        color,
        size: Math.random() * 4 + 2,
        shape
      });
    }
  };

  const addFloatingText = (x: number, y: number, text: string, color: string = '#fbcfe8') => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      life: 45
    });
  };

  // Main 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const gameLoop = () => {
      if (!isRunning) return;
      animTimeRef.current++;

      // Day / Night cycle logic (40 seconds full cycle = 2400 frames)
      const cycleFrames = 2400;
      const frameInCycle = animTimeRef.current % cycleFrames;
      let currentPhase: 'day' | 'sunset' | 'night' = 'day';
      let nightAlpha = 0; // 0 = daylight, 1 = darkest night

      if (frameInCycle < 1100) {
        // Bright Sunny Day (0s - 18s)
        currentPhase = 'day';
        nightAlpha = 0;
      } else if (frameInCycle < 1600) {
        // Sunset transition (18s - 26s)
        currentPhase = 'sunset';
        const progress = (frameInCycle - 1100) / 500;
        nightAlpha = progress * 0.45;
      } else {
        // Quiet Starry Night (26s - 40s)
        currentPhase = 'night';
        const progress = (frameInCycle - 1600) / 800;
        nightAlpha = 0.45 + (1 - Math.abs(progress - 0.5) * 2) * 0.35;
      }

      if (animTimeRef.current % 60 === 0 && onDayPhaseChange) {
        onDayPhaseChange(currentPhase);
      }

      if (!isPaused) {
        const p = playerRef.current;
        const keys = keysRef.current;

        // Passive mana regeneration: +1 every 30 frames (+2 mana/sec)
        if (animTimeRef.current % 30 === 0 && p.mana < p.maxMana) {
          p.mana = Math.min(p.maxMana, p.mana + 1);
          onPlayerHpManaChange(p.hp, p.mana, p.lives);
        }

        // --- 1. HANDLE PLAYER INPUT ---
        const left = keys['ArrowLeft'] || keys['KeyA'] || keys['a'] || touchInput.left;
        const right = keys['ArrowRight'] || keys['KeyD'] || keys['d'] || touchInput.right;
        const up = keys['ArrowUp'] || keys['KeyW'] || keys['w'] || touchInput.up;
        const down = keys['ArrowDown'] || keys['KeyS'] || keys['s'] || touchInput.down;
        const jumpPressed = keys['Space'] || keys['ArrowUp'] || keys['KeyW'] || keys['w'] || touchInput.jump;
        const shootPressed = keys['KeyJ'] || keys['j'] || keys['KeyZ'] || keys['z'] || keys['Enter'] || touchInput.shoot;

        // Crouch check: S or Down arrow allows dodging bullets!
        if (down && p.isGrounded) {
          p.isCrouching = true;
          p.height = 24; // Lower hitbox to dodge bullets
        } else {
          p.isCrouching = false;
          p.height = 44;
        }

        // Horizontal movement: A/D or Arrow keys
        const moveSpeed = p.isCrouching ? 1.6 : 3.8;
        if (left && !right) {
          p.vx = -moveSpeed;
          p.facing = 'left';
        } else if (right && !left) {
          p.vx = moveSpeed;
          p.facing = 'right';
        } else {
          p.vx *= 0.75;
          if (Math.abs(p.vx) < 0.1) p.vx = 0;
        }

        // Aiming direction: Horizontal, Up, or Diagonal-Up
        if (up && (left || right)) {
          p.aimDirection = 'diagonal-up';
        } else if (up) {
          p.aimDirection = 'up';
        } else {
          p.aimDirection = 'horizontal';
        }

        // Mario Jump physics
        if (jumpPressed && p.isGrounded) {
          p.vy = -12.0;
          p.isGrounded = false;
          soundEngine.playJump();
          addExplosion(p.x + p.width / 2, p.y + p.height, '#f472b6', 5, 'star');
        }

        // Gravity
        p.vy += 0.52;
        if (p.vy > 12) p.vy = 12;

        // Apply movement
        p.x += p.vx;
        p.y += p.vy;

        // Level boundary constraints
        if (p.x < 10) p.x = 10;
        if (p.x > levelWidth - 40) p.x = levelWidth - 40;

        // Invincibility & Barrier timers
        if (p.invincibleTimer > 0) p.invincibleTimer--;
        if (p.barrierTimer > 0) p.barrierTimer--;
        if (p.rapidCooldown > 0) p.rapidCooldown--;

        // Firing weapon (Straight or Diagonal)
        if (shootPressed && p.rapidCooldown <= 0) {
          const spawnX = p.facing === 'right' ? p.x + p.width + 6 : p.x - 8;
          const spawnY = p.isCrouching ? p.y + p.height / 2 : p.y + 14;

          const bulletSpeed = 9.5;
          let bulletVx = p.facing === 'right' ? bulletSpeed : -bulletSpeed;
          let bulletVy = 0;

          if (p.aimDirection === 'up') {
            bulletVx = 0;
            bulletVy = -bulletSpeed;
          } else if (p.aimDirection === 'diagonal-up') {
            bulletVx = (p.facing === 'right' ? 1 : -1) * (bulletSpeed * 0.72);
            bulletVy = -bulletSpeed * 0.72;
          }

          if (p.weapon === 'SPREAD') {
            // Súng S (Spread Gun): 3-5 prismatic star rays
            const baseAngle = Math.atan2(bulletVy, bulletVx);
            const spreadAngles = [-0.32, -0.16, 0, 0.16, 0.32];
            spreadAngles.forEach(offset => {
              const ang = baseAngle + offset;
              bulletsRef.current.push({
                x: spawnX,
                y: spawnY,
                vx: Math.cos(ang) * 9.5,
                vy: Math.sin(ang) * 9.5,
                radius: 5,
                type: 'SPREAD',
                damage: 2.2,
                color: '#ec4899',
                fromPlayer: true,
                sparkle: true
              });
            });
            p.rapidCooldown = 13;
            soundEngine.playShoot('SPREAD');
          } else if (p.weapon === 'LASER') {
            // Súng L (Laser Gun): Long piercing cyan beam
            bulletsRef.current.push({
              x: spawnX,
              y: spawnY,
              vx: bulletVx * 1.5,
              vy: bulletVy * 1.5,
              radius: 6,
              type: 'LASER',
              damage: 5,
              color: '#38bdf8',
              fromPlayer: true,
              sparkle: true,
              piercing: true
            });
            p.rapidCooldown = 14;
            soundEngine.playShoot('LASER');
          } else if (p.weapon === 'MACHINE') {
            bulletsRef.current.push({
              x: spawnX,
              y: spawnY,
              vx: bulletVx * 1.25,
              vy: bulletVy * 1.25,
              radius: 4,
              type: 'MACHINE',
              damage: 1.6,
              color: '#fde047',
              fromPlayer: true,
              sparkle: true
            });
            p.rapidCooldown = 6;
            soundEngine.playShoot('MACHINE');
          } else {
            // Normal Starlight wand
            bulletsRef.current.push({
              x: spawnX,
              y: spawnY,
              vx: bulletVx,
              vy: bulletVy,
              radius: 4.5,
              type: 'NORMAL',
              damage: 1.2,
              color: '#f472b6',
              fromPlayer: true,
              sparkle: true
            });
            p.rapidCooldown = 12;
            soundEngine.playShoot('NORMAL');
          }
        }

        // --- 2. PLATFORMS & SEAL GATES & QUESTION BLOCKS ---
        p.isGrounded = false;

        // Platform collision
        platforms.forEach(plat => {
          if (
            p.x + p.width > plat.x &&
            p.x < plat.x + plat.width &&
            p.y + p.height >= plat.y &&
            p.y + p.height <= plat.y + p.vy + 8 &&
            p.vy >= 0
          ) {
            p.y = plat.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
          }
        });

        // Momoko Rainbow Sparkle Trail when moving or jumping
        if ((Math.abs(p.vx) > 0.8 || Math.abs(p.vy) > 1) && animTimeRef.current % 9 === 0) {
          const rainbowColors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#c084fc'];
          const pickedColor = rainbowColors[animTimeRef.current % rainbowColors.length];
          particlesRef.current.push({
            x: p.x + p.width / 2 + (Math.random() * 8 - 4),
            y: p.y + p.height - 4 + (Math.random() * 4 - 2),
            vx: -p.vx * 0.2 + (Math.random() - 0.5),
            vy: (Math.random() - 0.7) * 1.5,
            life: 0,
            maxLife: 20,
            color: pickedColor,
            size: Math.random() * 3 + 2,
            shape: 'star'
          });
        }

        // --- PET CROCODILE (Bé Cá Sấu Wani 🐊) FOLLOW AI ---
        const croc = crocRef.current;
        croc.tailAngle = Math.sin(animTimeRef.current * 0.28) * 0.5;
        const targetCrocX = p.facing === 'right' ? p.x - 32 : p.x + p.width + 12;
        const distCroc = targetCrocX - croc.x;

        if (Math.abs(distCroc) > 6) {
          croc.vx = distCroc * 0.14;
          croc.facing = distCroc > 0 ? 'right' : 'left';
          croc.waddleCycle += 0.35;
        } else {
          croc.vx *= 0.65;
        }

        // Pet cute-hops when Momoko jumps or when obstacle/gap is ahead
        if (
          (jumpPressed && croc.isGrounded && Math.abs(distCroc) > 16) ||
          (croc.isGrounded && p.y + p.height < croc.y - 15)
        ) {
          croc.vy = -8.5;
          croc.isGrounded = false;
        }

        // Pet gravity
        croc.vy += 0.52;
        if (croc.vy > 12) croc.vy = 12;

        croc.x += croc.vx;
        croc.y += croc.vy;

        // Platform collision for Crocodile
        croc.isGrounded = false;
        platforms.forEach(plat => {
          if (
            croc.x + croc.width > plat.x &&
            croc.x < plat.x + plat.width &&
            croc.y + croc.height >= plat.y &&
            croc.y + croc.height <= plat.y + croc.vy + 8 &&
            croc.vy >= 0
          ) {
            croc.y = plat.y - croc.height;
            croc.vy = 0;
            croc.isGrounded = true;
          }
        });

        // Teleport pet back if it falls off or is way too far
        if (Math.abs(croc.x - p.x) > 420 || croc.y > 540) {
          croc.x = p.x - (p.facing === 'right' ? 30 : -30);
          croc.y = p.y + p.height - croc.height;
          croc.vy = 0;
        }

        // SEAL GATES (Rào chắn phong ấn tri thức)
        // Khi nhân vật chạm cổng, game lập tức TẠM DỪNG (Pause), quái vật và đạn đóng băng!
        for (const gate of gatesRef.current) {
          if (!gate.unlocked) {
            const touchingGate =
              p.x + p.width >= gate.x - 4 &&
              p.x <= gate.x + gate.width + 4 &&
              p.y + p.height >= gate.y &&
              p.y <= gate.y + gate.height;

            if (touchingGate) {
              // Block movement
              if (p.x < gate.x) {
                p.x = gate.x - p.width;
              } else {
                p.x = gate.x + gate.width;
              }
              p.vx = 0;

              // Trigger modal pause
              onTriggerQuestion(gate.id, undefined, true);
              break;
            }
          }
        }

        // Question Blocks [★]
        blocksRef.current.forEach(block => {
          if (block.bumping > 0) block.bumping *= 0.8;

          // Head hit from bottom (Mario mechanic)
          if (
            !block.hit &&
            p.vy < 0 &&
            p.x + p.width > block.x + 4 &&
            p.x < block.x + block.width - 4 &&
            p.y <= block.y + block.height + 2 &&
            p.y >= block.y + block.height - 14
          ) {
            block.hit = true;
            block.bumping = 12;
            p.vy = 2;
            soundEngine.playBlockBump();
            addExplosion(block.x + 18, block.y, '#f472b6', 12, 'star');
            onTriggerQuestion(block.id, block.rewardWeapon, false);
          }

          // Standing on top of block
          if (
            p.x + p.width > block.x &&
            p.x < block.x + block.width &&
            p.y + p.height >= block.y &&
            p.y + p.height <= block.y + p.vy + 8 &&
            p.vy >= 0
          ) {
            p.y = block.y - p.height;
            p.vy = 0;
            p.isGrounded = true;
          }
        });

        // --- 3. FLYING SUPPLY PODS (Hộp tiếp tế bay trên trời) ---
        podsRef.current.forEach(pod => {
          if (!pod.destroyed) {
            pod.x += pod.vx;
            // Float sine oscillation
            pod.y = pod.baseY + Math.sin((animTimeRef.current + pod.x) * 0.04) * 16;

            // Turn around at stage edges
            if (pod.x < 300 || pod.x > levelWidth - 300) {
              pod.vx *= -1;
            }
          }
        });

        // --- 4. DROPPED ITEMS (Vật phẩm rơi từ hộp tiếp tế: Nấm, Súng S, Súng L) ---
        for (let i = droppedItemsRef.current.length - 1; i >= 0; i--) {
          const item = droppedItemsRef.current[i];
          if (item.collected) {
            droppedItemsRef.current.splice(i, 1);
            continue;
          }

          // Gravity fall
          if (!item.isGrounded) {
            item.vy += 0.35;
            item.y += item.vy;

            // Land on ground or platform
            platforms.forEach(plat => {
              if (
                item.x + item.width > plat.x &&
                item.x < plat.x + plat.width &&
                item.y + item.height >= plat.y &&
                item.y + item.height <= plat.y + item.vy + 8
              ) {
                item.y = plat.y - item.height;
                item.vy = 0;
                item.isGrounded = true;
              }
            });
          }

          // Player collection
          if (
            p.x + p.width > item.x &&
            p.x < item.x + item.width &&
            p.y + p.height > item.y &&
            p.y < item.y + item.height
          ) {
            item.collected = true;

            if (item.type === 'MUSHROOM') {
              // Nấm thần kỳ: Hồi 100% HP & 100% Mana!
              p.hp = p.maxHp;
              p.mana = p.maxMana;
              soundEngine.playFullRecovery();
              addFloatingText(p.x, p.y - 25, '🍄 HỒI PHỤC 100% HP & MANA!', '#34d399');
              addExplosion(p.x + p.width / 2, p.y + p.height / 2, '#34d399', 24, 'heart');
              onPlayerHpManaChange(p.hp, p.mana, p.lives);
            } else if (item.type === 'SPREAD') {
              // Súng S (Spread Gun)
              p.weapon = 'SPREAD';
              soundEngine.playPowerUp();
              addFloatingText(p.x, p.y - 25, '⚡ SÚNG S: ĐẠN CHÙM 5 TIA!', '#f472b6');
              addExplosion(p.x + p.width / 2, p.y + p.height / 2, '#f472b6', 20, 'star');
              onPlayerWeaponChange('SPREAD');
            } else if (item.type === 'LASER') {
              // Súng L (Laser Gun)
              p.weapon = 'LASER';
              soundEngine.playPowerUp();
              addFloatingText(p.x, p.y - 25, '🌌 SÚNG L: TIA LASER XUYÊN THẤU!', '#38bdf8');
              addExplosion(p.x + p.width / 2, p.y + p.height / 2, '#38bdf8', 20, 'star');
              onPlayerWeaponChange('LASER');
            }
          }
        }

        // --- 5. BULLETS UPDATE & COLLISIONS ---
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const b = bulletsRef.current[i];
          b.x += b.vx;
          b.y += b.vy;

          if (
            b.x < cameraXRef.current - 120 ||
            b.x > cameraXRef.current + 920 ||
            b.y < -60 ||
            b.y > 600
          ) {
            bulletsRef.current.splice(i, 1);
            continue;
          }

          if (b.fromPlayer) {
            // Hit Flying Supply Pods
            for (const pod of podsRef.current) {
              if (
                !pod.destroyed &&
                b.x >= pod.x &&
                b.x <= pod.x + pod.width &&
                b.y >= pod.y &&
                b.y <= pod.y + pod.height
              ) {
                pod.destroyed = true;
                soundEngine.playExplosion();
                addExplosion(pod.x + pod.width / 2, pod.y + pod.height / 2, '#fde047', 20, 'star');
                addFloatingText(pod.x, pod.y - 15, 'HỘP TIẾP TẾ NỔ TUNG!', '#fde047');

                // Drop item down to ground!
                droppedItemsRef.current.push({
                  id: Math.random().toString(),
                  x: pod.x + 4,
                  y: pod.y + pod.height,
                  vx: 0,
                  vy: 1.5,
                  width: 28,
                  height: 28,
                  type: pod.dropType,
                  collected: false,
                  isGrounded: false
                });

                if (!b.piercing) {
                  bulletsRef.current.splice(i, 1);
                  break;
                }
              }
            }

            // Hit Question Blocks
            for (const block of blocksRef.current) {
              if (
                !block.hit &&
                b.x >= block.x &&
                b.x <= block.x + block.width &&
                b.y >= block.y &&
                b.y <= block.y + block.height
              ) {
                block.hit = true;
                block.bumping = 8;
                soundEngine.playBlockBump();
                addExplosion(b.x, b.y, '#f472b6', 10, 'star');
                onTriggerQuestion(block.id, block.rewardWeapon, false);
                if (!b.piercing) {
                  bulletsRef.current.splice(i, 1);
                  break;
                }
              }
            }

            // Hit Enemies
            for (let eIdx = enemiesRef.current.length - 1; eIdx >= 0; eIdx--) {
              const enemy = enemiesRef.current[eIdx];
              if (
                b.x >= enemy.x &&
                b.x <= enemy.x + enemy.width &&
                b.y >= enemy.y &&
                b.y <= enemy.y + enemy.height
              ) {
                enemy.hp -= b.damage;
                addExplosion(b.x, b.y, '#c084fc', 6, 'star');

                if (enemy.hp <= 0) {
                  addExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ec4899', 20, 'heart');
                  soundEngine.playExplosion();
                  onAddScore(enemy.points);
                  addFloatingText(enemy.x, enemy.y - 10, `+${enemy.points}`, '#34d399');

                  // Mana reward on kill (+6 mana)
                  p.mana = Math.min(p.maxMana, p.mana + 6);
                  onPlayerHpManaChange(p.hp, p.mana, p.lives);

                  if (enemy.type === 'shadow_queen') {
                    onStageClear();
                  }

                  enemiesRef.current.splice(eIdx, 1);
                }

                if (!b.piercing) {
                  bulletsRef.current.splice(i, 1);
                  break;
                }
              }
            }
          } else {
            // Enemy dark orb hitting player
            // Crouch check: if crouching, bullet may pass over head!
            const hitPlayer =
              b.x >= p.x &&
              b.x <= p.x + p.width &&
              b.y >= p.y &&
              b.y <= p.y + p.height;

            if (hitPlayer) {
              bulletsRef.current.splice(i, 1);

              if (p.barrierTimer > 0) {
                // Absorbed by Barrier
                addExplosion(b.x, b.y, '#38bdf8', 8, 'star');
                soundEngine.playBlockBump();
                continue;
              }

              if (p.invincibleTimer <= 0) {
                p.hp -= 20;
                p.invincibleTimer = 55;
                soundEngine.playExplosion();
                addExplosion(p.x + p.width / 2, p.y + p.height / 2, '#f43f5e', 12, 'circle');

                if (p.hp <= 0) {
                  p.lives -= 1;
                  p.hp = p.maxHp;
                  p.mana = p.maxMana;
                  if (p.lives <= 0) {
                    onGameOver();
                  }
                }
                onPlayerHpManaChange(p.hp, p.mana, p.lives);
              }
            }
          }
        }

        // --- 6. ENEMIES BEHAVIOR & MARIO STOMPING ---
        let currentBoss: Enemy | null = null;

        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const enemy = enemiesRef.current[i];
          if (enemy.type === 'shadow_queen') {
            currentBoss = enemy;
          }

          if (enemy.type === 'shadow_imp') {
            // Patrol soldiers running from right to left
            enemy.x += enemy.vx;
            if (enemy.patrolMinX && enemy.x < enemy.patrolMinX) {
              enemy.vx = Math.abs(enemy.vx);
              enemy.direction = 'right';
            } else if (enemy.patrolMaxX && enemy.x > enemy.patrolMaxX) {
              enemy.vx = -Math.abs(enemy.vx);
              enemy.direction = 'left';
            }

            enemy.shootCooldown--;
            if (enemy.shootCooldown <= 0 && Math.abs(enemy.x - p.x) < 420) {
              enemy.shootCooldown = 110 + Math.floor(Math.random() * 40);
              const dirX = p.x < enemy.x ? -4.5 : 4.5;
              bulletsRef.current.push({
                x: enemy.x + (dirX > 0 ? enemy.width : 0),
                y: enemy.y + 16,
                vx: dirX,
                vy: 0,
                radius: 4,
                type: 'NORMAL',
                damage: 20,
                color: '#a855f7',
                fromPlayer: false
              });
              soundEngine.playShoot('ENEMY');
            }
          } else if (enemy.type === 'crystal_turret') {
            // Stationary turret shooting towards player
            enemy.shootCooldown--;
            if (enemy.shootCooldown <= 0 && Math.abs(enemy.x - p.x) < 450) {
              enemy.shootCooldown = 85;
              const angle = Math.atan2((p.y + 16) - (enemy.y + 16), (p.x + 14) - (enemy.x + 16));
              bulletsRef.current.push({
                x: enemy.x + 16,
                y: enemy.y + 16,
                vx: Math.cos(angle) * 3.8,
                vy: Math.sin(angle) * 3.8,
                radius: 4.5,
                type: 'NORMAL',
                damage: 25,
                color: '#e11d48',
                fromPlayer: false
              });
              soundEngine.playShoot('ENEMY');
            }
          } else if (enemy.type === 'star_bat') {
            enemy.x += enemy.vx;
            enemy.y += Math.sin(animTimeRef.current * 0.08) * 1.6;
            if (enemy.x < cameraXRef.current - 80) {
              enemy.x = cameraXRef.current + 860;
            }
          } else if (enemy.type === 'shadow_queen') {
            enemy.shootCooldown--;
            if (enemy.shootCooldown <= 0) {
              enemy.shootCooldown = 75;
              [-0.22, 0, 0.22].forEach(ang => {
                bulletsRef.current.push({
                  x: enemy.x,
                  y: enemy.y + enemy.height / 2,
                  vx: -4.8 * Math.cos(ang),
                  vy: 4.8 * Math.sin(ang),
                  radius: 6,
                  type: 'NORMAL',
                  damage: 30,
                  color: '#9333ea',
                  fromPlayer: false
                });
              });
              soundEngine.playShoot('ENEMY');
            }
          }

          // MARIO STOMPING
          const isStomping =
            p.vy > 0 &&
            p.y + p.height >= enemy.y &&
            p.y + p.height <= enemy.y + 16 &&
            p.x + p.width > enemy.x &&
            p.x < enemy.x + enemy.width &&
            enemy.type !== 'shadow_queen';

          if (isStomping) {
            p.vy = -10; // Bounce up
            soundEngine.playStomp();
            enemy.hp -= 2;
            addExplosion(enemy.x + enemy.width / 2, enemy.y, '#f472b6', 14, 'heart');
            if (enemy.hp <= 0) {
              onAddScore(enemy.points);
              addFloatingText(enemy.x, enemy.y - 12, `STOMP +${enemy.points}!`, '#f472b6');
              enemiesRef.current.splice(i, 1);
            }
            continue;
          }

          // Body collision
          if (
            p.invincibleTimer <= 0 &&
            p.barrierTimer <= 0 &&
            p.x + p.width > enemy.x + 4 &&
            p.x < enemy.x + enemy.width - 4 &&
            p.y + p.height > enemy.y + 4 &&
            p.y < enemy.y + enemy.height - 4
          ) {
            p.hp -= 20;
            p.invincibleTimer = 60;
            p.vy = -4;
            p.vx = p.facing === 'right' ? -3 : 3;
            soundEngine.playExplosion();
            addExplosion(p.x + p.width / 2, p.y + p.height / 2, '#f43f5e', 14, 'star');

            if (p.hp <= 0) {
              p.lives -= 1;
              p.hp = p.maxHp;
              p.mana = p.maxMana;
              if (p.lives <= 0) {
                onGameOver();
              }
            }
            onPlayerHpManaChange(p.hp, p.mana, p.lives);
          }
        }

        // Update Boss HP bar
        if (currentBoss && Math.abs(currentBoss.x - p.x) < 550) {
          onBossHpUpdate(currentBoss.hp, currentBoss.maxHp);
        } else {
          onBossHpUpdate(null, null);
        }

        // Camera follow
        const targetCamX = p.x - 280;
        cameraXRef.current += (targetCamX - cameraXRef.current) * 0.12;
        if (cameraXRef.current < 0) cameraXRef.current = 0;
        if (cameraXRef.current > levelWidth - 800) cameraXRef.current = levelWidth - 800;

        // Pit fall check
        if (p.y > 480) {
          p.lives -= 1;
          p.hp = p.maxHp;
          p.mana = p.maxMana;
          p.x = Math.max(40, p.x - 180);
          p.y = 200;
          p.vy = 0;
          soundEngine.playExplosion();
          onPlayerHpManaChange(p.hp, p.mana, p.lives);
          if (p.lives <= 0) {
            onGameOver();
          }
        }
      }

      // --- 7. RENDER CANVAS SCENE ---
      const camX = cameraXRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Interpolate Sky Color for Day / Sunset / Night cycle
      let currentSkyTop = skyColorTop;
      let currentSkyBottom = skyColorBottom;

      if (currentPhase === 'sunset') {
        currentSkyTop = '#9a3412'; // Rich sunset amber
        currentSkyBottom = '#4c0519'; // Deep crimson
      } else if (currentPhase === 'night') {
        currentSkyTop = '#09090b'; // Deep starry navy black
        currentSkyBottom = '#1e1b4b'; // Night violet
      }

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, currentSkyTop);
      skyGrad.addColorStop(1, currentSkyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Parallax Stars & Celestial Bodies
      ctx.save();
      ctx.translate(-camX * 0.2, 0);

      // Sun or Moon
      if (currentPhase === 'night') {
        // Glowing Crescent Moon
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(650, 75, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = currentSkyTop;
        ctx.beginPath();
        ctx.arc(660, 70, 20, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Bright Radiant Magic Sun
        const sunGrad = ctx.createRadialGradient(200, 70, 8, 200, 70, 36);
        sunGrad.addColorStop(0, '#fef08a');
        sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(200, 70, 36, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stars
      const starDensity = currentPhase === 'night' ? 75 : 30;
      for (let i = 0; i < starDensity; i++) {
        const sx = (i * 67 + animTimeRef.current * 0.1) % 1200;
        const sy = (i * 37) % 320;
        const twinkle = Math.sin(animTimeRef.current * 0.06 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
        ctx.fillRect(sx, sy, i % 3 === 0 ? 3 : 2, i % 3 === 0 ? 3 : 2);
      }

      // Distant Pastel Mountains
      for (let i = 0; i < 12; i++) {
        const mx = i * 290;
        ctx.fillStyle = currentPhase === 'night' ? '#18181b' : backgroundTheme === 'candy_kingdom' ? '#701a75' : '#31103f';
        ctx.beginPath();
        ctx.moveTo(mx, 400);
        ctx.lineTo(mx + 145, 170);
        ctx.lineTo(mx + 290, 400);
        ctx.fill();
      }
      ctx.restore();

      // Foreground Game World
      ctx.save();
      ctx.translate(-camX, 0);

      // Draw Platforms
      platforms.forEach(plat => {
        if (plat.type === 'ground') {
          ctx.fillStyle = currentPhase === 'night' ? '#312e81' : backgroundTheme === 'candy_kingdom' ? '#831843' : '#4c1d95';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Top shining grass border
          ctx.fillStyle = currentPhase === 'night' ? '#6366f1' : '#f472b6';
          ctx.fillRect(plat.x, plat.y, plat.width, 8);

          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 1;
          for (let gx = plat.x; gx < plat.x + plat.width; gx += 32) {
            ctx.strokeRect(gx, plat.y + 8, 32, plat.height);
          }
        } else if (plat.type === 'pillar') {
          ctx.fillStyle = '#db2777';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#f472b6';
          ctx.fillRect(plat.x - 4, plat.y, plat.width + 8, 14);
          ctx.strokeStyle = '#9d174d';
          ctx.lineWidth = 2;
          ctx.strokeRect(plat.x - 4, plat.y, plat.width + 8, 14);
        } else if (plat.type === 'cloud' || plat.type === 'crystal') {
          ctx.fillStyle = '#a21caf';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#e879f9';
          ctx.fillRect(plat.x, plat.y, plat.width, 4);
        }
      });

      // DRAW SEAL GATES (Rào chắn / Cổng phong ấn)
      gatesRef.current.forEach(gate => {
        if (!gate.unlocked || gate.shattering) {
          const pulse = Math.sin(animTimeRef.current * 0.12) * 5;

          // Gate pillars & energy barrier
          ctx.fillStyle = `rgba(168, 85, 247, ${0.45 + pulse * 0.05})`;
          ctx.fillRect(gate.x, gate.y, gate.width, gate.height);

          // Left/Right pillars
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(gate.x - 4, gate.y - 10, 8, gate.height + 10);
          ctx.fillRect(gate.x + gate.width - 4, gate.y - 10, 8, gate.height + 10);

          // Star crystals on top of pillars
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(gate.x, gate.y - 12, 7, 0, Math.PI * 2);
          ctx.arc(gate.x + gate.width, gate.y - 12, 7, 0, Math.PI * 2);
          ctx.fill();

          // Rune Lock Badge in center
          const centerY = gate.y + gate.height / 2;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(gate.x + gate.width / 2, centerY, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Lock Icon '🔒'
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🔒', gate.x + gate.width / 2, centerY);

          // Gate banner
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(gate.x - 36, gate.y - 34, gate.width + 72, 18);
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(gate.x - 36, gate.y - 34, gate.width + 72, 18);
          ctx.fillStyle = '#fbcfe8';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(gate.title, gate.x + gate.width / 2, gate.y - 25);
        }
      });

      // DRAW FLYING SUPPLY PODS (Hộp tiếp tế bay)
      podsRef.current.forEach(pod => {
        if (!pod.destroyed) {
          const wingFlap = Math.sin(animTimeRef.current * 0.3) * 6;

          // Tiny mechanical wings
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(pod.x - 6, pod.y + 6 + wingFlap, 10, 5, -0.2, 0, Math.PI * 2);
          ctx.ellipse(pod.x + pod.width + 6, pod.y + 6 - wingFlap, 10, 5, 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Capsule Body (Red/White or Gold/Cyan)
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(pod.x, pod.y, pod.width, pod.height);
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.strokeRect(pod.x, pod.y, pod.width, pod.height);

          // Pod label badge
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let symbol = '★';
          if (pod.dropType === 'MUSHROOM') symbol = '🍄';
          if (pod.dropType === 'SPREAD') symbol = 'S';
          if (pod.dropType === 'LASER') symbol = 'L';
          ctx.fillText(symbol, pod.x + pod.width / 2, pod.y + pod.height / 2 + 1);
        }
      });

      // DRAW DROPPED ITEMS (Nấm thần kỳ, Súng S, Súng L)
      droppedItemsRef.current.forEach(item => {
        if (!item.collected) {
          const bounce = Math.sin(animTimeRef.current * 0.15) * 3;
          const iy = item.y + bounce;

          // Golden sparkle ring around item
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(item.x + item.width / 2, iy + item.height / 2, 16, 0, Math.PI * 2);
          ctx.stroke();

          if (item.type === 'MUSHROOM') {
            // Nấm thần kỳ (Magic Mushroom)
            // Red cap with white spots
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(item.x + item.width / 2, iy + 10, 12, Math.PI, 0);
            ctx.fill();
            // Spots
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(item.x + item.width / 2 - 5, iy + 7, 2.5, 0, Math.PI * 2);
            ctx.arc(item.x + item.width / 2 + 5, iy + 7, 2.5, 0, Math.PI * 2);
            ctx.arc(item.x + item.width / 2, iy + 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Stem
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(item.x + item.width / 2 - 5, iy + 10, 10, 10);
            // Cute eyes
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(item.x + item.width / 2 - 3, iy + 12, 2, 4);
            ctx.fillRect(item.x + item.width / 2 + 1, iy + 12, 2, 4);
          } else if (item.type === 'SPREAD') {
            // Súng S (Spread Gun Capsule)
            ctx.fillStyle = '#e11d48';
            ctx.fillRect(item.x, iy, item.width, item.height);
            ctx.strokeStyle = '#fbcfe8';
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x, iy, item.width, item.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', item.x + item.width / 2, iy + item.height / 2);
          } else if (item.type === 'LASER') {
            // Súng L (Laser Gun Capsule)
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(item.x, iy, item.width, item.height);
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x, iy, item.width, item.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('L', item.x + item.width / 2, iy + item.height / 2);
          }
        }
      });

      // Question Blocks [★]
      blocksRef.current.forEach(block => {
        const by = block.y - (block.bumping || 0);
        if (!block.hit) {
          const pulse = Math.sin(animTimeRef.current * 0.12) * 15;
          ctx.fillStyle = `rgb(${250}, ${180 + pulse * 1.5}, ${200 + pulse})`;
          ctx.fillRect(block.x, by, block.width, block.height);
          ctx.strokeStyle = '#db2777';
          ctx.lineWidth = 2;
          ctx.strokeRect(block.x, by, block.width, block.height);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', block.x + block.width / 2, by + block.height / 2 + 1);
        } else {
          ctx.fillStyle = '#475569';
          ctx.fillRect(block.x, by, block.width, block.height);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(block.x, by, block.width, block.height);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', block.x + block.width / 2, by + block.height / 2);
        }
      });

      // Enemies
      enemiesRef.current.forEach(enemy => {
        if (enemy.type === 'shadow_imp') {
          const isMoving = Math.abs(enemy.vx) > 0.1;
          const legSwing = isMoving ? Math.sin(animTimeRef.current * 0.25) * 5 : 0;
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(enemy.x + 6, enemy.y, 16, 24);
          ctx.fillStyle = '#ec4899';
          const eyeX = enemy.direction === 'left' ? enemy.x + 8 : enemy.x + 14;
          ctx.fillRect(eyeX, enemy.y + 8, 4, 4);
          ctx.fillRect(eyeX + 5, enemy.y + 8, 4, 4);
          ctx.fillStyle = '#18181b';
          const staffX = enemy.direction === 'left' ? enemy.x - 4 : enemy.x + 18;
          ctx.fillRect(staffX, enemy.y + 6, 4, 18);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(enemy.x + 6 + legSwing, enemy.y + 24, 6, 12);
          ctx.fillRect(enemy.x + 16 - legSwing, enemy.y + 24, 6, 12);
        } else if (enemy.type === 'crystal_turret') {
          ctx.fillStyle = '#581c87';
          ctx.beginPath();
          ctx.arc(enemy.x + 16, enemy.y + 20, 14, Math.PI, 0);
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.arc(enemy.x + 16, enemy.y + 14, 7, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'star_bat') {
          ctx.fillStyle = '#4a044e';
          ctx.beginPath();
          ctx.ellipse(enemy.x + 15, enemy.y + 13, 14, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(enemy.x + 8, enemy.y + 10, 4, 4);
          ctx.fillRect(enemy.x + 16, enemy.y + 10, 4, 4);
          ctx.fillStyle = '#701a75';
          const wingFlap = Math.sin(animTimeRef.current * 0.4) * 6;
          ctx.fillRect(enemy.x + 1, enemy.y + wingFlap, 6, 4);
          ctx.fillRect(enemy.x + 23, enemy.y + wingFlap, 6, 4);
        } else if (enemy.type === 'shadow_queen') {
          const pulse = Math.sin(animTimeRef.current * 0.1) * 0.12 + 1;
          ctx.fillStyle = '#3b0764';
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 3;
          ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
          ctx.fillStyle = '#831843';
          ctx.beginPath();
          ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 28 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(enemy.x + enemy.width / 2 - 16, enemy.y - 10, 32, 10);
        }
      });

      // Bullets (Straight, Spread, Laser Beam, Dark orbs)
      bulletsRef.current.forEach(b => {
        if (b.type === 'LASER') {
          // Long piercing laser line
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(b.x - b.vx * 2, b.y - b.vy * 2);
          ctx.lineTo(b.x + b.vx * 2, b.y + b.vy * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Pet Crocodile (Bé Cá Sấu Wani 🐊) - Mascot companion
      const croc = crocRef.current;
      ctx.save();
      const cx = croc.x;
      const cy = croc.y;
      const isCrocFacingRight = croc.facing === 'right';
      const waddleOffset = croc.isGrounded && Math.abs(croc.vx) > 0.2 ? Math.sin(croc.waddleCycle) * 2.5 : 0;

      // Crocodile Tail (wiggling)
      ctx.save();
      const tailBaseX = isCrocFacingRight ? cx + 2 : cx + croc.width - 2;
      const tailBaseY = cy + 10;
      ctx.translate(tailBaseX, tailBaseY);
      ctx.rotate(isCrocFacingRight ? -croc.tailAngle - 0.2 : croc.tailAngle + 0.2);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      if (isCrocFacingRight) {
        ctx.moveTo(0, -3);
        ctx.lineTo(-10, 0);
        ctx.lineTo(0, 4);
      } else {
        ctx.moveTo(0, -3);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 4);
      }
      ctx.closePath();
      ctx.fill();
      // Tail scale
      ctx.fillStyle = '#15803d';
      ctx.fillRect(isCrocFacingRight ? -5 : 3, -4, 3, 2);
      ctx.restore();

      // Crocodile Feet
      ctx.fillStyle = '#15803d';
      ctx.fillRect(cx + 4 + waddleOffset, cy + 14, 5, 4);
      ctx.fillRect(cx + 15 - waddleOffset, cy + 14, 5, 4);

      // Crocodile Main Body (Chubby green)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.roundRect(cx + 2, cy + 4, 20, 11, [4, 4, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cute pale yellow underbelly
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.roundRect(cx + 6, cy + 10, 12, 5, [0, 0, 2, 2]);
      ctx.fill();

      // Back dorsal scales (3 cute spikes)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(cx + 6, cy + 4);
      ctx.lineTo(cx + 8, cy + 1);
      ctx.lineTo(cx + 10, cy + 4);

      ctx.moveTo(cx + 11, cy + 4);
      ctx.lineTo(cx + 13, cy + 1);
      ctx.lineTo(cx + 15, cy + 4);

      ctx.moveTo(cx + 16, cy + 4);
      ctx.lineTo(cx + 18, cy + 1.5);
      ctx.lineTo(cx + 20, cy + 4);
      ctx.fill();

      // Snout (Long friendly alligator snout)
      ctx.fillStyle = '#22c55e';
      const snoutX = isCrocFacingRight ? cx + 14 : cx - 6;
      ctx.beginPath();
      ctx.roundRect(snoutX, cy + 5, 12, 8, [3, 3, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cute smiling mouth line & tiny white teeth
      ctx.fillStyle = '#ffffff';
      const toothX = isCrocFacingRight ? snoutX + 8 : snoutX + 2;
      ctx.fillRect(toothX, cy + 11, 2, 2);
      ctx.fillRect(isCrocFacingRight ? toothX - 4 : toothX + 4, cy + 11, 2, 2);

      // Big twinkling anime eye
      const eyeCrocX = isCrocFacingRight ? cx + 12 : cx + 8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeCrocX, cy + 4, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(eyeCrocX + (isCrocFacingRight ? 0.8 : -0.8), cy + 4, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(eyeCrocX + (isCrocFacingRight ? 1 : -1.5), cy + 3, 1.2, 1.2);

      // Cute Rainbow Collar / Bandana around crocodile's neck (Matching Momoko!)
      const collarX = isCrocFacingRight ? cx + 11 : cx + 7;
      ctx.fillStyle = '#f43f5e'; // Red
      ctx.fillRect(collarX, cy + 5, 3, 2);
      ctx.fillStyle = '#facc15'; // Yellow
      ctx.fillRect(collarX, cy + 7, 3, 2);
      ctx.fillStyle = '#38bdf8'; // Blue
      ctx.fillRect(collarX, cy + 9, 3, 2);

      // Floating tiny cheer icon / star over crocodile
      if (animTimeRef.current % 90 < 45) {
        ctx.fillStyle = '#fde047';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✨', cx + 11, cy - 4);
      }
      ctx.restore();

      // Draw Player (Momoko - Magical Girl with Rainbow Design 🌈)
      const p = playerRef.current;
      const isFlicker = p.invincibleTimer > 0 && Math.floor(animTimeRef.current / 3) % 2 === 0;

      if (!isFlicker) {
        ctx.save();
        const px = p.x;
        const py = p.y;

        // Barrier Shield
        if (p.barrierTimer > 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(px + p.width / 2, py + p.height / 2, 30, 0, Math.PI * 2);
          ctx.stroke();

          for (let o = 0; o < 3; o++) {
            const orbAng = (animTimeRef.current * 0.12) + (o * Math.PI * 2 / 3);
            const ox = px + p.width / 2 + Math.cos(orbAng) * 30;
            const oy = py + p.height / 2 + Math.sin(orbAng) * 30;
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(ox, oy, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (p.isCrouching) {
          // Crouched Momoko
          // Rainbow hair strands while crouching
          ctx.fillStyle = '#f43f5e'; // Red
          ctx.fillRect(px + 4, py, 20, 3);
          ctx.fillStyle = '#fb923c'; // Orange
          ctx.fillRect(px + 4, py + 3, 20, 3);
          ctx.fillStyle = '#facc15'; // Yellow
          ctx.fillRect(px + 4, py + 6, 20, 2);

          // Face
          ctx.fillStyle = '#fed7aa';
          ctx.fillRect(px + (p.facing === 'right' ? 10 : 2), py + 6, 14, 8);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(p.facing === 'right' ? px + 15 : px + 5, py + 8, 3, 3);

          // Rainbow Bodice & Skirt crouched
          ctx.fillStyle = '#22c55e'; // Green
          ctx.fillRect(px + 4, py + 14, 20, 4);
          ctx.fillStyle = '#38bdf8'; // Cyan
          ctx.fillRect(px + 4, py + 18, 20, 3);
          ctx.fillStyle = '#a855f7'; // Purple
          ctx.fillRect(px + 4, py + 21, 20, 3);

          // Rainbow Wand
          const wandX = p.facing === 'right' ? px + 20 : px - 12;
          ctx.fillStyle = '#fde047';
          ctx.fillRect(wandX, py + 14, 16, 4);
          // Rainbow crystal star
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(p.facing === 'right' ? wandX + 14 : wandX - 2, py + 12, 6, 8);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(p.facing === 'right' ? wandX + 16 : wandX, py + 14, 3, 4);
        } else {
          // Standing / Running Momoko (Full Rainbow Magical Girl)
          const isRunning = Math.abs(p.vx) > 0.2;
          const legCycle = isRunning ? Math.sin(animTimeRef.current * 0.3) * 6 : 0;
          const hairSway = Math.sin(animTimeRef.current * 0.22) * 3.5;

          // 1. Rainbow Hair Accessories: Golden Tiara with cycling Rainbow Gem
          ctx.fillStyle = '#fde047'; // Gold tiara band
          ctx.fillRect(px + 6, py, 16, 4);
          // Rainbow gem cycling colors
          const gemColors = ['#f43f5e', '#fb923c', '#facc15', '#22c55e', '#38bdf8', '#a855f7'];
          const activeGemColor = gemColors[Math.floor(animTimeRef.current / 8) % gemColors.length];
          ctx.fillStyle = activeGemColor;
          ctx.fillRect(px + 12, py - 3, 4, 5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px + 13, py - 2, 2, 2);

          // 2. Multi-tier Rainbow Hair & Twin Tails
          // Top Bangs: Ruby Red & Sunset Orange
          ctx.fillStyle = '#f43f5e'; // Red
          ctx.fillRect(px + 4, py + 3, 20, 4);
          ctx.fillStyle = '#fb923c'; // Orange
          ctx.fillRect(px + 4, py + 7, 20, 3);

          // Left Twin Tail (Flowing Rainbow Gradient layers)
          ctx.fillStyle = '#f43f5e'; // Red
          ctx.fillRect(px - 3, py + 4 + hairSway, 6, 5);
          ctx.fillStyle = '#fb923c'; // Orange
          ctx.fillRect(px - 3, py + 9 + hairSway, 6, 4);
          ctx.fillStyle = '#facc15'; // Yellow
          ctx.fillRect(px - 3, py + 13 + hairSway, 6, 4);
          ctx.fillStyle = '#22c55e'; // Green
          ctx.fillRect(px - 3, py + 17 + hairSway, 6, 4);
          ctx.fillStyle = '#38bdf8'; // Blue
          ctx.fillRect(px - 3, py + 21 + hairSway, 6, 3);
          ctx.fillStyle = '#a855f7'; // Purple tip
          ctx.fillRect(px - 3, py + 24 + hairSway, 5, 3);

          // Right Twin Tail (Flowing Rainbow Gradient layers)
          ctx.fillStyle = '#f43f5e'; // Red
          ctx.fillRect(px + 25, py + 4 - hairSway, 6, 5);
          ctx.fillStyle = '#fb923c'; // Orange
          ctx.fillRect(px + 25, py + 9 - hairSway, 6, 4);
          ctx.fillStyle = '#facc15'; // Yellow
          ctx.fillRect(px + 25, py + 13 - hairSway, 6, 4);
          ctx.fillStyle = '#22c55e'; // Green
          ctx.fillRect(px + 25, py + 17 - hairSway, 6, 4);
          ctx.fillStyle = '#38bdf8'; // Blue
          ctx.fillRect(px + 25, py + 21 - hairSway, 6, 3);
          ctx.fillStyle = '#a855f7'; // Purple tip
          ctx.fillRect(px + 25, py + 24 - hairSway, 5, 3);

          // 3. Cute Face & Big Sparkly Anime Eyes
          ctx.fillStyle = '#fed7aa';
          ctx.fillRect(px + (p.facing === 'right' ? 8 : 4), py + 9, 15, 8);
          // Big Royal Blue Eyes
          ctx.fillStyle = '#2563eb';
          const eyeX = p.facing === 'right' ? px + 15 : px + 7;
          ctx.fillRect(eyeX, py + 11, 4, 4);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(eyeX + 1, py + 11, 2, 2);
          // Cute pink blush
          ctx.fillStyle = '#f472b6';
          ctx.fillRect(p.facing === 'right' ? px + 12 : px + 8, py + 14, 3, 2);

          // 4. Rainbow Bodice with Golden Star Brooch
          ctx.fillStyle = '#f43f5e'; // Upper red trim
          ctx.fillRect(px + 5, py + 17, 18, 3);
          ctx.fillStyle = '#facc15'; // Yellow mid
          ctx.fillRect(px + 5, py + 20, 18, 4);
          ctx.fillStyle = '#38bdf8'; // Blue lower
          ctx.fillRect(px + 5, py + 24, 18, 4);
          // Star Brooch
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(px + 12, py + 19, 4, 4);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(px + 13, py + 20, 2, 2);

          // 5. Rainbow Magic Wand (Gậy Phép Cầu Vồng)
          ctx.save();
          const wandShoulderX = p.facing === 'right' ? px + 18 : px + 10;
          const wandShoulderY = py + 20;

          if (p.aimDirection === 'up') {
            ctx.fillStyle = '#fde047';
            ctx.fillRect(wandShoulderX - 2, wandShoulderY - 20, 4, 22);
            // Rainbow Star Head
            ctx.fillStyle = activeGemColor;
            ctx.fillRect(wandShoulderX - 6, wandShoulderY - 26, 12, 8);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(wandShoulderX - 3, wandShoulderY - 24, 6, 4);
          } else if (p.aimDirection === 'diagonal-up') {
            ctx.translate(wandShoulderX, wandShoulderY);
            ctx.rotate(p.facing === 'right' ? -Math.PI / 4 : -3 * Math.PI / 4);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(0, -2, 18, 4);
            ctx.fillStyle = activeGemColor;
            ctx.fillRect(16, -6, 10, 12);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(18, -4, 6, 8);
          } else {
            const wx = p.facing === 'right' ? wandShoulderX : wandShoulderX - 18;
            ctx.fillStyle = '#fde047';
            ctx.fillRect(wx, wandShoulderY - 2, 18, 4);
            ctx.fillStyle = activeGemColor;
            ctx.fillRect(p.facing === 'right' ? wx + 16 : wx - 8, wandShoulderY - 6, 10, 12);
            ctx.fillStyle = '#fde047';
            ctx.fillRect(p.facing === 'right' ? wx + 18 : wx - 6, wandShoulderY - 4, 6, 8);
          }
          ctx.restore();

          // 6. Tiered Frilled Rainbow Skirt!
          // Tier 1: Ruby Red
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(px + 4, py + 28, 20, 2);
          // Tier 2: Tangerine Orange
          ctx.fillStyle = '#fb923c';
          ctx.fillRect(px + 3, py + 30, 22, 2);
          // Tier 3: Golden Yellow
          ctx.fillStyle = '#facc15';
          ctx.fillRect(px + 2, py + 32, 24, 2);
          // Tier 4: Emerald Green
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(px + 1, py + 34, 26, 2);
          // Tier 5: Sky Cyan
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(px + 1, py + 36, 26, 2);
          // Tier 6: Purple Ruffle
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(px + 2, py + 38, 24, 2);

          // 7. Legs & Rainbow-accented Boots
          ctx.fillStyle = '#fed7aa';
          ctx.fillRect(px + 6 + legCycle, py + 40, 5, 3);
          ctx.fillRect(px + 16 - legCycle, py + 40, 5, 3);
          // Boots
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(px + 5 + legCycle, py + 42, 7, 3);
          ctx.fillRect(px + 15 - legCycle, py + 42, 7, 3);
          ctx.fillStyle = '#fde047'; // Star buckle on boot
          ctx.fillRect(px + 7 + legCycle, py + 42, 3, 2);
          ctx.fillRect(px + 17 - legCycle, py + 42, 3, 2);
        }
        ctx.restore();
      }

      // Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        const alpha = Math.max(0, 1 - pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Draw Floating Texts
      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatingTextsRef.current[i];
        ft.y -= 0.8;
        ft.life--;
        const alpha = Math.max(0, ft.life / 45);
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
        if (ft.life <= 0) {
          floatingTextsRef.current.splice(i, 1);
        }
      }

      ctx.restore(); // restore camera transform

      // NIGHT LIGHTING AURA EFFECT (Vào ban đêm: màn hình tối hơn, quanh Momoko và Bé Cá Sấu có quầng sáng bảo vệ)
      if (nightAlpha > 0.1) {
        ctx.save();
        // Screen-space position encompassing both Momoko and her pet crocodile
        const centerWorldX = (p.x + croc.x + p.width / 2) / 2;
        const centerWorldY = (p.y + croc.y + p.height / 2) / 2;
        const screenPx = centerWorldX - camX;
        const screenPy = centerWorldY;

        // Dark night overlay with cutout circle for aura
        const auraRadius = 165;
        const radialGrad = ctx.createRadialGradient(
          screenPx,
          screenPy,
          25,
          screenPx,
          screenPy,
          auraRadius
        );
        radialGrad.addColorStop(0, 'rgba(10, 10, 30, 0)');
        radialGrad.addColorStop(0.65, `rgba(10, 10, 30, ${nightAlpha * 0.4})`);
        radialGrad.addColorStop(1, `rgba(5, 5, 20, ${nightAlpha})`);

        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);

        // Rainbow glowing starlight rim around Momoko & Crocodile
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(screenPx, screenPy, 56, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [
    stageId,
    levelWidth,
    skyColorTop,
    skyColorBottom,
    backgroundTheme,
    platforms,
    isPaused,
    onPlayerHpManaChange,
    onPlayerWeaponChange,
    onAddScore,
    onTriggerQuestion,
    onStageClear,
    onGameOver,
    onBossHpUpdate,
    onDayPhaseChange,
    touchInput
  ]);

  return (
    <div className="relative w-full aspect-[16/9] max-h-[580px] bg-slate-950 overflow-hidden select-none border-b border-pink-900/60 cursor-crosshair">
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="w-full h-full object-contain pixel-art block"
        onClick={() => {
          // Click mouse to shoot forward / towards cursor
          const p = playerRef.current;
          if (p.rapidCooldown <= 0) {
            const spawnX = p.facing === 'right' ? p.x + p.width + 6 : p.x - 8;
            const spawnY = p.isCrouching ? p.y + p.height / 2 : p.y + 14;
            const bulletSpeed = 9.5;
            const bulletVx = p.facing === 'right' ? bulletSpeed : -bulletSpeed;

            if (p.weapon === 'SPREAD') {
              [-0.25, 0, 0.25].forEach(ang => {
                bulletsRef.current.push({
                  x: spawnX,
                  y: spawnY,
                  vx: Math.cos(ang) * bulletVx,
                  vy: Math.sin(ang) * 9.5,
                  radius: 5,
                  type: 'SPREAD',
                  damage: 2.2,
                  color: '#ec4899',
                  fromPlayer: true,
                  sparkle: true
                });
              });
              p.rapidCooldown = 13;
              soundEngine.playShoot('SPREAD');
            } else if (p.weapon === 'LASER') {
              bulletsRef.current.push({
                x: spawnX,
                y: spawnY,
                vx: bulletVx * 1.5,
                vy: 0,
                radius: 6,
                type: 'LASER',
                damage: 5,
                color: '#38bdf8',
                fromPlayer: true,
                sparkle: true,
                piercing: true
              });
              p.rapidCooldown = 14;
              soundEngine.playShoot('LASER');
            } else {
              bulletsRef.current.push({
                x: spawnX,
                y: spawnY,
                vx: bulletVx,
                vy: 0,
                radius: 4.5,
                type: 'NORMAL',
                damage: 1.2,
                color: '#f472b6',
                fromPlayer: true,
                sparkle: true
              });
              p.rapidCooldown = 12;
              soundEngine.playShoot('NORMAL');
            }
          }
        }}
      />
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-25" />
    </div>
  );
};
