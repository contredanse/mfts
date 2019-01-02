export const grepPageIdFromRoute = (route?: string | null): string | undefined => {
    if (route) {
        // Grep from page spec
        const regExp = /\/(en|fr)\/page\/([a-z0-9-_.]+)$/i;

        const found = route.match(regExp);
        //console.log('regExp', found[2])
        if (found) {
            return found[2];
        }
    }
    return undefined;
};
