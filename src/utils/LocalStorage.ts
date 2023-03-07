import { useEffect, useState } from 'react';

const useLocalStorage = (key: any) => {

    const [value, SetValue] = useState(
        JSON.parse(localStorage.getItem(key) as string)
    );

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, SetValue];
}

export default useLocalStorage;