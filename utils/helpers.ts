export const truncateText = (text: string, maxLength: number) => {
    if (text) {
        const textWithoutUnderscores = text.replace(/_/g, " ");
        if (textWithoutUnderscores.length > maxLength) {
            return textWithoutUnderscores.substring(0, maxLength) + "...";
        } else {
            return textWithoutUnderscores;
        }
    }
};