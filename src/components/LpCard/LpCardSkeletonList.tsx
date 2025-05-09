import LPCardSkeleton from "./LpcardSkeleton";

interface LPCardSkeletonsListProps {
  count: number;
}

const LPCardSkeletonsList = ({ count }: LPCardSkeletonsListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <LPCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default LPCardSkeletonsList;
