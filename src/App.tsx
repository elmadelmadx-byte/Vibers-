import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, Bell, Sparkles, Search, Phone, MessageCircle, Mail } from 'lucide-react';
import {
  BannerSlide,
  TeamApplication,
  UserRatingComment,
  LivePlatformStats,
  RoleId,
  StatCardCustomization,
  SubAdminAccount,
  ActiveAdminSession,
  ActivityShowcase,
  BroadcastNotification,
  ContactChannel,
  SupportTicket,
  TrashedApplication
} from './types';
import {
  INITIAL_BANNERS,
  INITIAL_ACTIVITIES,
  INITIAL_STATS,
  INITIAL_CUSTOMIZABLE_CARDS,
  INITIAL_APPLICATIONS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONTACT_CHANNELS,
  INITIAL_TICKETS
} from './data/initialData';
import { api } from './services/api';
import { HeroSlider } from './components/HeroSlider';
import { LiveStatsAndActivities } from './components/LiveStatsAndActivities';
import { TeamApplicationForm } from './components/TeamApplicationForm';
import { RatingsAndComments } from './components/RatingsAndComments';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { NotificationModal } from './components/NotificationModal';
import { ContactModal } from './components/ContactModal';
import { SearchCodeModal } from './components/SearchCodeModal';
import { SupportChatModal } from './components/SupportChatModal';

const STORAGE_KEYS = {
  BANNERS: 'vibers_v_banners_v2',
  APPLICATIONS: 'vibers_v_applications_v2',
  COMMENTS: 'vibers_v_comments_v2',
  BANNED_HANDLES: 'vibers_v_banned_handles_v2',
  STATS: 'vibers_v_stats_v2',
  CUSTOM_CARDS: 'vibers_v_custom_cards_v2'
};

