import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useInfiniteLpList from "../hooks/queries/useGetinfiniteLpList";
import LPCard from "../components/LpCard/LpCard";
import LPCardSkeletonsList from "../components/LpCard/LpCardSkeletonList";
import { PAGINATION_ORDER } from "../enums/common.ts";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // 무한 스크롤 쿼리 훅
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteLpList(
    10, // limit
    searchTerm, // search
    PAGINATION_ORDER.desc // order
  );

  // 뷰포트 감지 훅
  const { ref, inView } = useInView({ threshold: 0 });

  // 스크롤 감지 로직
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 데이터 평탄화
  const lps = data?.pages.flatMap((page) => page.data.data) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 검색 입력부 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search LPs..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 컨텐츠 영역 */}
      {isPending ? (
        <LPCardSkeletonsList count={8} />
      ) : error ? (
        <div className="text-red-600 text-center">
          Error: {error.message || "Failed to load data"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lps.map((lp) => (
            <LPCard key={lp.id} lp={lp} />
          ))}
          {isFetchingNextPage && <LPCardSkeletonsList count={4} />}
        </div>
      )}

      {/* 무한 스크롤 트리거 요소 */}
      <div ref={ref} className="h-20" />
    </div>
  );
};

export default HomePage;
