import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
} from './src/data/initialData';
import {
  TeamApplication,
  BannerSlide,
  ActivityShowcase,
  UserRatingComment,
  LivePlatformStats,
  StatCardCustomization,
  SubAdminAccount,
  BroadcastNotification,
  ContactChannel,
  SupportTicket,
  TrashedApplication
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  applications: TeamApplication[];
  banners: BannerSlide[];
  activities: ActivityShowcase[];
  notifications: BroadcastNotification[];
  comments: UserRatingComment[];
  bannedHandles: string[];
  stats: LivePlatformStats;
  customCards: StatCardCustomization[];
  subAdmins: SubAdminAccount[];
  contactChannels: ContactChannel[];
  tickets: SupportTicket[];
  isRatingsLocked: boolean;
  trashedApplications: TrashedApplication[];
}

const DEFAULT_SUB_ADMINS: SubAdminAccount[] = [
  {
    id: 'sub-1',
    name: 'مساعد العمليات والمراجعة',
    email: 'ops@vibersv.com',
    password: 'VibersOps2026@',
    roleTitle: 'مشرف مراجعة الطلبات والتقييمات',
    permissions: {
      canApproveApplicants: true,
      canRejectApplicants: true,
      canBanUsers: false,
      canDeleteReviews: false,
      canEditBanners: false,
      canViewStatsOnly: false,
      canEvaluateCandidates: true
    },
    createdAt: '2026-10-10'
  }
];

