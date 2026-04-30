function Bone({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="card-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <Bone className="w-7 h-7 rounded-lg" />
        <Bone className="w-16 h-5 rounded-full" />
      </div>
      <Bone className="w-28 h-7" />
      <Bone className="w-20 h-3" />
    </div>
  );
}

export function CompanyHeaderSkeleton() {
  return (
    <div className="card p-5 sm:p-6 space-y-4">
      <div className="flex gap-4">
        <Bone className="w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <Bone className="w-48 h-7" />
          <div className="flex gap-2">
            <Bone className="w-16 h-5 rounded-full" />
            <Bone className="w-12 h-5 rounded-full" />
          </div>
        </div>
      </div>
      <div className="divider" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Bone className="w-16 h-2.5" />
            <Bone className="w-24 h-3.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-5 sm:p-6 space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Bone className="w-32 h-5" />
          <Bone className="w-24 h-3" />
        </div>
        <Bone className="w-28 h-8 rounded-lg" />
      </div>
      <Bone className="w-full h-64 sm:h-80 rounded-xl" />
      <div className="grid grid-cols-3 gap-3 pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center space-y-1.5">
            <Bone className="w-12 h-2.5 mx-auto" />
            <Bone className="w-20 h-4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-white/[0.07] space-y-1">
        <Bone className="w-32 h-5" />
        <Bone className="w-48 h-3" />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="px-5 py-3.5 flex gap-6 border-b border-white/4">
          <Bone className="w-16 h-4" />
          <Bone className="w-24 h-4 ml-auto" />
          <Bone className="w-14 h-4" />
          <Bone className="w-10 h-4" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <CompanyHeaderSkeleton />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      <ChartSkeleton />
      <TableSkeleton />
    </div>
  );
}
