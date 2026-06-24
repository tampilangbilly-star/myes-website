"use client";
import AdminCrud from "@/components/AdminCrud";
export default function AdminActivities() {
  return (
    <AdminCrud
      title="Weekly Activities"
      apiUrl="/api/activities"
      createUrl="/admin/activities/new"
      columns={[
        {
          key: "type",
          label: "Type",
          render: (i) => (
            <span className={`type-badge type-${i.type}`}>{i.type}</span>
          ),
        },
        {
          key: "time",
          label: "Time",
          render: (i) => <span className="admin-time-badge">{i.time}</span>,
        },
        { key: "activityEn", label: "Activity (EN)" },
        { key: "sortOrder", label: "Order" },
      ]}
    />
  );
}
