/** Kerangka tampilan saat halaman dimuat (tanpa lompatan layout). */
export default function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="border-b border-line bg-surface">
        <div className="container-x space-y-4 py-12 sm:py-16">
          <div className="skeleton h-7 w-32 rounded-full" />
          <div className="skeleton h-10 w-3/4 max-w-xl" />
          <div className="skeleton h-5 w-full max-w-lg" />
        </div>
      </div>
      <div className="container-x grid grid-cols-2 gap-3 py-14 sm:gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="skeleton aspect-[4/3] rounded-none" />
            <div className="space-y-2 p-4">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
