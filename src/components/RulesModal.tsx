import React from 'react';
import { X, Wand2, Sparkles, Star, ChevronUp, Crosshair } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-pink-500/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-pink-950 px-4 sm:px-6 py-3 border-b border-pink-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-pink-400" />
            <span className="font-bold text-pink-100 font-display text-base">
              Hướng Dẫn Thao Tác & Phép Thuật
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-pink-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Controls table */}
          <div>
            <h4 className="font-bold text-pink-300 text-xs uppercase tracking-wider mb-2 font-display flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Bàn Phím & Nút Điều Khiển Màn Hình</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Nút NHẢY (Mario Jump):</span>
                <span className="font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                  Space hoặc W / ↑
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Nút TẤN CÔNG (Bắn Thẳng / Chéo):</span>
                <span className="font-mono bg-pink-950 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded font-bold">
                  J hoặc Click Chuột
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Di chuyển Trái / Phải:</span>
                <span className="font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                  A / D hoặc ← / →
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Cúi người né đường đạn:</span>
                <span className="font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-bold">
                  S hoặc Phím ↓
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-cyan-800/60 flex items-center justify-between col-span-1 sm:col-span-2">
                <span className="text-cyan-200">Kỹ Năng Mana (Khiên & Đạn nổ lớn):</span>
                <span className="font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-bold">
                  Phím K hoặc Nút [SKILL]
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between col-span-1 sm:col-span-2">
                <span className="text-slate-300">Nút Cảm Ứng Màn Hình:</span>
                <span className="text-pink-300 font-semibold">
                  Đầy đủ cụm D-Pad, NÚT NHẢY, TẤN CÔNG và KỸ NĂNG MANA ngay bên dưới màn hình!
                </span>
              </div>
            </div>
          </div>

          {/* Gameplay mechanics */}
          <div className="space-y-2">
            <h4 className="font-bold text-pink-300 text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Quy Tắc Vượt Ải & Các Tính Năng Đặc Biệt</span>
            </h4>
            <ul className="space-y-2 list-disc pl-4 text-slate-300">
              <li>
                <strong className="text-pink-300">Nhân Vật Momoko Cầu Vồng 🌈 & Pet Cá Sấu Wani 🐊:</strong> Momoko mang trang phục cầu vồng phép thuật rạng rỡ, đồng hành cùng bạn nhỏ là chú Cá Sấu Wani tinh nghịch lon ton chạy theo hỗ trợ và cổ vũ tinh thần suốt chặng đường!
              </li>
              <li>
                <strong className="text-amber-300">Rào Chắn / Cổng Phong Ấn:</strong> Khi chạm cổng, game lập tức tạm dừng (quái vật và đạn đóng băng hoàn toàn). Bạn cần trả lời đúng câu hỏi thử thách. Trả lời sai sẽ nhận gợi ý và yêu cầu chọn lại cho đến khi nào đúng thì cổng nổ tung và game tiếp tục!
              </li>
              <li>
                <strong className="text-cyan-300">Hộp Tiếp Tế Bay Trên Trời:</strong> Bắn vỡ hộp tiếp tế lượn trên không để rơi vật phẩm:
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mt-1 font-mono text-[11px]">
                  <span className="text-emerald-300">🍄 Nấm Thần Kỳ: Hồi 100% HP & Mana</span>
                  <span className="text-rose-300">⚡ Súng S: Bắn chùm tỏa 3-5 tia</span>
                  <span className="text-cyan-300">🌌 Súng L: Tia laser dài xuyên thấu</span>
                </div>
              </li>
              <li>
                <strong className="text-indigo-300">Chu Kỳ Ngày & Đêm:</strong> Nền trời tự đổi màu mượt mà mỗi 30-45 giây (Sáng xanh → Hoàng hôn đỏ cam → Đêm tối tĩnh mịch). Vào ban đêm quanh nhân vật sẽ xuất hiện quầng sáng ấm áp bảo vệ bạn!
              </li>
              <li>
                <strong className="text-emerald-300">Dẫm Đạp Mario:</strong> Nhảy dẫm lên đầu lính bóng đêm để tiêu diệt theo phong cách Mario cổ điển!
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            Đã Hiểu, Chiến Nào!
          </button>
        </div>
      </div>
    </div>
  );
};
