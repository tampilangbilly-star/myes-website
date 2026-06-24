"use client";
import AdminCrud from "@/components/AdminCrud";
export default function AdminPrograms() {
  return (
    <AdminCrud
      title="Programs"
      apiUrl="/api/programs"
      createUrl="/admin/programs/new"
      columns={[
        {
          key: "emoji",
          label: "Icon",
          render: (i) => <span style={{ fontSize: "1.5rem" }}>{i.emoji}</span>,
        },
        {
          key: "titleEn",
          label: "Title (EN)",
          render: (i) => <strong>{i.titleEn}</strong>,
        },
        {
          key: "titleId",
          label: "Title (ID)",
          render: (i) => i.titleId || "-",
        },
        { key: "sortOrder", label: "Order" },
      ]}
    />
  );
}
