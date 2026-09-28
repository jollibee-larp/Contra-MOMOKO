import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Sparkles, ChevronUp, Wand2 } from 'lucide-react';

interface TouchControlsProps {
  onDirectionChange: (dir: { left: boolean; right: boolean; up: boolean; down: boolean }) => void;
  onJumpPress: () => void;
  onJumpRelease: () => void;
  onShootPress: () => void;
  onShootRelease: () => void;
  onSkillPress?: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionChange,
  onJumpPress,
  onJumpRelease,
  onShootPress,
  onShootRelease,
  onSkillPress
}) => {
  const [dirs, setDirs] = React.useState({ left: false, right: false, up: false, down: false });

  const updateDir = (key: 'left' | 'right' | 'up' | 'down', active: boolean) => {
    setDirs(prev => {
      const next = { ...prev, [key]: active };
      onDirectionChange(next);
      return next;
    });
  };

  return (
    <div className="w-full select-none bg-slate-950/90 border-t border-pink-900/60 py-2.5 px-3 sm:px-6 shadow-inner touch-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Direction Pad */}
        <div className="relative w-28 h-28 sm:w-34 sm:h-34 flex items-center justify-center shrink-0">
          {/* Up (Ngắm lên) */}
          <button
            onTouchStart={(e) => { e.preventDefault(); updateDir('up', true); }}
            onTouchEnd={(e) => { e.preventDefault(); updateDir('up', false); }}
            onMouseDown={() => updateDir('up', true)}
            onMouseUp={() => updateDir('up', false)}
            className={`absolute top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-t-xl bg-slate-900 border border-pink-500/40 flex items-center justify-center active:bg-pink-600 transition-colors shadow-md ${
              dirs.up ? 'bg-pink-600 border-pink-300' : ''
            }`}
            title="Ngắm lên trên [W / ↑]"
          >
            <ArrowUp className="w-5 h-5 text-pink-200" />
          </button>

          {/* Down (Cúi người) */}
          <button
            onTouchStart={(e) => { e.preventDefault(); updateDir('down', true); }}
            onTouchEnd={(e) => { e.preventDefault(); updateDir('down', false); }}
            onMouseDown={() => updateDir('down', true)}
            onMouseUp={() => updateDir('down', false)}
            className={`absolute bottom-0 w-10 h-10 sm:w-11 sm:h-11 rounded-b-xl bg-slate-900 border border-pink-500/40 flex items-center justify-center active:bg-pink-600 transition-colors shadow-md ${
              dirs.down ? 'bg-pink-600 border-pink-300' : ''
            }`}
            title="Cúi người né đường đạn [S / ↓]"
          >
            <ArrowDown className="w-5 h-5 text-pink-200" />
          </button>

          {/* Left (Trái) */}
          <button
            onTouchStart={(e) => { e.preventDefault(); updateDir('left', true); }}
            onTouchEnd={(e) => { e.preventDefault(); updateDir('left', false); }}
            onMouseDown={() => updateDir('left', true)}
            onMouseUp={() => updateDir('left', false)}
            className={`absolute left-0 w-10 h-10 sm:w-11 sm:h-11 rounded-l-xl bg-slate-900 border border-pink-500/40 flex items-center justify-center active:bg-pink-600 transition-colors shadow-md ${
              dirs.left ? 'bg-pink-600 border-pink-300' : ''
            }`}
            title="Đi sang trái [A / ←]"
          >
            <ArrowLeft className="w-5 h-5 text-pink-200" />
          </button>

          {/* Right (Phải) */}
          <button
            onTouchStart={(e) => { e.preventDefault(); updateDir('right', true); }}
            onTouchEnd={(e) => { e.preventDefault(); updateDir('right', false); }}
            onMouseDown={() => updateDir('right', true)}
            onMouseUp={() => updateDir('right', false)}
            className={`absolute right-0 w-10 h-10 sm:w-11 sm:h-11 rounded-r-xl bg-slate-900 border border-pink-500/40 flex items-center justify-center active:bg-pink-600 transition-colors shadow-md ${
              dirs.right ? 'bg-pink-600 border-pink-300' : ''
            }`}
            title="Đi sang phải [D / →]"
          >
            <ArrowRight className="w-5 h-5 text-pink-200" />
          </button>

          {/* Center Gem */}
          <div className="w-8 h-8 bg-purple-950/80 border border-pink-400/50 rounded-full flex items-center justify-center pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
        </div>

        {/* Center: Tips & Hints */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center text-[11px] text-pink-300/80 px-2">
          <div className="font-semibold text-pink-200 flex items-center gap-1.5 mb-0.5">
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            <span>HỆ THỐNG ĐIỀU KHIỂN CHIẾN ĐẤU</span>
          </div>
          <div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">A/D</kbd> Chạy · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">W/Space</kbd> Nhảy · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">S</kbd> Cúi né đạn · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">J</kbd> Bắn · <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">K</kbd> Skill Mana
          </div>
        </div>

        {/* Right: ACTION BUTTONS (NHẢY, BẮN, KỸ NĂNG MANA) */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* NÚT KỸ NĂNG MANA (Phím K) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onSkillPress && onSkillPress()}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 border-2 border-cyan-300 active:scale-95 shadow-md shadow-cyan-950/60 flex flex-col items-center justify-center text-white font-bold cursor-pointer transition-transform"
              title="Kích hoạt Khiên / Sóng Nổ Tinh Tú [Phím K]"
            >
              <Sparkles className="w-5 h-5 drop-shadow-sm text-cyan-200" />
              <span className="text-[9px] sm:text-[10px] font-arcade tracking-wider">SKILL</span>
            </button>
            <span className="text-[9px] text-cyan-300 font-mono mt-0.5 font-semibold">
              [Phím K]
            </span>
          </div>

          {/* NÚT NHẢY (Jump Button) */}
          <div className="flex flex-col items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); onJumpPress(); }}
              onTouchEnd={(e) => { e.preventDefault(); onJumpRelease(); }}
              onMouseDown={onJumpPress}
              onMouseUp={onJumpRelease}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-emerald-300 active:scale-95 active:from-emerald-400 active:to-teal-600 shadow-lg shadow-emerald-950/60 flex flex-col items-center justify-center text-white font-bold cursor-pointer transition-transform"
              title="Nhảy lên các bậc địa hình [Space / W / ↑]"
            >
              <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm" />
              <span className="text-[10px] sm:text-xs font-arcade tracking-wider">NHẢY</span>
            </button>
            <span className="text-[9px] text-emerald-300 font-mono mt-0.5 font-semibold">
              [Space / W]
            </span>
          </div>

          {/* NÚT TẤN CÔNG (Attack / Shoot Button) */}
          <div className="flex flex-col items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); onShootPress(); }}
              onTouchEnd={(e) => { e.preventDefault(); onShootRelease(); }}
              onMouseDown={onShootPress}
              onMouseUp={onShootRelease}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 border-2 border-pink-300 active:scale-95 active:from-pink-400 active:to-purple-500 shadow-lg shadow-pink-950/60 flex flex-col items-center justify-center text-white font-bold cursor-pointer transition-transform"
              title="Bắn phép thuật tinh tú [J / Click chuột]"
            >
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm animate-pulse" />
              <span className="text-[10px] sm:text-xs font-arcade tracking-wider">TẤN CÔNG</span>
            </button>
            <span className="text-[9px] text-pink-300 font-mono mt-0.5 font-semibold">
              [Phím J]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
