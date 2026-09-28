export type WeaponType = 'NORMAL' | 'MACHINE' | 'SPREAD' | 'LASER' | 'FLAME' | 'BARRIER';

export type PowerUpType = 'MUSHROOM' | 'SPREAD' | 'LASER' | 'MACHINE' | 'BARRIER';

export type GameState = 'TITLE' | 'PLAYING' | 'QUIZ_PAUSED' | 'STAGE_CLEAR' | 'GAME_OVER' | 'VICTORY' | 'QUIZ_MANAGER';

export type QuestionCategory = 'informatics' | 'math' | 'english' | 'history' | 'science' | 'general';

export interface Question {
  id: string;
  category: QuestionCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // Gợi ý / giải thích chi tiết
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  aimDirection: 'horizontal' | 'up' | 'diagonal-up' | 'down';
  isCrouching: boolean;
  weapon: WeaponType;
  lives: number;
  maxHp: number;
  hp: number;
  maxMana: number;
  mana: number;
  invincibleTimer: number; // frames
  barrierTimer: number; // frames
  rapidCooldown: number;
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: WeaponType | 'LASER_BEAM';
  damage: number;
  color: string;
  fromPlayer: boolean;
  sparkle?: boolean;
  piercing?: boolean;
  width?: number;
  height?: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'crystal' | 'cloud' | 'pillar';
}

export interface QuestionBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hit: boolean;
  bumping: number; // bump animation offset
  questionId?: string;
  rewardWeapon?: WeaponType;
}

// Cổng phong ấn / Rào chắn trắc nghiệm
export interface SealGate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  unlocked: boolean;
  shattering: boolean;
  shatterTimer: number;
  title: string;
}

// Hộp tiếp tế bay trên trời (Flying Supply Capsule)
export interface SupplyPod {
  id: string;
  x: number;
  y: number;
  vx: number;
  baseY: number;
  width: number;
  height: number;
  hp: number;
  destroyed: boolean;
  dropType: PowerUpType;
}

// Vật phẩm rơi xuống đất (Rơi từ hộp tiếp tế bay)
export interface DroppedItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  type: PowerUpType;
  collected: boolean;
  isGrounded: boolean;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'shadow_imp' | 'crystal_turret' | 'star_bat' | 'shadow_queen';
  shootCooldown: number;
  direction: 'left' | 'right';
  points: number;
  patrolMinX?: number;
  patrolMaxX?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape?: 'circle' | 'star' | 'heart';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export interface AnswerRecord {
  question: Question;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTakenSec: number;
}

export interface StageConfig {
  id: number;
  name: string;
  subtitle: string;
  backgroundTheme: 'candy_kingdom' | 'crystal_lake' | 'celestial_temple';
  levelWidth: number;
  skyColorTop: string;
  skyColorBottom: string;
  groundColor: string;
  bossName: string;
}
