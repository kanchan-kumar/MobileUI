import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';

import { FavoriteTreeNodeInfo } from '../interfaces/favorite-tree-node-info';
import { DashboardMenuDef } from '../containers/dashboard-menu-def';

@Injectable()
export class DashboardDataProcessorService {

  constructor( private log: Logger ) { }

  /* Method is used for processing favorite menu and make compatible to menu widget. */
  processFavoriteMenuDef(favNodeInfo: FavoriteTreeNodeInfo[], onFavMenuClick): DashboardMenuDef[] {
    try {

       /* List of favorite tree nodes. */
       let arrFavMenu = new Array();

       /* Iterating existing tree nodes. */
       for (let i = 0; i < favNodeInfo.length; i++) {

         /* Getting Name. */
         let name = favNodeInfo[i].node;
         let items = null;

         /* Creating Menu here. */
         let dashboardMenuDef = new DashboardMenuDef(name, null, items, null);

         /*adding node relative path in favorite object*/
          dashboardMenuDef.menuData = favNodeInfo[i].nodeRelPath;

         /* Checking if menu has sub menu. */
         if (favNodeInfo[i].favoriteTreeDTO !== undefined &&  favNodeInfo[i].favoriteTreeDTO !== null &&
          favNodeInfo[i].favoriteTreeDTO.length > 0) {
            dashboardMenuDef.setSubMenuArr = this.processFavoriteMenuDef(favNodeInfo[i].favoriteTreeDTO, onFavMenuClick);
         } else {
            dashboardMenuDef.commandEvt(onFavMenuClick);
         }

         arrFavMenu.push(dashboardMenuDef);
         /* used for separator */
          if (name === 'Add Favorite') {
            dashboardMenuDef.separator = true;
          }
       }
      return arrFavMenu;
    } catch (e) {
      this.log.error('Error while processing favorite menu.', e);
      return null;
    }
  }
}
