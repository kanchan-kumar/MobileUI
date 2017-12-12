import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Logger} from '../../vendors/angular2-logger/core';

@Injectable()
export class DashboardRestDataApiService {

  constructor(private http: Http, private log: Logger) { }

/*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPI( url: string, param: string) {
    try {

      this.log.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.get(url + param)
        .map((response) => response.json())
        .catch((e) => {
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        });
    } catch (e) {
      this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.log.error(e);
    }
  }

  /*Getting Data Through REST API by using GET Method.*/
  getDataFromRESTUsingPOSTReq( url: string, param: string, data: any) {
    try {

      this.log.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.post(url + param,data)
        .map((response) => response.json())
        .catch((e) => {
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        });
    } catch (e) {
      this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.log.error(e);
    }
  }

/*Getting Data Through REST API by using GET Method.*/
  getDataByRESTAPIForDerived( url: string, param: string) {
    try {

      this.log.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.get(url + param)
        .map(response => response)
         .catch((e) => {
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        });
    } catch (e) {
      this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.log.error(e);
    }
  }

 /*Getting Data Through REST API by using GET Method in String format*/
  getDataByRESTAPIInString( url: string, param: string) {
    try {

      this.log.info('Getting data from url = ' + url + ', param = ' + param);

      return this.http.get(url + param)
        .map((response) => response['_body'])
        .catch((e) => {
          return Observable.throw(
            new Error(`${ e.status } ${ e.statusText }`)
          );
        });
    } catch (e) {
      this.log.error('Error while getting data from REST API. url = ' + url + ', param = ' + param);
      this.log.error(e);
    }
  }
}
