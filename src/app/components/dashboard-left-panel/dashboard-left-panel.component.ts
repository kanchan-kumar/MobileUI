import { Component, OnInit } from '@angular/core';
import { Logger } from '../../../vendors/angular2-logger/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuItem } from 'primeng/primeng';

import { ActionInfo } from '../../containers/action-info';
import { DashboardMenuDef } from '../../containers/dashboard-menu-def';
import { FAVORITE_TREE_UPDATE_AVAILABLE, COLLAPSE_SIDE_MENU } from '../../constants/action';

import { DashboardDataContainerService } from '../../services/dashboard-data-container.service';
import { DashboardDataProcessorService } from '../../services/dashboard-data-processor.service';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import { DashboardRequestHandlerService } from '../../services/dashboard-request-handler.service';
import { MenuNavigatorService } from '../../services/menu-navigator.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  // selector: 'app-dashboard-left-panel',
  selector: 'ons-page',
  templateUrl: './dashboard-left-panel.component.html',
  styleUrls: ['./dashboard-left-panel.component.css']
})
export class DashboardLeftPanelComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;

  favData: MenuItem[];

  constructor(private log: Logger,
    private _dataService: DashboardDataContainerService,
    private _dataUtils: DashboardDataProcessorService,
    private _dashboardConfigDataService: DashboardConfigDataService,
    private _laodFavorDataService: DashboardRequestHandlerService,
    private _menuNavigator: MenuNavigatorService) { }

  ngOnInit() {
    try {
      this.dataSubscription = this._dataService.favoriteDataObservable$.subscribe(
        action => {
          this.updateFavoriteTree(action);
        });
    } catch (e) {
      this.log.error('Error while initializing dashboard right panel component.', e);
    }
  }

  ngOnDestroy() {
    if(this.dataSubscription)
      this.dataSubscription.unsubscribe();
  }

  /**
  * Updating favorite tree structure.
  */
  updateFavoriteTree(action: ActionInfo) {
    try {
      this.log.debug('Updating Favorite tree data from service. Action type = ', action);

      /* Checking for action type */
      if (action.action === FAVORITE_TREE_UPDATE_AVAILABLE) {
        let favMenuDef: DashboardMenuDef[] = this._dataUtils.processFavoriteMenuDef(this._dataService.getDashboardFavoriteTreeData(),
          this.favMenuClick.bind(this));

        for (let i = 0; i < favMenuDef.length; i++) {
          let treeNodes: DashboardMenuDef = favMenuDef[i];

          if (treeNodes.label == 'Organize Favorites' || treeNodes.label == 'Add Favorite') {
            favMenuDef.splice(i, 1);
            i = i - 1;
          }

          if (!treeNodes.items || treeNodes.items.length == 0) {
            treeNodes.icon = 'fa-folder-o';
          }
          else {
            for (let j = 0; j < treeNodes.items.length; j++) {
              treeNodes.items[j].icon = 'fa-file-o';
            }
          }
        }

        this.favData = favMenuDef;
      }
    } catch (e) {
      this.log.error('Error while updating data in right panel widgets', e);
    }
  }

  /* Event for favorite menu click. */
  favMenuClick($event) {
    this.favoriteMenuActionHandler($event);
  }

  /* Handler for favorite menu click. */
  favoriteMenuActionHandler(event) {
    try {
      this.log.debug('DashboardMenuNavPanelComponent :  favoriteMenuActionHandler : favorite =' + event.item.label);

      if (event.item.data === event.item.label) {
        this._dashboardConfigDataService.$dashboardDefaultFavoritePath = event.item.data;
      } else {
        this._dashboardConfigDataService.$dashboardDefaultFavoritePath = event.item.data;
      }

      this._laodFavorDataService.loadFavoriteData(event);

      const action = new ActionInfo();
      action.type = COLLAPSE_SIDE_MENU;
      this._menuNavigator.doAction(action);

    } catch (e) {
      this.log.error('Error while handling favorite opertaion.', e);
    }
  }
}
