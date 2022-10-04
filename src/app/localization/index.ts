import arLocale from "date-fns/locale/ar";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";

export function Localization(lang: string | undefined): any {
    switch (lang){
        case 'ar': return 'arEG';
        case 'fr': return 'frFR';
        case 'en': return 'enUS';
        default:
            return 'frFR';
    }
}

export function LocaleFnsProvider(lang: string | undefined): any {
    switch (lang){
        case 'arEG': return arLocale;
        case 'frFR': return frLocale;
        case 'enUS': return enLocale;
        default:
            return frLocale;
    }
}
