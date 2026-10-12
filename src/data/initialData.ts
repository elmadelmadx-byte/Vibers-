import {
  BannerSlide,
  ActivityShowcase,
  RoleOption,
  TeamApplication,
  UserRatingComment,
  LivePlatformStats,
  StatCardCustomization,
  BroadcastNotification,
  ContactChannel,
  SupportTicket
} from '../types';

export const ROLES_LIST: RoleOption[] = [
  {
    id: 'super_admin',
    titleAr: 'سوبر أدمن (Super Admin)',
    titleEn: 'Super Admin',
    descAr: 'الإشراف الرقابي الأعلى وإدارة العمليات الإقليمية (يشترط وجود 15 مطور أعمال BD على الأقل تحت إدارتك)',
    badgeCode: 'SA-TIER',
    requiredBds: 15
  },
  {
    id: 'admin',
    titleAr: 'أدمن (Admin)',
    titleEn: 'System Admin',
    descAr: 'إدارة الغرف الصوتية وضمان الجودة (يشترط وجود 7 مطوري أعمال BD على الأقل تحت إدارتك)',
    badgeCode: 'ADM-OPS',
    requiredBds: 7
  },
  {
    id: 'bd',
    titleAr: 'مطور أعمال (BD - Business Developer)',
    titleEn: 'Business Developer',
    descAr: 'استقطاب الوكالات والتوسع التسويقي (لا يشترط وجود فريق مسبق، التقديم متاح للجميع)',
    badgeCode: 'BD-GROWTH',
    requiredBds: 0
  },
  {
    id: 'shipping_agent',
    titleAr: 'وكيل شحن معتمد (Shipping Agent)',
    titleEn: 'Authorized Shipping Agent',
    descAr: 'توفير خدمات شحن العملات والماسات الفورية بأعلى معايير الأمان والموثوقية',
    badgeCode: 'VIP-COIN',
    requiredBds: 0
  },
  {
    id: 'host_agent',
    titleAr: 'وكيل مضيفين (Host Agent)',
    titleEn: 'Voice Host Agent',
    descAr: 'إدارة وتدريب المذيعين وصناع المحتوى الصوتي وتنشيط الفعاليات اليومية',
    badgeCode: 'HOST-PRO',
    requiredBds: 0
  }
];

export const COUNTRY_CODES = [
  { code: '+966', country: 'السعودية (SA)', pattern: /^[5]\d{8}$/, example: '512345678', minLen: 9, maxLen: 9 },
  { code: '+971', country: 'الإمارات (AE)', pattern: /^[5]\d{8}$/, example: '501234567', minLen: 9, maxLen: 9 },
  { code: '+20', country: 'مصر (EG)', pattern: /^1[0125]\d{8}$/, example: '1012345678', minLen: 10, maxLen: 10 },
  { code: '+965', country: 'الكويت (KW)', pattern: /^[569]\d{7}$/, example: '51234567', minLen: 8, maxLen: 8 },
  { code: '+974', country: 'قطر (QA)', pattern: /^[3567]\d{7}$/, example: '33123456', minLen: 8, maxLen: 8 },
  { code: '+962', country: 'الأردن (JO)', pattern: /^7[789]\d{7}$/, example: '791234567', minLen: 9, maxLen: 9 },
  { code: '+964', country: 'العراق (IQ)', pattern: /^7[5789]\d{8}$/, example: '7712345678', minLen: 10, maxLen: 10 },
  { code: '+968', country: 'عمان (OM)', pattern: /^[79]\d{7}$/, example: '91234567', minLen: 8, maxLen: 8 },
  { code: '+973', country: 'البحرين (BH)', pattern: /^[36]\d{7}$/, example: '36123456', minLen: 8, maxLen: 8 },
  { code: '+212', country: 'المغرب (MA)', pattern: /^[67]\d{8}$/, example: '612345678', minLen: 9, maxLen: 9 },
  { code: '+213', country: 'الجزائر (DZ)', pattern: /^[567]\d{8}$/, example: '551234567', minLen: 9, maxLen: 9 },
  { code: '+90', country: 'تركيا (TR)', pattern: /^5\d{9}$/, example: '5321234567', minLen: 10, maxLen: 10 },
  { code: '+44', country: 'بريطانيا (UK)', pattern: /^7\d{9}$/, example: '7911123456', minLen: 10, maxLen: 10 },
  { code: '+1', country: 'أمريكا / كندا (US/CA)', pattern: /^\d{10}$/, example: '2025550199', minLen: 10, maxLen: 10 }
];

