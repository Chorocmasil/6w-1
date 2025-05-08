import { useQuery } from '@tanstack/react-query';
import { PaginationDto } from './../../types/common.ts';
import { getLpList } from './../../apis/lp.ts';
import { QUERY_KEY } from '../../constants/key.ts';

function useGetLpList({cursor,search,order,limit}: PaginationDto){
    return useQuery({
        queryKey:[QUERY_KEY.lps,cursor,search,order,limit],
        queryFn: () => 
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
    });
}

export default useGetLpList;

