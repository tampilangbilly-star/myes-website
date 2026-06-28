"use client";
import AdminCrud from "@/components/AdminCrud";

export default function AdminNews() {
  return (
    <AdminCrud
      title="News"
      apiUrl="/api/news"
      createUrl="/admin/news/new"
      columns={[
        {
          key: "image",
          label: "Img",
          render: (i) => (
            <div className="table-img">
              {i.image ? (
                <img
                  src={
                    i.image?.startsWith("/") ? i.image : `/uploads/${i.image}`
                  }
                  alt=""
                />
              ) : (
                "📰"
              )}
            </div>
          ),
        },
        {
          key: "titleEn",
          label: "Title",
          render: (i) => <strong>{i.titleEn?.substring(0, 40)}</strong>,
        },
        { key: "tagEn", label: "Tag" },
        {
          key: "publishedAt",
          label: "Date",
          render: (i) =>
            i.publishedAt ? new Date(i.publishedAt).toLocaleDateString() : "-",
        },
      ]}
    />
  );
}