export const BUSINESS_ACTIVITIES = [
  'تطوير وبرمجة تطبيقات الدردشة الصوتية (Voice Chat App Development)',
  'إدارة وتشغيل وكالات المضيفين والمذيعين (Host Agency Management)',
  'خدمات الشحن الفوري وتوزيع العملات الرقمية (Global Coin & VIP Shipping)',
  'تطوير الأعمال والتوسع الإقليمي للتطبيقات (Regional BD & Growth)',
  'الإشراف الإداري وحماية المجتمعات الصوتية (Super Admin & Trust Operations)',
  'تنظيم المسابقات والفعاليات الصوتية الكبرى (Live Audio Events & PK Tournaments)'
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    titleAr: 'Vibers V العالمية لتنمية التطبيقات ودعم الدردشة الصوتية',
    subtitleAr: 'بقيادة المدير العام عيون Prince — نبني الجيل القادم من منصات التواصل الصوتي التفاعلي، وندعم الوكالات والمضيفين ووكلاء الشحن في أكثر من 35 دولة حول العالم.',
    kickerEn: 'VIBERS V GLOBAL · EXECUTIVE ECOSYSTEM',
    imageUrl: '/src/assets/images/banner_voice_chat_ecosystem_1791675975272.jpg',
    ctaTextAr: 'انضم إلى فريق القيادة الآن',
    ctaTarget: '#join-team',
    statsHighlight: '+1.4M مستخدم نشط شهرياً عبر شبكتنا'
  },
  {
    id: 'banner-2',
    titleAr: 'تطوير تقني متكامل وهندسة غرف الدردشة الفورية',
    subtitleAr: 'نقدم حلولاً برمجية فائقة السرعة لنقاء الصوت، أنظمة الهدايا ثلاثية الأبعاد، ومستويات الـ VIP مع حماية متكاملة ضد الاختراق واستقرار بنسبة 99.98%.',
    kickerEn: 'ULTRA-LOW LATENCY AUDIO ARCHITECTURE',
    imageUrl: '/src/assets/images/banner_app_development_hub_1791675985654.jpg',
    ctaTextAr: 'استكشف أنشطتنا وخدماتنا',
    ctaTarget: '#activities',
    statsHighlight: 'أقل من 18ms زمن استجابة صوتية عالمياً'
  },
  {
    id: 'banner-3',
    titleAr: 'شبكة وكلاء الشحن ووكلاء المضيفين الأقوى عالمياً',
    subtitleAr: 'منظومة مالية وإدارية موثوقة تضمن أعلى العوائد لوكلاء الشحن، المضيفين، مطوري الأعمال (BD)، وفريق الإدارة تحت إشراف مباشر من عيون Prince.',
    kickerEn: 'GLOBAL AGENCY & VIP SHIPPING NETWORK',
    imageUrl: '/src/assets/images/banner_vip_agency_network_1791675995675.jpg',
    ctaTextAr: 'قدم طلب اعتماد وكالتك',
    ctaTarget: '#join-team',
    statsHighlight: '+480 وكالة شحن ومضيفين معتمدة'
  }
];

export const INITIAL_ACTIVITIES: ActivityShowcase[] = [
  {
    id: 'act-01',
    numberIndex: '01',
    titleAr: 'هندسة وتطوير تطبيقات الدردشة الصوتية',
    titleEn: 'Voice Chat App Architecture & Full-Stack Engineering',
    categoryAr: 'تطوير البرمجيات · البنية التحتية',
    descriptionAr: 'تصميم وبرمجة تطبيقات غرف الدردشة الصوتية الجماعية بأحدث تقنيات المعالجة الصوتية، مع لوحات تحكم ذكية، مؤثرات دخول ملكية، وأنظمة ألعاب تفاعلية داخل الغرف.',
    metricsAr: '+42 تطبيقاً ومشروعاً تقنياً ناجحاً في الشرق الأوسط وشمال أفريقيا وأوروبا',
    imageUrl: '/src/assets/images/activity_voice_rooms_1791676005998.jpg'
  },
  {
    id: 'act-02',
    numberIndex: '02',
    titleAr: 'إدارة وتأهيل وكالات المضيفين (Host Agencies)',
    titleEn: 'Host Agency Incubation & Audio Creator Growth',
    categoryAr: 'إدارة المواهب · تنشيط الغرف',
    descriptionAr: 'استقطاب وتدريب المضيفين وصناع المحتوى الصوتي، وتزويد الوكالات ببرامج تحفيزية، جداول بث احترافية، ومسابقات شهرية ترفع من تفاعل المستخدمين وعوائد الوكالة.',
    metricsAr: '+12,500 مضيف ومضيفة نشطين على مدار الساعة بإشراف وكلائنا',
    imageUrl: '/src/assets/images/activity_host_training_1791676015723.jpg'
  },
  {
    id: 'act-03',
    numberIndex: '03',
    titleAr: 'منظومة وكلاء الشحن المعتمدين والدعم المالي',
    titleEn: 'Authorized Global Coin Shipping & Financial Settlement',
    categoryAr: 'حلول الدفع · شحن فوري',
    descriptionAr: 'توفير بوابات شحن محلية ودولية سريعة وآمنة لجميع المستخدمين وكبار الشخصيات (VIP)، مع تسويات مالية فورية وعمولات تنافسية لوكلاء الشحن المعتمدين لدى Vibers V.',
    metricsAr: 'معاملات شحن فورية آمنة على مدار 24/7 في أكثر من 35 دولة',
    imageUrl: '/src/assets/images/banner_vip_agency_network_1791675995675.jpg'
  },
  {
    id: 'act-04',
    numberIndex: '04',
    titleAr: 'تطوير الأعمال (BD) والإدارة الرقابية العليا',
    titleEn: 'Executive BD Strategy, Super Admin & Governance',
    categoryAr: 'تطوير الأعمال · قيادة عيون Prince',
    descriptionAr: 'فريق متكامل من السوبر أدمن، الأدمن، ومطوري الأعمال (BD) بقيادة المدير العام عيون Prince لضمان بيئة آمنة، حل النزاعات فوراً، وتوسيع الحصة السوقية للتطبيقات الشريكة.',
    metricsAr: '+185% نمو سنوي في حجم التداول الصوتي واستقطاب الوكالات',
    imageUrl: '/src/assets/images/banner_voice_chat_ecosystem_1791675975272.jpg'
  }
];

