import React from 'react';
import { Volume2, VolumeX, Music, BookOpen, RotateCcw, Sparkles } from 'lucide-react';

interface RetroHeaderProps {
  score: number;
  highScore: number;
  stageName: string;
  categoryLabel?: string;
  onOpenQuizManager: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
  isPlaying: boolean;
  sfxOn: boolean;
  bgmOn: boolean;
  onToggleSfx: () => void;
  onToggleBgm: () => void;
}

export const RetroHeader: React.FC<RetroHeaderProps> = ({
  score,
  highScore,
  stageName,
  categoryLabel,
  onOpenQuizManager,
  onOpenRules,
  onResetGame,
  isPlaying,
  sfxOn,
  bgmOn,
  onToggleSfx,
  onToggleBgm
}) => {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-pink-900/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Wordmark */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onResetGame}
          className="text-sm sm:text-base font-bold tracking-tight text-pink-300 hover:text-pink-200 transition-colors flex items-center gap-2 font-display text-left"
        >
          <span className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping inline-block" />
          <span className="bg-gradient-to-r from-pink-400 via-yellow-300 via-green-300 to-purple-400 bg-clip-text text-transparent font-arcade text-xs sm:text-sm">
            MOMOKO'S ADVENTURE
          </span>
          <span className="text-pink-300/80 font-normal text-xs hidden md:inline">
            · Tri Thức Cầu Vồng 🌈
          </span>
        </button>
      </div>

      {/* Nav & Info */}
      <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-pink-200/90">
        <button
          onClick={onOpenRules}
          className="hover:text-amber-300 transition-colors whitespace-nowrap"
        >
          Hướng Dẫn & Thao Tác
        </button>

        <button
          onClick={onOpenQuizManager}
          className="px-2.5 py-1 rounded-full bg-pink-950/70 border border-pink-500/50 hover:bg-pink-900/60 hover:border-pink-400 transition-all text-pink-200 flex items-center gap-1.5 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-pink-400" />
          <span className="font-semibold">Quản Lý Câu Hỏi & Đề Thi</span>
        </button>

        <span className="text-pink-900">|</span>

        {categoryLabel && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-950 border border-purple-600/40 text-[11px] text-purple-200 font-mono">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Môn: {categoryLabel}</span>
          </div>
        )}

        <div className="text-[11px] text-pink-300/80 flex items-center gap-1.5">
          <span>KỶ LỤC:</span>
          <span className="font-arcade text-amber-300 tabular-nums">{highScore.toLocaleString()}</span>
        </div>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSfx}
          title={sfxOn ? 'Tắt Hiệu Ứng Âm Thanh' : 'Bật Hiệu Ứng Âm Thanh'}
          className={`p-1.5 sm:p-2 rounded-md border text-xs transition-colors flex items-center gap-1 ${
            sfxOn ? 'bg-pink-950/70 border-pink-700/60 text-pink-200 hover:bg-pink-900/70' : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
        >
          {sfxOn ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline text-[11px]">SFX</span>
        </button>

        <button
          onClick={onToggleBgm}
          title={bgmOn ? 'Tắt Nhạc Phép Thuật' : 'Bật Nhạc Phép Thuật'}
          className={`p-1.5 sm:p-2 rounded-md border text-xs transition-colors flex items-center gap-1 ${
            bgmOn ? 'bg-pink-950/70 border-amber-500/50 text-amber-300 hover:bg-pink-900/70' : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
        >
          <Music className={`w-4 h-4 ${bgmOn ? 'text-amber-400 animate-bounce' : ''}`} />
          <span className="hidden sm:inline text-[11px]">BGM</span>
        </button>

        <button
          onClick={onOpenQuizManager}
          className="lg:hidden p-1.5 sm:p-2 rounded-md bg-pink-950/70 border border-pink-700 text-pink-200 hover:bg-pink-900"
          title="Quản lý câu hỏi"
        >
          <BookOpen className="w-4 h-4 text-pink-300" />
        </button>

        {isPlaying && (
          <button
            onClick={onResetGame}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Menu</span>
          </button>
        )}
      </div>
    </header>
  );
};
