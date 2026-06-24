"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;

  const links = [
    {
      label: "Main",
      items: [
        { href: "/admin", icon: "📊", text: "Dashboard" },
        { href: "/admin/slides", icon: "🖼️", text: "Homepage Slides" },
        // INI TAMBAHAN MENU BARUNYA:
        { href: "/admin/messages", icon: "📬", text: "Inbox Pesan" },
      ],
    },
    {
      label: "Content",
      items: [
        { href: "/admin/settings", icon: "📋", text: "About Us" },
        { href: "/admin/personnel", icon: "👥", text: "Personnel" },
        { href: "/admin/guest-speakers", icon: "🎤", text: "Guest Speakers" },
        { href: "/admin/programs", icon: "📚", text: "Programs" },
        { href: "/admin/activities", icon: "📅", text: "Activities" },
        {
          href: "/admin/weekly-activities",
          icon: "📸",
          text: "Weekly Gallery",
        },
        { href: "/admin/missions", icon: "✈️", text: "Mission Trip" },
        { href: "/admin/news", icon: "📰", text: "News" },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          href: "/admin/settings?tab=social",
          icon: "🔗",
          text: "Social Media",
        },
        {
          href: "/admin/settings?tab=contact",
          icon: "💬",
          text: "Contact Info",
        },
      ],
    },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">M-Y</div>
          <div className="admin-sidebar-text">
            <h3>M-YES</h3>
            <small>Admin Panel</small>
          </div>
        </div>
        <nav className="admin-sidebar-nav">
          {links.map((group) => (
            <div key={group.label}>
              <div className="admin-sidebar-label">{group.label}</div>
              {group.items.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`admin-sidebar-link ${pathname === l.href ? "active" : ""}`}
                >
                  <span className="icon">{l.icon}</span> {l.text}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button
            className="admin-logout"
            onClick={() => {
              document.cookie = "next-auth.session-token=;max-age=0;path=/";
              window.location.href = "/admin/login";
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>Admin Dashboard</h1>
          <div className="admin-topbar-actions">
            <div className="admin-badge">
              <span className="dot" /> Online
            </div>
            <Link href="/" target="_blank" className="view-site-btn">
              🌐 View Site
            </Link>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