export const INITIAL_STATS: LivePlatformStats = {
  activeUsers: 2750340,
  hostAgencies: 19700,
  totalHosts: 350000,
  superAdmins: 2573,
  admins: 3940,
  bds: 8806,
  shippingAgents: 7860,
  hostAgents: 19700,
  officialRegistrations: 14820,
  quickRegistrations: 38450,
  dailyActiveLogins: 42890
};

export const INITIAL_NOTIFICATIONS: BroadcastNotification[] = [
  {
    id: 'notif-1',
    senderName: 'المدير العام عيون Prince',
    title: 'رسالة ترحيبية ملكية من القيادة العامة',
    message: 'أهلاً وسهلاً بجميع الزوار والمنضمين إلى منظومة Vibers V العالمية لتنمية التطبيقات ودعم تطبيقات الدردشة الصوتية. طلباتكم واستفساراتكم تحظى برعايتنا المباشرة.',
    type: 'welcome',
    createdAt: 'الآن',
    isActive: true
  },
  {
    id: 'notif-2',
    senderName: 'لجنة المراجعة والاعتماد التنفيذي',
    title: 'تنبيه مهم لجميع المتقدمين عبر الرابط',
    message: 'يرجى الانتظار 24 إلى 48 ساعة كحد أقصى لتأكيد الطلب واستلام رسالة التعيين عبر الواتساب أو البريد. وفي حال التأخر يرجى التواصل مع الإدارة العليا فوراً.',
    type: 'announcement',
    createdAt: 'اليوم',
    isActive: true
  }
];

export const INITIAL_CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'contact-wa-1',
    type: 'whatsapp',
    labelAr: 'واتساب الإدارة العليا المباشر (المدير العام عيون Prince)',
    value: '+201065874461',
    descriptionAr: 'الخط الرسمي الأول للتواصل الفوري، استفسارات التعيين، واعتماد العقود الرسمية والمشاكل الطارئة',
    isPrimary: true
  },
  {
    id: 'contact-wa-2',
    type: 'whatsapp',
    labelAr: 'خط دعم الوكلاء ومطوري الأعمال والشكاوى (WhatsApp Business)',
    value: '+201066934250',
    descriptionAr: 'الخط الرسمي الثاني المخصص لوكالات المضيفين ووكلاء الشحن وشؤون السوبر أدمن والأدمن وخدمة العملاء',
    isPrimary: false
  },
  {
    id: 'contact-mail-1',
    type: 'email',
    labelAr: 'البريد الإلكتروني الرسمي للقيادة العامة',
    value: 'vibersvge@gmail.com',
    descriptionAr: 'المراسلات الرسمية والشكاوى القانونية واعتماد الوثائق',
    isPrimary: true
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    trackingCode: 'VBR-102-SEC',
    applicantOrUserName: 'فهد الدوسري',
    realFullNameOptional: 'فهد محمد ناصر الدوسري',
    role: 'وكيل شحن معتمد',
    whatsappOrEmail: '+966 512345678',
    problemDescription: 'طلب استفسار وتأكيد كود الانضمام المعتمد',
    reasonOrDetails: 'أرغب في التأكد من تفعيل صلاحيات شحن العملات في لوحة المنظومة.',
    status: 'resolved',
    createdAt: 'منذ ساعتين',
    adminReply: 'تم التحقق من بياناتك واعتماد حسابك رسمياً كوكيل شحن معتمد.'
  }
];

