import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Logger } from '../../../vendors/angular2-logger/core';

import { ActionInfo } from '../../containers/action-info';
import { TOGGLE_SIDE_MENU, LOAD_MAIN_GRID, FAVORITE_DATA_UPDATE_AVAILABLE } from '../../constants/action';

import { DashboardFavoriteData } from '../../interfaces/dashboard-favorite-data';
import { DashboardInitDataInfo } from '../../interfaces/dashboard-init-data-info';

import { MenuNavigatorService } from '../../services/menu-navigator.service';
import { DashboardDataContainerService } from '../../services/dashboard-data-container.service';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import { DashboardWidgetDataService } from '../../services/dashboard-widget-data.service';

@Component({
  // selector: 'app-dashboard-top-panel',
  selector: 'ons-page',
  templateUrl: './dashboard-top-panel.component.html',
  styleUrls: ['./dashboard-top-panel.component.css']
})
export class DashboardTopPanelComponent implements OnInit {
  dataSubscription: Subscription;

  selectedIndex: number = 0;
  totalLength: number = 0;
  productName: string;

  favData: DashboardFavoriteData;
  configData: DashboardInitDataInfo;

  graphTime = 'Last 4 Hours';
  activeFavName = 'default';
  viewByLabel: string;

  showPagination = true;

  // flag for isOnline Test
  isOnLineTest = false;

  showTestRunNumber = false;   // this flag is used to show test run number on top panel

  totalWidgets: number;
  totalPanels: number;

  public paginator = {};

  constructor(private log: Logger,
    private _changeDetection: ChangeDetectorRef,
    private _menuNavigator: MenuNavigatorService,
    private _dataService: DashboardDataContainerService,
    public _dashConfigData: DashboardConfigDataService,
    private _dataWidgetService: DashboardWidgetDataService) { }

  ngOnInit() {
    this.dataSubscription = this._dataService.favoriteDataObservable$.subscribe(
      action => {
        this.updateTopPanelData(action);
      });
  }

  updateTopPanelData(action: ActionInfo) {
    try {
      this.log.debug('Getting data from service. Action type = ', action);

      /* Checking for actions. */
      switch (action.action) {
        case FAVORITE_DATA_UPDATE_AVAILABLE:
          {
            this.productName = this._dashConfigData.$productName.toLowerCase();
            this.favData = this._dataService.getDashboardFavoriteData();
            // this._dashConfigData.$isCompareMode = this.favData.compareMode;
            this.updateFavName();
            /* updating Time Period */
            this.graphTime = this.favData.graphTimeLabel;

            let panelNum = this._dashConfigData.$activePanelNumber;
            // In compare mode ,only Global Graph Time apply 
            // if(!this._dashConfigData.$isCompareMode) {
            //   this.graphTime = this.favData.panelData[panelNum].graphTimeLabel; //Overriding graphTime Label  as per widget selection
            //   this.selectedViewBy = this.favData.panelData[panelNum].viewByLabel;
            //  }
            //this.presetMode = this.favData.graphTimeMode;  //getting graphTime mode and disable viewBy lable in ase of WidgetWise GraphTime mode 
            
            // if (this.activeFavName === '' || this.activeFavName === '-1') {
            //   this.showFavoriteButton = false;
            // } else {
            //   this.showFavoriteButton = true;
            // }

            // if (this._dashConfigData.$isCompareMode) {
            //   this.showCompareMenu = true;
            //   this._menuNavService.toggleNavMenuAction(UPDATE_LEFT_PANEL_MENU_ON_COMPARE_ENABLE);
            //   this.lastSampleTime = this.favData.compareDataDTO[0].lastSampleTime;
            // } else {
            //   this.showCompareMenu = false;
            //   this._menuNavService.toggleNavMenuAction(UPDATE_LEFT_PANEL_MENU_ON_COMPARE_DISABLE);
            //   /*Updating Last sample time. */
            //   this.lastSampleTime = this._dataService.getDashboardFavoriteData().lastSampleTime;
            // }

            // if (this._dashConfigData.$isPatternMatchSuccess) {
            //   this.showPatternMatchTable = true;
            // } else {
            //   this.showPatternMatchTable = false;
            // }
            this.configData = this._dataService.getDashboardConfigData();


            /*Updating elapsed time. */
            // this.toggleElapsedTime();
            // this.updateElapsedTimeStamp();
            // this.toggleStopStartTestRun();
            // this.updateViewBy();
            // this.updateFavoritemenu();

            // used to get the value of pause is true or false
            // this.enablePauseResume = this.favData.pause;

            this.isOnLineTest = this.configData.isOnlineTest && !this.favData.pause;
            
            // used to show the pause resume button on top panel
            // if (this.configData.isOnlineTest && this.productName !== 'netvision' && !this.configData.cM_Mode) {
            //   this.isToShowPauseResume = true;
            // }

            /* this check is used to show the tooltip on stop test button */
            // if (this.productName === 'netdiagnostics') {
            //   if (this.isToShowStartButton === true) {
            //     this.stopTestTooltip = 'Start Session - ' + this.testRunNum;
            //   } else if (this.isToShowStopButton === true) {
            //     this.stopTestTooltip = 'Stop Session - ' + this.testRunNum;
            //   }
            // } else {
            //   this.stopTestTooltip = this.isStopOnlineTR;
            // }

            /*check for hiding test run number in case of continuous monitoring mode */
            if (this.configData.cM_Mode) {
              this.showTestRunNumber = false;
            } else {
              this.showTestRunNumber = true;
            }

            this.totalWidgets = this._dataService.getDashboardLayoutInfo().panelLayoutDTO.widgets.length;
            this.totalPanels = this._dataService.getDashboardFavoriteData().panelData.length;

            console.log('panel length = ', this.totalPanels);
            this.changeToInitialPage();
            this.log.debug('Total values are: Panels -  ', this.totalPanels, ' Widgets -- ', this.totalWidgets)
            break;
          };
      }

    }
    catch (e) {
      this.log.error('updateTopPanelData | exception is = ', e);
    }
  }

