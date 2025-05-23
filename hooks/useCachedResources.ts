import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

const useCachedResources = (): boolean => {
    const [isLoadingComplete, setLoadingComplete] = useState<boolean>(false);

    // Load any resources or data that we need prior to rendering the app
    useEffect((): void => {
        const loadResourcesAndDataAsync = async (): Promise<void> => {
            try {
                SplashScreen.preventAutoHideAsync();

                // Load fonts
                await Font.loadAsync({
                    ...FontAwesome.font,
                    "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
                    Bilbo: require("../assets/fonts/Bilbo-Regular.ttf"),
                });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                SplashScreen.hideAsync();
            }
        };

        loadResourcesAndDataAsync();
    }, []);

    return isLoadingComplete;
};

export default useCachedResources;