// Default Customizable Stat Cards that Manager Ayoun Prince can rename or customize
export const INITIAL_CUSTOMIZABLE_CARDS: StatCardCustomization[] = [
  {
    id: 'active-users',
    topText: 'REAL-TIME PARTICIPANTS (+2.75M)',
    insideTitle: 'المستخدمون النشطون (Active Users)',
    bottomText: 'أكثر من 2,750,000 مستخدم نشط في غرف الصوت عالمياً',
    starsCount: 7,
    iconEmoji: '🟢',
    iconType: 'users'
  },
  {
    id: 'host-agencies',
    topText: 'AUTHORIZED HOST AGENCIES',
    insideTitle: 'وكالات المضيفين (19,700 وكالة)',
    bottomText: 'وكالات صوتية رسمية معتمدة تحت إشراف الإدارة العامة',
    starsCount: 7,
    iconEmoji: '🎙️',
    iconType: 'mic'
  },
  {
    id: 'total-hosts',
    topText: 'VOICE TALENTS & BROADCASTERS',
    insideTitle: 'المضيفون وصناع المحتوى (350 ألف)',
    bottomText: '350,000 مضيف ومضيفة نشطين على مدار الساعة',
    starsCount: 7,
    iconEmoji: '🌟',
    iconType: 'award'
  },
  {
    id: 'shipping-agents',
    topText: 'AUTHORIZED SHIPPING AGENTS',
    insideTitle: 'وكلاء الشحن المعتمدون (7,860 وكيل)',
    bottomText: 'شحن فوري ومعاملات مالية معتمدة في أكثر من 35 دولة',
    starsCount: 7,
    iconEmoji: '📦',
    iconType: 'coins'
  },
  {
    id: 'super-admins',
    topText: 'EXECUTIVE GOVERNANCE (15 BDs)',
    insideTitle: 'سوبر أدمن (2,573 قيادة)',
    bottomText: 'قيادات تنفيذية ورقابية مسؤولة عن حماية وتوجيه المنظومة',
    starsCount: 7,
    iconEmoji: '👑',
    iconType: 'shieldAlert'
  },
  {
    id: 'admins',
    topText: 'OPERATIONS & TRUST (7 BDs)',
    insideTitle: 'الأدمن (3,940 مشرف)',
    bottomText: 'إشراف فني مباشر ومتابعة مستمرة على مدار الساعة 24/7',
    starsCount: 7,
    iconEmoji: '🛡️',
    iconType: 'shieldCheck'
  },
  {
    id: 'bds',
    topText: 'BUSINESS DEVELOPERS',
    insideTitle: 'مطورو الأعمال (8,806 BD)',
    bottomText: 'تطوير وتوسيع الوكالات واستقطاب الشراكات الدولية',
    starsCount: 7,
    iconEmoji: '💼',
    iconType: 'briefcase'
  },
  {
    id: 'official-reg',
    topText: 'OFFICIAL 100% FAST-TRACK',
    insideTitle: 'المسجلون رسمياً (التسجيل الرسمي 100%)',
    bottomText: 'ملف موثق بالهوية والعنوان - أولوية توظيف فورية',
    starsCount: 7,
    iconEmoji: '✅',
    iconType: 'award'
  },
  {
    id: 'quick-reg',
    topText: 'QUICK ENTRY 50% PROBABILITY',
    insideTitle: 'المسجلون بالنموذج المختصر (50%)',
    bottomText: 'بيانات سريعة - قيد التقييم الأولي والمطابقة',
    starsCount: 5,
    iconEmoji: '⚡',
    iconType: 'fileText'
  }
];

export const INITIAL_APPLICATIONS: TeamApplication[] = [
  {
    id: 'app-101',
    registrationTrack: 'official',
    realFullName: 'عبدالله محمد الفيصل العتيبي',
    nickname: 'الصقر الملكي VIP',
    email: 'abdullah.alotaibi@vibers-agency.sa',
    countryCode: '+966',
    phoneNumber: '554892103',
    fullPhone: '+966 554892103',
    whatsappPhone: '+966 554892103',
    businessActivity: 'خدمات الشحن الفوري وتوزيع العملات الرقمية (Global Coin & VIP Shipping)',
    selectedRoles: ['super_admin', 'shipping_agent'],
    bio: 'خبرة 5 سنوات في إدارة شحن تطبيقات الدردشة الصوتية في الخليج مع قاعدة عملاء تتجاوز 1500 داعم VIP.',
    age: 29,
    gender: 'male',
    nationalIdNumber: '1098472619',
    residenceAddress: 'المملكة العربية السعودية، الرياض، حي النخيل',
    streetName: 'طريق الملك فهد الفرعي',
    houseNumber: '14B',
    managedBdCount: 18,
    managedBdNamesOrCodes: 'فريق صقور نجد (18 مطور أعمال معتمدين بأرقام اشتراك رسمية)',
    status: 'approved',
    candidateRating: 7,
    moderationNotes: 'ملف مكتمل ومستوفي كافة شروط السوبر أدمن مع 18 BD نشطين.',
    submittedAt: '2026-10-10 14:20'
  },
  {
    id: 'app-102',
    registrationTrack: 'official',
    realFullName: 'سارة أحمد محمود المنصور',
    nickname: 'Queen Sarah Audio',
    email: 'sarah.mansour@voicehub.ae',
    countryCode: '+971',
    phoneNumber: '508374911',
    fullPhone: '+971 508374911',
    whatsappPhone: '+971 508374911',
    businessActivity: 'إدارة وتشغيل وكالات المضيفين والمذيعين (Host Agency Management)',
    selectedRoles: ['admin', 'host_agent'],
    bio: 'مؤسسة وكالة صوتية تضم 85 مضيفة محترفة في الإمارات والأردن، نرغب بالانضمام تحت مظلة Vibers V العالمية.',
    age: 26,
    gender: 'female',
    nationalIdNumber: '784-1998-1234567-1',
    residenceAddress: 'الإمارات العربية المتحدة، دبي، الخليج التجاري',
    streetName: 'شارع مراسي درايف',
    houseNumber: 'برج الأوبال 402',
    managedBdCount: 9,
    managedBdNamesOrCodes: 'وكالة ستارز فويس (9 مطوري أعمال متعاقدين رسمياً)',
    status: 'approved',
    candidateRating: 7,
    moderationNotes: 'تمت المقابلة واعتمادها كأدمن رسمي مع فريق 9 BD.',
    submittedAt: '2026-10-09 19:45'
  },
  {
    id: 'app-103',
    registrationTrack: 'quick',
    realFullName: 'كريم طارق حسن الشناوي',
    nickname: 'Karim Tech BD',
    email: 'karim.shenawy@devstream.eg',
    countryCode: '+20',
    phoneNumber: '1092837465',
    fullPhone: '+20 1092837465',
    whatsappPhone: '+20 1092837465',
    businessActivity: 'تطوير الأعمال والتوسع الإقليمي للتطبيقات (Regional BD & Growth)',
    selectedRoles: ['bd'],
    bio: 'مطور أعمال سابق في منصات صوتية، متخصص في التعاقد مع الوكالات الكبرى.',
    age: 24,
    gender: 'male',
    status: 'waitlist',
    candidateRating: 5,
    moderationNotes: 'تسجيل مختصر بنسبة 50% - في قائمة الانتظار لحين استكمال الوثائق الرسمية.',
    submittedAt: '2026-10-10 16:05'
  }
];

