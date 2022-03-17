import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
