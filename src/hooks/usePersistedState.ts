import { useEffect, useState } from "react";
import { getItem, setItem } from "../utils/localStorage"

export function usPersistedState<T>(key: string, initialValue: T){
    const [value, setValue] = useState(()=> {
        const item = getItem(key);
        return (item as T) || initialValue;
    });

    useEffect(() => {
        setItem(key, value);
    }, [value]);
    return [value, setValue] as const;
}