  /*Method used for getting favorite name and view by label*/
  updateFavName() {
    try {
      this.activeFavName = this.favData.favoriteName;
      this.viewByLabel = this.favData.viewByLabel;
      this.log.log('favorite name and view by label=', this.activeFavName, this.viewByLabel);
    } catch (e) {
      this.log.error('Error while getting favorite name and view by label.', e);
    }
  }

  changeToInitialPage() {
    try {
      this.changePageNumber(0);
      this._dashConfigData.$currentPage = 0;
      this._dashConfigData._isSinglePanelViewMode = false;

      if (!this._changeDetection['destroyed']) {
        this._changeDetection.detectChanges();
      }
    } catch (error) {
      this.log.error('Error while initializing Page to 0.', error);
    }
  }

  changePage($event) {
    try {
      this.log.debug('In changePage Method.', $event);
      
      // this.blockUI.start();
      this._dashConfigData._loadingProgress = '';
      this._dashConfigData.$currentPage = $event.page;
      this._dashConfigData.$totalpages = $event.pageCount;
      this._dataWidgetService.changeActivePageNumber();
      setTimeout(() => { 
        // this.blockUI.stop(); 
        this._dashConfigData._loadingProgress = 'hidden';
      }, 2000);
    //  if(this._dataService.getDashboardFavoriteData().graphTimeMode === 1){
    //    this.updateGraphTimeLabel();
    //  }
    } catch (error) {
      // this.blockUI.stop();
      this.log.error('Error while initializing Page to 0.', error);
    }
  }

  changePageNumber(val: number) {
    try {
      this.log.debug('Active Page Change: ', val);
      this.paginator = {
        activePage: val,
        ts: Date.now()
      };
      this.log.debug(' Page Change Object:', this.paginator);
    } catch (error) {
      this.log.error('Error while changing Page to ', val, error);
    }
  }

  openLeftMenu($event) {
    const action = new ActionInfo();
    action.type = TOGGLE_SIDE_MENU;
    this._menuNavigator.doAction(action);
  }

  backToMain() {
    this.changePageNumber(this._dashConfigData.$currentPage);
    this._dashConfigData._isSinglePanelViewMode = false;
    
    if (!this._changeDetection['destroyed']) {
      this._changeDetection.detectChanges();
    }

    const action = new ActionInfo();
    action.type = LOAD_MAIN_GRID;
    this._menuNavigator.doAction(action);
  }

  countChange(event) {    
    let action: ActionInfo = event;
    this.selectedIndex = action.currentlySelectedIndex + 1;
    this.totalLength = action.totalWidgetCount;

    this._dashConfigData._isSinglePanelViewMode = true;
    
    if (!this._changeDetection['destroyed']) {
      this._changeDetection.detectChanges();
    }
    
    this._dashConfigData._loadingProgress = 'hidden';
  }
}
