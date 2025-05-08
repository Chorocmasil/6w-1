
import { PaginationDto } from './../types/common';
import { axiosInstance } from './axios.ts';
import { ResponseLpListDto } from '../types/lp.ts';

export const getLpList = async (
    paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get('/v1/lps', {
        params:paginationDto,
    });
    console.log(paginationDto);

 return data;
};



