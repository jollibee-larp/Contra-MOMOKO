import React from 'react';
import { Play, BookOpen, HelpCircle, Sparkles, Heart, Star, Compass } from 'lucide-react';
import { STAGES } from '../data/stages';
import { CATEGORY_LABELS } from '../data/defaultQuestions';
import { Question } from '../types/game';
import momokoBannerImg from '../assets/images/momoko_rainbow_banner_1790566973498.jpg';
import momokoAvatarImg from '../assets/images/momoko_wani_avatar_1790566990793.jpg';

interface TitleScreenProps {
  onStartGame: (stageId: number, category: string) => void;
  onOpenQuizManager: () => void;
  onOpenRules: () => void;
  highScore: number;
  totalQuestions: number;
  questions: Question[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenQuizManager,
  onOpenRules,
  highScore,
  totalQuestions,
  questions,
  selectedCategory,
  onSelectCategory
}) => {
  const [selectedStage, setSelectedStage] = React.useState<number>(1);

  // Count questions in selected category
  const activeCount = selectedCategory === 'all'
    ? questions.length
    : questions.filter(q => q.category === selectedCategory).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Hero Magical Arcade Banner */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/70 bg-slate-900 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={momokoBannerImg}
            alt="Momoko Rainbow & Wani Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-95 filter contrast-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />

          {/* Title and Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-pink-300 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
                <span className="font-bold tracking-wider">MOMOKO'S ADVENTURE × KNOWLEDGE</span>
                <span>·</span>
                <span className="text-amber-300 font-semibold">{totalQuestions} Câu hỏi sẵn sàng</span>
              </div>
              <h1 className="font-arcade text-xl sm:text-3xl bg-gradient-to-r from-pink-400 via-yellow-300 via-green-300 to-purple-400 bg-clip-text text-transparent tracking-wider drop-shadow-[0_0_14px_rgba(244,114,182,0.8)]">
                MOMOKO'S ADVENTURE
              </h1>
              <p className="text-pink-100 text-sm sm:text-base font-display font-semibold mt-1">
                Chiến Dịch Tri Thức: Momoko Cầu Vồng 🌈 & Pet Cá Sấu Wani 🐊
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-slate-950/90 rounded-xl border border-pink-500/60 text-right shadow-md">
                <div className="text-[10px] text-pink-300/80 tracking-wider">KỶ LỤC ĐIỂM SỐ</div>
                <div className="font-arcade text-sm sm:text-base text-amber-300 tabular-nums">
                  {highScore.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: CHỌN CHỦ ĐỀ ÔN TẬP (Cực kỳ quan trọng) */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/50 to-slate-950 border-2 border-purple-500/50 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-slate-950 font-arcade text-xs flex items-center justify-center font-bold">
              1
            </span>
            <h2 className="text-sm sm:text-base font-bold text-pink-100 font-display flex items-center gap-2">
              <span>BƯỚC 1: CHỌN CHỦ ĐỀ ÔN TẬP THỬ THÁCH</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
          </div>

          <div className="text-xs text-pink-300/80">
            Trò chơi chỉ lấy các câu hỏi thuộc chủ đề đã chọn để làm thử thách trong màn chơi!
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Option All */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-amber-300 text-white font-bold shadow-lg shadow-pink-500/25 ring-2 ring-amber-300/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-pink-500/50 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🌟</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40">
                {questions.length} câu
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold">Tất Cả Môn</div>
            <div className="text-[10px] text-pink-200/70 mt-0.5 truncate">Đề thi tổng hợp</div>
          </button>

          {/* Specific Categories */}
          {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => {
            const count = questions.filter(q => q.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => onSelectCategory(catKey)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-amber-300 text-white font-bold shadow-lg shadow-pink-500/25 ring-2 ring-amber-300/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-pink-500/50 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40">
                    {count} câu
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold truncate">{info.label}</div>
                <div className="text-[10px] text-pink-200/70 mt-0.5 truncate">Ôn tập chuyên đề</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: CHỌN MÀN CHƠI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-pink-500 text-slate-950 font-arcade text-xs flex items-center justify-center font-bold">
              2
            </span>
            <h2 className="text-sm sm:text-base font-bold text-pink-100 font-display">
              BƯỚC 2: CHỌN CẤP ĐỘ CHIẾN DỊCH
            </h2>
          </div>
          <span className="text-xs text-pink-300/70">3 Màn chơi với kẻ địch và trùm hắc ám đặc sắc</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STAGES.map((st) => {
            const isSelected = selectedStage === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStage(st.id)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-850 border-pink-400 shadow-lg shadow-pink-500/20 ring-1 ring-pink-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-pink-500/40 hover:bg-slate-850'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="absolute transform rotate-45 bg-pink-500 text-white font-arcade text-[8px] py-0.5 right-[-35px] top-[14px] w-[120px] text-center font-bold">
                      ĐÃ CHỌN
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-mono text-pink-400 font-bold mb-1">
                    CẤP ĐỘ 0{st.id}
                  </div>
                  <h3 className="font-bold text-pink-100 text-sm sm:text-base mb-1">
                    {st.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {st.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-rose-300">Trùm: {st.bossName}</span>
                  <span className="text-amber-300 font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300" />
                    <span>Khối [★] Tinh Tú</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Call to Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-pink-950/80 border-2 border-pink-500/60 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src={momokoAvatarImg}
            alt="Momoko Rainbow & Wani Avatar"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl border-2 border-pink-400 object-cover shrink-0 shadow-md shadow-pink-500/30"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="text-sm font-bold text-pink-100 flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-400 via-yellow-300 via-green-300 to-purple-400 bg-clip-text text-transparent font-extrabold">
                Nữ Pháp Sư Momoko 🌈
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 flex items-center gap-1">
                <span>🐊</span>
                <span>Pet: Bé Cá Sấu Wani</span>
              </span>
            </div>
            <div className="text-xs text-pink-300/80 flex items-center gap-2 mt-0.5">
              <span>Chủ đề: <strong className="text-amber-300">{selectedCategory === 'all' ? 'Tất Cả Môn' : CATEGORY_LABELS[selectedCategory]?.label}</strong></span>
              <span>·</span>
              <span className="text-emerald-300">{activeCount} câu hỏi sẵn sàng</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Quản lý câu hỏi / Phím tắt / Bắt đầu */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Button Quản Lý Câu Hỏi / Cài Đặt Đề Thi ngay tại menu chính */}
          <button
            onClick={onOpenQuizManager}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-pink-500/60 bg-pink-950/60 hover:bg-pink-900/70 text-pink-200 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-pink-400" />
            <span>Quản Lý Câu Hỏi</span>
          </button>

          <button
            onClick={onOpenRules}
            className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            title="Xem hướng dẫn thao tác phím"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Phím Tắt</span>
          </button>

          <button
            onClick={() => onStartGame(selectedStage, selectedCategory)}
            className="flex-1 sm:flex-initial px-7 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Xuất Trận Ngay!</span>
          </button>
        </div>
      </div>

      {/* Magical Features Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-pink-900/50 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pink-950/80 border border-pink-500/40 text-pink-300 shrink-0">
            <Star className="w-4 h-4 fill-pink-400" />
          </div>
          <div>
            <div className="font-bold text-pink-100 mb-0.5">Khối [★] Ngôi Sao Thần Kỳ</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Nhảy Mario đập đầu vào khối ngôi sao để kích hoạt câu hỏi môn học và nhận vũ khí phép thuật.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-purple-900/50 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-pink-100 mb-0.5">Vũ Khí Phép Thuật Tinh Tú</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Nâng cấp gậy phép với Ngũ Tinh Tỏa Sáng, Tia Ngân Hà, Bão Sao Băng và Khiên Ma Pháp.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-900/50 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-pink-100 mb-0.5">Tùy Biến Đề Thi Không Giới Hạn</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Giáo viên và học sinh dễ dàng Thêm, Sửa, Xóa đề thi theo từng môn học và lưu tự động.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
