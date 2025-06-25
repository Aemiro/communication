const JD_EPOCH_OFFSET_AMETE_ALEM = -285019; //      ዓ/ዓ
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856; //    ዓ/ም
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;
const JD_EPOCH_OFFSET_UNSET = -1;

let JDN_OFFSET = JD_EPOCH_OFFSET_UNSET;

const GREGORIAN_NUMBER_OF_MONTHS = 12;
const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** ERA HELPERS */
const setEra = (era: any) => {
  if (era === JD_EPOCH_OFFSET_AMETE_ALEM || era === JD_EPOCH_OFFSET_AMETE_MIHRET) {
    JDN_OFFSET = era;
  } else {
    throw new Error(`Unknown Era: ${era}`);
  }
};

const isEraSet = () => {
  return JD_EPOCH_OFFSET_UNSET === JDN_OFFSET ? false : true;
};

const unsetEra = () => {
  JDN_OFFSET = JD_EPOCH_OFFSET_UNSET;
};

const guessEraFromJDN = (jdn: any) => {
  return jdn >= JD_EPOCH_OFFSET_AMETE_MIHRET + 365 ? JD_EPOCH_OFFSET_AMETE_MIHRET : JD_EPOCH_OFFSET_AMETE_ALEM;
};

const ethiopicToJDN = (day: any, month: any, year: any) => {
  const ERA = isEraSet() ? JDN_OFFSET : JD_EPOCH_OFFSET_AMETE_MIHRET;

  return ERA + 365 + (year - 1) * 365 + quotient(year, 4) + Number(month) * 30 + Number(day) - 31;
};

const jdnToEthiopic = (jdn: any) => {
  const ERA = isEraSet() ? JDN_OFFSET : guessEraFromJDN(jdn);
  const r = mod(jdn - ERA, 1461);
  const n = mod(r, 365) + quotient(r, 1460) * 365;
  const year = quotient(jdn - ERA, 1461) * 4 + quotient(r, 365) - quotient(r, 1460);
  const month = quotient(n, 30) + 1;
  const day = mod(n, 30) + 1;

  return [year, month, day];
};

const gregorianToJDN = (day: any, month: any, year: any) => {
  const s =
    quotient(year, 4) -
    quotient(year - 1, 4) -
    quotient(year, 100) +
    quotient(year - 1, 100) +
    quotient(year, 400) -
    quotient(year - 1, 400);

  const t = quotient(14 - month, 12);

  const n = t * 31 * (month - 1) + (1 - t) * (s + 59 + (month - 3) * 30 + quotient(Number(month) * 3 - 7, 5)) + Number(day) - 1;

  return JD_EPOCH_OFFSET_GREGORIAN + (year - 1) * 365 + quotient(year - 1, 4) - quotient(year - 1, 100) + quotient(year - 1, 400) + n;
};

const jdnToGregorian = (jdn: any) => {
  const r2000 = mod(jdn - JD_EPOCH_OFFSET_GREGORIAN, 730485);
  const r400 = mod(jdn - JD_EPOCH_OFFSET_GREGORIAN, 146097);
  const r100 = mod(r400, 36524);
  const r4 = mod(r100, 1461);
  let n = mod(r4, 365) + quotient(r4, 1460) * 365;
  const s = quotient(r4, 1095);
  const aprime =
    quotient(jdn - JD_EPOCH_OFFSET_GREGORIAN, 146097) * 400 +
    quotient(r400, 36524) * 100 +
    quotient(r100, 1461) * 4 +
    quotient(r4, 365) -
    quotient(r4, 1460) -
    quotient(r2000, 730484);
  const year = aprime + 1;
  const t = quotient(s + 364 - n, 306);
  let month = t * (quotient(n, 31) + 1) + (1 - t) * (quotient((n - s) * 5 + 13, 153) + 1);
  n += 1 - quotient(r2000, 730484);
  let day = n;

  if (r100 === 0 && n === 0 && r400 !== 0) {
    month = 12;
    day = 31;
  } else {
    monthDays[2] = isGregorianLeap(year) ? 29 : 28;
    for (let i = 1; i <= GREGORIAN_NUMBER_OF_MONTHS; i += 1) {
      if (n <= monthDays[i]) {
        day = n;
        break;
      }
      n -= monthDays[i];
    }
  }

  return [year, month, day];
};

const gregorianToEthiopic = (day: any, month: any, year: any) => {
  const jdn = gregorianToJDN(day, month, year);

  return jdnToEthiopic(jdn);
};

const ethioipicToGreg = (day: any, month: any, year: any) => {
  const jdn = ethiopicToJDN(day, month, year);

  return jdnToGregorian(jdn);
};

const ethioipicToGregorian = (day: any, month: any, year: any, era: any) => {
  setEra(era);
  const result = ethioipicToGreg(day, month, year);
  unsetEra();

  return result;
};

const quotient = (i: any, j: any) => {
  return Math.floor(i / j);
};

const mod = (i: any, j: any) => {
  return i % j;
};

const isGregorianLeap = (year: any) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

/** ethiopian to gregorian */
export const toGC = (dateArray: any) => {
  let [y, m, d, era] = dateArray;
  if (d < 0 || d > 30 || m < 0 || m > 13) {
    throw new Error('Invalid Ethiopian Date');
  }
  if (!era) {
    era = JD_EPOCH_OFFSET_AMETE_MIHRET;
  }

  return ethioipicToGregorian(d, m, y, era);
};

/** gregorian to ethiopian */
export const toEC = (dateArray: any) => {
  const [y, m, d] = dateArray;
  if (d < 0 || d > 31 || m < 0 || m > 12) {
    throw new Error('Invalid Gregorian Date');
  }

  return gregorianToEthiopic(d, m, y);
};
