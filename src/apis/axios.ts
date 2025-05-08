import axios, { InternalAxiosRequestConfig } from "axios"; // axios 라이브러리와 요청 설정 관련 타입을 가져옵니다.
import { LOCAL_STORAGE_KEY } from "../constants/key.ts"; // 로컬 스토리지 키 값을 정의한 상수 파일을 가져옵니다.
import { useLocalStorage } from "../hooks/useLocalStorage.ts"; // 로컬 스토리지 사용을 위한 커스텀 훅을 가져옵니다. (주의: 인터셉터 콜백은 React 컴포넌트 컨텍스트 외부이므로 훅 직접 사용은 일반적인 규칙에 어긋날 수 있습니다.)

// Axios 요청 설정에 커스텀 속성(_retry)을 추가하기 위한 인터페이스를 정의합니다.
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
 _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그 (선택적 프로퍼티)
}

// 토큰 재발급 요청 Promise를 저장하기 위한 전역 변수입니다. 중복 요청을 방지하는 데 사용됩니다.
let refreshPromise: Promise<string> | null = null;

// Axios 인스턴스를 생성하고 기본 설정을 지정합니다. 다른 파일에서 이 인스턴스를 가져와 사용합니다.
export const axiosInstance = axios.create({
 baseURL: import.meta.env.VITE_SERVER_API_URL, // Vite 환경 변수에서 API 서버의 기본 URL을 가져와 설정합니다.
});

// 요청 인터셉터: 모든 API 요청이 서버로 전송되기 전에 실행됩니다.
axiosInstance.interceptors.request.use(
    (config ) => { // 요청 설정을 인자로 받는 콜백 함수입니다.
 // useLocalStorage 훅을 사용하여 로컬 스토리지에서 아이템을a 가져오는 함수(getItem)를 가져옵니다. (주의: 훅 호출 위치)
 const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
 const accessToken = getItem(); // 로컬 스토리지에서 현재 Access Token 값을 가져옵니다.
 
 // Access Token이 로컬 스토리지에 존재하는 경우
 if (accessToken) {
   // config.headers 객체가 없을 경우 빈 객체로 초기화합니다 (타입 안전성).
   config.headers = config.headers || {};
   // Authorization 헤더에 'Bearer [토큰값]' 형식으로 Access Token을 설정합니다.
   config.headers.Authorization = `Bearer ${accessToken}`;
 }

 // 수정된 요청 설정을 반환하여 요청을 계속 진행합니다.
 return config;
},
(error) => Promise.reject(error) // 요청 설정 중 오류가 발생하면 해당 오류를 Promise를 통해 거부(reject)합니다.
);

