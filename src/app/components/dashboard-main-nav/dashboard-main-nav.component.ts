import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import { Subscription } from 'rxjs/Subscription';

import * as ons from 'onsenui';

@Component({
    selector: 'app-dashboard-main-nav',
    templateUrl: './dashboard-main-nav.component.html',
    styleUrls: ['./dashboard-main-nav.component.css']
})
export class DashboardMainNavComponent implements OnInit {
    productName: string = 'NetStorm';
    v: number = 0;
    setPadding: string = '9%';
    loading: string = 'hidden';
    routerSubscription: Subscription;

    constructor(public _configService: DashboardConfigDataService,
        private _router: Router,
        private _changeDetection: ChangeDetectorRef) {
        setInterval(() => {
            this.v = (this.v + 10) % 110;
        }, 800);

        /**Subscribing to router events. */
        this.routerSubscription = _router.events.subscribe((event: Event) => {
            this.handleRouterEvents(event);
        });
    }

    /**
    * Method is used for handling routing events.
    * @param event
    */
    handleRouterEvents(event: Event) {
        try {
            if (event instanceof NavigationStart) {
                this._configService._loadingProgress = '';
            }

            if (event instanceof NavigationEnd) {
                this._configService._loadingProgress = 'hidden';
            }

            if (event instanceof NavigationError) {
                this._configService._loadingProgress = 'hidden';
            }
        } catch (e) {
            console.log(e);
        }
    }

    ngOnInit() {
        let res = this._configService.$productName;
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

        if (!ons.orientation.isPortrait()) {
            this.setPadding = '5%';
        }
        else {
            if(ons.platform.isIPad()) {
              this.setPadding = '7%';
            }
            else {
              this.setPadding = '9%';
            } 
        }

        /***this is to handle the orientation of mobile view */
        ons.orientation.on('change', (event) => {
          if (!event.isPortrait) {
            if(ons.platform.isIPad()) {
              this.setPadding = '4%';
            }
            else 
              this.setPadding = '5%';
            }
            else {
              if(ons.platform.isIPad()) {
                this.setPadding = '7%';
              }
              else 
                this.setPadding = '9%';
            }

            this._changeDetection.detectChanges();
        });
    }

    backToTestRun() {
        this._router.navigate(['/home/testrun']);
    }

    ngOnDestroy() {
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
    }
}
