import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { DashboardConfigDataService } from './dashboard-config-data.service';
@Injectable()
export class DashboardAuthService {
  private userNameWithPass: String;

  constructor(private http: Http,
    private _configService: DashboardConfigDataService) { }

  login(username: string, password: string) {
    this.userNameWithPass = username + "|" + password;

    return this.http.get(this._configService.$serverIP + 'ProductUI/productSummary/SummaryWebService/authenticate?queryString=' + this.userNameWithPass)
      .map((response: Response) => response.json());
  }

  getProductData() {
    return this.http.get(this._configService.$serverIP + 'ProductUI/productSummary/SummaryWebService/getProductName').map((response: Response) => response.json());
  }

  validateUserBeforeLogin(userName: string, passWord: string) {
    try {

      return this.http.get(this._configService.$serverIP + 'DashboardServer/acl/user/authenticateUser?userName=' + userName + '&passWord=' + passWord)
        .map((response: Response) => response.json());

    } catch (error) {
      console.log('error in while validating user --> ', error);
    }
  }

  getTestRunData() {
    try {
      return this.http.get(this._configService.$serverIP + 'ProductUI/productSummary/SummaryWebService/getTestRunDetailsJsonData')
        .map((response: Response) => response.json());

    } catch (error) {
      console.log('error in while validating user --> ', error);
    }
  }

  getFilteredData(filterKeyword, duration?, startedTime?) {
    try {
      if(!duration)
        duration = '00:00:00-NA';

      if(!startedTime)
        startedTime = '';

      return this.http.post(this._configService.$serverIP + 'ProductUI/productSummary/SummaryWebService/getFilterTestRunDetailsData?projName=&subProjName=&scenarioName=&status=&sKeyword=' + filterKeyword + '&duration=' + duration + '&startedTime=' + startedTime + '&sUser=' + this._configService.$userName, 
      JSON.parse(JSON.stringify({'All':{'All':7}})))
      .map((response) => response.json());
    }
    catch(e) {
      console.log(e);
    }
  }
}
