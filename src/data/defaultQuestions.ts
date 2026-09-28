import { Question } from '../types/game';

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string; badge: string }> = {
  informatics: { label: 'Tin Học', icon: '💻', color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-900/60 text-cyan-300 border-cyan-500/40' },
  math: { label: 'Toán Học', icon: '📐', color: 'from-amber-500 to-orange-600', badge: 'bg-amber-900/60 text-amber-300 border-amber-500/40' },
  english: { label: 'Tiếng Anh', icon: '🇬🇧', color: 'from-pink-500 to-rose-600', badge: 'bg-pink-900/60 text-pink-300 border-pink-500/40' },
  history: { label: 'Lịch Sử', icon: '📜', color: 'from-yellow-500 to-amber-700', badge: 'bg-yellow-900/60 text-yellow-300 border-yellow-500/40' },
  science: { label: 'Khoa Học', icon: '🔬', color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40' },
  general: { label: 'Tổng Hợp', icon: '✨', color: 'from-purple-500 to-indigo-600', badge: 'bg-purple-900/60 text-purple-300 border-purple-500/40' },
};

export const DEFAULT_QUESTIONS: Question[] = [
  // --- TIN HỌC (INFORMATICS) ---
  {
    id: 'it-01',
    category: 'informatics',
    question: 'Phím tắt nào được dùng phổ biến để lưu tài liệu (Save) trong hầu hết các phần mềm máy tính?',
    options: ['Ctrl + P', 'Ctrl + S', 'Ctrl + Z', 'Ctrl + O'],
    correctIndex: 1,
    explanation: 'Gợi ý: Phím tắt Ctrl + S (Save) dùng để lưu dữ liệu tức thì. Ctrl + P là in ấn, Ctrl + Z là hoàn tác.',
    difficulty: 'easy'
  },
  {
    id: 'it-02',
    category: 'informatics',
    question: 'Thiết bị nào sau đây được coi là "bộ não" xử lý mọi mệnh lệnh của máy tính?',
    options: ['RAM (Bộ nhớ trong)', 'CPU (Bộ vi xử lý trung tâm)', 'Ổ cứng SSD', 'Bộ nguồn PSU'],
    correctIndex: 1,
    explanation: 'Gợi ý: CPU (Central Processing Unit) nhận lệnh, giải mã và thực thi các phép tính toán của máy tính.',
    difficulty: 'easy'
  },
  {
    id: 'it-03',
    category: 'informatics',
    question: 'Trong mạng máy tính, giao thức HTTPS khác HTTP ở điểm cơ bản nào?',
    options: [
      'HTTPS có thêm lớp bảo mật mã hóa SSL/TLS an toàn',
      'HTTPS tải trang chậm hơn 100 lần',
      'HTTPS chỉ dùng cho hình ảnh video',
      'HTTPS không cần kết nối mạng Internet'
    ],
    correctIndex: 0,
    explanation: 'Gợi ý: Chữ "S" trong HTTPS là Secure, dữ liệu truyền đi được mã hóa tránh bị nghe lén và đánh cắp thông tin.',
    difficulty: 'medium'
  },
  {
    id: 'it-04',
    category: 'informatics',
    question: '1 Gigabyte (GB) tương đương với bao nhiêu Megabyte (MB) theo hệ thống nhị phân tiêu chuẩn?',
    options: ['100 MB', '512 MB', '1000 MB', '1024 MB'],
    correctIndex: 3,
    explanation: 'Gợi ý: Trong hệ số nhị phân máy tính (2^10), 1 GB = 1024 MB, 1 MB = 1024 KB.',
    difficulty: 'easy'
  },
  {
    id: 'it-05',
    category: 'informatics',
    question: 'Ngôn ngữ lập trình nào thường được sử dụng phổ biến nhất để tạo trang web tương tác phía máy khách (Client)?',
    options: ['JavaScript', 'C++', 'Assembly', 'Pascal'],
    correctIndex: 0,
    explanation: 'Gợi ý: JavaScript là ngôn ngữ tiêu chuẩn của web browser, mang lại các tính năng động và giao diện tương tác.',
    difficulty: 'medium'
  },

  // --- TOÁN HỌC (MATH) ---
  {
    id: 'math-01',
    category: 'math',
    question: 'Số nguyên tố chẵn duy nhất trong tập hợp các số tự nhiên là số nào?',
    options: ['Số 0', 'Số 2', 'Số 4', 'Số 6'],
    correctIndex: 1,
    explanation: 'Gợi ý: Số 2 chỉ có đúng 2 ước số là 1 và 2. Tất cả số chẵn lớn hơn 2 đều chia hết cho 2 nên không phải số nguyên tố.',
    difficulty: 'easy'
  },
  {
    id: 'math-02',
    category: 'math',
    question: 'Tổng ba góc trong của một hình tam giác phẳng luôn luôn bằng bao nhiêu độ?',
    options: ['90°', '180°', '270°', '360°'],
    correctIndex: 1,
    explanation: 'Gợi ý: Trong hình học Euclid phẳng, định lý cơ bản khẳng định tổng 3 góc tam giác luôn là 180° (bằng 2 góc vuông).',
    difficulty: 'easy'
  },
  {
    id: 'math-03',
    category: 'math',
    question: 'Giá trị của biểu thức 12 + 8 ÷ 2 × 3 bằng bao nhiêu?',
    options: ['30', '24', '15', '42'],
    correctIndex: 1,
    explanation: 'Gợi ý: Thực hiện phép chia và nhân trước từ trái sang phải: 8 ÷ 2 = 4, 4 × 3 = 12, sau đó cộng 12 + 12 = 24.',
    difficulty: 'medium'
  },
  {
    id: 'math-04',
    category: 'math',
    question: 'Một hình vuông có diện tích là 81 cm². Chu vi của hình vuông đó là bao nhiêu cm?',
    options: ['18 cm', '27 cm', '36 cm', '72 cm'],
    correctIndex: 2,
    explanation: 'Gợi ý: Cạnh của hình vuông là căn bậc hai của 81 = 9 cm. Chu vi = 9 × 4 = 36 cm.',
    difficulty: 'medium'
  },
  {
    id: 'math-05',
    category: 'math',
    question: 'Phân số 3/4 được biểu diễn dưới dạng số thập phân bằng bao nhiêu?',
    options: ['0.34', '0.75', '0.43', '0.25'],
    correctIndex: 1,
    explanation: 'Gợi ý: Lấy 3 chia cho 4 ta được kết quả chính xác là 0.75 (hay 75%).',
    difficulty: 'easy'
  },

  // --- TIẾNG ANH (ENGLISH) ---
  {
    id: 'eng-01',
    category: 'english',
    question: 'Từ nào sau đây là từ đồng nghĩa (synonym) gần nhất với từ "HAPPY"?',
    options: ['Sad', 'Angry', 'Joyful', 'Tired'],
    correctIndex: 2,
    explanation: 'Gợi ý: "Joyful" mang nghĩa vui tươi, hạnh phúc, hân hoan, đồng nghĩa với "Happy".',
    difficulty: 'easy'
  },
  {
    id: 'eng-02',
    category: 'english',
    question: 'Điền vào chỗ trống: "She _______ to school every day by bicycle."',
    options: ['go', 'goes', 'went', 'going'],
    correctIndex: 1,
    explanation: 'Gợi ý: Chủ ngữ ngôi thứ 3 số ít "She" ở thì hiện tại đơn (every day) thì động từ thêm "es" -> "goes".',
    difficulty: 'easy'
  },
  {
    id: 'eng-03',
    category: 'english',
    question: 'Dạng quá khứ phân từ (Past Participle - V3) của động từ "WRITE" là gì?',
    options: ['Wrote', 'Written', 'Writing', 'Writes'],
    correctIndex: 1,
    explanation: 'Gợi ý: Động từ bất quy tắc: Write (V1) - Wrote (V2) - Written (V3).',
    difficulty: 'medium'
  },
  {
    id: 'eng-04',
    category: 'english',
    question: 'Thành ngữ "Piece of cake" trong tiếng Anh có ý nghĩa tương đương là gì?',
    options: ['Một miếng bánh ngọt ngon', 'Một việc rất dễ dàng', 'Một thử thách nguy hiểm', 'Một món quà bất ngờ'],
    correctIndex: 1,
    explanation: 'Gợi ý: Idiom "a piece of cake" nghĩa là việc gì đó cực kỳ đơn giản, dễ như ăn kẹo.',
    difficulty: 'easy'
  },
  {
    id: 'eng-05',
    category: 'english',
    question: 'Tìm từ trái nghĩa (Antonym) với từ "ANCIENT" (Cổ xưa):',
    options: ['Old', 'Historic', 'Modern', 'Antique'],
    correctIndex: 2,
    explanation: 'Gợi ý: "Ancient" nghĩa là cổ đại, lâu đời; từ trái nghĩa là "Modern" (hiện đại, tối tân).',
    difficulty: 'medium'
  },

  // --- LỊCH SỬ (HISTORY) ---
  {
    id: 'his-01',
    category: 'history',
    question: 'Chiến thắng Bạch Đằng năm 938 do vị anh hùng nào lãnh đạo chấm dứt hơn 1000 năm Bắc thuộc?',
    options: ['Đinh Bộ Lĩnh', 'Ngô Quyền', 'Lê Hoàn', 'Trần Hưng Đạo'],
    correctIndex: 1,
    explanation: 'Gợi ý: Ngô Quyền chỉ huy trận địa cọc ngầm trên sông Bạch Đằng năm 938 đánh tan quân Nam Hán.',
    difficulty: 'easy'
  },
  {
    id: 'his-02',
    category: 'history',
    question: 'Vua Lý Thái Tổ ban Chiếu dời đô từ Hoa Lư về Đại La (Thăng Long) vào năm nào?',
    options: ['Năm 938', 'Năm 1009', 'Năm 1010', 'Năm 1075'],
    correctIndex: 2,
    explanation: 'Gợi ý: Mùa thu năm Canh Tuất 1010, vua Lý Thái Tổ dời đô về thành Thăng Long (Hà Nội ngày nay).',
    difficulty: 'easy'
  },
  {
    id: 'his-03',
    category: 'history',
    question: 'Chiến dịch Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" giành thắng lợi hoàn toàn vào ngày nào?',
    options: ['30/04/1975', '07/05/1954', '02/09/1945', '19/08/1945'],
    correctIndex: 1,
    explanation: 'Gợi ý: Chiều ngày 07/05/1954, lá cờ quyết chiến quyết thắng tung bay trên nóc hầm tướng De Castries.',
    difficulty: 'easy'
  },
  {
    id: 'his-04',
    category: 'history',
    question: 'Hội nghị Diên Hồng nổi tiếng trong cuộc kháng chiến chống quân Nguyên Mông lần thứ hai do ai triệu tập?',
    options: ['Vua Trần Nhân Tông và Thượng hoàng Trần Thánh Tông', 'Vua Lê Lợi', 'Nguyễn Trãi', 'Quang Trung'],
    correctIndex: 0,
    explanation: 'Gợi ý: Hội nghị Diên Hồng năm 1284 quy tụ các bô lão trong cả nước với lời đồng thanh vang dội: "ĐÁNH!".',
    difficulty: 'medium'
  },
  {
    id: 'his-05',
    category: 'history',
    question: 'Vị vua nào của phong trào Tây Sơn đã chỉ huy trận Ngọc Hồi - Đống Đa đại phá 29 vạn quân Thanh?',
    options: ['Nguyễn Nhạc', 'Nguyễn Huệ (Vua Quang Trung)', 'Nguyễn Lữ', 'Lê Chiêu Thống'],
    correctIndex: 1,
    explanation: 'Gợi ý: Hoàng đế Quang Trung (Nguyễn Huệ) thần tốc hành quân ra Bắc, quét sạch quân Thanh mùa xuân Kỷ Dậu 1789.',
    difficulty: 'easy'
  },

  // --- KHOA HỌC (SCIENCE) ---
  {
    id: 'sci-01',
    category: 'science',
    question: 'Khí nào chiếm tỷ lệ thể tích lớn nhất trong bầu khí quyển của Trái Đất?',
    options: ['Khí Oxy (O2)', 'Khí Nitơ (N2)', 'Khí Carbonic (CO2)', 'Khí Argon'],
    correctIndex: 1,
    explanation: 'Gợi ý: Khí Nitơ chiếm xấp xỉ 78% thể tích không khí Trái Đất, trong khi Oxy chiếm khoảng 21%.',
    difficulty: 'easy'
  },
  {
    id: 'sci-02',
    category: 'science',
    question: 'Hành tinh nào gần Mặt Trời nhất trong Hệ Mặt Trời?',
    options: ['Sao Kim (Venus)', 'Sao Thủy (Mercury)', 'Sao Hỏa (Mars)', 'Trái Đất'],
    correctIndex: 1,
    explanation: 'Gợi ý: Sao Thủy (Mercury) là hành tinh nằm gần Mặt Trời nhất với chu kỳ quay quanh Mặt Trời khoảng 88 ngày.',
    difficulty: 'easy'
  },
  {
    id: 'sci-03',
    category: 'science',
    question: 'Quá trình nào giúp thực vật xanh hấp thụ ánh sáng mặt trời để tổng hợp chất hữu cơ và nhả khí oxy?',
    options: ['Hô hấp tế bào', 'Quang hợp', 'Thoát hơi nước', 'Lên men'],
    correctIndex: 1,
    explanation: 'Gợi ý: Nhờ có diệp lục trong lục lạp, cây xanh thực hiện quang hợp: CO2 + H2O + Ánh sáng -> Glucose + O2.',
    difficulty: 'easy'
  },
  {
    id: 'sci-04',
    category: 'science',
    question: 'Vận tốc ánh sáng trong chân không có giá trị xấp xỉ khoảng bao nhiêu?',
    options: ['340 m/s', '30.000 km/s', '300.000 km/s', '3.000.000 km/s'],
    correctIndex: 2,
    explanation: 'Gợi ý: Vận tốc ánh sáng là giới hạn tốc độ vũ trụ c ≈ 299.792 km/s, xấp xỉ 300.000 km/giây.',
    difficulty: 'medium'
  }
];
