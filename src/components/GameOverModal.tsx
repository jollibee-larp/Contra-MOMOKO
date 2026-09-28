import React, { useState } from 'react';
import { AnswerRecord } from '../types/game';
import { Award, RotateCcw, ArrowRight, CheckCircle2, XCircle, Trophy, BookOpen, Sparkles, Home, LogOut, X } from 'lucide-react';

interface GameOverModalProps {
  type: 'VICTORY' | 'STAGE_CLEAR' | 'GAME_OVER';
  score: number;
  highScore: number;
  stageName: string;
  stageId: number;
  answers: AnswerRecord[];
  categoryLabel?: string;
  onRestart: () => void;
  onNextStage?: () => void;
  onExitToTitle?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  type,
  score,
  highScore,
  stageName,
  stageId,
  answers,
  categoryLabel,
  onRestart,
  onNextStage,
  onExitToTitle
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const correctCount = answers.filter(a => a.isCorrect).length;
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  // Rank determination
  const getRank = () => {
    if (type === 'VICTORY' && accuracy >= 90) return { title: 'NỮ THẦN TRI THỨC TỐI CAO', desc: 'Thấu hiểu trọn vẹn tri thức và cứu rỗi thế giới hoàn hảo!' };
    if (accuracy >= 80) return { title: 'ĐẠI PHÙ THỦY TINH TÚ', desc: 'Phép thuật kiên cố, kiến thức sâu rộng!' };
    if (accuracy >= 60) return { title: 'CHIẾN BINH PHÉP THUẬT TIÊN PHONG', desc: 'Phản xạ tuyệt vời, nắm vững nền tảng bài học.' };
    return { title: 'TẬP SỰ MA PHÁP', desc: 'Hãy tiếp tục rèn luyện thêm để bách chiến bách thắng!' };
  };

  const rank = getRank();
  const isStageClear = type === 'STAGE_CLEAR';
  const isVictory = type === 'VICTORY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-pink-500/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Banner header */}
        <div
          className={`relative p-6 text-center border-b ${
            isVictory
              ? 'bg-gradient-to-b from-purple-950/90 to-slate-900 border-amber-500/50'
              : isStageClear
              ? 'bg-gradient-to-b from-pink-950/90 to-slate-900 border-pink-500/50'
              : 'bg-gradient-to-b from-rose-950/90 to-slate-900 border-rose-500/50'
          }`}
        >
          {/* Quick Exit Top Right Button */}
          {onExitToTitle && (
            <button
              onClick={onExitToTitle}
              className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/70 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Thoát về giao diện chính"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          )}

          <div className="inline-flex p-3 rounded-2xl bg-slate-950/80 border border-pink-500/40 mb-2 shadow-md">
            {isVictory ? (
              <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
            ) : isStageClear ? (
              <Award className="w-8 h-8 text-pink-400 animate-pulse" />
            ) : (
              <RotateCcw className="w-8 h-8 text-rose-400" />
            )}
          </div>

          <h2 className="font-arcade text-lg sm:text-2xl text-pink-100 tracking-wider mb-1">
            {isVictory ? 'ĐẠI CHIẾN TOÀN THẮNG!' : isStageClear ? 'VƯỢT ẢI THÀNH CÔNG!' : 'HẾT NĂNG LƯỢNG MA PHÁP'}
          </h2>

          <p className="text-xs sm:text-sm text-pink-200/80 font-medium">
            {isVictory
              ? 'Nữ Pháp Sư Momoko và Bé Cá Sấu Wani đã thanh tẩy Nữ Hoàng Bóng Tối và cứu rỗi thế giới!'
              : isStageClear
              ? `Momoko & Bé Cá Sấu đã hoàn thành xuất sắc ${stageName} · Môn: ${categoryLabel || 'Tổng hợp'}`
              : 'Momoko cần hồi phục năng lượng! Xem lại sổ tay ghi nhớ kiến thức để sẵn sàng lượt tới!'}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-950/90 border-b border-slate-800 py-3 text-center">
          <div>
            <div className="text-[10px] text-pink-300/80 uppercase tracking-wider">Điểm Sao</div>
            <div className="font-arcade text-base sm:text-lg text-amber-300 tabular-nums mt-0.5">
              {score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-pink-300/80 uppercase tracking-wider">Độ Chính Xác</div>
            <div className="font-arcade text-base sm:text-lg text-emerald-300 tabular-nums mt-0.5">
              {accuracy}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-pink-300/80 uppercase tracking-wider">Câu Đã Trả Lời</div>
            <div className="font-arcade text-base sm:text-lg text-pink-300 tabular-nums mt-0.5">
              {correctCount}/{answers.length}
            </div>
          </div>
        </div>

        {/* Rank Badge */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-arcade text-xs text-pink-200 bg-gradient-to-r from-pink-900 to-purple-900 px-2.5 py-1 rounded-md border border-pink-500/40">
              {rank.title}
            </span>
            <span className="text-xs text-pink-300/80 hidden sm:inline">{rank.desc}</span>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-pink-300 hover:text-white flex items-center gap-1 font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-pink-400" />
            <span>{showDetails ? 'Thu Gọn Sổ Tay' : 'Mở Sổ Tay Ghi Nhớ'}</span>
          </button>
        </div>

        {/* Answer Review Section (Sổ Tay Ghi Nhớ Tri Thức) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="text-xs font-bold text-pink-200 font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>SỔ TAY GHI NHỚ TRI THỨC PHÉP THUẬT</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (Xem kỹ đáp án và gợi ý để nắm vững kiến thức)
            </span>
          </div>

          {answers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
              Chưa trả lời câu hỏi nào trong lượt này. Hãy nhảy đập vào các khối Ngôi Sao [★] nhé!
            </div>
          ) : (
            answers.map((record, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs transition-colors ${
                  record.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-700/50 text-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {record.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-100 text-xs sm:text-sm">
                      {idx + 1}. {record.question.question}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-pink-300 shrink-0">
                    {record.timeTakenSec}s
                  </span>
                </div>

                <div className="pl-6 space-y-1 text-[11px]">
                  <div>
                    <span className="text-slate-400">Đáp án chuẩn: </span>
                    <span className="font-bold text-emerald-300">
                      {record.question.options[record.question.correctIndex]}
                    </span>
                  </div>

                  {!record.isCorrect && record.selectedAnswer >= 0 && (
                    <div>
                      <span className="text-slate-400">Bạn đã chọn: </span>
                      <span className="text-rose-400 line-through">
                        {record.question.options[record.selectedAnswer]}
                      </span>
                    </div>
                  )}

                  <div className="text-slate-300 font-sans mt-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-semibold text-pink-300">Gợi ý & Ghi nhớ: </span>
                    {record.question.explanation}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-950 px-4 sm:px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {onExitToTitle && (
              <button
                onClick={onExitToTitle}
                className="px-3.5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 hover:text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Thoát trở về giao diện chính"
              >
                <Home className="w-4 h-4 text-rose-400" />
                <span>Thoát Về Menu</span>
              </button>
            )}

            <button
              onClick={onRestart}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isStageClear && onNextStage && (
              <button
                onClick={onNextStage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-pink-950 cursor-pointer"
              >
                <span>Vào Màn Kế Tiếp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {isVictory && (
              <button
                onClick={onRestart}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-950 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Chinh Phục Lần Nữa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
