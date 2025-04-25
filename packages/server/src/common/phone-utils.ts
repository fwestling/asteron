import { Locale } from '@second/common';

export const sanitisePhone = (phone: string) => {
  const re = new RegExp(`^${Locale.default_phone_prefix}`);
  return phone
    .replace(/\s+/g, '')
    .replace(/[()]/g, '') 
    .replace(/^\+?0/, `+${Locale.default_phone_prefix}`)
    .replace(re, `+${Locale.default_phone_prefix}`)
    .replace(`+${Locale.default_phone_prefix}0`, `+${Locale.default_phone_prefix}`);
}
