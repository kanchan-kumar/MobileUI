import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';
import * as moment from 'moment';

@Injectable()
export class DashboardDataValidatorService {

  constructor( private log: Logger ) { }

  /**
   * Method is used to check wheather object is valid or not.
   */
  isValidObject(object: any) {
    try {

      if (object == null || object === undefined) {
        return false;
      }
      return true;

    } catch (e) {
      this.log.error('Error while checking object integrity.', e);
      return false;
    }
  }

  /*
  * validation for alphaNumeric currently used to compare window
  */

  aplhaNumericCheck(value) {
    let validate = false;
    // if (/^[a-zA-Z][a-zA-Z0-9_ /-]*$/.test(value))
    if (/^[a-zA-Z0-9_ /:']*$/.test(value)) {
      validate = true;
    }
    return validate;
  }


  /*validation for hh:mm:ss format for Time */
  validateTimeWithSecond(time) {
    let validate = false;
    if (/^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
      validate = true;
    }
    return validate;
  }


  validateMmssInHhmmss(time) {
    this.log.info('validateMmssInHhmmss method is called ' + time);
    try {
      let validate = false;
      if (/^([0-5]\d):([0-5]\d)$/.test(time)) {
        validate = true;
      }
      return validate;
    } catch (e) {
      this.log.info(e);
      this.log.info('exception in validateMmssInHhmmss');
    }
  }

  /*validation for hh:mm format for Time */
  validateTimeWithoutSecond(time) {
    let validate = false;
    if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      validate = true;
    }
    return validate;
  }

  /*Method is used to validate the date format. */
  validateDateFormat(date, format) {
    try {
      return moment(date, format, true).isValid();
    } catch (error) {
      this.log.info('exception in validateDateFormat');
      this.log.info(error);
      return false;
    }
  }
}
