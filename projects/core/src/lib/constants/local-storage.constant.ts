import { I18nSupported } from '../enums/i18n-supported.enum';

export const MOSA_MERGED_TRANSLATION = (lang: string): string => `mosa_${ lang }_merged_${ location.host }`;
export const MOSA_FALLBACK_TRANSLATION = `mosa_${ I18nSupported.enUS }_merged_${ location.host }`;
