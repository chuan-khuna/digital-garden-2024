export const getUserTimeZoneInBrowser = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};