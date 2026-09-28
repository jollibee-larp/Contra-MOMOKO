import { StageConfig, Platform, QuestionBlock, Enemy, SealGate, SupplyPod } from '../types/game';

export const STAGES: StageConfig[] = [
  {
    id: 1,
    name: 'Màn 1: Vương Quốc Pha Lê & Kẹo Ngọt',
    subtitle: 'Học viện Tinh Tú khởi động - Vùng đất kẹo thần tiên',
    backgroundTheme: 'candy_kingdom',
    levelWidth: 2600,
    skyColorTop: '#831843',
    skyColorBottom: '#3b0764',
    groundColor: '#db2777',
    bossName: 'Hộ Vệ Bóng Đêm Dark Marionette'
  },
  {
    id: 2,
    name: 'Màn 2: Hồ Ánh Trăng & Sao Băng',
    subtitle: 'Vượt qua thác nước dạ quang và các tinh thể ma pháp',
    backgroundTheme: 'crystal_lake',
    levelWidth: 2800,
    skyColorTop: '#1e1b4b',
    skyColorBottom: '#4c1d95',
    groundColor: '#7c3aed',
    bossName: 'Phù Thủy Hắc Ám Dark Sorceress'
  },
  {
    id: 3,
    name: 'Màn 3: Cung Điện Ngân Hà Hư Vô',
    subtitle: 'Đại chiến tại lõi ma pháp vũ trụ cứu lấy thế giới',
    backgroundTheme: 'celestial_temple',
    levelWidth: 3000,
    skyColorTop: '#4a044e',
    skyColorBottom: '#09090b',
    groundColor: '#c026d3',
    bossName: 'Nữ Hoàng Bóng Tối Shadow Queen'
  }
];

