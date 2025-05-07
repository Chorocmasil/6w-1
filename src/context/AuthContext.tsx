// React 라이브러리에서 필요한 함수와 타입들을 가져옵니다.
// createContext: Context 객체 생성
// PropsWithChildren: 컴포넌트가 자식 요소를 받을 수 있음을 나타내는 타입
// useContext: Context 값을 사용하기 위한 훅
// useState: 컴포넌트 상태 관리를 위한 훅
import { createContext, PropsWithChildren, useContext, useState } from "react";

// 인증 관련 타입 정의 파일에서 로그인 요청 시 필요한 데이터 타입을 가져옵니다.
import { RequestSigninDto } from "../types/auth";

// 상수 정의 파일에서 로컬 스토리지 키 값을 가져옵니다.
import { LOCAL_STORAGE_KEY } from "../constants/key";

// 인증 관련 API 함수 정의 파일에서 로그아웃, 로그인 함수를 가져옵니다.
import { postLogout, postSignin } from "../apis/auth";

// 커스텀 훅 정의 파일에서 로컬 스토리지 사용을 위한 훅을 가져옵니다.
import { useLocalStorage } from "../hooks/useLocalStorage";


// AuthContext가 제공할 값들의 타입을 정의하는 인터페이스입니다.
interface AuthContextType {
    // Access Token 값 (문자열 또는 null)
    accessToken: string | null;
    // Refresh Token 값 (문자열 또는 null)
    refreshToken: string | null;
    // 로그인 함수 타입 정의 (로그인 데이터를 받고, 비동기 작업 후 반환값 없음)
    login: (signlnData: RequestSigninDto) => Promise<void>;
    // 로그아웃 함수 타입 정의 (인자 없고, 비동기 작업 후 반환값 없음)
    logout: () => Promise<void>;
};

// AuthContext 객체를 생성합니다. AuthContextType 타입을 가지며, 기본값을 설정합니다.
export const AuthContext = createContext<AuthContextType>({
    // 기본 Access Token 값은 null
    accessToken: null,
    // 기본 Refresh Token 값은 null
    refreshToken: null,
    // 기본 login 함수는 아무 작업도 안 하는 비동기 함수
    login: async () => {},
    // 기본 logout 함수는 아무 작업도 안 하는 비동기 함수
    logout: async () => {},
});

// 인증 상태와 기능을 제공하는 Provider 컴포넌트입니다. 자식 컴포넌트(children)를 감쌉니다.
export const AuthProvider = ({ children }: PropsWithChildren) => {
    // useLocalStorage 훅을 사용하여 Access Token을 로컬 스토리지에서 가져오고(getItem),
    // 저장하고(setItem), 제거하는(removeItem) 함수들을 가져옵니다. 이름을 각각 변경합니다.
    const {
      getItem: getAccessTokenFromStorage,
      setItem: setAccessTokenInStorage,
      removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    // useLocalStorage 훅을 사용하여 Refresh Token 관련 함수들도 동일하게 가져옵니다.
    const {
      getItem: getRefreshTokenFromStorage,
      setItem: setRefreshTokenInStorage,
      removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    // useState 훅을 사용하여 Access Token 상태를 관리합니다. 초기값은 로컬 스토리지에서 가져옵니다.
    const [accessToken,setAccessToken] = useState<string | null>(
      getAccessTokenFromStorage()
    );

    // useState 훅을 사용하여 Refresh Token 상태를 관리합니다. 초기값은 로컬 스토리지에서 가져옵니다.
    const [refreshToken , setRefreshToken ] = useState<string | null>(
      getRefreshTokenFromStorage()
    );

    // 로그인 로직을 처리하는 비동기 함수입니다. 로그인 데이터를 인자로 받습니다.
    const login = async (signinData: RequestSigninDto) => {
        // try-catch 블록으로 API 요청 및 후속 처리 중 발생할 수 있는 오류를 처리합니다.
        try{
            // postSignin API 함수를 호출하고, 응답 객체에서 data 속성만 추출합니다.
            const { data } = await postSignin(signinData);

      // API 응답 데이터가 존재하는 경우 아래 로직을 실행합니다.
      if(data){
        // 응답 데이터에서 새로운 Access Token을 추출합니다.
        const newAccessToken = data.accessToken;
        // 응답 데이터에서 새로운 Refresh Token을 추출합니다.
        const newRefreshToken = data.refreshToken;

        // 새로운 Access Token을 로컬 스토리지에 저장합니다.
        setAccessTokenInStorage(newAccessToken);
        // 새로운 Refresh Token을 로컬 스토리지에 저장합니다.
        setRefreshTokenInStorage(newRefreshToken);

        // React 컴포넌트의 Access Token 상태를 업데이트합니다.
        setAccessToken(newAccessToken);
        // React 컴포넌트의 Refresh Token 상태를 업데이트합니다.
        setRefreshToken(newRefreshToken);
        // 사용자에게 로그인 성공 알림을 표시합니다.
        alert('로그인에 성공했습니다.');
        // 사용자를 '/my' 페이지로 이동시킵니다.
        window.location.href = '/my';
      }
    // API 요청이나 처리 중 오류가 발생한 경우 아래 로직을 실행합니다.
    } catch (error) {
        // 콘솔에 로그인 에러 정보를 출력합니다[1].
        console.error('login error', error);
        // 사용자에게 로그인 실패 알림을 표시합니다.
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
    };


    // 로그아웃 로직을 처리하는 비동기 함수입니다.
    const logout = async () => {
        // try-catch 블록으로 API 요청 및 후속 처리 중 발생할 수 있는 오류를 처리합니다.
        try {
          // postLogout API 함수를 호출합니다 (서버에 로그아웃 요청).
          await postLogout();
          // 로컬 스토리지에서 Access Token을 제거합니다.
          removeAccessTokenFromStorage();
          // 로컬 스토리지에서 Refresh Token을 제거합니다.
          removeRefreshTokenFromStorage();

          // React 컴포넌트의 Access Token 상태를 null로 설정합니다.
          setAccessToken(null );
          // React 컴포넌트의 Refresh Token 상태를 null로 설정합니다.
          setRefreshToken(null);

          // 사용자에게 로그아웃 성공 알림을 표시합니다.
          alert("로그아웃 성공");
        // API 요청이나 처리 중 오류가 발생한 경우 아래 로직을 실행합니다.
        } catch (error) {
          // 콘솔에 로그아웃 에러 정보를 출력합니다.
          console.error("로그아웃 오류", error);
          // 사용자에게 로그아웃 실패 알림을 표시합니다.
          alert("로그아웃 실패");
        }
    };

      // AuthProvider 컴포넌트가 실제로 렌더링하는 내용입니다.
      return (
        // AuthContext.Provider를 사용하여 하위 컴포넌트(children)에게 value 객체를 전달합니다.
        // value 객체에는 현재 accessToken, refreshToken 상태와 login, logout 함수가 포함됩니다.
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {/* AuthProvider로 감싸진 자식 컴포넌트들을 렌더링합니다. */}
            {children}
        </AuthContext.Provider>
      );
    };


      // AuthContext의 값을 쉽게 사용하기 위한 커스텀 훅입니다.
      export const useAuth = () => {
        // useContext 훅을 사용하여 AuthContext의 현재 값(상태와 함수들)을 가져옵니다.
        const context = useContext(AuthContext);
        // 만약 context 값이 없다면 (AuthProvider 외부에서 사용된 경우) 에러를 발생시킵니다.
        if(!context){
            throw new Error('AuthContext를 찾을 수 없습니다');
        }

        // 가져온 context 값을 반환합니다.
        return context;
      };
