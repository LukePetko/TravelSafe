import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (
    key: string,
    value: string,
): Promise<Boolean> => {
    try {
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (error) {
        return false;
    }
};

export const getData = async (
    key: string,
): Promise<String | null | Boolean> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        return false;
    }
};

export const removeData = async (key: string): Promise<Boolean> => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
};