export function generateStageElements(stageId: number, groundY: number) {
  const platforms: Platform[] = [];
  const questionBlocks: QuestionBlock[] = [];
  const enemies: Enemy[] = [];
  const sealGates: SealGate[] = [];
  const supplyPods: SupplyPod[] = [];

  const levelWidth = STAGES[stageId - 1]?.levelWidth || 2600;
  // Main ground
  platforms.push({
    x: 0,
    y: groundY,
    width: levelWidth,
    height: 120,
    type: 'ground'
  });

  if (stageId === 1) {
    // Platforms (crystal floating steps, cloud bridges)
    platforms.push(
      { x: 260, y: groundY - 80, width: 140, height: 20, type: 'crystal' },
      { x: 500, y: groundY - 130, width: 180, height: 20, type: 'cloud' },
      { x: 740, y: groundY - 70, width: 80, height: 70, type: 'pillar' },
      { x: 920, y: groundY - 110, width: 180, height: 20, type: 'crystal' },
      { x: 1240, y: groundY - 90, width: 90, height: 90, type: 'pillar' },
      { x: 1420, y: groundY - 140, width: 220, height: 20, type: 'cloud' },
      { x: 1720, y: groundY - 110, width: 160, height: 20, type: 'crystal' },
      { x: 1960, y: groundY - 150, width: 200, height: 20, type: 'cloud' }
    );

    // Mystery Star Blocks [★]
    questionBlocks.push(
      { id: 'qb-1', x: 300, y: groundY - 160, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'SPREAD' },
      { id: 'qb-2', x: 560, y: groundY - 210, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'MACHINE' },
      { id: 'qb-3', x: 960, y: groundY - 190, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'BARRIER' },
      { id: 'qb-4', x: 1480, y: groundY - 220, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'LASER' },
      { id: 'qb-5', x: 1760, y: groundY - 190, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'FLAME' }
    );

    // CỔNG PHONG ẤN / RÀO CHẮN TRI THỨC (Cần giải câu đố đúng để phá vỡ)
    sealGates.push(
      {
        id: 'gate-1',
        x: 1140,
        y: groundY - 180,
        width: 32,
        height: 180,
        unlocked: false,
        shattering: false,
        shatterTimer: 0,
        title: 'CỔNG PHONG ẤN I'
      },
      {
        id: 'gate-2',
        x: 2180,
        y: groundY - 180,
        width: 32,
        height: 180,
        unlocked: false,
        shattering: false,
        shatterTimer: 0,
        title: 'CỔNG PHONG ẤN II'
      }
    );

    // HỘP TIẾP TẾ BAY TRÊN TRỜI (Bắn vỡ để rơi vật phẩm: Nấm, Súng S, Súng L)
    supplyPods.push(
      {
        id: 'pod-1',
        x: 650,
        y: 110,
        baseY: 110,
        vx: 1.2,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'SPREAD' // Súng S
      },
      {
        id: 'pod-2',
        x: 1350,
        y: 95,
        baseY: 95,
        vx: 1.1,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'MUSHROOM' // Nấm thần kỳ (100% HP & Mana)
      },
      {
        id: 'pod-3',
        x: 1850,
        y: 105,
        baseY: 105,
        vx: 1.2,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'LASER' // Súng L
      }
    );

    // Shadow monsters
    enemies.push(
      { id: 'e1', x: 420, y: groundY - 36, vx: -1.2, vy: 0, width: 28, height: 36, hp: 1, maxHp: 1, type: 'shadow_imp', shootCooldown: 120, direction: 'left', points: 100, patrolMinX: 380, patrolMaxX: 680 },
      { id: 'e2', x: 745, y: groundY - 70 - 32, vx: 0, vy: 0, width: 32, height: 32, hp: 3, maxHp: 3, type: 'crystal_turret', shootCooldown: 90, direction: 'left', points: 250 },
      { id: 'e3', x: 980, y: groundY - 36, vx: -1.2, vy: 0, width: 28, height: 36, hp: 1, maxHp: 1, type: 'shadow_imp', shootCooldown: 100, direction: 'left', points: 100, patrolMinX: 850, patrolMaxX: 1100 },
      { id: 'e4', x: 1245, y: groundY - 90 - 32, vx: 0, vy: 0, width: 32, height: 32, hp: 3, maxHp: 3, type: 'crystal_turret', shootCooldown: 80, direction: 'left', points: 250 },
      { id: 'e5', x: 1540, y: groundY - 180, vx: -1.5, vy: 0, width: 30, height: 26, hp: 2, maxHp: 2, type: 'star_bat', shootCooldown: 140, direction: 'left', points: 200 },
      { id: 'e6', x: 1800, y: groundY - 36, vx: -1.2, vy: 0, width: 28, height: 36, hp: 1, maxHp: 1, type: 'shadow_imp', shootCooldown: 110, direction: 'left', points: 100, patrolMinX: 1720, patrolMaxX: 1940 },
      { id: 'boss-1', x: 2380, y: groundY - 120, vx: 0, vy: 0, width: 90, height: 110, hp: 25, maxHp: 25, type: 'shadow_queen', shootCooldown: 60, direction: 'left', points: 2000 }
    );
  } else if (stageId === 2) {
    platforms.push(
      { x: 220, y: groundY - 70, width: 120, height: 20, type: 'crystal' },
      { x: 420, y: groundY - 140, width: 140, height: 20, type: 'cloud' },
      { x: 680, y: groundY - 90, width: 90, height: 90, type: 'pillar' },
      { x: 880, y: groundY - 160, width: 180, height: 20, type: 'crystal' },
      { x: 1240, y: groundY - 110, width: 150, height: 20, type: 'cloud' },
      { x: 1460, y: groundY - 170, width: 180, height: 20, type: 'crystal' },
      { x: 1740, y: groundY - 80, width: 90, height: 80, type: 'pillar' },
      { x: 1960, y: groundY - 150, width: 220, height: 20, type: 'cloud' },
      { x: 2260, y: groundY - 100, width: 160, height: 20, type: 'crystal' }
    );

    questionBlocks.push(
      { id: 'qb-21', x: 260, y: groundY - 150, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'MACHINE' },
      { id: 'qb-22', x: 480, y: groundY - 220, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'SPREAD' },
      { id: 'qb-23', x: 920, y: groundY - 240, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'LASER' },
      { id: 'qb-24', x: 1520, y: groundY - 250, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'BARRIER' }
    );

    sealGates.push(
      {
        id: 'gate-21',
        x: 1140,
        y: groundY - 180,
        width: 32,
        height: 180,
        unlocked: false,
        shattering: false,
        shatterTimer: 0,
        title: 'CỔNG PHONG ẤN ÁNH TRĂNG'
      },
      {
        id: 'gate-22',
        x: 2360,
        y: groundY - 180,
        width: 32,
        height: 180,
        unlocked: false,
        shattering: false,
        shatterTimer: 0,
        title: 'CỔNG PHONG ẤN TỐI CAO'
      }
    );

    supplyPods.push(
      {
        id: 'pod-21',
        x: 550,
        y: 115,
        baseY: 115,
        vx: 1.3,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'LASER'
      },
      {
        id: 'pod-22',
        x: 1300,
        y: 100,
        baseY: 100,
        vx: 1.2,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'MUSHROOM'
      },
      {
        id: 'pod-23',
        x: 1950,
        y: 110,
        baseY: 110,
        vx: 1.3,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'SPREAD'
      }
    );

    enemies.push(
      { id: 'e21', x: 340, y: groundY - 36, vx: -1.3, vy: 0, width: 28, height: 36, hp: 1, maxHp: 1, type: 'shadow_imp', shootCooldown: 100, direction: 'left', points: 100, patrolMinX: 200, patrolMaxX: 500 },
      { id: 'e22', x: 690, y: groundY - 90 - 32, vx: 0, vy: 0, width: 32, height: 32, hp: 4, maxHp: 4, type: 'crystal_turret', shootCooldown: 75, direction: 'left', points: 250 },
      { id: 'e23', x: 940, y: groundY - 160 - 36, vx: -1.0, vy: 0, width: 28, height: 36, hp: 1, maxHp: 1, type: 'shadow_imp', shootCooldown: 90, direction: 'left', points: 100, patrolMinX: 880, patrolMaxX: 1040 },
      { id: 'e24', x: 1320, y: groundY - 200, vx: -1.8, vy: 0, width: 30, height: 26, hp: 2, maxHp: 2, type: 'star_bat', shootCooldown: 110, direction: 'left', points: 200 },
      { id: 'e25', x: 1750, y: groundY - 80 - 32, vx: 0, vy: 0, width: 32, height: 32, hp: 4, maxHp: 4, type: 'crystal_turret', shootCooldown: 70, direction: 'left', points: 250 },
      { id: 'e26', x: 2050, y: groundY - 36, vx: -1.3, vy: 0, width: 28, height: 36, hp: 1, maxHp: 1, type: 'shadow_imp', shootCooldown: 90, direction: 'left', points: 100, patrolMinX: 1850, patrolMaxX: 2200 },
      { id: 'boss-2', x: 2580, y: groundY - 130, vx: 0, vy: 0, width: 100, height: 120, hp: 35, maxHp: 35, type: 'shadow_queen', shootCooldown: 50, direction: 'left', points: 3000 }
    );
  } else {
    // Stage 3
    platforms.push(
      { x: 200, y: groundY - 90, width: 140, height: 20, type: 'crystal' },
      { x: 420, y: groundY - 170, width: 160, height: 20, type: 'cloud' },
      { x: 680, y: groundY - 100, width: 90, height: 100, type: 'pillar' },
      { x: 860, y: groundY - 180, width: 200, height: 20, type: 'crystal' },
      { x: 1240, y: groundY - 120, width: 160, height: 20, type: 'cloud' },
      { x: 1500, y: groundY - 200, width: 220, height: 20, type: 'crystal' },
      { x: 1820, y: groundY - 110, width: 100, height: 110, type: 'pillar' },
      { x: 2060, y: groundY - 180, width: 220, height: 20, type: 'cloud' },
      { x: 2380, y: groundY - 120, width: 180, height: 20, type: 'crystal' }
    );

    questionBlocks.push(
      { id: 'qb-31', x: 240, y: groundY - 170, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'SPREAD' },
      { id: 'qb-32', x: 460, y: groundY - 250, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'LASER' },
      { id: 'qb-33', x: 920, y: groundY - 260, width: 36, height: 36, hit: false, bumping: 0, rewardWeapon: 'BARRIER' }
    );

    sealGates.push(
      {
        id: 'gate-31',
        x: 1120,
        y: groundY - 180,
        width: 32,
        height: 180,
        unlocked: false,
        shattering: false,
        shatterTimer: 0,
        title: 'CỔNG PHONG ẤN THIÊN HÀ'
      },
      {
        id: 'gate-32',
        x: 2440,
        y: groundY - 180,
        width: 32,
        height: 180,
        unlocked: false,
        shattering: false,
        shatterTimer: 0,
        title: 'CỔNG PHONG ẤN HƯ VÔ'
      }
    );

    supplyPods.push(
      {
        id: 'pod-31',
        x: 600,
        y: 110,
        baseY: 110,
        vx: 1.4,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'MUSHROOM'
      },
      {
        id: 'pod-32',
        x: 1350,
        y: 100,
        baseY: 100,
        vx: 1.3,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'SPREAD'
      },
      {
        id: 'pod-33',
        x: 2000,
        y: 110,
        baseY: 110,
        vx: 1.4,
        width: 36,
        height: 28,
        hp: 1,
        destroyed: false,
        dropType: 'LASER'
      }
    );

    enemies.push(
      { id: 'e31', x: 320, y: groundY - 36, vx: -1.5, vy: 0, width: 28, height: 36, hp: 2, maxHp: 2, type: 'shadow_imp', shootCooldown: 85, direction: 'left', points: 150, patrolMinX: 180, patrolMaxX: 420 },
      { id: 'e32', x: 690, y: groundY - 100 - 32, vx: 0, vy: 0, width: 32, height: 32, hp: 5, maxHp: 5, type: 'crystal_turret', shootCooldown: 60, direction: 'left', points: 300 },
      { id: 'e33', x: 920, y: groundY - 180 - 36, vx: -1.2, vy: 0, width: 28, height: 36, hp: 2, maxHp: 2, type: 'shadow_imp', shootCooldown: 80, direction: 'left', points: 150, patrolMinX: 860, patrolMaxX: 1040 },
      { id: 'e34', x: 1340, y: groundY - 220, vx: -2.0, vy: 0, width: 30, height: 26, hp: 3, maxHp: 3, type: 'star_bat', shootCooldown: 90, direction: 'left', points: 250 },
      { id: 'e35', x: 1830, y: groundY - 110 - 32, vx: 0, vy: 0, width: 32, height: 32, hp: 5, maxHp: 5, type: 'crystal_turret', shootCooldown: 55, direction: 'left', points: 300 },
      { id: 'e36', x: 2150, y: groundY - 36, vx: -1.5, vy: 0, width: 28, height: 36, hp: 2, maxHp: 2, type: 'shadow_imp', shootCooldown: 80, direction: 'left', points: 150, patrolMinX: 1950, patrolMaxX: 2320 },
      { id: 'boss-3', x: 2740, y: groundY - 140, vx: 0, vy: 0, width: 110, height: 130, hp: 50, maxHp: 50, type: 'shadow_queen', shootCooldown: 40, direction: 'left', points: 5000 }
    );
  }

  return { platforms, questionBlocks, enemies, sealGates, supplyPods };
}
