import useGetLpList from "../hooks/queries/useGetLpList.ts";
import { useState } from "react";

const Homepage = () => {
    const [search,setSearch] = useState("타입");
    const {data,isPending,isError} = useGetLpList({search,});

    if(isPending) return <h1 className={"mt-20"}>로딩중</h1>;
    if(isError) return <h1 className={"mt-20"}>에러</h1>;

    return (
    <div>
        <input value={search} onChange={(e)=>setSearch(e.target.value)}/>
        {data?.map((lp)=><h1>{lp.title}</h1>)}
    </div>
    );
};
 
export default Homepage;