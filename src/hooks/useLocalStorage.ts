// 다른 파일에서 가져다 쓸 수 있도록(export) 'useLocalStorage'라는 이름의 함수를 정의합니다.
// 이 함수는 로컬 스토리지에 사용할 키(key) 문자열을 인자로 받습니다.
export const useLocalStorage = (key: string) => {
    // 로컬 스토리지에 값을 저장하는 'setItem' 함수를 정의합니다.
    // 저장할 값(value)을 인자로 받으며, 어떤 타입이든 받을 수 있도록 unknown으로 지정합니다.
    const setItem = (value: unknown) => {
        // try-catch 블록으로 로컬 스토리지 작업 중 발생할 수 있는 오류를 감지하고 처리합니다.
        try {
            // 브라우저의 window 객체 아래 localStorage 객체의 setItem 메서드를 호출합니다.
            // 지정된 key에 값을 저장하며, 값은 JSON 문자열 형태로 변환하여 저장합니다.
            window.localStorage.setItem(key, JSON.stringify(value));
        // 만약 try 블록 안에서 오류가 발생하면 catch 블록이 실행됩니다.
        }        catch (error) {
            // 발생한 오류 객체를 콘솔에 출력합니다.
            console.log(error);
        }
    };

    // 로컬 스토리지에서 값을 가져오는 'getItem' 함수를 정의합니다.
    const getItem = () => {
        // try-catch 블록으로 오류를 처리합니다.
        try {
            // localStorage 객체의 getItem 메서드를 호출하여 지정된 key에 해당하는 값을 가져옵니다.
            const item = window.localStorage.getItem(key);
            // 가져온 값(item)이 존재하면(null이나 undefined가 아니면), JSON 문자열을 실제 값/객체로 변환(JSON.parse)하여 반환하고,
            // 값이 없다면(null) 그대로 null을 반환합니다.
            return item ? JSON.parse(item) : null;
        // 만약 try 블록 안에서 오류가 발생하면 catch 블록이 실행됩니다.
        } catch (error) {
            // 발생한 오류 객체를 콘솔에 출력합니다.
            console.log(error);
            // 오류 발생 시 값을 가져올 수 없으므로 null을 반환합니다.
            return null;
        }
    };

    // 로컬 스토리지에서 값을 삭제하는 'removeItem' 함수를 정의합니다.
    const removeItem = () => {
        // try-catch 블록으로 오류를 처리합니다.
        try {
            // localStorage 객체의 removeItem 메서드를 호출하여 지정된 key에 해당하는 값을 삭제합니다.
            window.localStorage.removeItem(key);
        // 만약 try 블록 안에서 오류가 발생하면 catch 블록이 실행됩니다.
        } catch (error) {
            // 발생한 오류 객체를 콘솔에 출력합니다.
            console.log(error);
        }
    };

    // 이 useLocalStorage 훅이 최종적으로 반환하는 값입니다.
    // 위에서 정의한 setItem, getItem, removeItem 함수들을 포함하는 객체를 반환합니다.
    return { setItem, getItem, removeItem };
};
