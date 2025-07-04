export function format(zemen: any, pattern: any) {
  if (!zemen) {
    return '';
  }

  if (!pattern) {
    return defaultFormating(zemen);
  } else {
    return formatWithPattern(zemen, pattern);
  }
}

function defaultFormating(zemen: any) {
  const [y, m, d] = [zemen.getFullYear(), zemen.getMonth(), zemen.getDate()];
  return `${y}-${m + 1}-${d}`;
}

/**
 *
 * @param {Zemen} zemen zemen date instance
 * @param {String} pattern formatting pattern
 * @returns{Strig} returns formated date
 */
function formatWithPattern(zemen: any, pattern: any) {
  const [y, m, d] = [zemen.getFullYear(), zemen.getMonth(), zemen.getDate()];
  let result = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    switch (ch) {
      case 'Y': {
        const year = zemen.getFullYear();
        let res = year;
        const str = pattern.slice(i);
        if (/^YY/.test(str)) {
          res = zeroPaddedTwoDigityear(year);
          i++;
        }
        if (/^YYYY/.test(str)) {
          res = year;
          i += 2;
        }
        result += res;
        break;
      }
      case 'M': {
        const month = zemen.getMonth() + 1;
        let res = month;
        const str = pattern.slice(i);
        if (/^MM/.test(str)) {
          res = zeroPaddMonth(month);
          i++;
        }
        if (/^MMM/.test(str)) {
          res = zemen.getShortMonthName();
          i++;
        }
        if (/^MMMM/.test(str)) {
          res = zemen.getMonthName();
          i++;
        }
        result += res;
        break;
      }
      case 'D': {
        const date = zemen.getDate();
        let res = date;
        const str = pattern.slice(i);
        if (/^DD/.test(str)) {
          res = zeroPaddDate(date);
          i++;
        }
        if (/^DDD/.test(str)) {
          res = zemen.getDayOfWeek();
          i++;
        }
        result += res;
        break;
      }
      case 'd': {
        result += zemen.getDayOfWeek();
        break;
      }
      case 'e': {
        result += zemen.getGCWeekDay();
        break;
      }
      case 'E': {
        result += 'ዓ.ም';
        break;
      }
      default: {
        result += ch;
        break;
      }
    }
  }
  return result;
}

function zeroPaddedTwoDigityear(year: any) {
  const remainder = year % 100;
  return remainder >= 10 ? remainder : '0' + remainder;
}
function zeroPaddMonth(month: any) {
  const remainder = month % 100;
  return remainder >= 10 ? remainder : '0' + remainder;
}
function zeroPaddDate(date: any) {
  const remainder = date % 100;
  return remainder >= 10 ? remainder : '0' + remainder;
}
