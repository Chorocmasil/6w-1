import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/footer";

const HomeLayout = () => {
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

export default HomeLayout;