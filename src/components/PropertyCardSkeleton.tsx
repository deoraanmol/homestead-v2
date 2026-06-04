export function PropertyCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <div className="aspect-[4/3] skeleton" />
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="h-5 w-3/4 skeleton rounded-lg" />
        <div className="h-4 w-1/2 skeleton rounded-lg" />
        <div className="mt-1 flex gap-2">
          <div className="h-7 w-20 skeleton rounded-full" />
          <div className="h-7 w-20 skeleton rounded-full" />
        </div>
        <div className="mt-auto h-11 w-full skeleton rounded-xl" />
      </div>
    </article>
  );
}
