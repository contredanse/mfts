export type BasicI18nDictionary = { [key: string]: { [key: string]: string } };

export const getFromDictionary = (textKey: string, lang: string, dict: BasicI18nDictionary): string => {
    if (textKey in dict && lang in dict[textKey]) {
        return dict[textKey][lang];
    }
    return textKey;
};
