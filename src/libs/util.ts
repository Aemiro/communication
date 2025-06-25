import * as fs from 'fs';
import { ToWords } from 'to-words';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as base64arraybuffer from 'base64-arraybuffer';

export class Util {
  static getTimeDifference(endTime: Date, startTime: Date): string {
    const diff = endTime.getTime() - startTime.getTime();
    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    let result = hh ? hh.toString() : '00';
    result += ':' + (mm.toString() ? mm.toString() : '00');
    result += ':' + (ss.toString() ? ss.toString() : '00');
    return result;
  }
  static compareDate(date1: Date, date2: Date) {
    return date1.getTime() - date2.getTime();
  }
  static readFilesFromFolder(path: string) {
    if (!fs.existsSync(path)) {
      console.log('Folder does not exist');
      return [];
      // fs.mkdirSync(path);
    }
    return fs.readdirSync(path);
  }
  static isFolderExists(path: string) {
    return fs.existsSync(path);
  }
  static deleteFile(path: string) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    });
  }
  static numberToWord(num: number | string) {
    if (typeof num === 'string') num = parseFloat(num);
    const toWords = new ToWords({
      localeCode: 'en-US',
      converterOptions: {
        currency: false,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: 'Birr',
          plural: 'Birr',
          symbol: 'ብር',
          fractionalUnit: {
            name: 'Santim',
            plural: 'Santim',
            symbol: '',
          },
        },
      },
    });
    const fixedNumber = toWords.toFixed(num, 2);
    return toWords.convert(fixedNumber);
  }
  static excelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }
  static removeSpecialCharacters(str: string) {
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
  }
  static dateFormat(date: Date, timeZone = null) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    if (timeZone) options.timeZone = timeZone;
    return date.toLocaleDateString('en-US', options);
  }
  static addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  static addMonths(date: Date, months: number) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }
  static addYears(date: Date, years: number) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }
  static addHours(date: Date, hours: number) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }
  static addMinutes(date: Date, minutes: number) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }
  static addSeconds(date: Date, seconds: number) {
    const result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  }
  static addWeeks(date: Date, weeks: number) {
    const result = new Date(date);
    const days = weeks * 7;
    result.setDate(result.getDate() + days);
    return result;
  }
  static generateNonSpecialCharacter(length = 4): string {
    let str = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      str += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return str;
  }
  static comparePassword(
    plainPassword: string,
    encryptedPassword: string,
  ): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }
  static GenerateToken(user: any, expiresIn: string | number = '1h') {
    return jwt.sign(user, process.env['JWT_SECRET'] || '', {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  static GenerateRefreshToken(user: any, expiresIn: string | number = '1d') {
    return jwt.sign(user, process.env['REFRESH_SECRET_TOKEN'] || '', {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });
  }
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  static async convertToBase64FromUrl(fileUrl: string) {
    const arrayBuffer = await fetch(fileUrl).then((res) => res.arrayBuffer());
    const base64 = base64arraybuffer.encode(arrayBuffer);
    let mimeType = 'image/png';
    if (fileUrl.includes('.jpg')) {
      mimeType = 'image/jpg';
    } else if (fileUrl.includes('.jpeg')) {
      mimeType = 'image/jpeg';
    } else if (fileUrl.includes('.svg')) {
      mimeType = 'image/svg+xml';
    }
    return `data:${mimeType};base64,${base64}`;
  }
  static formatNumber(num: number | string) {
    if (!num) {
      return '';
    }
    if (typeof num === 'string') num = parseFloat(num);
    return num.toLocaleString('en-US');
  }

  static formatDateWithDayName(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  static generateOtpCode() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  static generateRandomStr(length = 4): string {
    let password = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return password;
  }
}