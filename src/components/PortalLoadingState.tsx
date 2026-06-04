import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";

const SKELETON_COUNT = 6;

export function PortalLoadingState() {
  return (
    <>
      <section className="overflow-hidden rounded-3xl bg-slate-200/80 px-6 py-14 sm:px-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="mx-auto h-10 w-2/3 max-w-md skeleton rounded-xl" />
          <div className="mx-auto h-5 w-4/5 max-w-lg skeleton rounded-lg" />
          <div className="mt-8 rounded-2xl bg-white/60 p-5 ring-1 ring-slate-200/80">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 skeleton rounded" />
                  <div className="h-11 skeleton rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-56 skeleton rounded-lg" />
          <div className="h-4 w-40 skeleton rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
