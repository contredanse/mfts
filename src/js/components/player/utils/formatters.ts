export const formatSecondsToHuman = (milli: number, infinityToBlank: boolean = true): string => {
    if (milli === Infinity) {
        return infinityToBlank ? '' : 'Infinity';
    }
    const d = Math.trunc(milli);
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    const minutes = m.toString().padStart(h > 0 ? 2 : 1, '0');
    const seconds = s.toString().padStart(2, '0');
    const hDisplay = h > 0 ? `${h}:` : '';
    const mDisplay = m > 0 ? `${minutes}:` : `${'0'.padStart(h > 0 ? 2 : 1, '0')}:`;
    const sDisplay = s > 0 ? `${seconds}` : '00';
    return `${hDisplay}${mDisplay}${sDisplay}`;
};