// 응답 인터셉터: 서버로부터 응답을 받은 후 실행됩니다.
axiosInstance.interceptors.response.use(
  (response) => response, // 정상적인 응답(2xx 상태 코드)은 그대로 반환합니다.
  async (error) => { // 오류 응답(2xx 외 상태 코드)을 처리하는 비동기 콜백 함수입니다.
    // 실패한 원래 요청의 설정을 가져옵니다. 커스텀 타입을 사용하여 _retry 속성에 접근합니다.
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;
    
    // 오류 응답이 있고, 상태 코드가 401(Unauthorized)이며, 아직 재시도(_retry 플래그가 true가 아닌 경우)하지 않은 요청인지 확인합니다.
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry // _retry 플래그가 설정되지 않았거나 false인 경우
    ) {
      // 실패한 요청이 토큰 재발급 요청('/v1/auth/refresh') 자체인지 확인합니다. (무한 재귀 호출 방지)
      if (originalRequest.url === "/v1/auth/refresh") {
        // Access Token 제거 함수를 가져옵니다. (주의: 훅 호출 위치)
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken,
        );
        // Refresh Token 제거 함수를 가져옵니다. (주의: 훅 호출 위치)
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken,
        );
        
        // 로컬 스토리지에서 두 토큰을 모두 제거합니다.
        removeAccessToken();
        removeRefreshToken();
        // 사용자 경험을 위해 로그인 페이지로 강제 이동시킵니다.
        window.location.href = "/login";
        // 현재 오류를 반환하여 Promise 체인을 중단합니다.
        return Promise.reject(error);
      }

      // 현재 요청을 재시도 했음을 표시하기 위해 _retry 플래그를 true로 설정합니다.
      originalRequest._retry = true;

      // 다른 요청에 의해 토큰 재발급이 이미 진행 중인지 확인합니다 (refreshPromise가 null이 아닌지).
      if (!refreshPromise) {
        // 토큰 재발급 요청이 진행 중이지 않으면, 새로운 재발급 요청을 시작합니다.
        // 즉시 실행 함수(IIFE)를 사용하여 비동기 로직을 실행하고, 그 결과 Promise를 refreshPromise에 저장합니다.
        refreshPromise = (async () => {
          // Refresh Token을 가져오는 함수를 가져옵니다. (주의: 훅 호출 위치)
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
        
          // 로컬 스토리지에서 Refresh Token 값을 가져옵니다.
          const refreshToken = getRefreshToken();
        
          // axiosInstance를 사용하여 토큰 재발급 API('/v1/auth/refresh')에 POST 요청을 보냅니다.
          // 요청 본문(body)에는 Refresh Token을 포함합니다 (백엔드 API 명세에 따라 key 이름 'refresh' 사용).
          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken, // 실제 백엔드 API가 요구하는 key 이름으로 수정 필요할 수 있음
          });
        
          // 서버로부터 성공적으로 새 토큰들을 받으면 (응답 데이터 구조 확인 필요: data.data.accessToken)
          // Access Token 저장 함수를 가져옵니다. (주의: 훅 호출 위치)
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
          
          // Refresh Token 저장 함수를 가져옵니다. (주의: 훅 호출 위치)
          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          
          // 새로운 Access Token을 로컬 스토리지에 저장합니다.
          setAccessToken(data.data.accessToken); // 서버 응답 구조에 맞게 경로 수정 필요 (예: data.accessToken)
          // 새로운 Refresh Token을 로컬 스토리지에 저장합니다. (서버가 새 Refresh Token도 반환하는 경우)
          setRefreshToken(data.data.refreshToken); // 서버 응답 구조에 맞게 경로 수정 필요 (예: data.refreshToken)
          
          // 성공적으로 발급받은 새로운 Access Token 값을 Promise 결과로 반환합니다.
          return data.data.accessToken; // 서버 응답 구조에 맞게 경로 수정 필요
        })()
        .catch((error) => { // 토큰 재발급 요청 중 오류 발생 시 처리합니다.
          // Access Token 제거 함수를 가져옵니다. (주의: 훅 호출 위치)
          const { removeItem: removeAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
          // Refresh Token 제거 함수를 가져옵니다. (주의: 훅 호출 위치)
          const { removeItem: removeRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          
          // 오류 발생 시 토큰을 모두 제거합니다.
          removeAccessToken();
          removeRefreshToken();
          // 발생한 오류를 Promise를 통해 거부합니다.
          return Promise.reject(error);
        })
        .finally(() => { // 토큰 재발급 요청이 성공하든 실패하든 항상 실행됩니다.
          // refreshPromise를 null로 초기화하여, 다음 401 에러 발생 시 새로운 재발급 요청을 시작할 수 있도록 합니다.
          refreshPromise = null;
        });
      }
      
      // 현재 요청은 진행 중인(또는 방금 시작된) refreshPromise가 완료될 때까지 기다립니다.
      // refreshPromise가 성공적으로 완료되면(resolve) .then 블록이 실행됩니다.
      return refreshPromise.then((newAccessToken: string) => {
        // .then 콜백은 재발급된 새로운 Access Token을 인자로 받습니다.
        // 실패했던 원래 요청(originalRequest)의 Authorization 헤더 값을 새로운 토큰으로 업데이트합니다.
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        // 수정된 설정으로 원래 요청을 다시 시도합니다. axiosInstance.request()는 새로운 Promise를 반환합니다.
        return axiosInstance.request(originalRequest);
      });
    }
    // 401 에러가 아니거나, 이미 재시도한 요청(_retry=true)이거나, 다른 종류의 오류인 경우,
    // 해당 오류를 그대로 Promise를 통해 거부(reject)하여 호출한 쪽에서 처리하도록 합니다.
    return Promise.reject(error);
  }
);
