import secureLocalStorage from "react-secure-storage";

export const setLocalItemWithExpiry = (key: string, value: any, expiryInDays: number) => {
    const now = new Date();
    const expiryTime = now.getTime() + expiryInDays * 24 * 60 * 60 * 1000;

    const item = {
        value: value,
        expiry: expiryTime,
    };

    secureLocalStorage.setItem(key, JSON.stringify(item));
};


export const getLocalItem = (key: string) => {
    const itemStr = secureLocalStorage.getItem(key) as string;

    if (!itemStr) { return null; }

    try {
        const item = JSON.parse(itemStr);

        return item.value;
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
}

export const cleanlocalStorageWithExpiry = () => {
    const keys = Object.keys(secureLocalStorage);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const itemStr = secureLocalStorage.getItem(key) as string;

        if (itemStr) {
            try {
                const item = JSON.parse(itemStr);

                if (item && item.expiry) {
                    const now = new Date();
                    if (now.getTime() > item.expiry) {
                        secureLocalStorage.removeItem(key);
                    }
                }
            } catch (error) {
                console.error(`Error processing ${key}:`, error);
            }
        }
    }
}

export const cleanlocalStorage = () => {
    secureLocalStorage.clear();
}