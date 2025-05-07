
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";

const ProtectedLayout = () => {
 const { accessToken } = useAuth();
 const location = useLocation();
 
 if (!accessToken) {
   return <Navigate to={"/login"} state= {{location}} replace />;
 }
 
 return ( 
    <div className='h-dvh flex flex-col'>
      <NavBar />
      <main className='flex-1' style={{paddingTop: '64px'}}>
        <Outlet />
      </main>
      <footer>This is footer</footer>
    </div>
 );
};

export default ProtectedLayout;