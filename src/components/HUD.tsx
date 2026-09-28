import React from 'react';
import { WeaponType } from '../types/game';
import { Shield, Flame, Zap, Sparkles, Heart, Award } from 'lucide-react';

interface HUDProps {
  score: number;
  lives: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  weapon: WeaponType;
  stageName: string;
  stageId: number;
  bossHp: number | null;
  bossMaxHp: number | null;
  bossName: string;
  quizStreak: number;
  invincibleTimer: number;
  categoryLabel?: string;
  dayPhase?: 'day' | 'sunset' | 'night';
}

export const HUD: React.FC<HUDProps> = ({
  score,
  lives,
  hp,
  maxHp,
  mana,
  maxMana,
  weapon,
  stageName,
  stageId,
  bossHp,
  bossMaxHp,
  bossName,
  quizStreak,
  invincibleTimer,
  categoryLabel,
  dayPhase = 'day'
}) => {
  const getWeaponBadge = (w: WeaponType) => {
    switch (w) {
      case 'SPREAD':
        return { label: 'SÚNG S [SPREAD]', color: 'bg-rose-500 text-white border-rose-300', icon: Sparkles };
      case 'LASER':
        return { label: 'SÚNG L [LASER]', color: 'bg-cyan-400 text-slate-950 border-cyan-200', icon: Zap };
      case 'MACHINE':
        return { label: 'BÃO SAO [M]', color: 'bg-amber-400 text-slate-950 border-amber-200', icon: Sparkles };
      case 'FLAME':
        return { label: 'HỎA TÂM [F]', color: 'bg-orange-500 text-white border-orange-300', icon: Flame };
      case 'BARRIER':
        return { label: 'KHIÊN TÚ [B]', color: 'bg-fuchsia-500 text-white border-fuchsia-300', icon: Shield };
      default:
        return { label: 'TIÊN SAO [N]', color: 'bg-pink-700 text-pink-100 border-pink-500', icon: Sparkles };
    }
  };

  const currentWeaponInfo = getWeaponBadge(weapon);
  const hpPercent = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
  const manaPercent = Math.max(0, Math.min(100, Math.round((mana / maxMana) * 100)));

  const getDayPhaseBadge = () => {
    switch (dayPhase) {
      case 'sunset':
        return { label: 'HOÀNG HÔN', color: 'text-amber-400 bg-amber-950/80 border-amber-500/50', icon: '🌅' };
      case 'night':
        return { label: 'ĐÊM TỐI (QUẦNG SÁNG)', color: 'text-indigo-300 bg-indigo-950/90 border-indigo-400/60 shadow-[0_0_8px_rgba(99,102,241,0.5)]', icon: '🌙' };
      default:
        return { label: 'BAN NGÀY', color: 'text-sky-300 bg-sky-950/80 border-sky-400/50', icon: '☀️' };
    }
  };

  const dayInfo = getDayPhaseBadge();

  return (
    <div className="w-full bg-slate-950/95 border-b border-pink-900/60 text-slate-200 px-3 py-2 text-xs select-none shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Left: Character Badge, Score & Hearts */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Momoko Rainbow & Pet Crocodile badge */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-rose-950/70 via-purple-950/70 to-cyan-950/70 border border-pink-400/50 px-2 py-0.5 rounded-lg shadow-sm">
            <span className="text-xs" title="Cầu Vồng">🌈</span>
            <span className="font-arcade text-[10px] bg-gradient-to-r from-rose-300 via-amber-200 via-emerald-200 to-sky-300 bg-clip-text text-transparent font-bold">
              MOMOKO
            </span>
            <span className="text-xs ml-0.5" title="Bé Cá Sấu Wani 🐊">🐊</span>
          </div>

          <div className="h-6 w-px bg-pink-900/60 hidden sm:block" />

          <div>
            <div className="text-[10px] text-pink-300/80 tracking-wider">ĐIỂM SAO</div>
            <div className="font-arcade text-amber-300 text-xs sm:text-sm tabular-nums">
              {score.toString().padStart(6, '0')}
            </div>
          </div>

          <div className="h-6 w-px bg-pink-900/60 hidden sm:block" />

          {/* Hearts / Lives */}
          <div>
            <div className="text-[10px] text-pink-300/80 tracking-wider">MẠNG SỐNG</div>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
                    i < lives
                      ? 'text-pink-500 fill-pink-500 drop-shadow-[0_0_4px_rgba(236,72,153,0.7)]'
                      : 'text-slate-700 fill-slate-800 opacity-40'
                  }`}
                />
              ))}
              <span className="font-arcade text-xs text-pink-400 ml-1">×{lives}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-pink-900/60 hidden sm:block" />

          {/* HP Bar */}
          <div className="hidden xs:block">
            <div className="text-[10px] text-pink-300/80 tracking-wider flex justify-between gap-2">
              <span>MÁU (HP)</span>
              <span className="tabular-nums font-mono text-pink-300">{hpPercent}/100</span>
            </div>
            <div className="w-20 sm:w-24 h-2.5 bg-slate-900 rounded-full border border-pink-700/60 overflow-hidden mt-0.5 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-200 bg-gradient-to-r ${
                  hpPercent > 50
                    ? 'from-pink-500 to-rose-500'
                    : hpPercent > 25
                    ? 'from-amber-500 to-pink-500'
                    : 'from-rose-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div className="hidden sm:block">
            <div className="text-[10px] text-cyan-300/80 tracking-wider flex justify-between gap-2">
              <span>MANA (NĂNG LƯỢNG)</span>
              <span className="tabular-nums font-mono text-cyan-300">{manaPercent}/100</span>
            </div>
            <div className="w-20 sm:w-24 h-2.5 bg-slate-900 rounded-full border border-cyan-700/60 overflow-hidden mt-0.5 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-200 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Stage, Boss Bar, & Day/Night Indicator */}
        <div className="flex-1 max-w-xs text-center hidden md:flex flex-col items-center justify-center">
          {bossHp !== null && bossMaxHp !== null ? (
            <div className="animate-pulse w-full">
              <div className="text-[10px] text-rose-300 font-bold tracking-wider uppercase flex items-center justify-center gap-1">
                <span>⚠️ {bossName}</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full border border-rose-500/80 overflow-hidden mt-0.5 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-pink-500 transition-all duration-150"
                  style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <div className="text-[10px] text-pink-300/80 tracking-wider flex items-center justify-center gap-1">
                  <span>CHIẾN ĐỊCH</span>
                  {categoryLabel && <span className="text-amber-300">[{categoryLabel}]</span>}
                </div>
                {/* Day Phase indicator */}
                <div className={`px-1.5 py-0.2 rounded border text-[9px] font-mono flex items-center gap-1 ${dayInfo.color}`}>
                  <span>{dayInfo.icon}</span>
                  <span>{dayInfo.label}</span>
                </div>
              </div>
              <div className="font-bold text-pink-100 truncate text-xs">{stageName}</div>
            </div>
          )}
        </div>

        {/* Right: Weapon & Streak & Mana skill prompt */}
        <div className="flex items-center gap-2 sm:gap-3">
          {quizStreak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-pink-950/80 border border-pink-500/50 rounded-full">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] text-amber-200 font-mono font-bold">
                Chuỗi {quizStreak}x
              </span>
            </div>
          )}

          {invincibleTimer > 0 && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-yellow-300 to-pink-400 text-slate-950 text-[10px] font-bold rounded-full animate-bounce font-arcade shadow-md shadow-pink-500/30">
              BẤT TỬ
            </div>
          )}

          {/* Weapon Badge */}
          <div className="flex items-center gap-1.5">
            <div
              className={`px-2.5 py-1 text-[11px] font-bold font-mono tracking-wider rounded-md border flex items-center gap-1 shadow-xs ${currentWeaponInfo.color}`}
            >
              <currentWeaponInfo.icon className="w-3 h-3" />
              <span>{currentWeaponInfo.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
