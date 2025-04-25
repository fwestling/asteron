import {
  LOCALE,
} from '../data/constants';

// 
// Let's use 2 letter country codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

// Each member of this type must have 'readonly', this prevents BOTH modification & not instantiating it in the 'LocaleData'
// Each array type must also have this to prevent their modification
type LocaleType = {
  readonly country: string;               // Fullname
  readonly country_code: string;          // Use 2 letter country abbreviation
  readonly default_phone_prefix: string;  //EG: '61' for Australia (no plus or zeroes)
  readonly states: readonly string[];              // Auto-populated with keys of state_data. Leave as 'states: new Array<string>(),'
  readonly terms_and_conditions_link: string; // firebase.links.ts expects a string, not a url type
}

type LocaleListType = {
  [key: string]: LocaleType;
}

const LocaleData: LocaleListType = {
  "AU": {
    country: 'Australia', //TODO integrate use
    country_code: 'AU',
    default_phone_prefix: '61',
    terms_and_conditions_link: 'https://www.firstaustralia.org/terms-and-conditions',
    states: ['NSW', "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"] as const,
  },
} as const;

const myLocale: LocaleType = LocaleData[LOCALE] || LocaleData["AU"];

Object.freeze(myLocale);

export const Locale = myLocale;