export function App() {
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [applications, setApplications] = useState<TeamApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [comments, setComments] = useState<UserRatingComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [bannedHandles, setBannedHandles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNED_HANDLES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<LivePlatformStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [customCards, setCustomCards] = useState<StatCardCustomization[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMIZABLE_CARDS;
    } catch {
      return INITIAL_CUSTOMIZABLE_CARDS;
    }
  });

  const [activities, setActivities] = useState<ActivityShowcase[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_activities_v2');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [notifications, setNotifications] = useState<BroadcastNotification[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_notifs_v2');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [contactChannels, setContactChannels] = useState<ContactChannel[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_contacts_v2');
      return saved ? JSON.parse(saved) : INITIAL_CONTACT_CHANNELS;
    } catch {
      return INITIAL_CONTACT_CHANNELS;
    }
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_tickets_v2');
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [isRatingsLocked, setIsRatingsLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_ratings_locked_v2');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [trashedApplications, setTrashedApplications] = useState<TrashedApplication[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_trash_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [preselectedRole, setPreselectedRole] = useState<RoleId | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeAdminSession, setActiveAdminSession] = useState<ActiveAdminSession | null>(null);
  const [subAdmins, setSubAdmins] = useState<SubAdminAccount[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isSupportChatModalOpen, setIsSupportChatModalOpen] = useState(false);
  const [supportPrefilledCode, setSupportPrefilledCode] = useState('');
  const [welcomeToast, setWelcomeToast] = useState<BroadcastNotification | null>(null);
  const [liveNewAlert, setLiveNewAlert] = useState<string | null>(null);

  const prevApplicationsCountRef = useRef(applications.length);

  // Show welcome toast on session start
  useEffect(() => {
    const welcome = notifications.find((n) => n.type === 'welcome');
    if (welcome && !sessionStorage.getItem('vibers_welcomed')) {
      setWelcomeToast(welcome);
      sessionStorage.setItem('vibers_welcomed', 'true');
    }
  }, [notifications]);

  // Record daily active visit / login hit
  useEffect(() => {
    api.recordLoginHit();
  }, []);

  // 1. Initial Load & Background Polling for Real-Time Synchronization across any users/devices
  useEffect(() => {
    let isMounted = true;

    const fetchSync = async () => {
      const remote = await api.getState();
      if (!remote || !isMounted) return;

      if (Array.isArray(remote.applications)) {
        if (remote.applications.length > prevApplicationsCountRef.current) {
          const newest = remote.applications[0];
          if (newest && newest.realFullName) {
            setLiveNewAlert(`وصول طلب جديد الآن من: ${newest.realFullName} (${newest.nickname})!`);
            setTimeout(() => setLiveNewAlert(null), 6000);
          }
        }
        prevApplicationsCountRef.current = remote.applications.length;
        setApplications(remote.applications);
      }

      if (Array.isArray(remote.banners)) setBanners(remote.banners);
      if (Array.isArray(remote.activities)) setActivities(remote.activities);
      if (Array.isArray(remote.notifications)) setNotifications(remote.notifications);
      if (Array.isArray(remote.comments)) setComments(remote.comments);
      if (Array.isArray(remote.bannedHandles)) setBannedHandles(remote.bannedHandles);
      if (remote.stats) setStats(remote.stats);
      if (Array.isArray(remote.customCards)) setCustomCards(remote.customCards);
      if (Array.isArray(remote.subAdmins)) setSubAdmins(remote.subAdmins);
      if (Array.isArray(remote.contactChannels)) setContactChannels(remote.contactChannels);
      if (Array.isArray(remote.tickets)) setTickets(remote.tickets);
      if (typeof remote.isRatingsLocked === 'boolean') {
        setIsRatingsLocked(remote.isRatingsLocked);
      }
      if (Array.isArray(remote.trashedApplications)) {
        setTrashedApplications(remote.trashedApplications);
      }
    };

    fetchSync();
    // Poll every 3 seconds for instant real-time sync across any device or link visitor
    const interval = setInterval(fetchSync, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Sync to localStorage as resilient offline mirror
  useEffect(() => {
    try {
      localStorage.setItem('vibers_v_ratings_locked_v2', JSON.stringify(isRatingsLocked));
    } catch {}
  }, [isRatingsLocked]);

  useEffect(() => {
    try {
      localStorage.setItem('vibers_v_trash_v2', JSON.stringify(trashedApplications));
    } catch {}
  }, [trashedApplications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    } catch {}
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    } catch {}
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNED_HANDLES, JSON.stringify(bannedHandles));
    } catch {}
  }, [bannedHandles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(customCards));
    } catch {}
  }, [customCards]);

  const handleToggleRatingsLock = async (locked: boolean) => {
    setIsRatingsLocked(locked);
    try {
      localStorage.setItem('vibers_v_ratings_locked_v2', JSON.stringify(locked));
    } catch {}
    await api.toggleRatingsLock(locked);
  };

  const handleNavigate = (targetSelector: string) => {
    const el = document.querySelector(targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRoleAndScroll = (roleId: string) => {
    setPreselectedRole(roleId as RoleId);
    handleNavigate('#join-team');
  };

  // Application Submission Handler - Immediately persists to backend database
  const handleSubmitApplication = async (
    newApp: Omit<TeamApplication, 'id' | 'status' | 'submittedAt'>
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;

    const entry: TeamApplication = {
      ...newApp,
      id: `app-${Date.now()}`,
      status: newApp.registrationTrack === 'quick' ? 'waitlist' : 'pending',
      submittedAt: formattedDate
    };

    // Optimistic local update
    setApplications((prev) => [entry, ...prev]);
    prevApplicationsCountRef.current = prevApplicationsCountRef.current + 1;

    setStats((st) => ({
      ...st,
      officialRegistrations:
        newApp.registrationTrack === 'official'
          ? st.officialRegistrations + 1
          : st.officialRegistrations,
      quickRegistrations:
        newApp.registrationTrack === 'quick'
          ? st.quickRegistrations + 1
          : st.quickRegistrations
    }));

    // Post to server so it appears instantly for General Manager on any browser
    await api.submitApplication(entry);
  };

  // Admin Application Moderation Workflow
  const handleUpdateApplicationStatus = async (
    id: string,
    status: TeamApplication['status'],
    notes?: string,
    rating?: number
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        if (app.status !== 'approved' && status === 'approved') {
          setStats((st) => ({
            ...st,
            superAdmins: app.selectedRoles.includes('super_admin')
              ? st.superAdmins + 1
              : st.superAdmins,
            admins: app.selectedRoles.includes('admin') ? st.admins + 1 : st.admins,
            bds: app.selectedRoles.includes('bd') ? st.bds + 1 : st.bds,
            shippingAgents: app.selectedRoles.includes('shipping_agent')
              ? st.shippingAgents + 1
              : st.shippingAgents,
            hostAgents: app.selectedRoles.includes('host_agent')
              ? st.hostAgents + 1
              : st.hostAgents
          }));
        }

        return {
          ...app,
          status,
          moderationNotes: notes !== undefined ? notes : app.moderationNotes,
          candidateRating: rating !== undefined ? rating : app.candidateRating
        };
      })
    );

    await api.updateApplicationStatus(id, status, notes, rating);
  };

  const handleTrashApplication = async (id: string, reason?: string) => {
    const target = applications.find((a) => a.id === id);
    if (!target) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
    const trashed: TrashedApplication = {
      ...target,
      trashedAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      trashedReason: reason || (target.status === 'rejected' ? 'مرفوض من الإدارة' : 'نقل إلى سلة المهملات'),
      originalStatusBeforeTrash: target.status
    };
    setTrashedApplications((prev) => [trashed, ...prev]);
    await api.trashApplication(id, reason);
  };

  const handleTrashInactiveApplications = async () => {
    const inactive = applications.filter(
      (a) => a.status === 'rejected' || a.status === 'waitlist' || a.status === 'banned'
    );
    if (inactive.length === 0) return;
    const inactiveIds = new Set(inactive.map((a) => a.id));
    setApplications((prev) => prev.filter((a) => !inactiveIds.has(a.id)));
    const newlyTrashed: TrashedApplication[] = inactive.map((app) => ({
      ...app,
      trashedAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      trashedReason:
        app.status === 'rejected'
          ? 'مرفوض بقرار الإدارة'
          : app.status === 'banned'
          ? 'محظور من المنظومة'
          : 'غير نشط / قائمة الانتظار',
      originalStatusBeforeTrash: app.status
    }));
    setTrashedApplications((prev) => [...newlyTrashed, ...prev]);
    await api.trashInactiveApplications();
  };

  const handleRestoreTrashedApplication = async (id: string) => {
    const target = trashedApplications.find((a) => a.id === id);
    if (!target) return;
    setTrashedApplications((prev) => prev.filter((a) => a.id !== id));
    const { trashedAt, trashedReason, originalStatusBeforeTrash, ...originalApp } = target;
    const restoredApp: TeamApplication = {
      ...originalApp,
      status: originalStatusBeforeTrash || 'pending'
    };
    setApplications((prev) => [restoredApp, ...prev]);
    await api.restoreTrashedApplication(id);
  };

  const handleRestoreAllTrashed = async () => {
    if (trashedApplications.length === 0) return;
    const restoredItems: TeamApplication[] = trashedApplications.map((target) => {
      const { trashedAt, trashedReason, originalStatusBeforeTrash, ...originalApp } = target;
      return {
        ...originalApp,
        status: originalStatusBeforeTrash || 'pending'
      };
    });
    setApplications((prev) => [...restoredItems, ...prev]);
    setTrashedApplications([]);
    await api.restoreAllTrashed();
  };

  const handleDeleteTrashedPermanently = async (id: string) => {
    setTrashedApplications((prev) => prev.filter((a) => a.id !== id));
    await api.deleteTrashedPermanently(id);
  };

  const handleEmptyTrash = async () => {
    setTrashedApplications([]);
    await api.emptyTrash();
  };

  const handleDeleteApplication = async (id: string) => {
    await handleTrashApplication(id);
  };

  // Banner Management Handlers
  const handleAddBanner = async (bannerData: Omit<BannerSlide, 'id'>) => {
    const created: BannerSlide = {
      ...bannerData,
      id: `banner-${Date.now()}`
    };
    setBanners((prev) => [created, ...prev]);
    await api.addBanner(created);
  };

  const handleDeleteBanner = async (id: string) => {
    if (banners.length <= 1) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    await api.deleteBanner(id);
  };

  const handleUpdateBanner = async (id: string, updatedFields: Partial<BannerSlide>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
    await api.updateBanner(id, updatedFields);
  };

  // Sub-Admins Handlers
  const handleCreateSubAdmin = async (sub: Omit<SubAdminAccount, 'id' | 'createdAt'>) => {
    const created: SubAdminAccount = {
      ...sub,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSubAdmins((prev) => [created, ...prev]);
    await api.createSubAdmin(sub);
  };

  const handleDeleteSubAdmin = async (id: string) => {
    setSubAdmins((prev) => prev.filter((s) => s.id !== id));
    await api.deleteSubAdmin(id);
  };

  // Activities Management Handler (Full control over showcase images)
  const handleUpdateActivities = async (updated: ActivityShowcase[]) => {
    setActivities(updated);
    try {
      localStorage.setItem('vibers_v_activities_v2', JSON.stringify(updated));
    } catch {}
    await api.updateActivities(updated);
  };

  // Broadcast & Welcome Notification Handlers
  const handleSendBroadcast = async (
    notifData: Omit<BroadcastNotification, 'id' | 'createdAt' | 'isActive'>
  ) => {
    const created: BroadcastNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: 'الآن',
      isActive: true
    };
    setNotifications((prev) => [created, ...prev]);
    setWelcomeToast(created);
    await api.sendBroadcastNotification(created);
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await api.deleteBroadcastNotification(id);
  };

  // Comments & Ratings Handlers
  const handleAddComment = async (entry: {
    authorName: string;
    authorHandle: string;
    stars: number;
    comment: string;
    activityType: string;
    imageUrl?: string;
  }) => {
    const created: UserRatingComment = {
      id: `rev-${Date.now()}`,
      authorName: entry.authorName,
      authorHandle: entry.authorHandle,
      stars: entry.stars,
      comment: entry.comment,
      activityType: entry.activityType,
      imageUrl: entry.imageUrl,
      createdAt: 'الآن'
    };
    setComments((prev) => [created, ...prev]);
    await api.addComment(created);
  };

  const handleDeleteComment = async (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    await api.deleteComment(id);
  };

  const handleBanUserByComment = async (commentId: string, authorHandle: string) => {
    const normalized = authorHandle.toLowerCase();
    if (!bannedHandles.includes(normalized)) {
      setBannedHandles((prev) => [...prev, normalized]);
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId || c.authorHandle.toLowerCase() === normalized
          ? { ...c, isBannedUser: true }
          : c
      )
    );
    await api.banUser(commentId, authorHandle);
  };

  const handleUnbanHandle = async (handle: string) => {
    const normalized = handle.toLowerCase();
    setBannedHandles((prev) => prev.filter((h) => h !== normalized));
    setComments((prev) =>
      prev.map((c) =>
        c.authorHandle.toLowerCase() === normalized ? { ...c, isBannedUser: false } : c
      )
    );
    await api.unbanUser(handle);
  };

  // Update stat cards customization from manager panel
  const handleUpdateCardCustomization = async (updated: StatCardCustomization[]) => {
    setCustomCards(updated);
    await api.updateCustomCards(updated);
  };

  // Contact Channels handler
  const handleUpdateContactChannels = async (updated: ContactChannel[]) => {
    setContactChannels(updated);
    await api.updateContactChannels(updated);
  };

  // Submit User Grievance / Ticket
  const handleSubmitTicket = async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const created = await api.submitTicket(ticket);
    if (created) {
      setTickets((prev) => [created, ...prev]);
      return true;
    }
    return false;
  };

  const handleUpdateTicketStatus = async (
    id: string,
    status: SupportTicket['status'],
    adminReply?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, adminReply: adminReply || t.adminReply } : t))
    );
    await api.updateTicketStatus(id, status, adminReply);
  };

  const handleDeleteTicket = async (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    await api.deleteTicket(id);
  };

  const openExecutiveAccess = () => {
    if (isAdminAuthenticated && activeAdminSession) {
      setIsDashboardModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100">
      {/* Live Incoming Application Banner Notification */}
      {liveNewAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 p-0.5 animate-pulse sticky top-0 z-50">
          <div className="bg-[#0B0F1C] px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-300 text-xs sm:text-sm font-bold">
              <Bell className="w-4 h-4 animate-bounce text-amber-400" />
              <span>{liveNewAlert}</span>
            </div>
            <button
              type="button"
              onClick={openExecutiveAccess}
              className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-lg font-bold cursor-pointer whitespace-nowrap"
            >
              فتح لوحة التحكم فوراً
            </button>
          </div>
        </div>
      )}

      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-40 h-16 bg-[#070913]/90 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <a
          href="#"
          className="text-lg sm:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>Vibers V Global</span>
          {pendingAppsCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono-num font-bold cursor-pointer"
              onClick={openExecutiveAccess}
              title="طلبات انضمام جديدة بانتظار المدير"
            >
              {pendingAppsCount} طلب جديد
            </span>
          )}
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#stats"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            الإحصائيات المباشرة
          </a>
          <a
            href="#activities"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            أنشطة الشركة
          </a>
          <a
            href="#leadership"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            هيكل القيادة
          </a>
          <a
            href="#join-team"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            بوابة التسجيل (100% / 50%)
          </a>
          <a
            href="#reviews"
            className="hover:text-white hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            التقييمات الملكية
          </a>
        </nav>

        {/* Zone 3: Actions & Quick Icons (Search Code, WhatsApp Numbers, Chat Support, Bell, Join CTA) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Top Search Code Icon (Direct User Requirement: search by tracking code in top bar) */}
          <button
            type="button"
            onClick={() => {
              setSearchInitialQuery('');
              setIsSearchModalOpen(true);
            }}
            aria-label="الاستعلام والبحث بكود التسجيل"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
            title="الاستعلام بكود الطلب (مقبول / قيد الانتظار / مرفوض)"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline text-xs font-semibold">بحث بكود الطلب</span>
          </button>

          {/* Top WhatsApp Numbers Icon (Direct User Requirement: fixed WhatsApp numbers updatable from admin) */}
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            aria-label="أرقام الواتساب المعتمدة (+201065874461 / +201066934250)"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
            title="أرقام الواتساب الرسمية: +201065874461 / +201066934250"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline text-xs font-semibold">أرقام الواتساب الرسمية</span>
          </button>

          {/* Top Support Chat Icon (Direct User Requirement: chat connected to admin dashboard) */}
          <button
            type="button"
            onClick={() => setIsSupportChatModalOpen(true)}
            aria-label="الدردشة والدعم المباشر"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
            title="مراسلة الإدارة وإرسال شكوى أو مشكلة"
          >
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden xl:inline text-xs font-semibold">دردشة وشكاوى</span>
          </button>

          {/* Top Admin Dashboard Access Icon */}
          <button
            type="button"
            onClick={openExecutiveAccess}
            aria-label="تسجيل الدخول إلى لوحة الإدارة"
            className="p-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 hover:from-amber-500/25 hover:to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="تسجيل الدخول إلى لوحة الإدارة"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline text-xs font-bold">لوحة الإدارة</span>
            {pendingAppsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white font-mono-num font-bold text-[9px] flex items-center justify-center">
                {pendingAppsCount}
              </span>
            )}
          </button>

          {/* Notification Bell Button */}
          <button
            type="button"
            onClick={() => setIsNotificationModalOpen(true)}
            aria-label="مركز الإشعارات والترحيب"
            className="relative p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="الإشعارات ورسائل الترحيب الملكية"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-mono-num font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          <a
            href="#join-team"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-blue-600/20"
          >
            تقديم طلب
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Interactive Promotional Hero Banner Slider */}
        <HeroSlider banners={banners} onNavigate={handleNavigate} />

        {/* Live Dynamic Counters & Activities with Manager Customizable Cards */}
        <LiveStatsAndActivities
          stats={stats}
          activities={activities}
          customCards={customCards}
          onSelectRoleAndScroll={handleSelectRoleAndScroll}
        />

        {/* Dual-Track Team Joining Form (Official 100% vs Quick 50%) */}
        <TeamApplicationForm
          preselectedRole={preselectedRole}
          onSubmitApplication={handleSubmitApplication}
          onOpenSearchModal={(code) => {
            setSearchInitialQuery(code);
            setIsSearchModalOpen(true);
          }}
        />

        {/* 1-to-7 Stars Rating & Comments Section */}
        <RatingsAndComments
          comments={comments}
          bannedHandles={bannedHandles}
          isRatingsLocked={isRatingsLocked}
          onAddComment={handleAddComment}
        />
      </main>

      {/* Floating Action Buttons Dock */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Independent Admin Login Button (Directly requested: ايقونه تسجيل الدخول الى لوحه الاداره فوق مراسله الاداره للشكاوي ايقونه خاصه بها ومستقله) */}
        <button
          type="button"
          onClick={openExecutiveAccess}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-amber-950/70 flex items-center gap-2 cursor-pointer border border-amber-300/80 transition-all hover:scale-105 active:scale-95 group"
          title="تسجيل الدخول إلى لوحة الإدارة (المدير العام عيون Prince)"
          aria-label="تسجيل الدخول إلى لوحة الإدارة"
        >
          <div className="w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center shrink-0">
            {isAdminAuthenticated && activeAdminSession ? (
              <ShieldCheck className="w-4 h-4 text-slate-950" />
            ) : (
              <Lock className="w-4 h-4 text-slate-950" />
            )}
          </div>
          <span>
            {isAdminAuthenticated && activeAdminSession
              ? `لوحة الإدارة (${activeAdminSession.name})`
              : 'تسجيل الدخول إلى لوحة الإدارة'}
          </span>
          {pendingAppsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-mono-num font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
              {pendingAppsCount}
            </span>
          )}
        </button>

        {/* Floating Support Chat & Complaints Button */}
        <button
          type="button"
          onClick={() => setIsSupportChatModalOpen(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-900/60 flex items-center gap-2 cursor-pointer border border-cyan-400/40 transition-transform hover:scale-105"
          title="الدردشة ومراسلة الإدارة وإرسال الشكاوى"
        >
          <MessageCircle className="w-5 h-5 text-white animate-pulse" />
          <span>مراسلة الإدارة والشكاوى</span>
        </button>
      </div>

      {/* Quiet Footer with Discreet Bottom-Left General Manager Login */}
      <footer className="border-t border-slate-800/80 bg-[#05070F] py-10 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-base font-bold text-white">
              Vibers V العالمية لتنمية التطبيقات ودعم تطبيقات الدردشة الصوتية
            </div>
            <p className="text-xs text-slate-400">
              المدير العام والمدير التنفيذي: <span className="text-amber-400 font-semibold">عيون Prince</span> · جميع الحقوق محفوظة © {new Date().getFullYear()}
            </p>
            {/* Official Phone Numbers Display */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="text-slate-400 font-semibold">الأرقام الرسمية:</span>
              <a
                href="https://wa.me/201065874461"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono-num font-bold hover:bg-emerald-900/50 transition-colors"
                dir="ltr"
                title="واتساب الخط الرسمي 1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                +201065874461
              </a>
              <a
                href="https://wa.me/201066934250"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono-num font-bold hover:bg-slate-800 transition-colors"
                dir="ltr"
                title="واتساب الخط الرسمي 2"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                +201066934250
              </a>
              <a
                href="mailto:vibersvge@gmail.com"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-300 font-mono-num hover:bg-blue-900/50 transition-colors"
                dir="ltr"
                title="البريد الرسمي"
              >
                <Mail className="w-3 h-3 text-blue-400" />
                vibersvge@gmail.com
              </a>
            </div>
          </div>

          {/* Discreet General Manager Login */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button
              type="button"
              onClick={openExecutiveAccess}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-400 hover:text-amber-300 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="الدخول الخاص بالمدير العام عيون Prince"
            >
              {isAdminAuthenticated && activeAdminSession ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    لوحة التحكم ({activeAdminSession.name} - {pendingAppsCount} بانتظار الإجراء)
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>دخول الإدارة العليا</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* General Manager & Sub-Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        subAdmins={subAdmins}
        onSuccessLogin={(session) => {
          setActiveAdminSession(session);
          setIsAdminAuthenticated(true);
          setIsLoginModalOpen(false);
          setIsDashboardModalOpen(true);
        }}
      />

      {/* Notifications & Live Welcome Broadcast Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        session={activeAdminSession}
        onSendBroadcast={handleSendBroadcast}
        onDeleteNotification={handleDeleteNotification}
      />

      {/* Official WhatsApp Numbers Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactChannels={contactChannels}
        onOpenSupportModal={() => setIsSupportChatModalOpen(true)}
      />

      {/* Search Code Status & Verification Modal */}
      <SearchCodeModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        applications={applications}
        contactChannels={contactChannels}
        initialQuery={searchInitialQuery}
        onOpenSupportModal={(code) => {
          setSupportPrefilledCode(code || '');
          setIsSupportChatModalOpen(true);
        }}
      />

      {/* User Grievance & In-Site Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportChatModalOpen}
        onClose={() => setIsSupportChatModalOpen(false)}
        contactChannels={contactChannels}
        onSubmitTicket={handleSubmitTicket}
        prefilledCode={supportPrefilledCode}
      />

      {/* Floating Welcome Reassurance Toast for Incoming Users */}
      {welcomeToast && (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md bg-[#0F1424] border-2 border-amber-500/60 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>{welcomeToast.title}</span>
              </h5>
              <button
                type="button"
                onClick={() => setWelcomeToast(null)}
                className="text-slate-500 hover:text-white p-1 text-xs cursor-pointer"
                title="إغلاق التنبيه"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">{welcomeToast.message}</p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setWelcomeToast(null);
                  setIsNotificationModalOpen(true);
                }}
                className="text-[11px] text-amber-400 hover:underline font-bold cursor-pointer"
              >
                فتح مركز الإشعارات
              </button>
              <span className="text-[10px] text-slate-500">من: {welcomeToast.senderName}</span>
            </div>
          </div>
        </div>
      )}

      {/* General Manager & Sub-Admins Executive Control Panel Modal */}
      {activeAdminSession && (
        <AdminDashboardModal
          isOpen={isDashboardModalOpen}
          onClose={() => setIsDashboardModalOpen(false)}
          onLogout={() => {
            setIsAdminAuthenticated(false);
            setActiveAdminSession(null);
            setIsDashboardModalOpen(false);
          }}
          session={activeAdminSession}
          banners={banners}
          onAddBanner={handleAddBanner}
          onDeleteBanner={handleDeleteBanner}
          onUpdateBanner={handleUpdateBanner}
          activities={activities}
          onUpdateActivities={handleUpdateActivities}
          notifications={notifications}
          onSendBroadcast={handleSendBroadcast}
          onDeleteNotification={handleDeleteNotification}
          applications={applications}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onDeleteApplication={handleDeleteApplication}
          comments={comments}
          bannedHandles={bannedHandles}
          onDeleteComment={handleDeleteComment}
          onBanUserByComment={handleBanUserByComment}
          onUnbanHandle={handleUnbanHandle}
          customCards={customCards}
          onUpdateCardCustomization={handleUpdateCardCustomization}
          subAdmins={subAdmins}
          onCreateSubAdmin={handleCreateSubAdmin}
          onDeleteSubAdmin={handleDeleteSubAdmin}
          dailyActiveLogins={stats.dailyActiveLogins || 42890}
          contactChannels={contactChannels}
          onUpdateContactChannels={handleUpdateContactChannels}
          tickets={tickets}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onDeleteTicket={handleDeleteTicket}
          isRatingsLocked={isRatingsLocked}
          onToggleRatingsLock={handleToggleRatingsLock}
          trashedApplications={trashedApplications}
          onTrashApplication={handleTrashApplication}
          onTrashInactiveApplications={handleTrashInactiveApplications}
          onRestoreTrashedApplication={handleRestoreTrashedApplication}
          onRestoreAllTrashed={handleRestoreAllTrashed}
          onDeleteTrashedPermanently={handleDeleteTrashedPermanently}
          onEmptyTrash={handleEmptyTrash}
        />
      )}
    </div>
  );
}

export default App;
