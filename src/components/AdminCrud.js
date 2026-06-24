"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Tambahkan hook bawaan Next.js

export default function AdminCrud({ title, apiUrl, columns, createUrl }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // Mengambil rute saat ini (misal: /admin/news)

  useEffect(() => {
    fetch(apiUrl)
      .then((r) => r.json())
      .then((d) => {
        // Tambahkan fallback array kosong jika data gagal diload
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <>
      <div className="crud-header">
        <h2>{title}</h2>
        {/* Lebih fleksibel: pakai createUrl dari prop, atau otomatis buat dari pathname */}
        <Link href={createUrl || `${pathname}/new`} className="add-btn">
          + Add New
        </Link>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No data yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(item) : item[c.key] || "-"}
                    </td>
                  ))}
                  <td>
                    <div className="action-btns">
                      {/* Solusi Permanen: Gunakan pathname agar link edit selalu akurat 100% */}
                      <Link
                        href={`${pathname}/${item.id}`}
                        className="act-btn edit"
                      >
                        ✏️
                      </Link>
                      <button
                        className="act-btn delete"
                        onClick={() => deleteItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
