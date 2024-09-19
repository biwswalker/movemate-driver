import { includes, isEmpty } from 'lodash';
import * as Yup from 'yup';

const MAX_FILE_SIZE = 2 * 1000 * 1000;

declare module 'yup' {
  interface MixedSchema {
    maxFileSize(message: string, size?: number): Yup.MixedSchema;
    fileFormat(format: string[], message: string): Yup.MixedSchema;
  }

  interface StringSchema {
    minmaxNoRequire(min: number, max: number, message: string): Yup.StringSchema;
    matchNoRequire(regex: RegExp, message: string): Yup.StringSchema;
  }
}

Yup.MixedSchema.prototype.maxFileSize = function (message: string, size = MAX_FILE_SIZE) {
  return this.test('maxFileSize', message, (file: any) => {
    if (file && file.size > 0) {
      return file.size <= size;
    }
    return true;
  });
};

Yup.MixedSchema.prototype.fileFormat = function (formats: string[], message: string) {
  return this.test('fileFormat', message, (file: any) => {
    if (file && !isEmpty(file.type)) {
      return includes(formats, file.type);
    }
    return true;
  });
};

Yup.StringSchema.prototype.minmaxNoRequire = function (min: number, max: number, message: string) {
  return this.test('minmaxNoRequire', message, (value: string) => {
    if (value) {
      if (value.length < min || value.length > max) {
        return false;
      }
    }
    return true;
  });
};

Yup.StringSchema.prototype.matchNoRequire = function (regex: RegExp, message: string) {
  return this.test('matchNoRequire', message, (value: string) => {
    if (value && !isEmpty(value)) {
      return regex.test(value);
    }
    return true;
  });
};

export default Yup;
