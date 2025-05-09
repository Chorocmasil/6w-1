import { PAGINATION_ORDER } from "../../enums/common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetinfiniteLpList(
    limit: number,
    search: string,
    order: PAGINATION_ORDER,
) {

  return useInfiniteQuery({
    queryFn:({pageParam}) => 
        getLpList({cursor: pageParam, limit, search, order}),
    queryKey:[QUERY_KEY.lps,search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
        // console.log("lastPage", lastPage);
        // console.log("allPages", allPages);
        return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    
  });
}

export default useGetinfiniteLpList;