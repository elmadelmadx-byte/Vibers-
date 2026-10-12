import React, { useState } from 'react';
import {
  Star,
  Send,
  MessageSquareQuote,
  CheckCircle2,
  AlertCircle,
  Lock,
  ShieldCheck,
  Users,
  BarChart2,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Search,
  ThumbsUp,
  Check,
  Maximize2
} from 'lucide-react';
import { UserRatingComment } from '../types';
import { processImageFile } from '../utils/imageUtils';

interface RatingsAndCommentsProps {
  comments: UserRatingComment[];
  bannedHandles: string[];
  isRatingsLocked?: boolean;
  onAddComment: (entry: {
    authorName: string;
    authorHandle: string;
    stars: number;
    comment: string;
    activityType: string;
    imageUrl?: string;
  }) => void;
}

// User-specified grand scale metrics:
// السبع نجوم: مليون شخص (1,000,000) و 100 ألف شخص قام بعمل كومنت (100,000)
// الست نجوم: 100,000 شخص
// الخمس نجوم: 50,000 شخص
// الأربع نجوم: 25,000 شخص
// الثلاث نجوم: 1,000 شخص
// النجمتان: 500 شخص
// النجمة: 100 شخص
const STAR_SCALE_DATA: Record<
  number,
  {
    peopleCount: number;
    displayCount: string;
    commentCount: string;
    percentage: number;
    titleAr: string;
  }
> = {
  7: {
    peopleCount: 1000000,
    displayCount: '1,000,000',
    commentCount: '100,000+',
    percentage: 97,
    titleAr: 'مليون شخص (1,000,000) في السبع نجوم'
  },
  6: {
    peopleCount: 100000,
    displayCount: '100,000',
    commentCount: '18,500+',
    percentage: 80,
    titleAr: '100 ألف شخص'
  },
  5: {
    peopleCount: 50000,
    displayCount: '50,000',
    commentCount: '8,400+',
    percentage: 75,
    titleAr: '50 ألف شخص'
  },
  4: {
    peopleCount: 25000,
    displayCount: '25,000',
    commentCount: '3,200+',
    percentage: 42,
    titleAr: '25 ألف شخص'
  },
  3: {
    peopleCount: 1000,
    displayCount: '1,000',
    commentCount: '450+',
    percentage: 16,
    titleAr: '1,000 شخص'
  },
  2: {
    peopleCount: 500,
    displayCount: '500',
    commentCount: '180+',
    percentage: 11,
    titleAr: '500 شخص'
  },
  1: {
    peopleCount: 100,
    displayCount: '100',
    commentCount: '45+',
    percentage: 2,
    titleAr: '100 شخص'
  }
};

const GRAND_TOTAL_RATINGS = '1,176,600+';
const GRAND_TOTAL_REVIEWERS = '1,000,000+';
const GRAND_TOTAL_COMMENTS = '100,000+';

