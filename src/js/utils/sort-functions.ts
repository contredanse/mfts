// Native sort function, replaces lodash/underscore orderBy

export const sortBy = (key: string) => {
    return (a: any, b: any) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
};
