import { PAGINATION_ORDER } from "../enums/common.ts";

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type CursorBaseResponse<T> = {
   status: boolean,
   statusCode: number,
   message: string,
   data: T
   hasNext: boolean,
   nextCursor: number
}

export type PaginationDto = {
    cursor?: number,
    limit?: number,
    search?: string,
    order?: PAGINATION_ORDER,
}

