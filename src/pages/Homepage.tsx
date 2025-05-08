import useGetLpList from "../hooks/queries/useGetLpList.ts";

const Homepage = () => {
    const {data,isPending,isError} = useGetLpList({});
    console.log(data?.data.data.map((lp)=>lp.id));
    return <div>{data?.data.data.map((lp)=><h1>{lp.title}</h1>)}</div>

};

export default Homepage;