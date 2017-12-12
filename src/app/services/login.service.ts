import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  private errorMsg = '';
  constructor() { }

  validateAndVerifyUser(): boolean {
    try {



    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
