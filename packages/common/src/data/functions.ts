export type Email = string;

export const isEmail = (email: string): email is Email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const displayNameToSplit = (
  name: string,
): { givenName?: string; familyName?: string } => {
  if (!name) return {};
  const split = name.split(' ');
  if (split.length === 0) return {};
  if (split.length === 1) return { givenName: name };
  if (split.length === 2) return { familyName: split[1], givenName: split[0] };
  return { givenName: split[0], familyName: split.slice(1).join(' ') };
};

type UserVisibility = {
  locked?: boolean;
  deleted?: boolean;
};

export const userHidden = (u: UserVisibility) => {
  return (u.deleted ?? false) || (u.locked ?? false);
};

export const redactIfUserHidden = (u: UserVisibility, s: string) => {
  return userHidden(u) ? '(redacted)' : s;
};
