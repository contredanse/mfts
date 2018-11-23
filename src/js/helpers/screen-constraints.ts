/**
 * 700px should be tuned
 */
export const helixMinimumWidthConstraint = 700;

export const isScreenAdaptedForHelixMenu = (): boolean => {
    const screenWidth = window.innerWidth || window.screen.width;
    return screenWidth >= helixMinimumWidthConstraint;
};
