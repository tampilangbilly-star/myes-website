"use client";
import AdminCrud from "@/components/AdminCrud";

export default function AdminPersonnel() {
  return (
    <AdminCrud
      title="Organization Personnel"
      apiUrl="/api/personnel"
      createUrl="/admin/personnel/new"
      columns={[
        {
          key: "photo",
          label: "Photo",
          render: (i) => (
            <div className="table-img">
              {i.photo ? (
                <img
                  src={
                    i.photo?.startsWith("/") ? i.photo : `/uploads/${i.photo}`
                  }
                  alt=""
                />
              ) : (
                "👤"
              )}
            </div>
          ),
        },
        {
          key: "name",
          label: "Name",
          render: (i) => <strong>{i.name}</strong>,
        },
        { key: "roleEn", label: "Role (EN)" },
        { key: "sortOrder", label: "Order" },
      ]}
    />
  );
}
