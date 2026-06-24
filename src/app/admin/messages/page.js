"use client";
import { useState, useEffect } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    const res = await fetch("/api/contact");
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;

    const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("✅ Pesan dihapus!");
      fetchMessages(); // Refresh data
    } else {
      alert("❌ Gagal menghapus pesan.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2>📬 Inbox Pesan Pengunjung</h2>
        <span
          style={{
            background: "#3b82f6",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            fontSize: "0.9rem",
            fontWeight: "bold",
          }}
        >
          Total Pesan: {messages.length}
        </span>
      </div>

      {isLoading ? (
        <p>Memuat pesan...</p>
      ) : messages.length === 0 ? (
        <div
          style={{
            background: "#1e293b",
            padding: "3rem",
            textAlign: "center",
            borderRadius: "12px",
            color: "#94a3b8",
          }}
        >
          <span
            style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}
          >
            📭
          </span>
          Belum ada pesan yang masuk.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: "#1e293b",
                padding: "1.5rem",
                borderRadius: "12px",
                borderLeft: "4px solid #3b82f6",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #334155",
                  paddingBottom: "1rem",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.2rem 0", color: "#fff" }}>
                    {msg.name}
                  </h3>
                  <a
                    href={`mailto:${msg.email}`}
                    style={{
                      color: "#3b82f6",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                    }}
                  >
                    {msg.email}
                  </a>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "block",
                      color: "#94a3b8",
                      fontSize: "0.85rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#e2e8f0",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
