import { Component, OnInit, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Logger } from '../../../vendors/angular2-logger/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DashboardAuthService } from '../../services/dashboard-auth.service';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import { window } from 'rxjs/operators/window';
import { Highcharts } from '../../constants/common-constants';

import * as ons from 'onsenui';
import * as jQuery from 'jquery';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  tiles = [];
  model: any = {};

  productName = 'NetDiagnostics';
  controllerInfo: string = '';
  message: string = '';
  setHeight: string = '';
  setCardHeight: string = '';
  setCardWidth: string = '100%';
  setUserTop: string = '42%';
  setPassTop: string = '64%';
  setImage: string = 'bottom';
  dataSubscription: Subscription;
  loading: boolean = false;

  constructor(private log: Logger,
    private _changeDetection: ChangeDetectorRef,
    private _router: Router,
    private _authService: DashboardAuthService,
    private _configService: DashboardConfigDataService,
    private _zone: NgZone ) {
    this.tiles = [
      { text: 'Two', cols: 5, rows: 1 },
      { text: 'Two', cols: 5, rows: 1 },
      { text: 'Two', cols: 2, rows: 10 },
      { text: 'login', cols: 6, rows: 10 },
      { text: 'Two', cols: 2, rows: 10 },
      { text: 'Two', cols: 10, rows: 1 }
    ];

  }

  ngOnInit() {
    this.dataSubscription = this._authService.getProductData().subscribe(res => {
      this.setsessionValue(res);
    });

  
    let hThemeLink = 'resources/themes/highchart-colors.js';
    
    /*Loading Highchart theme. */
    jQuery.getScript(hThemeLink)
      .done(function (script, textStatus) {
      })
      .fail(function (jqxhr, settings, exception) {
        console.error('Error while loading User Default highchart theme.', hThemeLink, exception);
    });
    
     /***this is to handle the orientation of mobile view */
     ons.orientation.on('change', (event) => {
      if (!event.isPortrait) {
          this.setHeight = '17%';
          this.setCardHeight = '100%';
          this.setCardWidth = '70%';

          if(ons.platform.isIPad()) {
            this.setUserTop = '23%';
            this.setPassTop = '34%';
          }
          else {
            this.setUserTop = '28%';
            this.setPassTop = '50%';
          }

          this.setImage = 'unset';

          this.tiles = [
            { text: 'Two', cols: 5, rows: 1 },
            { text: 'Two', cols: 5, rows: 1 },
            { text: 'Two', cols: 2, rows: 5 },
            { text: 'login', cols: 6, rows: 5 },
            { text: 'Two', cols: 2, rows: 5 },
            { text: 'Two', cols: 10, rows: 1 }
          ];

          if (!this._changeDetection['destroyed']) 
            this._changeDetection.detectChanges();
      }
      else {
          this.setHeight = '';
          this.setCardHeight = '';
          this.setCardWidth = '100%';

          if(ons.platform.isIPad()) {
            this.setUserTop = '34%';
            this.setPassTop = '58%';
          }
          else  {
            this.setUserTop = '42%';
            this.setPassTop = '64%';
          }

          this.setImage = 'bottom';

          this.tiles = [
            { text: 'Two', cols: 5, rows: 1 },
            { text: 'Two', cols: 5, rows: 1 },
            { text: 'Two', cols: 2, rows: 10 },
            { text: 'login', cols: 6, rows: 10 },
            { text: 'Two', cols: 2, rows: 10 },
            { text: 'Two', cols: 10, rows: 1 }
          ];

          if (!this._changeDetection['destroyed']) 
            this._changeDetection.detectChanges();
      }
  });  
  }

  setsessionValue(data) {
    let res = data["productName"];
    let controllerName = data["controllerName"];
    let runningtest = data["runningtest"];

    if (res == "netstorm") {
      this.productName = "NetStorm";
      document.title = "Cavisson NetStorm";
    }
    else if (res == "netdiagnostics") {
      this.productName = "NetDiagnostics";
      document.title = "Cavisson NetDiagnostics Enterprise";
    }
    else if (res == "netcloud") {
      this.productName = "NetCloud";
      document.title = "Cavisson NetCloud";
    } else if (res == 'netocean') {
      this.productName = "NetOcean";
      document.title = "Cavisson NetOcean";

    } else if (res == 'netfunction') {
      this.productName = "NetFunction";
      document.title = "Cavisson NetFunction";
    }

    if (controllerName != "work")
      controllerName = " (" + controllerName + ")";
    else
      controllerName = "";

    this.controllerInfo = "Sign in to access " + this.productName + "" + controllerName;

    this._configService.$runningTest = runningtest;
  }

  setDataInConfigService(data) {
    this._configService.$userName = data['sesLoginName']; //this.UserNameFormControl.value;
    this._configService.$userPass = this.model.PasswordFormControl.trim();
    this._configService.$continouseMode = data['ContinuousMode'];
    this._configService.$productMode = data['productMode'];
    this._configService.$productType = data['productType'];
    this._configService.$timeZone = data['timeZoneId'];
    this._configService.$timeZoneId = data['timeZone'];
    this._configService.$workPath = data['workPath'];
    this._configService.$serverTitle = data['sessServerTitle'];
    this._configService.$serverType = data['strServerType'];
    this._configService.$testRun = sessionStorage.getItem('runningtest');
  }

  onSubmit($event) {
    try {
      this.log.debugLog('Login', 'onSubmit', 'Submit Action.');
      this.loading = true;
      this._changeDetection.detectChanges();

      if (!this.model.UserNameFormControl.trim() || !this.model.PasswordFormControl.trim()) {
        this.message = 'Invalid user name or password';
        this.loading = false;
        this._changeDetection.detectChanges();
        return;
      }

      this.dataSubscription = this._authService.validateUserBeforeLogin(this.model.UserNameFormControl.trim(), this.model.PasswordFormControl.trim())
      .subscribe(
      data => {
        if (data['status'] === 'Fail' || JSON.stringify(data) === '{}') { 
          
          if('statusCode' in data && data['statusCode'] == 115) {
              this.message = 'Could not connect to postgres server :connection refused';
          }
          else{
          this.message = 'Invalid user name or password';
          }

          this.loading = false;
          this._changeDetection.detectChanges();
        }
        else {
          this._configService.$userType = data["sessUserType"];
          this._configService.$userGroup = data["sessGroupName"];

          this._authService.login(this.model.UserNameFormControl.trim(), this.model.PasswordFormControl.trim()).subscribe(
            data => {
             this.loading = false;
             this._changeDetection.detectChanges();

              this.setDataInConfigService(data);
              let continousMode = data['ContinuousMode'];
    
              if(continousMode == 'true') {
                this._zone.run(() => {
                  this._router.navigate(['/home/dashboard']);    
                });
              }
              else {
                this._zone.run(() => {
                  this._router.navigate(['/home/testrun']);    
                });
              }
            });
        }
      });
    } catch (e) {
      this.loading = false;
      console.error(e);
    }
  }

  ngOnDestroy() {
    if(this.dataSubscription) 
      this.dataSubscription.unsubscribe();
    
    if (!this._changeDetection['destroyed'])
      this._changeDetection.detach();
  }
}
