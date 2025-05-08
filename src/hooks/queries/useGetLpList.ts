import { useQuery } from '@tanstack/react-query';
import { PaginationDto } from './../../types/common.ts';
import { getLpList } from './../../apis/lp.ts';
import { QUERY_KEY } from '../../constants/key.ts';

function useGetLpList({cursor,search,order,limit}: PaginationDto){
    return useQuery({
        queryKey:[QUERY_KEY.lps,search,order],
        queryFn: () => 
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
            // 데이터가 신선하다고 간주하는 시간
            // 이 시간 동안은 캐시된 데이터를 그대로 사용. 컴포넌트가 마운트 되거나 창에 포커스 들어오는 경우도 재요청 x
            staleTime: 1000 * 60 * 5, // 5 minutes

            // 데이터가 신선하지 않더라도 일정 시간동안 메모리에 보관
            // 그 이후에 해당 쿼리가 전혀 사용되지 않으면 메모리에서 삭제
            gcTime: 1000 * 60 * 10, // 10 minutes

            //조건에 따라 쿼리를 실행 여부 제어
            //enabled:Boolean(search),
            //refetchInterval: 100*60

            //쿼리 요청이 실패했을 때, 자동으로 재시도할 횟수를 지정한다
            //retry:3, // 쿼리 실패시 재요청 횟수

            //keepPreviousData: true, // 이전 데이터를 유지하여 사용자 경험을 개선합니다.

            select: (data) => data.data.data
    });
}

export default useGetLpList;

