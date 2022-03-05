export const distanceText = (distance: number | null): string => {
    if (!distance) return "";
    if (distance > 1000) {
        return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${distance} m`;
};
