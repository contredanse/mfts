import { formatSecondsToHuman } from '@src/components/player/utils/formatters';

describe('Player formatters tests', () => {
    it('must format 0', () => {
        expect(formatSecondsToHuman(0)).toEqual('0:00');
    });

    it('must format Infinity to blank', () => {
        expect(formatSecondsToHuman(Infinity)).toEqual('');
    });

    it('must format Infinity', () => {
        expect(formatSecondsToHuman(Infinity, false)).toEqual('Infinity');
    });

    it('must format 3600 = 1 hour', () => {
        expect(formatSecondsToHuman(3600)).toEqual('1:00:00');
    });

    it('must format 60 = 1 minute', () => {
        expect(formatSecondsToHuman(60)).toEqual('1:00');
    });

    it('must format 30 = 30 seconds', () => {
        expect(formatSecondsToHuman(30)).toEqual('0:30');
    });
});
