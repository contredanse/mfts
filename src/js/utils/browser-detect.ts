/**
 * @link https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
 */

export const isChrome = (includeIOS: boolean = false) => {
    const isChromium = (window as any).chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof (window as any).opr !== 'undefined';
    const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
    const isIOSChrome = winNav.userAgent.match('CriOS');

    if (isIOSChrome) {
        // is Google Chrome on IOS
        return includeIOS;
    } else if (
        isChromium !== null &&
        typeof isChromium !== 'undefined' &&
        vendorName === 'Google Inc.' &&
        isOpera === false &&
        isIEedge === false
    ) {
        return true;
    }
    return false;
};
