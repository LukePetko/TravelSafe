export const getTimeDifference = (time: Date): string => {
    const diff = new Date().getTime() - time.getTime();
    const day = 1000 * 60 * 60 * 24;
    const hour = 1000 * 60 * 60;
    const minute = 1000 * 60;
    const second = 1000;

    if (diff > day) {
        return `${Math.floor(diff / day)} days ago`;
    } else if (diff > hour) {
        return `${Math.floor(diff / hour)} hours ago`;
    } else if (diff > minute) {
        return `${Math.floor(diff / minute)} minutes ago`;
    } else if (diff > second) {
        return `${Math.floor(diff / second)} seconds ago`;
    } else {
        return "Just now";
    }
};
