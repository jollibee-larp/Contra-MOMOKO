import React, { useState } from 'react';
import { Question, QuestionCategory } from '../types/game';
import { CATEGORY_LABELS } from '../data/defaultQuestions';
import { BookOpen, Plus, Trash2, Edit3, Download, Upload, RotateCcw, X, Check, Search, Sparkles, HelpCircle } from 'lucide-react';

interface QuizManagerModalProps {
  questions: Question[];
  onSaveQuestions: (updated: Question[]) => void;
  onResetDefault: () => void;
  onClose: () => void;
}

export const QuizManagerModal: React.FC<QuizManagerModalProps> = ({
  questions,
  onSaveQuestions,
  onResetDefault,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State (used for both Add and Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState<QuestionCategory>('informatics');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOpt0, setFormOpt0] = useState('');
  const [formOpt1, setFormOpt1] = useState('');
  const [formOpt2, setFormOpt2] = useState('');
  const [formOpt3, setFormOpt3] = useState('');
  const [formCorrectIdx, setFormCorrectIdx] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formError, setFormError] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchCat = filterCat === 'all' || q.category === filterCat;
    const matchSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const resetForm = () => {
    setEditingId(null);
    setFormCategory('informatics');
    setFormQuestion('');
    setFormOpt0('');
    setFormOpt1('');
    setFormOpt2('');
    setFormOpt3('');
    setFormCorrectIdx(0);
    setFormExplanation('');
    setFormError('');
  };

  const handleStartAdd = () => {
    resetForm();
    setActiveTab('add');
  };

  const handleStartEdit = (q: Question) => {
    setEditingId(q.id);
    setFormCategory(q.category);
    setFormQuestion(q.question);
    setFormOpt0(q.options[0] || '');
    setFormOpt1(q.options[1] || '');
    setFormOpt2(q.options[2] || '');
    setFormOpt3(q.options[3] || '');
    setFormCorrectIdx(q.correctIndex || 0);
    setFormExplanation(q.explanation || '');
    setFormError('');
    setActiveTab('edit');
  };

  const handleDelete = (id: string, questionText: string) => {
    if (questions.length <= 2) {
      alert('Cần giữ lại ít nhất 2 câu hỏi để ngân hàng đề thi có thể vận hành!');
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa câu hỏi này khỏi đề thi không?\n\n"${questionText.slice(0, 70)}..."`
    );

    if (confirmed) {
      const next = questions.filter(q => q.id !== id);
      onSaveQuestions(next);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formOpt0.trim() || !formOpt1.trim() || !formOpt2.trim() || !formOpt3.trim()) {
      setFormError('Vui lòng nhập đầy đủ nội dung câu hỏi và cả 4 phương án A, B, C, D!');
      return;
    }

    if (activeTab === 'edit' && editingId) {
      // UPDATE (Sửa)
      const updatedList = questions.map(q => {
        if (q.id === editingId) {
          return {
            ...q,
            category: formCategory,
            question: formQuestion.trim(),
            options: [formOpt0.trim(), formOpt1.trim(), formOpt2.trim(), formOpt3.trim()],
            correctIndex: formCorrectIdx,
            explanation: formExplanation.trim() || 'Gợi ý: Hãy ghi nhớ kỹ kiến thức trọng tâm này.'
          };
        }
        return q;
      });

      onSaveQuestions(updatedList);
      resetForm();
      setActiveTab('list');
    } else {
      // CREATE (Thêm mới)
      const created: Question = {
        id: `custom-${Date.now()}`,
        category: formCategory,
        question: formQuestion.trim(),
        options: [formOpt0.trim(), formOpt1.trim(), formOpt2.trim(), formOpt3.trim()],
        correctIndex: formCorrectIdx,
        explanation: formExplanation.trim() || 'Gợi ý: Hãy ghi nhớ kỹ kiến thức trọng tâm này.',
        difficulty: 'medium'
      };

      onSaveQuestions([created, ...questions]);
      resetForm();
      setActiveTab('list');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `momoko-adventure-quiz-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question && parsed[0].options) {
            onSaveQuestions(parsed);
            alert(`Nhập thành công ${parsed.length} câu hỏi mới vào ngân hàng đề thi!`);
          } else {
            alert('File JSON không đúng định dạng danh sách câu hỏi!');
          }
        } catch {
          alert('Không thể đọc file JSON này, vui lòng kiểm tra lại!');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-pink-500/70 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-950 via-slate-950 to-purple-950 px-4 sm:px-6 py-3 border-b border-pink-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/40">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-pink-100 font-display text-base sm:text-lg flex items-center gap-2">
                <span>Quản Lý Câu Hỏi & Cài Đặt Đề Thi</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-[11px] text-pink-300/70">
                Thêm, Sửa, Xóa và Lọc câu hỏi theo từng môn học. Tự động lưu trữ trên trình duyệt!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-pink-300 hover:text-white hover:bg-pink-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar & Sub-nav */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 font-medium rounded-md transition-all ${
                activeTab === 'list'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-pink-200'
              }`}
            >
              Danh Sách Câu Hỏi ({questions.length})
            </button>
            <button
              onClick={handleStartAdd}
              className={`px-3 py-1.5 font-medium rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-pink-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-pink-300" />
              <span>Thêm Câu Mới</span>
            </button>
            {activeTab === 'edit' && (
              <span className="px-3 py-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Đang Sửa</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
              title="Xuất file JSON sao lưu hoặc chia sẻ cho học sinh"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Xuất JSON</span>
            </button>

            <label className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nhập JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (window.confirm('Khôi phục lại danh sách câu hỏi mặc định ban đầu? (Dữ liệu tùy chỉnh của bạn sẽ được thay thế)')) {
                  onResetDefault();
                  resetForm();
                  setActiveTab('list');
                }
              }}
              className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 flex items-center gap-1 transition-colors"
              title="Khôi phục câu hỏi ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc Định</span>
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo nội dung câu hỏi, gợi ý, hoặc đáp án..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-400"
                  />
                </div>

                {/* Category filter pills */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
                  <button
                    onClick={() => setFilterCat('all')}
                    className={`px-3 py-1 rounded-full transition-all whitespace-nowrap font-medium ${
                      filterCat === 'all'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Tất Cả ({questions.length})
                  </button>
                  {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => {
                    const count = questions.filter(q => q.category === catKey).length;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setFilterCat(catKey)}
                        className={`px-3 py-1 rounded-full transition-all whitespace-nowrap font-medium flex items-center gap-1 ${
                          filterCat === catKey
                            ? 'bg-pink-500 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{info.icon}</span>
                        <span>{info.label} ({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Questions Cards */}
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs bg-slate-950/50 rounded-xl border border-slate-800">
                    Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại. Hãy bấm <strong className="text-pink-300 cursor-pointer" onClick={handleStartAdd}>"Thêm Câu Mới"</strong>!
                  </div>
                ) : (
                  filteredQuestions.map((q, index) => {
                    const catInfo = CATEGORY_LABELS[q.category] || CATEGORY_LABELS.general;
                    return (
                      <div
                        key={q.id}
                        className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col gap-3 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-[11px] mb-1">
                              <span className="font-mono text-amber-300 font-bold">#{index + 1}</span>
                              <span>·</span>
                              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold flex items-center gap-1 ${catInfo.badge}`}>
                                <span>{catInfo.icon}</span>
                                <span>{catInfo.label}</span>
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                              {q.question}
                            </h4>
                          </div>

                          {/* Action Buttons: SỬA & XÓA */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleStartEdit(q)}
                              className="px-2.5 py-1 text-xs rounded-md bg-pink-950/70 border border-pink-700/60 text-pink-300 hover:bg-pink-900 hover:text-white transition-colors flex items-center gap-1"
                              title="Sửa nội dung câu hỏi này"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>

                            <button
                              onClick={() => handleDelete(q.id, q.question)}
                              className="px-2.5 py-1 text-xs rounded-md bg-rose-950/70 border border-rose-800/60 text-rose-300 hover:bg-rose-900 hover:text-white transition-colors flex items-center gap-1"
                              title="Xóa câu hỏi này khỏi đề thi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>

                        {/* Options preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctIndex;
                            return (
                              <div
                                key={oIdx}
                                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 font-semibold'
                                    : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                                }`}
                              >
                                <span className="font-mono text-xs text-amber-300 font-bold shrink-0">
                                  [{String.fromCharCode(65 + oIdx)}]
                                </span>
                                <span className="flex-1 truncate">{opt}</span>
                                {isCorrect && (
                                  <span className="text-[10px] text-emerald-400 bg-emerald-900/50 px-1.5 py-0.5 rounded font-mono shrink-0">
                                    Đúng
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation / Hint */}
                        {q.explanation && (
                          <div className="text-[11px] text-slate-300 bg-purple-950/30 border border-purple-800/40 p-2.5 rounded-lg flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                              <span className="font-semibold text-purple-300">Gợi ý & Giải thích: </span>
                              {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            // Add or Edit Question Form
            <form onSubmit={handleSubmitForm} className="space-y-4 max-w-2xl mx-auto bg-slate-950/80 p-5 sm:p-6 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="text-sm sm:text-base font-bold text-pink-300 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {activeTab === 'edit' ? 'Cập Nhật & Sửa Câu Hỏi' : 'Thêm Mới Câu Hỏi Vào Đề Thi'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { resetForm(); setActiveTab('list'); }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Quay lại danh sách
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-lg text-rose-200 text-xs">
                  {formError}
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1.5">
                  Chủ Đề / Môn Học:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(CATEGORY_LABELS).map(([k, info]) => {
                    const isSelected = formCategory === k;
                    return (
                      <button
                        type="button"
                        key={k}
                        onClick={() => setFormCategory(k as QuestionCategory)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-600/80 to-purple-600/80 border-pink-400 text-white font-bold shadow-xs'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-base">{info.icon}</span>
                        <span>{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">
                  Nội Dung Câu Hỏi Thử Thách:
                </label>
                <textarea
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Ví dụ: Phím tắt nào dùng để sao chép (Copy) văn bản trong hệ điều hành Windows?"
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400 leading-relaxed"
                />
              </div>

              {/* 4 Options with Radio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-pink-200">
                    4 Phương Án Trả Lời (Chọn nút tròn đáp án đúng):
                  </label>
                  <span className="text-[11px] text-amber-300">
                    * Đáp án đúng hiện tại: [ {String.fromCharCode(65 + formCorrectIdx)} ]
                  </span>
                </div>

                {[
                  { val: formOpt0, set: setFormOpt0, idx: 0, label: 'Phương án A' },
                  { val: formOpt1, set: setFormOpt1, idx: 1, label: 'Phương án B' },
                  { val: formOpt2, set: setFormOpt2, idx: 2, label: 'Phương án C' },
                  { val: formOpt3, set: setFormOpt3, idx: 3, label: 'Phương án D' },
                ].map((item) => (
                  <div
                    key={item.idx}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                      formCorrectIdx === item.idx
                        ? 'bg-emerald-950/40 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="correctChoiceForm"
                      checked={formCorrectIdx === item.idx}
                      onChange={() => setFormCorrectIdx(item.idx)}
                      className="w-4 h-4 text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500 cursor-pointer"
                      title="Chọn đây là đáp án đúng"
                    />
                    <span className="font-mono text-xs text-amber-300 font-bold shrink-0">
                      [{String.fromCharCode(65 + item.idx)}]
                    </span>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      placeholder={item.label}
                      className="flex-1 bg-transparent border-0 px-2 py-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Explanation & Hint */}
              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">
                  Gợi Ý & Giải Thích Chi Tiết (Hiển thị cho học sinh ôn tập):
                </label>
                <textarea
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Gợi ý phương pháp tính toán hoặc lý do tại sao đáp án này là chính xác..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { resetForm(); setActiveTab('list'); }}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-pink-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{activeTab === 'edit' ? 'Lưu Cập Nhật' : 'Lưu Câu Hỏi Mới'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-pink-300/70 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mọi thay đổi Thêm/Sửa/Xóa đều được tự động lưu vào LocalStorage trình duyệt.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
