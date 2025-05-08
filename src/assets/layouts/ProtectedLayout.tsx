
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/NavBar";
import Footer from "../../components/footer";

const ProtectedLayout = () => {
 const { accessToken } = useAuth();
 const location = useLocation();
 
 if (!accessToken) {
   return <Navigate to={"/login"} state= {{location}} replace />;
 }
 
 return ( 
        <div className='h-dvh flex flex-col'>
        <NavBar />
        <main className='flex-1 mt-20'>
            <Outlet />
        </main>
        <Footer />
    </div>
 );
};

export default ProtectedLayout;