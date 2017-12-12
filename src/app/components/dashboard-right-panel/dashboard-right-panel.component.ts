import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Logger } from '../../../vendors/angular2-logger/core';
import { Subscription } from 'rxjs/Subscription';

import { MenuNavigatorService } from '../../services/menu-navigator.service';
import { DashboardRequestHandlerService } from '../../services/dashboard-request-handler.service';
import { DashboardDataContainerService } from '../../services/dashboard-data-container.service';
import { DashboardWidgetDataService } from '../../services/dashboard-widget-data.service';

import { DashboardFavoriteData } from '../../interfaces/dashboard-favorite-data';
import { WidgetInfo } from '../../interfaces/widget-info';
import { FAVORITE_DATA_UPDATE_AVAILABLE, LOAD_MAIN_GRID, WIDGET_DATA_UPDATED } from '../../constants/action';
import { ActionInfo } from '../../containers/action-info';
import { Widget } from '../../containers/widget';
import { WidgetActionInputs } from '../../containers/widget-action-inputs';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import * as ons from 'onsenui';

@Component({
  selector: 'app-dashboard-right-panel',
  templateUrl: './dashboard-right-panel.component.html',
  styleUrls: ['./dashboard-right-panel.component.css']
})
export class DashboardRightPanelComponent implements OnInit, OnDestroy {
  widgetData: any;
  favData: DashboardFavoriteData;
  dataSubscription: Subscription;

  @ViewChild('carousel') carousel;

  totalNoOfCol = 10;
  columns: number = 2;
  colMargin: number = 5;
  rowHeight: string = '200px';

  @Output('change')
  change: EventEmitter<ActionInfo> = new EventEmitter<ActionInfo>();

  constructor( private log: Logger,
               private _changeDetection: ChangeDetectorRef,
               private _menuNavigator: MenuNavigatorService,
               private _requestHandler: DashboardRequestHandlerService,
               private _dataService: DashboardDataContainerService,
               private _widgetService: DashboardWidgetDataService,
               public _dashConfigData: DashboardConfigDataService ) { }

  ngOnInit() {
    this._dashConfigData._loadingProgress = '';
    
    this._requestHandler.getDashboardConfiguration();

    this.dataSubscription = this._dataService.favoriteDataObservable$.subscribe(
      action => {
        this.updateLayoutAndGraphs(action);
      });
    
    let subscription = this._menuNavigator.menuNavigatorObservable$.subscribe(
      action => {
         this.showHideGrid(action);
      });

    /***this is to handle the orientation of mobile view */
    ons.orientation.on('change', (event) => { 
      this.orientationEvent(event.isPortrait);
    });
  }

  showHideGrid(action) {
    try {
      switch(action.type) {
        case LOAD_MAIN_GRID: {
          this._dashConfigData._isSinglePanelViewMode = false;

          if (!this._changeDetection['destroyed']) {
            this._changeDetection.detectChanges();
          }
          break;
        }
      }
    }
    catch(e) {
      console.error(e);
    }
  }

  orientationEvent(isPortrait: boolean) {
    this.totalNoOfCol = this.calculateNumOfCol();
    if(isPortrait) {
      if(this.totalNoOfCol <= 2) {
        this.columns = this.favData.dashboardLayoutData.columns;
        this.colMargin = this.favData.dashboardLayoutData.colMargin;
        this.rowHeight = "fit";
      }
      else {
        this.columns = 2;
        this.colMargin = 5;
        this.rowHeight = window.innerHeight / 3 + 'px';
      }
    }
    else {
      if(this.totalNoOfCol <= 2) {
        this.columns = this.favData.dashboardLayoutData.columns;
        this.colMargin = this.favData.dashboardLayoutData.colMargin;
        this.rowHeight = "fit";
      }
      else {
        this.columns = 2;
        this.colMargin = 5;
        this.rowHeight = (window.innerHeight - 100) + 'px';
      }
    }
    
    if (!this._changeDetection['destroyed']) {
       this._changeDetection.detectChanges();
    }
      
    let widgetAction = new WidgetActionInputs();
    widgetAction.widgetAction = WIDGET_DATA_UPDATED;
    this._widgetService.broadcastWidgetAction(widgetAction);
  }

  updateLayoutAndGraphs(action: ActionInfo) {
    try {
      this.log.debug('Getting data from service. Action type = ', action);

      /* Checking for actions. */
      switch (action.action) {
        case FAVORITE_DATA_UPDATE_AVAILABLE:
          {
            this.favData = this._dataService.getDashboardFavoriteData();

            /* Updating Layout widgets in favorite update. */
            this._widgetService.processLayoutWidgets();
            
            /* Now processing graphs on panel. */
            this._widgetService.processFavoriteGraphData();

            /* Now getting data of processed widget. */
            this.widgetData = this._widgetService.getWidgets();
            
            /***this is to handle the orientation of mobile view */
            this.orientationEvent(ons.orientation.isPortrait());
          }
        }
      }
      catch(e) {
        console.log(e);
      }
  }

  calculateNumOfCol(): number {
   try {
     let widgetArr: Widget[] = this._widgetService.getWidgets();
     let noOfCol: number = 0;

     for(let i = 0; i < widgetArr.length; i++) {
       if((widgetArr[i].row - 1) == 0)
         noOfCol++;
     }

     return noOfCol;
   }
   catch(e) {
     console.log(e);
     return -1;
   }
  }

  onRowClicked(event) {
    let data: Widget = event;
    this._dashConfigData._loadingProgress = '';

    this._dashConfigData._isSinglePanelViewMode = true;

    if (!this._changeDetection['destroyed']) {
      this._changeDetection.detectChanges();
    }

    setTimeout(() => {
      let index = this._widgetService.getWidgets().indexOf(data);
      this.carousel.nativeElement.setActiveIndex(index);
        
      const action = new ActionInfo();
      action.currentlySelectedIndex = index;
      action.totalWidgetCount = this.favData.dashboardLayoutData.panelLayoutDTO.widgets.length;
      this.change.emit(action);
    }, 0);
  }

  myHandler(event){
    const action = new ActionInfo();
    action.currentlySelectedIndex = event.activeIndex;
    action.totalWidgetCount = this.favData.dashboardLayoutData.panelLayoutDTO.widgets.length;
    this.change.emit(action);
  }

  /**
   * Method called for any widget action.
   */
  onWidgetAction(action) {
    try{

    }
    catch(e) {

    }
  }

  ngOnDestroy() {
    if (!this._changeDetection['destroyed']) {
      this._changeDetection.detach();
    }
  }
}
