import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  User,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SupportTicket, ContactChannel } from '../types';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactChannels: ContactChannel[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  prefilledCode?: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  contactChannels,
  onSubmitTicket,
  prefilledCode = ''
}) => {
  const [userName, setUserName] = useState('');
  const [realNameOptional, setRealNameOptional] = useState('');
  const [role, setRole] = useState('متقدم / عضو');
  const [whatsappOrEmail, setWhatsappOrEmail] = useState('');
  const [trackingCode, setTrackingCode] = useState(prefilledCode);
  const [problemDescription, setProblemDescription] = useState('');
  const [reasonOrDetails, setReasonOrDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!userName.trim() || userName.trim().length < 2) {
      newErrors.userName = 'يرجى كتابة اسمك (الاسم المستخدم أو الاسم الحقيقي الثلاثي).';
    }

    if (!whatsappOrEmail.trim() || whatsappOrEmail.trim().length < 5) {
      newErrors.whatsappOrEmail = 'يرجى إدخال رقم الواتساب الخاص بك أو بريدك الإلكتروني للتواصل.';
    }

    if (!problemDescription.trim() || problemDescription.trim().length < 6) {
      newErrors.problemDescription = 'يرجى كتابة وصف المشكلة التي تواجهها بوضوح (6 أحرف على الأقل).';
    }

    if (!reasonOrDetails.trim() || reasonOrDetails.trim().length < 4) {
      newErrors.reasonOrDetails = 'يرجى إضافة سبب المشكلة أو توضيح إضافي للطلب.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitTicket({
      trackingCode: trackingCode.trim() || `VBR-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantOrUserName: userName.trim(),
      realFullNameOptional: realNameOptional.trim() || undefined,
      role,
      whatsappOrEmail: whatsappOrEmail.trim(),
      problemDescription: problemDescription.trim(),
      reasonOrDetails: reasonOrDetails.trim()
    });

    setIsSubmitting(false);
    if (success) {
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setUserName('');
    setRealNameOptional('');
    setWhatsappOrEmail('');
    setProblemDescription('');
    setReasonOrDetails('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="دردشة ومراسلة الإدارة العليا وإرسال الشكاوى"
    >
      <div className="w-full max-w-2xl bg-[#0F1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-right">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                منظومة الدردشة والدعم المباشر مع لوحة تحكم الإدارة العليا
              </h3>
              <p className="text-xs text-slate-400">
                أرسل وصف مشكلتك أو طلبك لتصل فوراً إلى لوحة تحكم المسؤول
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OFFICIAL CUSTOMER SERVICE CALLOUT (Strict requirement before submitting) */}
        <div className="p-4 rounded-2xl bg-[#070913] border border-amber-500/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>خدمة العملاء الرسمية للإدارة العليا (قبل إرسال الطلب):</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            يمكنك التواصل المباشر مع خدمة عملاء الإدارة العليا الرسمية عبر أرقام الواتساب المعتمدة أو ملء النموذج أدناه ليصل طلبك إلى لوحة التحكم فوراً.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {contactChannels.map((c) => (
              <span
                key={c.id}
                className="px-2.5 py-1 rounded-lg bg-[#0F1424] border border-slate-800 text-[11px] font-mono-num text-amber-300 flex items-center gap-1.5"
                dir="ltr"
              >
                {c.type === 'whatsapp' ? <Phone className="w-3 h-3 text-emerald-400" /> : <Mail className="w-3 h-3 text-blue-400" />}
                <span>{c.value}</span>
              </span>
            ))}
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-2xl bg-[#090D1A] border border-emerald-500/50 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">تم إرسال طلبك ومكتوبك للإدارة العليا بنجاح!</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              وصلت مشكلتك وتفاصيل حسابك إلى لوحة تحكم المدير العام عيون Prince وفريق المشرفين، وسوف يتم مراجعتها والتواصل معك عبر الواتساب أو البريد المدخل.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              تم، العودة إلى الموقع
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User Name (Real 3-part or chosen username) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  الاسم المستخدم في التسجيل أو الاسم الحقيقي <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="الاسم الذي استخدمته في تسجيل الدخول أو اللقب..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {errors.userName && <p className="text-[11px] text-rose-400">{errors.userName}</p>}
              </div>

              {/* Real Full Name (Optional as requested) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  الاسم الحقيقي الثلاثي <span className="text-slate-400 text-[10px]">(اختياري وليس إجبارياً)</span>
                </label>
                <input
                  type="text"
                  value={realNameOptional}
                  onChange={(e) => setRealNameOptional(e.target.value)}
                  placeholder="اختياري: اكتب اسمك الثلاثي الكامل إذا رغبت..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role in system */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  دورك أو رتبتك في المنظومة <span className="text-amber-400">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="متقدم جديد">متقدم جديد (طلب انضمام)</option>
                  <option value="سوبر أدمن (Super Admin)">سوبر أدمن (Super Admin)</option>
                  <option value="أدمن (Admin)">أدمن (Admin)</option>
                  <option value="مطور أعمال (BD)">مطور أعمال (BD)</option>
                  <option value="وكيل شحن معتمد">وكيل شحن معتمد</option>
                  <option value="وكيل مضيفين">وكيل مضيفين</option>
                  <option value="مستخدم / زائر للموقع">مستخدم / زائر للموقع</option>
                </select>
              </div>

              {/* Contact Method */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  رقم الواتساب أو البريد الإلكتروني <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={whatsappOrEmail}
                  onChange={(e) => setWhatsappOrEmail(e.target.value)}
                  placeholder="مثال: +966512345678 أو البريد الإلكتروني..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-num"
                />
                {errors.whatsappOrEmail && (
                  <p className="text-[11px] text-rose-400">{errors.whatsappOrEmail}</p>
                )}
              </div>
            </div>

            {/* Tracking Code (if applicable) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                كود الطلب الخاص بك <span className="text-slate-400 text-[10px]">(إذا كان لديك كود مسبق)</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="مثال: app-101 أو اتركه فارغاً وسيتم توليد كود جديد"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs sm:text-sm text-white font-mono-num placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                وصف المشكلة التي تواجهها بالتفصيل <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="اشرح المشكلة بالتفصيل، مثلاً: تعليق كود التسجيل، الرغبة في مراجعة قرار الحظر أو الرفض، الاستفسار عن الشحن..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {errors.problemDescription && (
                <p className="text-[11px] text-rose-400">{errors.problemDescription}</p>
              )}
            </div>

            {/* Reason and additional details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                السبب وتفاصيل إضافية <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={reasonOrDetails}
                onChange={(e) => setReasonOrDetails(e.target.value)}
                placeholder="أضف السبب أو أي تفاصيل مساعدة للإدارة لاتخاذ القرار..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {errors.reasonOrDetails && (
                <p className="text-[11px] text-rose-400">{errors.reasonOrDetails}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                * لن يتم إرسال الطلب إلى لوحة سيستم الإدارة إلا بعد ملء كافة الحقول الإلزامية بعناية.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-900/40"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب والمشكلة للإدارة فوراً'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
