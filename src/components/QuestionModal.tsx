import React, { useState, useEffect } from 'react';
import { Question, WeaponType } from '../types/game';
import { soundEngine } from '../utils/audio';
import { CATEGORY_LABELS } from '../data/defaultQuestions';
import { CheckCircle2, XCircle, Clock, Sparkles, Award, ArrowRight, HelpCircle, ShieldAlert, RotateCcw } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  rewardWeapon?: WeaponType;
  isSealGate?: boolean;
  onAnswer: (isCorrect: boolean, timeTakenSec: number) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  rewardWeapon = 'SPREAD',
  isSealGate = true,
  onAnswer,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    soundEngine.playQuizTrigger();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isAnswered && isCorrect) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 30; // Reset timer to allow re-trying until correct
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, isCorrect]);

  const handleSelect = (index: number) => {
    if (isCorrect) return; // Already solved
    if (disabledOptions.includes(index)) return; // Already tried and wrong

    const timeTaken = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === question.correctIndex;
    if (correct) {
      setIsCorrect(true);
      soundEngine.playCorrect();
      onAnswer(true, timeTaken);
    } else {
      setIsCorrect(false);
      setWrongAttempts(prev => prev + 1);
      setDisabledOptions(prev => [...prev, index]);
      soundEngine.playWrong();
      onAnswer(false, timeTaken);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // Keyboard navigation (1, 2, 3, 4 hoặc A, B, C, D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCorrect) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') handleSelect(0);
        if (e.key === '2' || e.key === 'b' || e.key === 'B') handleSelect(1);
        if (e.key === '3' || e.key === 'c' || e.key === 'C') handleSelect(2);
        if (e.key === '4' || e.key === 'd' || e.key === 'D') handleSelect(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCorrect, disabledOptions]);

  const catInfo = CATEGORY_LABELS[question.category] || CATEGORY_LABELS.general;

  const getRewardName = (type: WeaponType) => {
    switch (type) {
      case 'SPREAD':
        return 'Gậy Phép Ngũ Tinh SPREAD [S] + Hồi Máu';
      case 'LASER':
        return 'Tia Sáng Ngân Hà LASER [L] + Hồi Máu';
      case 'MACHINE':
        return 'Bão Sao Băng RAPID [M] + Hồi Máu';
      case 'FLAME':
        return 'Hỏa Cầu Tình Yêu FIRE [F] + Hồi Máu';
      case 'BARRIER':
        return 'Khiên Tinh Tú Ma Pháp BARRIER [B] + Hồi Máu';
      default:
        return 'Khai Mở Cổng Phong Ấn + Tinh Lực';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-pink-500 rounded-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Magical Terminal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-pink-950 px-4 sm:px-6 py-3.5 border-b border-pink-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-pink-400 rounded-full animate-ping" />
            <span className="font-arcade text-xs text-pink-300 tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{isSealGate ? 'CỔNG PHONG ẤN TRI THỨC' : 'KHỐI TINH TÚ TRI THỨC'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 font-mono text-slate-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold tabular-nums text-amber-200">
                {timeLeft}s
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${catInfo.badge}`}>
              <span>{catInfo.icon}</span>
              <span>{catInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Notice banner for Seal Gate */}
          {isSealGate && (
            <div className="bg-purple-950/70 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-purple-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Cổng phong ấn ma thuật đóng băng mọi đường đạn và quái vật. <strong>Phải trả lời ĐÚNG</strong> để phá cổng và tiếp tục!
              </span>
            </div>
          )}

          {/* Question Text */}
          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-xl border border-pink-900/60 shadow-inner">
            <div className="text-[10px] text-pink-400 font-mono tracking-widest uppercase mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Câu hỏi giải mã ma pháp:</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {question.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isThisSelected = selectedOption === idx;
              const isThisCorrect = idx === question.correctIndex;
              const isThisDisabled = disabledOptions.includes(idx);

              let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-pink-400/50 cursor-pointer';

              if (isCorrect) {
                if (isThisCorrect) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-950';
                } else {
                  btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed';
                }
              } else if (isThisDisabled) {
                btnStyle = 'bg-rose-950/60 border-rose-800 text-rose-300 opacity-60 cursor-not-allowed line-through';
              } else if (isThisSelected && !isThisCorrect) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isCorrect || isThisDisabled}
                  className={`flex items-start text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all relative ${btnStyle}`}
                >
                  <span className="font-arcade text-xs text-amber-300 mr-2.5 mt-0.5 shrink-0">
                    [{letter}]
                  </span>
                  <span className="font-medium flex-1">{opt}</span>
                  {isCorrect && isThisCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1.5 self-center" />
                  )}
                  {isThisDisabled && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1.5 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Error & Hint Display when answered WRONG */}
          {isAnswered && !isCorrect && (
            <div className="p-4 rounded-xl border bg-rose-950/80 border-rose-500 text-rose-200 text-xs sm:text-sm animate-in zoom-in-95 duration-150 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-rose-300">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>TRẢ LỜI SAI! CỔNG PHONG ẤN CHƯA MỞ!</span>
              </div>
              <p className="text-rose-200">
                Bạn chưa thể đi tiếp. Vui lòng đọc gợi ý bên dưới và chọn lại phương án đúng:
              </p>

              {/* Detailed Explanation / Gợi ý */}
              <div className="text-slate-100 bg-black/40 p-3 rounded-lg border border-pink-500/30 flex items-start gap-2.5 mt-2">
                <HelpCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300 mb-0.5">Gợi Ý & Giải Thích:</div>
                  <div className="leading-relaxed text-slate-200">{question.explanation}</div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-pink-300 font-mono">
                  Đã thử: {wrongAttempts} lần (Hãy chọn các phương án còn lại)
                </span>
                <button
                  onClick={handleRetry}
                  className="px-3 py-1.5 rounded-lg bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chọn Lại Ngay</span>
                </button>
              </div>
            </div>
          )}

          {/* Success Feedback when answered CORRECT */}
          {isCorrect && (
            <div className="p-4 rounded-xl border bg-emerald-950/80 border-emerald-400 text-emerald-200 text-xs sm:text-sm animate-in zoom-in-95 duration-150 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>CHÍNH XÁC! CỔNG PHONG ẤN PHÁ VỠ!</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-emerald-900/50 rounded-lg border border-emerald-500/40 text-emerald-300 font-mono text-xs">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>PHẦN THƯỞNG: {getRewardName(rewardWeapon)}</span>
              </div>

              {/* Detailed explanation */}
              <div className="text-slate-200 leading-relaxed font-sans bg-black/30 p-2.5 rounded-lg flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-pink-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-pink-200">Gợi ý & Kiến thức cần nhớ: </span>
                  {question.explanation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-pink-300/70 hidden sm:block">
            Mẹo: Nhấn phím 1, 2, 3, 4 trên bàn phím để chọn nhanh
          </div>

          {isCorrect ? (
            <button
              onClick={onClose}
              className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer animate-pulse"
            >
              <span>Phá Hủy Cổng & Tiến Lên!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-[11px] text-amber-300 flex items-center gap-1.5 font-mono ml-auto">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Cần trả lời đúng phương án để mở cổng</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
