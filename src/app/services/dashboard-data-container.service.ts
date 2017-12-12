import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';
import { Subject } from 'rxjs/Subject';

import { DashboardFavoriteData } from '../interfaces/dashboard-favorite-data';
import { DashboardInitDataInfo } from '../interfaces/dashboard-init-data-info';
import { FavoriteTreeNodeInfo } from '../interfaces/favorite-tree-node-info';

import { ActionInfo } from '../containers/action-info';

import { FAVORITE_DATA_UPDATE_AVAILABLE, FAVORITE_TREE_UPDATE_AVAILABLE } from '../constants/action';

@Injectable()
export class DashboardDataContainerService {
  /* Dashboard configuration data. */
  private dashboardConfigData: DashboardInitDataInfo;

  /* Dashboard Favorite data. */
  private dashboardFavoriteData: DashboardFavoriteData;

  /*Observable sources for favorite data updation.*/
  private favoriteDataUpdateBroadcaster = new Subject<ActionInfo>();
  
  /* Service Observable for favorite updation broadcast. */
  favoriteDataObservable$ = this.favoriteDataUpdateBroadcaster.asObservable();

  /* Tree Data of Favorite. */
  private favTreeDataInfo: FavoriteTreeNodeInfo[] = null;

  constructor(private log: Logger) { }

  /**Setting Dashboard configuration data. */
  public getDashboardConfigData(): DashboardInitDataInfo {
    return this.dashboardConfigData;
  }

  /**Getting Dashboard configuration data. */
  public setDashboardConfigData(dashboardConfigData: DashboardInitDataInfo) {
    this.dashboardConfigData = dashboardConfigData;
  }

  /**
   * Method for updating Favorite data on service. Every time data updated in favorite, it broadcast to all subscribers.
   */
  public updateFavoriteData(favoriteData: DashboardFavoriteData) {
    try {
      console.log('Favorite data = ', favoriteData);
      
      if (favoriteData.dashboardLayoutData == null || favoriteData.dashboardLayoutData === undefined) {
        /*Assigning layouts data*/
        favoriteData.dashboardLayoutData = this.dashboardFavoriteData.dashboardLayoutData;
      } else {
        /*nothing to do here. we need to load favorite on existing layout*/
      }
          /* Assigning Favorite Data Here. */
      this.dashboardFavoriteData = favoriteData;
      this.dashboardFavoriteData.updateTS = Date.now();

       /* Creating Action Object. */
       let actionInfo = new ActionInfo();
       actionInfo.action = FAVORITE_DATA_UPDATE_AVAILABLE;
 
       /* Notify to all subscribers for new data available. */
       this.favoriteDataUpdateBroadcaster.next(actionInfo);

    } catch (e) {
      this.log.error('Error while processing and updating favorite data in service.', e);
    }
  }

  /* Updating Favorite Tree Data in Service. */
  public updateFavoriteTreeData(favTreeDataInfo: FavoriteTreeNodeInfo[]) {
    try {
      this.favTreeDataInfo = favTreeDataInfo;

      /* Creating Action Object. */
      let actionInfo = new ActionInfo();
      actionInfo.action = FAVORITE_TREE_UPDATE_AVAILABLE;

      /* Notify to all subscribers for new data available. */
      this.favoriteDataUpdateBroadcaster.next(actionInfo);
    } catch (e) {
      this.log.error('Error while processing and updating favorite tree data in service.', e);
    }
  }

  /*Getting Dashboard Favorite data. */
  public getDashboardFavoriteData() {
    return this.dashboardFavoriteData;
  }

  /*Getting Dashboard Favorite tree data. */
  public getDashboardFavoriteTreeData(): FavoriteTreeNodeInfo[] {
    return this.favTreeDataInfo;
  }

  /*Getting Layout Information from favorite.*/
  getDashboardLayoutInfo() {
    return this.dashboardFavoriteData.dashboardLayoutData;
  }
}
