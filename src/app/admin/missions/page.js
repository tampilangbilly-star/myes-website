"use client";
import AdminCrud from "@/components/AdminCrud";

export default function AdminMissions() {
  return (
    <AdminCrud
      title="Mission Trips"
      apiUrl="/api/missions"
      createUrl="/admin/missions/new"
      columns={[
        {
          key: "image",
          label: "Img",
          render: (i) => (
            <div className="table-img">
              {i.image ? (
                <img
                  src={i.image?.startsWith("/") ? i.image : `${i.image}`}
                  alt=""
                />
              ) : (
                "✈️"
              )}
            </div>
          ),
        },
        {
          key: "titleEn",
          label: "Title",
          render: (i) => <strong>{i.titleEn}</strong>,
        },
        { key: "dateLabelEn", label: "Date Label" },
        { key: "sortOrder", label: "Order" },
      ]}
    />
  );
}
