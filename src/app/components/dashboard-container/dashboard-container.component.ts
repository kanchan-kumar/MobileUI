import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DashboardLeftPanelComponent } from '../dashboard-left-panel/dashboard-left-panel.component';
import { DashboardTopPanelComponent } from '../dashboard-top-panel/dashboard-top-panel.component';
import { MenuNavigatorService } from '../../services/menu-navigator.service';
import { Subscription } from 'rxjs/Subscription';
import { ActionInfo } from '../../containers/action-info';
import { TOGGLE_SIDE_MENU, COLLAPSE_SIDE_MENU } from '../../constants/action';
import { Logger } from '../../../vendors/angular2-logger/core';

import * as ons from 'onsenui';

@Component({
  // selector: 'ons-page',
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css']
})

export class DashboardContainerComponent implements OnInit, OnDestroy {

  leftSidePage = DashboardLeftPanelComponent;
  topPanelPage = DashboardTopPanelComponent;
  @ViewChild('splitter') splitter;
  menuSubscription: Subscription;

  setTop: string = '10%';

  constructor(private _menuNavigator: MenuNavigatorService,
    private log: Logger) {
    this.menuSubscription = this._menuNavigator.$menuObservable.subscribe(action => this.handleMenuNavigation(action));
  }

  ngOnInit() {
    let screenTestMode = ons.orientation.isPortrait();

    if(screenTestMode) {
      this.setTop = '6%';
    }
    else {
      if(ons.platform.isIPad()) {
        this.setTop = '6%';
      }
      else 
        this.setTop = '10%';
    }

    /***this is to handle the orientation of mobile view */
    ons.orientation.on('change', (event) => {
      if (!event.isPortrait) {
        this.setTop = '10%';
      }
      else {
        this.setTop = '6%';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.menuSubscription !== undefined) {
      this.menuSubscription.unsubscribe();
    }
  }

  handleMenuNavigation(action: ActionInfo) {
    try {
      this.log.debugLog('DashboardContainer', 'handleMenuNavigation', 'action = ' + action.type);
      switch (action.type) {
        case TOGGLE_SIDE_MENU: {
          this.splitter.nativeElement.side.open();
          break;
        }
        case COLLAPSE_SIDE_MENU: {
          this.splitter.nativeElement.side.close();
          break;
        }
      }
    } catch (e) {
      this.log.errorLog('DashboardContainer', 'handleMenuNavigation', 'action = ' + action.type, e);
    }
  }
}