export const RatingsAndComments: React.FC<RatingsAndCommentsProps> = ({
  comments,
  bannedHandles,
  isRatingsLocked = false,
  onAddComment
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [activityType, setActivityType] = useState('وكيل شحن معتمد');
  const [selectedStars, setSelectedStars] = useState<number>(7);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentImageUrl, setCommentImageUrl] = useState<string>('');
  const [imageUploadStatus, setImageUploadStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Record<string, number>>({});

  const visibleComments = comments.filter(
    (c) => !c.isBannedUser && !bannedHandles.includes(c.authorHandle.toLowerCase())
  );

  const starCounts = [7, 6, 5, 4, 3, 2, 1].map((s) => {
    const scale = STAR_SCALE_DATA[s] || {
      peopleCount: 1000,
      displayCount: '1,000',
      commentCount: '100+',
      percentage: 50,
      titleAr: ''
    };
    const sampleCount = visibleComments.filter((c) => c.stars === s).length;
    return {
      stars: s,
      displayCount: scale.displayCount,
      commentCount: scale.commentCount,
      percentage: scale.percentage,
      titleAr: scale.titleAr,
      sampleCount
    };
  });

  const averageRating = '6.9';

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageUploadStatus('جاري معالجة الصورة للعرض المباشر...');
      const dataUrl = await processImageFile(file);
      setCommentImageUrl(dataUrl);
      setImageUploadStatus('تم تجهيز الصورة بنجاح! تظهر الآن مباشرة في المعاينة أدناه.');
      setTimeout(() => setImageUploadStatus(null), 3500);
    } catch (err: any) {
      setImageUploadStatus(err.message || 'فشل تحميل ملف الصورة');
    }
  };

  const handleLike = (commentId: string) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!authorName.trim() || authorName.trim().length < 2) {
      setErrorMsg('يرجى إدخال اسمك أو لقبك لعرضه مع التقييم.');
      return;
    }

    const formattedHandle = authorHandle.trim()
      ? authorHandle.trim().startsWith('@')
        ? authorHandle.trim()
        : `@${authorHandle.trim()}`
      : `@${authorName.trim().replace(/\s+/g, '_').toLowerCase()}`;

    if (bannedHandles.includes(formattedHandle.toLowerCase())) {
      setErrorMsg('عذراً، هذا الحساب محظور من إضافة التعليقات بقرار من الإدارة.');
      return;
    }

    if (!commentText.trim() || commentText.trim().length < 5) {
      setErrorMsg('يرجى كتابة نص التقييم بشكل واضح (5 أحرف على الأقل).');
      return;
    }

    onAddComment({
      authorName: authorName.trim(),
      authorHandle: formattedHandle,
      stars: selectedStars,
      comment: commentText.trim(),
      activityType,
      imageUrl: commentImageUrl.trim() || undefined
    });

    setAuthorName('');
    setAuthorHandle('');
    setCommentText('');
    setCommentImageUrl('');
    setSelectedStars(7);
    setImageUploadStatus(null);
    setSuccessMsg('شكراً لك! تم نشر تقييمك وصورتك بنجاح وتظهر الآن مباشرة في الموقع.');
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const activeStarDisplay = hoveredStars !== null ? hoveredStars : selectedStars;

  // Filtered comments for display
  const filteredComments = visibleComments.filter((item) => {
    const matchesStars = selectedStarFilter === null || item.stars === selectedStarFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.activityType && item.activityType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStars && matchesSearch;
  });

  return (
    <section
      id="reviews"
      aria-label="تقييمات وتعليقات العملاء والوكلاء (نظام الـ 7 نجوم الملكي)"
      className="py-16 lg:py-24 border-t border-slate-800/80 bg-[#070913]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        {/* Header & Grand Scale 7-Star Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono-num flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>نظام الـ 7 نجوم الملكي المعتمد (+1.17M تقييم)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono-num">
                مليون مقيم في السبع نجوم (1,000,000★)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono-num">
                100,000+ شخص كتبوا كومنتات
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              سجل التقييمات وآراء المستخدمين والوكلاء
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              شارك تجربتك الحقيقية مع منظومة Vibers V العالمية لتنمية التطبيقات ودعم تطبيقات الدردشة الصوتية بقيادة المدير العام عيون Prince. أكثر من مليون شخص يضعون ثقتهم في المنظومة.
            </p>
          </div>

          {/* Grand Stats Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1424] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0 shadow-2xl">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="text-3xl sm:text-4xl font-bold font-mono-num text-amber-400">
                  {averageRating} <span className="text-base text-slate-400">/ 7.0</span>
                </div>
                {isRatingsLocked ? (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                    <Lock className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>مقفلة (الأرقام فقط)</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    معتمد وموثق
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span>
                  إجمالي التقييمات:{' '}
                  <strong className="font-mono-num text-white font-bold">{GRAND_TOTAL_RATINGS}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>
                  السبع نجوم:{' '}
                  <strong className="font-mono-num text-amber-400 font-bold">مليون شخص ({GRAND_TOTAL_REVIEWERS})</strong>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>
                  الكومنتات:{' '}
                  <strong className="font-mono-num text-blue-400 font-bold">{GRAND_TOTAL_COMMENTS}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>
                  رضا 7★:{' '}
                  <strong className="font-mono-num text-emerald-400 font-bold">97%</strong>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 self-center sm:self-auto">
              {[1, 2, 3, 4, 5, 6, 7].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown of Star Percentages & Grand Scaled Counts (Directly requested by user) */}
        <div className="p-6 rounded-2xl bg-[#0F1424] border border-slate-800/90 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">
                توزيع أعداد التقييمات ومعدلات الرضا المعتمدة (السبع نجوم: مليون شخص و100 ألف كومنت)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono-num">
              السبع: 97% | الست: 80% | الخمس: 75% | الثلاث: 16% | النجمتان: 11% | النجمة: 2%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {starCounts.map((sc) => {
              const isSelected = selectedStarFilter === sc.stars;
              return (
                <button
                  key={sc.stars}
                  type="button"
                  onClick={() =>
                    setSelectedStarFilter(selectedStarFilter === sc.stars ? null : sc.stars)
                  }
                  className={`p-3.5 rounded-xl border transition-all text-right cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-[#070913] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold font-mono-num text-white">
                        {sc.stars} نجوم
                      </span>
                    </div>
                    <span className="text-[11px] font-mono-num text-amber-300 font-bold">
                      {sc.displayCount}
                    </span>
                  </div>

                  {/* Comments count in thousands / hundreds of thousands */}
                  <div className="text-[10px] text-blue-300 font-mono-num flex items-center justify-between border-t border-slate-800/60 pt-1">
                    <span className="text-slate-400">الكومنتات:</span>
                    <span className="font-bold">{sc.commentCount}</span>
                  </div>

                  {/* Prominent Percentage display */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono-num text-amber-400">
                      {sc.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-500">نسبة الرضا</span>
                  </div>

                  {/* Progress visual bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sc.stars >= 6
                          ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                          : sc.stars === 5
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-400'
                          : 'bg-gradient-to-r from-slate-600 to-amber-600'
                      }`}
                      style={{ width: `${sc.percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {selectedStarFilter !== null && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-amber-300 font-semibold">
                تصفية التعليقات بحسب: {selectedStarFilter} نجوم ({STAR_SCALE_DATA[selectedStarFilter]?.displayCount} شخص - نسبة الرضا {STAR_SCALE_DATA[selectedStarFilter]?.percentage}%)
              </span>
              <button
                type="button"
                onClick={() => setSelectedStarFilter(null)}
                className="text-blue-400 hover:underline cursor-pointer font-bold"
              >
                عرض كل التقييمات ✕
              </button>
            </div>
          )}
        </div>

        {/* Main Grid: Form (Left) & Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submit 1-to-7 Star Rating Form with Direct Image Upload */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#0F1424] border border-slate-800/90 space-y-6 shadow-xl sticky top-24">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>أضف تقييمك وصورتك المباشرة</span>
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  صورة + نصوص كتابية
                </span>
              </div>
              <p className="text-xs text-slate-400">
                انضم إلى أكثر من مليون مقيم معتمد! اكتب رأيك وأرفق صورة تظهر فوراً في الواجهة.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1 to 7 Interactive Stars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">مستوى التقييم الملكي:</span>
                  <span className="text-xs font-mono-num font-bold text-amber-400">
                    {activeStarDisplay} من 7 نجوم (نسبة الموثوقية:{' '}
                    {STAR_SCALE_DATA[activeStarDisplay]?.percentage ?? 90}%)
                  </span>
                </div>
                <div
                  className="flex items-center justify-between gap-1 p-3 rounded-xl bg-[#070913] border border-slate-800"
                  onMouseLeave={() => setHoveredStars(null)}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                    const isFilled = num <= activeStarDisplay;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedStars(num)}
                        onMouseEnter={() => setHoveredStars(num)}
                        aria-label={`تقييم ${num} من 7 نجوم`}
                        className="p-1.5 rounded-lg hover:bg-slate-800/80 transition-transform active:scale-95 cursor-pointer flex flex-col items-center gap-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                        />
                        <span
                          className={`text-[10px] font-mono-num ${
                            isFilled ? 'text-amber-300 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {num}★
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="reviewerName" className="block text-xs font-semibold text-slate-300">
                    الاسم أو اللقب <span className="text-amber-400">*</span>
                  </label>
                  <input
                    id="reviewerName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="مثال: فهد الدوسري"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reviewerRole" className="block text-xs font-semibold text-slate-300">
                    صفتك في المنظومة
                  </label>
                  <select
                    id="reviewerRole"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="وكيل شحن معتمد">وكيل شحن معتمد</option>
                    <option value="وكيل مضيفين">وكيل مضيفين</option>
                    <option value="مستخدم VIP">مستخدم VIP</option>
                    <option value="سوبر أدمن / أدمن">سوبر أدمن / أدمن</option>
                    <option value="مطور أعمال BD">مطور أعمال BD</option>
                    <option value="صانعة محتوى صوتي">صانع / صانعة محتوى صوتي</option>
                    <option value="شريك تطوير تطبيقات">شريك تطوير تطبيقات</option>
                    <option value="مستخدم مسجل">مستخدم مسجل</option>
                  </select>
                </div>
              </div>

              {/* Handle */}
              <div className="space-y-1.5">
                <label htmlFor="reviewerHandle" className="block text-xs font-semibold text-slate-300">
                  المعرف أو اسم المستخدم (اختياري)
                </label>
                <input
                  id="reviewerHandle"
                  type="text"
                  dir="ltr"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  placeholder="@your_username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono-num"
                />
              </div>

              {/* Comment Text */}
              <div className="space-y-1.5">
                <label htmlFor="reviewerComment" className="block text-xs font-semibold text-slate-300">
                  نص التقييم الكتابي <span className="text-amber-400">*</span>
                </label>
                <textarea
                  id="reviewerComment"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="اكتب تجربتك أو رأيك في خدمات Vibers V العالمية ودعم الإدارة العليا..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Image Upload System with Direct Live Display */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[#070913] border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>إرفاق صورة مع التقييم (تظهر مباشرة فوراً):</span>
                  </label>
                  {commentImageUrl && (
                    <button
                      type="button"
                      onClick={() => setCommentImageUrl('')}
                      className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>إلغاء الصورة</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/15 text-amber-300 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>اختر ملف صورة من جهازك (تظهر مباشرة)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    dir="ltr"
                    value={commentImageUrl}
                    onChange={(e) => setCommentImageUrl(e.target.value)}
                    placeholder="أو الصق رابط صورة مباشر هنا..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono-num"
                  />
                </div>

                {imageUploadStatus && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{imageUploadStatus}</span>
                  </p>
                )}

                {/* Direct Instant Live Preview of Image with Written Text */}
                {commentImageUrl && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>معاينة حية ومباشرة للتقييم قبل الإرسال:</span>
                      </span>
                      <span className="text-slate-400 font-mono-num">{selectedStars}/7★</span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-black aspect-video max-h-48 group">
                      <img
                        src={commentImageUrl}
                        alt="معاينة الصورة المباشرة"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent p-3 flex flex-col justify-end">
                        <span className="text-xs font-bold text-white">
                          {authorName || 'اسمك الكريم'}
                        </span>
                        <p className="text-[11px] text-slate-300 line-clamp-2">
                          {commentText || 'نص التعليق المكتوب سيظهر هنا...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>إرسال ونشر التقييم المباشر ({selectedStars} نجوم)</span>
              </button>
            </form>
          </div>

          {/* Comments Feed with Written Text, Search, Filters & Direct Images */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-2xl bg-[#0F1424] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في آراء وتعليقات الأعضاء والوكلاء..."
                  className="w-full pr-10 pl-3.5 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-mono-num">
                  عرض <strong className="text-white">{filteredComments.length}</strong> من{' '}
                  <strong className="text-amber-400">{GRAND_TOTAL_COMMENTS}</strong>
                </span>
                {selectedStarFilter !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedStarFilter(null)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 cursor-pointer font-bold"
                  >
                    إلغاء التصفية
                  </button>
                )}
              </div>
            </div>

            {/* Locked Mode Notice if toggled by admin */}
            {isRatingsLocked ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1424] border-2 border-amber-500/40 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/90">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
                          نظام الخصوصية المشدد
                        </span>
                        <span className="text-xs text-slate-400">إشعار رسمي من الإدارة العليا</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-1">
                        تم قفل استعراض تفاصيل وهوية المقيمين
                      </h4>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>البيانات معتمدة ومحفوظة</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-[#070913] border border-slate-800 text-center space-y-1">
                    <div className="text-xl sm:text-2xl font-bold font-mono-num text-amber-400">
                      {GRAND_TOTAL_RATINGS}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>إجمالي التقييمات</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070913] border border-slate-800 text-center space-y-1">
                    <div className="text-xl sm:text-2xl font-bold font-mono-num text-amber-300">
                      {GRAND_TOTAL_REVIEWERS}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>مليون شخص (7★)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070913] border border-slate-800 text-center space-y-1">
                    <div className="text-xl sm:text-2xl font-bold font-mono-num text-blue-400">
                      {GRAND_TOTAL_COMMENTS}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-blue-400" />
                      <span>التعليقات المكتوبة</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070913] border border-slate-800 text-center space-y-1">
                    <div className="text-xl sm:text-2xl font-bold font-mono-num text-emerald-400">
                      {averageRating} <span className="text-xs text-slate-500">/ 7</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>مؤشر الرضا العام</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-amber-300 mb-1">
                    🔒 بيان الإدارة العليا برئاسة المدير العام عيون Prince:
                  </p>
                  <p>
                    تطبيقاً لمعايير الخصوصية التنافسية للأعضاء والوكلاء، تم قفل أسماء المقيمين مع الحفاظ على الأرقام الإجمالية الموثقة (أكثر من 1.17 مليون تقييم، ومليون شخص في تقييم السبع نجوم الملكية بنسبة 97%، و100 ألف شخص قاموا بعمل تعليق كتابي).
                  </p>
                </div>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0F1424] border border-slate-800/80 text-center space-y-3">
                <MessageSquareQuote className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">لا توجد تقييمات مطابقة لبحثك</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  جرب تغيير كلمات البحث أو اختر فئة نجوم أخرى لعرض المزيد من آراء وتجارب الأعضاء.
                </p>
                {selectedStarFilter !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedStarFilter(null)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    عرض كل التقييمات
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* List of comments with Full Written Text & Direct Images */}
                <div className="space-y-4">
                  {filteredComments.slice(0, displayLimit).map((item) => {
                    const likes = likedComments[item.id] || 0;
                    return (
                      <article
                        key={item.id}
                        className="p-5 sm:p-6 rounded-2xl bg-[#0F1424] border border-slate-800/90 space-y-4 hover:border-slate-700/80 transition-all shadow-md group"
                      >
                        {/* Author Header & Stars */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-base font-display shrink-0 shadow-inner">
                              {item.authorName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold text-white leading-snug">
                                  {item.authorName}
                                </h4>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span className="font-mono-num text-amber-400/90 font-medium" dir="ltr">
                                  {item.authorHandle}
                                </span>
                                <span aria-hidden="true" className="text-slate-600">·</span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                                  {item.activityType || 'عضو المنظومة'}
                                </span>
                                <span aria-hidden="true" className="text-slate-600">·</span>
                                <span className="text-[11px] text-slate-500">{item.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          {/* Star Pill with 1 to 7 Stars */}
                          <div className="flex items-center gap-1.5 bg-[#070913] px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                            <span className="text-xs font-mono-num font-bold text-amber-400 ml-1">
                              {item.stars}/7
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 7 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < item.stars
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Direct Written Comment Text */}
                        <div className="bg-[#070913]/90 p-4 rounded-xl border border-slate-800/80">
                          <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                            {item.comment}
                          </p>
                        </div>

                        {/* Direct Image Display if Attached */}
                        {item.imageUrl && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="flex items-center gap-1 font-semibold text-slate-300">
                                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                                <span>صورة مرفقة مع التقييم (عرض مباشر):</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setZoomedImage(item.imageUrl || null)}
                                className="text-blue-400 hover:text-blue-300 text-[11px] flex items-center gap-1 cursor-pointer font-bold"
                              >
                                <Maximize2 className="w-3 h-3" />
                                <span>تكبير الصورة</span>
                              </button>
                            </div>

                            <div
                              onClick={() => setZoomedImage(item.imageUrl || null)}
                              className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-72 cursor-pointer group/img"
                            >
                              <img
                                src={item.imageUrl}
                                alt={`صورة مرفقة من ${item.authorName}`}
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                loading="eager"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                  <span>انقر للمشاهدة بالحجم الكامل</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reaction / Helpful Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-xs text-slate-400">
                          <button
                            type="button"
                            onClick={() => handleLike(item.id)}
                            className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer text-slate-300 hover:text-amber-400 active:scale-95"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>مفيد وموثوق</span>
                            {likes > 0 && (
                              <span className="font-mono-num font-bold text-amber-400">
                                ({likes})
                              </span>
                            )}
                          </button>

                          <span className="text-[11px] text-slate-500 font-mono-num">
                            تقييم رسمي موثق عبر Vibers V
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {filteredComments.length > displayLimit && (
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 10)}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>عرض المزيد من التقييمات والآراء ({filteredComments.length - displayLimit} متبقية)</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* High-Resolution Full Screen Zoom Modal for Attached Images */}
      {zoomedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#0F1424] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-[#070913]">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>معاينة الصورة المرفقة بالحجم الكامل</span>
              </span>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center">
              <img
                src={zoomedImage}
                alt="الصورة المرفقة بالحجم الكامل"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