// Initialize directory and database
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        applications: parsed.applications || INITIAL_APPLICATIONS,
        banners: parsed.banners || INITIAL_BANNERS,
        activities: parsed.activities || INITIAL_ACTIVITIES,
        notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
        comments:
          parsed.comments && parsed.comments.length >= 20
            ? parsed.comments
            : INITIAL_COMMENTS,
        bannedHandles: parsed.bannedHandles || [],
        stats: {
          ...INITIAL_STATS,
          ...(parsed.stats || {}),
          // Ensure exact counts requested by user are set
          activeUsers: parsed.stats?.activeUsers && parsed.stats.activeUsers >= 2750000 ? parsed.stats.activeUsers : INITIAL_STATS.activeUsers,
          hostAgencies: INITIAL_STATS.hostAgencies,
          totalHosts: INITIAL_STATS.totalHosts,
          superAdmins: INITIAL_STATS.superAdmins,
          admins: INITIAL_STATS.admins,
          bds: INITIAL_STATS.bds,
          shippingAgents: INITIAL_STATS.shippingAgents,
          dailyActiveLogins: parsed.stats?.dailyActiveLogins || 42890
        },
        customCards: parsed.customCards || INITIAL_CUSTOMIZABLE_CARDS,
        subAdmins: parsed.subAdmins || DEFAULT_SUB_ADMINS,
        contactChannels:
          parsed.contactChannels &&
          parsed.contactChannels.some((c: any) => c.value === '+201065874461')
            ? parsed.contactChannels
            : INITIAL_CONTACT_CHANNELS,
        tickets: parsed.tickets || INITIAL_TICKETS,
        isRatingsLocked: typeof parsed.isRatingsLocked === 'boolean' ? parsed.isRatingsLocked : false,
        trashedApplications: parsed.trashedApplications || []
      };
    }
  } catch (err) {
    console.error('Error loading db.json:', err);
  }

  const initialDb: DatabaseSchema = {
    applications: INITIAL_APPLICATIONS,
    banners: INITIAL_BANNERS,
    activities: INITIAL_ACTIVITIES,
    notifications: INITIAL_NOTIFICATIONS,
    comments: INITIAL_COMMENTS,
    bannedHandles: [],
    stats: INITIAL_STATS,
    customCards: INITIAL_CUSTOMIZABLE_CARDS,
    subAdmins: DEFAULT_SUB_ADMINS,
    contactChannels: INITIAL_CONTACT_CHANNELS,
    tickets: INITIAL_TICKETS,
    isRatingsLocked: false,
    trashedApplications: []
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // --- API ROUTES ---

  // 1. Get full state
  app.get('/api/state', (_req, res) => {
    res.json(db);
  });

  // Track daily login hit
  app.post('/api/stats/login-hit', (_req, res) => {
    db.stats.dailyActiveLogins = (db.stats.dailyActiveLogins || 3420) + 1;
    saveDatabase(db);
    res.json({ success: true, dailyActiveLogins: db.stats.dailyActiveLogins });
  });

  // 2. Sub-Admin Accounts management (Only General Manager has master access)
  app.get('/api/sub-admins', (_req, res) => {
    res.json(db.subAdmins);
  });

  app.post('/api/sub-admins', (req, res) => {
    const { name, email, password, roleTitle, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required sub-admin fields' });
    }

    const newSub: SubAdminAccount = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      roleTitle: roleTitle?.trim() || 'مشرف معتمد',
      permissions: permissions || {
        canApproveApplicants: false,
        canRejectApplicants: false,
        canBanUsers: false,
        canDeleteReviews: false,
        canEditBanners: false,
        canViewStatsOnly: true,
        canEvaluateCandidates: false
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.subAdmins = [newSub, ...db.subAdmins];
    saveDatabase(db);
    res.status(201).json({ success: true, subAdmin: newSub });
  });

  app.put('/api/sub-admins/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password, roleTitle, permissions } = req.body;

    db.subAdmins = db.subAdmins.map((sub) => {
      if (sub.id !== id) return sub;
      return {
        ...sub,
        name: name !== undefined ? name : sub.name,
        email: email !== undefined ? email.toLowerCase() : sub.email,
        password: password !== undefined ? password : sub.password,
        roleTitle: roleTitle !== undefined ? roleTitle : sub.roleTitle,
        permissions: permissions !== undefined ? permissions : sub.permissions
      };
    });

    saveDatabase(db);
    res.json({ success: true, subAdmins: db.subAdmins });
  });

  app.delete('/api/sub-admins/:id', (req, res) => {
    const { id } = req.params;
    db.subAdmins = db.subAdmins.filter((s) => s.id !== id);
    saveDatabase(db);
    res.json({ success: true, id });
  });

  // 3. Applications
  app.get('/api/applications', (_req, res) => {
    res.json(db.applications);
  });

  app.post('/api/applications', (req, res) => {
    const newApp: TeamApplication = req.body;
    if (!newApp || !newApp.realFullName) {
      return res.status(400).json({ error: 'Missing applicant data' });
    }

    // Insert at front
    db.applications = [newApp, ...db.applications];

    // Update registration counters
    if (newApp.registrationTrack === 'official') {
      db.stats.officialRegistrations = (db.stats.officialRegistrations || 0) + 1;
    } else {
      db.stats.quickRegistrations = (db.stats.quickRegistrations || 0) + 1;
    }

    saveDatabase(db);
    res.status(201).json({ success: true, application: newApp, stats: db.stats });
  });

  app.put('/api/applications/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, moderationNotes, candidateRating } = req.body;

    let updatedApp: TeamApplication | null = null;
    db.applications = db.applications.map((app) => {
      if (app.id !== id) return app;

      if (app.status !== 'approved' && status === 'approved') {
        if (app.selectedRoles.includes('super_admin')) db.stats.superAdmins++;
        if (app.selectedRoles.includes('admin')) db.stats.admins++;
        if (app.selectedRoles.includes('bd')) db.stats.bds++;
        if (app.selectedRoles.includes('shipping_agent')) db.stats.shippingAgents++;
        if (app.selectedRoles.includes('host_agent')) db.stats.hostAgents++;
      }

      updatedApp = {
        ...app,
        status,
        moderationNotes: moderationNotes !== undefined ? moderationNotes : app.moderationNotes,
        candidateRating: candidateRating !== undefined ? candidateRating : app.candidateRating
      };
      return updatedApp;
    });

    saveDatabase(db);
    res.json({ success: true, application: updatedApp, stats: db.stats });
  });

  // Move application to Trash (سلة المهملات)
  app.post('/api/applications/:id/trash', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body || {};
    const target = db.applications.find((a) => a.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Application not found' });
    }

    db.applications = db.applications.filter((a) => a.id !== id);
    const trashedItem: TrashedApplication = {
      ...target,
      trashedAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      trashedReason: reason || (target.status === 'rejected' ? 'مرفوض من الإدارة' : 'نقل إلى سلة المهملات'),
      originalStatusBeforeTrash: target.status
    };

    db.trashedApplications = [trashedItem, ...(db.trashedApplications || [])];
    saveDatabase(db);
    res.json({
      success: true,
      applications: db.applications,
      trashedApplications: db.trashedApplications,
      trashedItem
    });
  });

  // Bulk move rejected & inactive candidates to trash
  app.post('/api/applications/trash-inactive', (_req, res) => {
    const inactiveList = db.applications.filter(
      (a) => a.status === 'rejected' || a.status === 'waitlist' || a.status === 'banned'
    );
    if (inactiveList.length === 0) {
      return res.json({
        success: true,
        movedCount: 0,
        applications: db.applications,
        trashedApplications: db.trashedApplications
      });
    }

    const inactiveIds = new Set(inactiveList.map((a) => a.id));
    db.applications = db.applications.filter((a) => !inactiveIds.has(a.id));

    const newlyTrashed: TrashedApplication[] = inactiveList.map((app) => ({
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

    db.trashedApplications = [...newlyTrashed, ...(db.trashedApplications || [])];
    saveDatabase(db);
    res.json({
      success: true,
      movedCount: newlyTrashed.length,
      applications: db.applications,
      trashedApplications: db.trashedApplications
    });
  });

  // Restore application from Trash back to active list (زر الاسترجاع)
  app.post('/api/trash/:id/restore', (req, res) => {
    const { id } = req.params;
    const target = (db.trashedApplications || []).find((a) => a.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Trashed application not found' });
    }

    db.trashedApplications = (db.trashedApplications || []).filter((a) => a.id !== id);

    // Extract original application data
    const { trashedAt, trashedReason, originalStatusBeforeTrash, ...originalApp } = target;
    const restoredApp: TeamApplication = {
      ...originalApp,
      status: originalStatusBeforeTrash || 'pending'
    };

    db.applications = [restoredApp, ...db.applications];
    saveDatabase(db);
    res.json({
      success: true,
      restoredApp,
      applications: db.applications,
      trashedApplications: db.trashedApplications
    });
  });

  // Restore ALL applications from Trash back to active list (استرجاع كافة المحذوفات)
  app.post('/api/trash/restore-all', (_req, res) => {
    if (!db.trashedApplications || db.trashedApplications.length === 0) {
      return res.json({ success: true, restoredCount: 0, applications: db.applications, trashedApplications: [] });
    }

    const restoredItems: TeamApplication[] = db.trashedApplications.map((target) => {
      const { trashedAt, trashedReason, originalStatusBeforeTrash, ...originalApp } = target;
      return {
        ...originalApp,
        status: originalStatusBeforeTrash || 'pending'
      };
    });

    db.applications = [...restoredItems, ...db.applications];
    db.trashedApplications = [];
    saveDatabase(db);
    res.json({
      success: true,
      restoredCount: restoredItems.length,
      applications: db.applications,
      trashedApplications: []
    });
  });

  // Permanently delete single item from trash
  app.delete('/api/trash/:id', (req, res) => {
    const { id } = req.params;
    db.trashedApplications = (db.trashedApplications || []).filter((a) => a.id !== id);
    saveDatabase(db);
    res.json({ success: true, trashedApplications: db.trashedApplications });
  });

  // Empty entire Trash Can
  app.delete('/api/trash', (_req, res) => {
    db.trashedApplications = [];
    saveDatabase(db);
    res.json({ success: true, trashedApplications: [] });
  });

  // Fallback direct delete
  app.delete('/api/applications/:id', (req, res) => {
    const { id } = req.params;
    const target = db.applications.find((a) => a.id === id);
    if (target) {
      db.applications = db.applications.filter((a) => a.id !== id);
      db.trashedApplications = [
        {
          ...target,
          trashedAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
          trashedReason: 'حذف ونقل للسلة',
          originalStatusBeforeTrash: target.status
        },
        ...(db.trashedApplications || [])
      ];
    }
    saveDatabase(db);
    res.json({ success: true, applications: db.applications, trashedApplications: db.trashedApplications });
  });

  // 4. Comments & Ratings
  app.get('/api/comments', (_req, res) => {
    res.json({ comments: db.comments, bannedHandles: db.bannedHandles });
  });

  app.post('/api/comments', (req, res) => {
    const newComment: UserRatingComment = req.body;
    if (!newComment || !newComment.authorName || !newComment.comment) {
      return res.status(400).json({ error: 'Missing comment fields' });
    }

    const normalizedHandle = (newComment.authorHandle || '').toLowerCase();
    if (db.bannedHandles.includes(normalizedHandle)) {
      return res.status(403).json({ error: 'This user handle is banned from posting comments.' });
    }

    db.comments = [newComment, ...db.comments];
    saveDatabase(db);
    res.status(201).json({ success: true, comment: newComment });
  });

  app.delete('/api/comments/:id', (req, res) => {
    const { id } = req.params;
    db.comments = db.comments.filter((c) => c.id !== id);
    saveDatabase(db);
    res.json({ success: true, id });
  });

  app.post('/api/comments/ban', (req, res) => {
    const { commentId, authorHandle } = req.body;
    const normalized = (authorHandle || '').toLowerCase();
    if (normalized && !db.bannedHandles.includes(normalized)) {
      db.bannedHandles.push(normalized);
    }
    db.comments = db.comments.map((c) =>
      c.id === commentId || c.authorHandle.toLowerCase() === normalized
        ? { ...c, isBannedUser: true }
        : c
    );
    saveDatabase(db);
    res.json({ success: true, bannedHandles: db.bannedHandles });
  });

  app.post('/api/comments/unban', (req, res) => {
    const { authorHandle } = req.body;
    const normalized = (authorHandle || '').toLowerCase();
    db.bannedHandles = db.bannedHandles.filter((h) => h !== normalized);
    db.comments = db.comments.map((c) =>
      c.authorHandle.toLowerCase() === normalized ? { ...c, isBannedUser: false } : c
    );
    saveDatabase(db);
    res.json({ success: true, bannedHandles: db.bannedHandles });
  });

  // Lock / Unlock Reviews and Ratings Display
  app.put('/api/ratings-lock', (req, res) => {
    const { isRatingsLocked } = req.body;
    db.isRatingsLocked = Boolean(isRatingsLocked);
    saveDatabase(db);
    res.json({ success: true, isRatingsLocked: db.isRatingsLocked });
  });

  // 5. Banners (Full text & image editing)
  app.get('/api/banners', (_req, res) => {
    res.json(db.banners);
  });

  app.post('/api/banners', (req, res) => {
    const banner: BannerSlide = req.body;
    db.banners = [banner, ...db.banners];
    saveDatabase(db);
    res.status(201).json({ success: true, banner });
  });

  app.put('/api/banners/:id', (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;
    db.banners = db.banners.map((b) => (b.id === id ? { ...b, ...updatedFields } : b));
    saveDatabase(db);
    res.json({ success: true, banners: db.banners });
  });

  app.delete('/api/banners/:id', (req, res) => {
    const { id } = req.params;
    if (db.banners.length > 1) {
      db.banners = db.banners.filter((b) => b.id !== id);
      saveDatabase(db);
    }
    res.json({ success: true, banners: db.banners });
  });

  // 6. Stat Cards Customization
  app.get('/api/custom-cards', (_req, res) => {
    res.json(db.customCards);
  });

  app.put('/api/custom-cards', (req, res) => {
    const { customCards } = req.body;
    if (Array.isArray(customCards)) {
      db.customCards = customCards;
      saveDatabase(db);
    }
    res.json({ success: true, customCards: db.customCards });
  });

  // 7. Broadcast Welcome & Notifications
  app.get('/api/notifications', (_req, res) => {
    res.json(db.notifications || []);
  });

  app.post('/api/notifications', (req, res) => {
    const notif: BroadcastNotification = req.body;
    if (!notif || !notif.message) {
      return res.status(400).json({ error: 'Missing notification body' });
    }
    const created: BroadcastNotification = {
      id: notif.id || `notif-${Date.now()}`,
      title: notif.title || 'إشعار ترحيبي من الإدارة العليا',
      message: notif.message,
      senderName: notif.senderName || 'المدير العام عيون Prince',
      type: notif.type || 'welcome',
      createdAt: notif.createdAt || 'الآن',
      isActive: true
    };
    db.notifications = [created, ...(db.notifications || [])];
    saveDatabase(db);
    res.status(201).json({ success: true, notification: created, notifications: db.notifications });
  });

  app.delete('/api/notifications/:id', (req, res) => {
    const { id } = req.params;
    db.notifications = (db.notifications || []).filter((n) => n.id !== id);
    saveDatabase(db);
    res.json({ success: true, notifications: db.notifications });
  });

  // 8. Activities & Images Showcase Customization
  app.get('/api/activities', (_req, res) => {
    res.json(db.activities || []);
  });

  app.put('/api/activities', (req, res) => {
    const { activities } = req.body;
    if (Array.isArray(activities)) {
      db.activities = activities;
      saveDatabase(db);
    }
    res.json({ success: true, activities: db.activities });
  });

  // 9. Update Live Stats directly
  app.put('/api/stats', (req, res) => {
    const { stats } = req.body;
    if (stats) {
      db.stats = { ...db.stats, ...stats };
      saveDatabase(db);
    }
    res.json({ success: true, stats: db.stats });
  });

  // 10. Official Management Contact Channels (WhatsApp & Email Management)
  app.get('/api/contact-channels', (_req, res) => {
    res.json(db.contactChannels || INITIAL_CONTACT_CHANNELS);
  });

  app.put('/api/contact-channels', (req, res) => {
    const { channels } = req.body;
    if (Array.isArray(channels)) {
      db.contactChannels = channels;
      saveDatabase(db);
    }
    res.json({ success: true, contactChannels: db.contactChannels });
  });

  // 11. Support Tickets & User Grievance Requests (Integrated Chat / Support Hub)
  app.get('/api/tickets', (_req, res) => {
    res.json(db.tickets || []);
  });

  app.post('/api/tickets', (req, res) => {
    const ticket: SupportTicket = req.body;
    if (!ticket || !ticket.applicantOrUserName || !ticket.whatsappOrEmail || !ticket.problemDescription) {
      return res.status(400).json({ error: 'Missing mandatory ticket fields' });
    }

    const created: SupportTicket = {
      id: ticket.id || `tkt-${Date.now()}`,
      trackingCode: ticket.trackingCode || `VBR-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantOrUserName: ticket.applicantOrUserName.trim(),
      realFullNameOptional: ticket.realFullNameOptional?.trim() || undefined,
      role: ticket.role || 'عضو / متقدم',
      whatsappOrEmail: ticket.whatsappOrEmail.trim(),
      problemDescription: ticket.problemDescription.trim(),
      reasonOrDetails: ticket.reasonOrDetails?.trim() || '',
      status: 'new',
      createdAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      adminReply: undefined
    };

    db.tickets = [created, ...(db.tickets || [])];
    saveDatabase(db);
    res.status(201).json({ success: true, ticket: created, tickets: db.tickets });
  });

  app.put('/api/tickets/:id', (req, res) => {
    const { id } = req.params;
    const { status, adminReply } = req.body;
    db.tickets = (db.tickets || []).map((t) => {
      if (t.id !== id) return t;
      return {
        ...t,
        status: status !== undefined ? status : t.status,
        adminReply: adminReply !== undefined ? adminReply : t.adminReply
      };
    });
    saveDatabase(db);
    res.json({ success: true, tickets: db.tickets });
  });

  app.delete('/api/tickets/:id', (req, res) => {
    const { id } = req.params;
    db.tickets = (db.tickets || []).filter((t) => t.id !== id);
    saveDatabase(db);
    res.json({ success: true, tickets: db.tickets });
  });

  // --- VITE MIDDLEWARE ---
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vibers V Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
