const commonConfig = {
    slug: "travelsafe",
    icon: "./assets/images/ts_icon.png",
    splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    ios: {
        bundleIdentifier: "com.lukaspetko.travelsafe",
    },
};

module.exports = () => {
    return {
        ...commonConfig,
        name: "TravelSafe",
    };
};