export const INITIAL_COMMENTS: UserRatingComment[] = [
  {
    id: 'rev-1',
    authorName: 'فهد الدوسري',
    authorHandle: '@fahad_vip_ksa',
    stars: 7,
    comment: 'شركة Vibers V العالمية بقيادة المدير العام عيون Prince نقلت وكالتنا لمستوى عالمي. سرعة في الشحن، دعم فني على مدار الساعة، واحترافية غير مسبوقة في إدارة التطبيقات الصوتية.',
    createdAt: 'منذ ساعتين',
    activityType: 'وكيل شحن معتمد'
  },
  {
    id: 'rev-2',
    authorName: 'نور الهدى العلي',
    authorHandle: '@nour_host_agency',
    stars: 7,
    comment: 'أفضل منظومة لدعم وكلاء المضيفين والـ BD. الرواتب والمكافآت تنزل في موعدها بالدقيقة، وفريق السوبر أدمن متعاون جداً في حل أي مشكلة تقنية فوراً.',
    createdAt: 'منذ 4 ساعات',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-3',
    authorName: 'الشيخ ماجد العتيبي',
    authorHandle: '@majed_alotaibi_vip',
    stars: 7,
    comment: 'المنصة الصوتية الوحيدة التي تجمع بين الأمان المطلق وحفظ حقوق الوكلاء والداعمين. فخور بكوني داعم VIP في منظومة Vibers V بإشراف عيون Prince.',
    createdAt: 'منذ 5 ساعات',
    activityType: 'مستخدم VIP'
  },
  {
    id: 'rev-4',
    authorName: 'المهندس خالد الشمري',
    authorHandle: '@khaled_voice_super',
    stars: 7,
    comment: 'إشراف وتنظيم بمستوى عالمي. نتابع أكثر من 18 مطور أعمال BD تحت مظلتنا، والتعامل مع الإدارة العامة يتم بمنتهى الشفافية والسرعة والاحترافية.',
    createdAt: 'منذ 6 ساعات',
    activityType: 'سوبر أدمن / أدمن'
  },
  {
    id: 'rev-5',
    authorName: 'سارة أحمد المنصور',
    authorHandle: '@queen_sarah_dubai',
    stars: 7,
    comment: 'وكالتنا تضم 85 مضيفة صوتية محترفة، وحققنا نمو أرباح بنسبة +140% خلال 3 أشهر فقط بعد انضمامنا لعائلة Vibers V العالمية.',
    createdAt: 'منذ 8 ساعات',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-6',
    authorName: 'المستشار راشد الكعبي',
    authorHandle: '@rashed_alkaabi_qa',
    stars: 7,
    comment: 'تطوير الأعمال في Vibers V له طابع استثنائي. سهولة التعاقد مع الوكالات الصوتية الدولية والحصول على نسب أرباح مجزية وعقود موثقة ومعتمدة.',
    createdAt: 'منذ 10 ساعات',
    activityType: 'مطور أعمال BD'
  },
  {
    id: 'rev-7',
    authorName: 'د. يوسف الغامدي',
    authorHandle: '@dr_youssef_ksa',
    stars: 7,
    comment: 'البنية التحتية للسيرفرات الصوتية وتقنية الغرف التفاعلية لا مثيل لها في الشرق الأوسط. 7 نجوم ملكية مستحقة بجدارة للإدارة الحكيمة.',
    createdAt: 'منذ 12 ساعة',
    activityType: 'شريك تطوير تطبيقات'
  },
  {
    id: 'rev-8',
    authorName: 'ريم القحطاني',
    authorHandle: '@reem_voice_star',
    stars: 7,
    comment: 'احترام المذيعات وتوفير بيئة بث محترمة وآمنة من أهم مزايا Vibers V. الدعم الفني متواجد معنا في الرومات الصوتية على مدار الساعة.',
    createdAt: 'منذ 14 ساعة',
    activityType: 'صانعة محتوى صوتي'
  },
  {
    id: 'rev-9',
    authorName: 'أحمد خليل النجار',
    authorHandle: '@ahmed_najjar_eg',
    stars: 7,
    comment: 'أسرع شحن عملات وكوينز رأيته في مجال تطبيقات الصوت. التحويلات تتم في أقل من 30 ثانية دون أي تعليق أو تأخير.',
    createdAt: 'منذ 16 ساعة',
    activityType: 'وكيل شحن معتمد'
  },
  {
    id: 'rev-10',
    authorName: 'فيصل بن طلال السبيعي',
    authorHandle: '@faisal_subaie',
    stars: 7,
    comment: 'القيادة الحكيمة من المدير العام عيون Prince تمنح كل عضو حقه كاملاً. تطبيق القوانين وحماية المنظومة هي أولويتنا دائماً.',
    createdAt: 'منذ 18 ساعة',
    activityType: 'سوبر أدمن / أدمن'
  },
  {
    id: 'rev-11',
    authorName: 'منى العبدالله',
    authorHandle: '@mona_kuwait_audio',
    stars: 7,
    comment: 'وكالة فويس الكويت أصبحت في صدارة الترتيب بفضل توجيهات الإدارة العليا والمكافآت الأسبوعية المحفزة جداً.',
    createdAt: 'يوم أمس',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-12',
    authorName: 'سلطان الدليمي',
    authorHandle: '@sultan_iraq_bd',
    stars: 7,
    comment: 'استقطبنا أكثر من 20 وكالة جديدة في العراق خلال شهرين. المصداقية والدفع الفوري هما سر النجاح مع Vibers V.',
    createdAt: 'يوم أمس',
    activityType: 'مطور أعمال BD'
  },
  {
    id: 'rev-13',
    authorName: 'هيا الحربي',
    authorHandle: '@haya_alharbi_vip',
    stars: 7,
    comment: 'أجواء الرومات الصوتية راقية جداً والمسابقات الرسمية تعطي حماس كبير للجميع. تقييمي 7 نجوم كاملة بدون تردد.',
    createdAt: 'يوم أمس',
    activityType: 'مستخدم VIP'
  },
  {
    id: 'rev-14',
    authorName: 'محمد باسل الزيود',
    authorHandle: '@basel_jordan_host',
    stars: 7,
    comment: 'تعامل راقي جداً من لجنة المراجعة والاعتماد. رسالة التعيين والعقد الرسمي وصلا في أقل من 24 ساعة عبر الواتساب والبريد.',
    createdAt: 'منذ يومين',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-15',
    authorName: 'طارق المحمدي',
    authorHandle: '@tariq_morocco_dev',
    stars: 7,
    comment: 'شراكة تقنية ناجحة بكل المقاييس. كفاءة واجهات API وسرعة الاستجابة تفوق أي منصة صوتية أخرى في السوق.',
    createdAt: 'منذ يومين',
    activityType: 'شريك تطوير تطبيقات'
  },
  {
    id: 'rev-16',
    authorName: 'عبدالعزيز بن ناصر',
    authorHandle: '@abdulaziz_vip99',
    stars: 7,
    comment: 'أفضل خدمة عملاء وتجاوب سريع مع التذاكر والاستفسارات. 7 نجوم تستحقونها عن جدارة واستحقاق تحت قيادة عيون Prince.',
    createdAt: 'منذ يومين',
    activityType: 'مستخدم VIP'
  },
  {
    id: 'rev-17',
    authorName: 'شروق التميمي',
    authorHandle: '@shorouq_tamimi',
    stars: 7,
    comment: 'النظام المالي وحساب الأرباح شفاف بنسبة 100% مع تقارير يومية مفصلة لكل مذيع في الوكالة، شكراً لكم.',
    createdAt: 'منذ 3 أيام',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-18',
    authorName: 'حمزة المغربي',
    authorHandle: '@hamza_shipping_agent',
    stars: 7,
    comment: 'السيولة متوفرة والتحويلات الدولية البنكية والعملات الرقمية تتم بأمان تام تحت إشراف القيادة التنفيذية.',
    createdAt: 'منذ 3 أيام',
    activityType: 'وكيل شحن معتمد'
  },
  {
    id: 'rev-19',
    authorName: 'ناصر المطيري',
    authorHandle: '@nasser_mutairi_ksa',
    stars: 7,
    comment: 'نظام الترقية والصلاحيات في المنظومة عادل جداً ويكافئ المجتهدين ومن يمتلكون فرق BD نشطة ومؤثرة.',
    createdAt: 'منذ 3 أيام',
    activityType: 'سوبر أدمن / أدمن'
  },
  {
    id: 'rev-20',
    authorName: 'فاطمة الزهراء البلوشي',
    authorHandle: '@fatima_oman_voice',
    stars: 7,
    comment: 'حصلت على درع التميز الشهري ومكافأة مباشرة من الإدارة العليا. فخورة بانتمائي لمنظومة Vibers V الصوتية.',
    createdAt: 'منذ 4 أيام',
    activityType: 'صانعة محتوى صوتي'
  },
  {
    id: 'rev-21',
    authorName: 'عادل الجابري',
    authorHandle: '@adel_aljabri_uae',
    stars: 7,
    comment: 'توفير كافة الأدوات التسويقية والتدريب المستمر لمطوري الأعمال جعل مهمتنا سهلة ومثمرة في كافة دول الخليج.',
    createdAt: 'منذ 4 أيام',
    activityType: 'مطور أعمال BD'
  },
  {
    id: 'rev-22',
    authorName: 'زياد الشامي',
    authorHandle: '@ziad_voice_agency',
    stars: 7,
    comment: 'بيئة داعمة للشباب والمواهب الصوتية. جميع المذيعين في فريقي يشيدون بالدعم الفني والإداري الصارم والعادل.',
    createdAt: 'منذ 5 أيام',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-23',
    authorName: 'بندر بن فهد الهذلي',
    authorHandle: '@bandar_vip_voice',
    stars: 7,
    comment: 'غرف صوتية بنقاء صوت كريستالي ومؤثرات خرافية. لا غنى عن قضاء الأمسيات في تطبيقات Vibers V يومياً.',
    createdAt: 'منذ 5 أيام',
    activityType: 'مستخدم VIP'
  },
  {
    id: 'rev-24',
    authorName: 'مريم الصالح',
    authorHandle: '@maryam_alsaleh_kw',
    stars: 7,
    comment: 'أشكر المدير العام عيون Prince على دعمه المتواصل واهتمامه الشخصي بكل وكالة شريكة، أنتم الرقم واحد دائماً.',
    createdAt: 'منذ 6 أيام',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-25',
    authorName: 'حسام الدين الرشيدي',
    authorHandle: '@hossam_rashidi_eg',
    stars: 7,
    comment: 'معاملات بملايين الكوينز يومياً دون أي خطأ تقني. نظام شحن صلب ومحمي بأعلى درجات الأمان المالي.',
    createdAt: 'منذ 6 أيام',
    activityType: 'وكيل شحن معتمد'
  },
  // 6-star comments (80% satisfaction tier)
  {
    id: 'rev-26',
    authorName: 'عمر الزهراني',
    authorHandle: '@omar_audio_dev',
    stars: 6,
    comment: 'جودة السيرفرات الصوتية وتصميم غرف الـ VIP في تطبيقات Vibers V تتفوق على جميع المنافسين. تجربة ممتازة وتستحق 7 نجوم بجدارة.',
    createdAt: 'يوم أمس',
    activityType: 'تطوير تطبيقات'
  },
  {
    id: 'rev-27',
    authorName: 'لمياء الرشيد',
    authorHandle: '@lamia_voice_host',
    stars: 6,
    comment: 'منظومة قوية جداً وتنظيم محكم ومريح. نقترح فقط إضافة خيارات تصفية إضافية في لوحة المضيفين لتكون المنظومة متكاملة 100%.',
    createdAt: 'منذ يومين',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-28',
    authorName: 'غازي الشمري',
    authorHandle: '@ghazi_bd_ksa',
    stars: 6,
    comment: 'مكافآت شهرية مجزية وعقود واضحة وموثقة. تم تدريب فريقي بنجاح والدعم الفني ممتاز وسريع التجاوب.',
    createdAt: 'منذ 3 أيام',
    activityType: 'مطور أعمال BD'
  },
  {
    id: 'rev-29',
    authorName: 'سفيان بن حمودة',
    authorHandle: '@sofiane_tunisia',
    stars: 6,
    comment: 'خدمة شحن سريعة وموثوقة جداً في تونس وشمال أفريقيا. تجربة 6 نجوم ممتازة ونتطلع للمزيد من التحديثات.',
    createdAt: 'منذ 4 أيام',
    activityType: 'وكيل شحن معتمد'
  },
  {
    id: 'rev-30',
    authorName: 'دلال العنزي',
    authorHandle: '@dalal_alenazi_vip',
    stars: 6,
    comment: 'تفاعل رائع من الإدارة مع اقتراحات الأعضاء. الغرف الصوتية أصبحت أكثر متعة وأماناً، استمروا في هذا التميز.',
    createdAt: 'منذ 5 أيام',
    activityType: 'مستخدم VIP'
  },
  {
    id: 'rev-31',
    authorName: 'مروان الكردي',
    authorHandle: '@marwan_kurdi',
    stars: 6,
    comment: 'فريق المراجعة متعاون جداً وتم اعتماد وكالتنا خلال يوم واحد فقط بعد مطابقة الشروط الرسمية.',
    createdAt: 'منذ أسبوع',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-32',
    authorName: 'بدر الشهري',
    authorHandle: '@bader_shehri_vip',
    stars: 6,
    comment: 'خدمة راقية وهدايا مميزة في الرومات الصوتية ومستوى حماية عالي جداً ضد الإزعاج، شكراً لفريق العمل.',
    createdAt: 'منذ أسبوع',
    activityType: 'مستخدم VIP'
  },
  // 5-star comments (75% satisfaction tier)
  {
    id: 'rev-33',
    authorName: 'كريم طارق حسن الشناوي',
    authorHandle: '@karim_tech_bd',
    stars: 5,
    comment: 'تسجيل سهل وسريع بالنموذج المختصر. بانتظار استكمال بعض إجراءات التوثيق الرسمية للبدء في تشغيل فريقي بالكامل.',
    createdAt: 'منذ يومين',
    activityType: 'مطور أعمال BD'
  },
  {
    id: 'rev-34',
    authorName: 'إياد الحلبي',
    authorHandle: '@eyad_halabi',
    stars: 5,
    comment: 'منظومة واعدة جداً وخطوة ممتازة للصوتيات العربية، نتمنى إضافة بوابات دفع محلية إضافية لبعض الدول لتسهيل المعاملات أكثر.',
    createdAt: 'منذ 4 أيام',
    activityType: 'وكيل مضيفين'
  },
  {
    id: 'rev-35',
    authorName: 'شهد المنصوري',
    authorHandle: '@shahad_almansoori',
    stars: 5,
    comment: 'تجربة جيدة جداً في البث الصوتي وهناك تفاعل ممتاز من الداعمين والمشرفين، ونأمل زيادة عدد الفعاليات اليومية.',
    createdAt: 'منذ 5 أيام',
    activityType: 'صانعة محتوى صوتي'
  },
  {
    id: 'rev-36',
    authorName: 'وائل السعدي',
    authorHandle: '@wael_saadi_vip',
    stars: 5,
    comment: 'الخدمة ممتازة والدعم الفني يتجاوب بسرعة عند فتح التذاكر، لكن نتمنى تسريع إطلاق التحديث القادم للتطبيق.',
    createdAt: 'منذ أسبوع',
    activityType: 'مستخدم VIP'
  },
  // 4-star comments
  {
    id: 'rev-37',
    authorName: 'جابر المري',
    authorHandle: '@jaber_almarri_qa',
    stars: 4,
    comment: 'المنظومة جيدة ومتكاملة، ننتظر فقط مزيداً من الفعاليات الصوتية والمسابقات الأسبوعية للوكالات الجديدة.',
    createdAt: 'منذ أسبوع',
    activityType: 'مطور أعمال BD'
  },
  {
    id: 'rev-38',
    authorName: 'رزان الخطيب',
    authorHandle: '@razan_voice_jordan',
    stars: 4,
    comment: 'غرف صوتية جميلة والجمهور محترم. تجربة جيدة في المجمل والدعم الفني يجيب على الاستفسارات.',
    createdAt: 'منذ أسبوع',
    activityType: 'صانعة محتوى صوتي'
  },
  // 3-star comments (16% score tier)
  {
    id: 'rev-39',
    authorName: 'طلال البقمي',
    authorHandle: '@talal_alboqami',
    stars: 3,
    comment: 'التطبيق ممتاز وقوي، ولكن واجهت بعض التأخير البسيط في الرد عبر الواتساب في وقت الذروة، وتم حل استفساري لاحقاً باحترافية.',
    createdAt: 'منذ أسبوعين',
    activityType: 'مستخدم مسجل'
  },
  // 2-star comments (11% score tier)
  {
    id: 'rev-40',
    authorName: 'سليم التازي',
    authorHandle: '@salim_tazi_maroc',
    stars: 2,
    comment: 'واجهت بطء في استجابة الصوت عند الاتصال بشبكة 3G القديمة على هاتفي السابق، نتمنى تحسين استهلاك البيانات للأجهزة المتوسطة.',
    createdAt: 'منذ أسبوعين',
    activityType: 'مستخدم مسجل'
  },
  // 1-star comment (2% score tier)
  {
    id: 'rev-41',
    authorName: 'فهد المسعودي',
    authorHandle: '@fahad_almasoudi',
    stars: 1,
    comment: 'تم رفض طلبي المبدئي لرتبة سوبر أدمن لعدم توفر شرط 15 مطور أعمال BD. الشروط صارمة جداً، رغم أنني أتفهم حرص الإدارة على معايير الجودة العالية.',
    createdAt: 'منذ 3 أسابيع',
    activityType: 'متقدم سابق'
  }
];
