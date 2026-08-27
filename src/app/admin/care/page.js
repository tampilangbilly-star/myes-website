"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCarePage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/care");
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus kegiatan ini?")) return;
    try {
      await fetch(`/api/care/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      alert("Gagal menghapus data");
    }
  };

  if (isLoading) return <div style={{ padding: "2rem", color: "#fff" }}>Memuat data...</div>;

  return (
    <div className="admin-crud">
      <div className="admin-crud-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>M-YES Care</h2>
        <Link href="/admin/care/new" className="admin-btn primary">
          + Tambah Kegiatan
        </Link>
      </div>

      <div className="table-responsive">
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <th style={{ padding: "12px 16px" }}>Tanggal</th>
              <th style={{ padding: "12px 16px" }}>Judul Kegiatan</th>
              <th style={{ padding: "12px 16px" }}>Total Media</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <td style={{ padding: "14px 16px", color: "#e2e8f0", whiteSpace: "nowrap" }}>
                  {new Date(item.activityDate).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </td>
                <td style={{ padding: "14px 16px", color: "#fff", fontWeight: "500" }}>
                  {item.titleEn}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#93c5fd", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                    {item.media?.length || 0} File
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ color: item.isActive ? "#4ade80" : "#f87171", fontWeight: "500" }}>
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <div className="admin-action-btns" style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <Link href={`/admin/care/${item.id}`} className="admin-btn-icon edit" title="Edit" style={{ padding: "6px 10px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "6px", color: "#93c5fd", textDecoration: "none" }}>
                      ✏️
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="admin-btn-icon delete" title="Hapus" style={{ padding: "6px 10px", background: "rgba(239, 68, 68, 0.2)", borderRadius: "6px", color: "#fca5a5", border: "none", cursor: "pointer" }}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  Belum ada data kegiatan M-YES Care.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}