import biblio_en from './biblio.en.md';
import biblio_fr from './biblio.fr.md';
import bio_en from './bio.en.md';
import bio_fr from './bio.fr.md';
import credits_en from './credits.en.md';
import credits_fr from './credits.fr.md';

export type HTMLStaticContent = {
    section_id: string;
    title: {
        en: string;
        fr: string;
        [key: string]: string;
    };
    content: {
        en: string;
        fr: string;
        [key: string]: string;
    };
};

export const staticContent: HTMLStaticContent[] = [
    {
        section_id: 'credits',
        title: { en: 'Credits', fr: 'Crédits' },
        content: { en: credits_en, fr: credits_fr },
    },
    {
        section_id: 'bio',
        title: { en: 'Biography', fr: 'Biographie' },
        content: { en: bio_en, fr: bio_fr },
    },
    {
        section_id: 'biblio',
        title: { en: 'Bibliography', fr: 'Bibliographie' },
        content: { en: biblio_en, fr: biblio_fr },
    },
];
