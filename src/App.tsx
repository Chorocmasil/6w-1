import { RouteObject, RouterProvider, createBrowserRouter} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./assets/layouts/HomeLayout";
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import Mypage from "./pages/Mypage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./assets/layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <Homepage />},
      {path: 'login', element: <LoginPage />},
      {path: 'signup', element: <SignupPage />},
      {path: "v1/auth/google/callback",element:<GoogleLoginRedirectPage />},
    ],
  },
];

//protectedRoutes
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'my',
        element: <Mypage />,
      }
    ]
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
export const queryclient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        // 쿼리 요청이 실패했을 때, 자동으로 재시도할 횟수를 지정한다
        retry: 3, // 쿼리 실패시 재요청 횟수
      },
    },
  }
)

function App() {

    return (
    <QueryClientProvider client={queryclient}>
     <AuthProvider>
      <RouterProvider router={router}/>
     </AuthProvider>
     {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}  
    </QueryClientProvider>
    );
}

export default App;