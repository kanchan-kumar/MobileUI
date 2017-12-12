import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';
import { Subject } from 'rxjs/Subject';

import { Chart } from '../containers/chart';
import { ChartTitle } from '../containers/chart-title';
import { ChartType } from '../constants/chart-type.enum';

import { ActionInfo } from '../containers/action-info';
import { PAGE_DATA_UPDATE, WIDGET_CAPTION_UPDATED, WIDGET_DATA_UPDATED } from '../constants/action';
import { WidgetConfiguration } from '../containers/widget-configuration';
import { Widget, TableWidget } from '../containers/widget';
import { WidgetInfo } from '../interfaces/widget-info';
import { WidgetType } from '../constants/widget-type.enum';
import { WidgetActionInputs } from '../containers/widget-action-inputs';
import { DashboardPanelData } from '../containers/dashboard-panel-data';
import { DataWidget } from '../containers/data-widget';
import { DashboardFavoriteData } from '../interfaces/dashboard-favorite-data';

import { DashboardConfigDataService } from './dashboard-config-data.service';
import { DashboardDataValidatorService } from './dashboard-data-validator.service';
import { DashboardChartProviderService } from './dashboard-chart-provider.service';
import { TabularDataProviderService } from './tabular-data-provider.service';
import { DashboardDataContainerService } from './dashboard-data-container.service';
import { WidgetDataProcessorService } from './widget-data-processor.service';

@Injectable()
export class DashboardWidgetDataService {

  /*Observable string sources.*/
  private widgetBroadCasterService = new Subject<ActionInfo>();

  /*Service Observable for getting widget broadcast.*/
  widgetComProvider$ = this.widgetBroadCasterService.asObservable();

  private layoutConfiguration: WidgetConfiguration;
  private widgets: Widget[];
  private arrPanelData: DashboardPanelData[] = null;

  color: string[] = ["#CBD42A", "#FF6F00", "#006400", "#0E93F6", "#CC00CC", "#FFAE00", "#922427", "#0D0D0D", "#A1A1A1", "#146EFF", "#C7D109", "#8D268F", "#535055", "#EF4270",
    "#016160", "#60D060", "#666633", "#8336D2", "#F08C41", "#001621", "#EC1C44", "#36B8F2", "#E6E100", "#843230", "#CC9900", "#EC241B", "#2CAE2C", "#8336D2", "#F08C41", "#001621", "#EC1C44", "#36B8F2", "#E6E100", "#843230", "#06D48A", "#CC9900", "#EC241B", "#2CAE2C", "#538DD5", "#FF6600", "#16365C", "#EF4270", "#2DF7AE", "#504500", "#DBD600", "#533B95", "#05D600", "#D91919"
  ];

  constructor(private log: Logger,
    private _configService: DashboardConfigDataService,
    private _dataService: DashboardDataContainerService,
    private _dataValidatorService: DashboardDataValidatorService,
    private _chartProvider: DashboardChartProviderService,
    private _widgetDataProcessor: WidgetDataProcessorService,
    private _tabulerDataProvider: TabularDataProviderService) {
    /* Creating Instance for Layout configuration. */
    this.layoutConfiguration = new WidgetConfiguration();
  }

  /*
   * Processing layout widgets.
   */
  processLayoutWidgets() {
    try {
      /* Getting layout and graph data information. */
      let dashboardFavoriteData = this._dataService.getDashboardFavoriteData();
      let dashboardLayoutInfo = dashboardFavoriteData.dashboardLayoutData;

      /* Creating Widgets Based on layout data. */
      this.createAndUpdateWidgets(dashboardLayoutInfo.panelLayoutDTO.widgets);

      /*Now setting highchart global options. */
      this._chartProvider.setHighchartsDynamicOptions();
  
    } catch (e) {
      this.log.error('Error while processing data of widget.', e);
    }
  }

  /**
   * Creating/Updating dashboard widgets.
   */
  createAndUpdateWidgets(layoutWidgets: WidgetInfo[]) {
    try {
      /* Creating widgets of layout widget length. */
      this.widgets = new Array(layoutWidgets.length);

      for (let i = 0; i < layoutWidgets.length; i++) {
        let widget = layoutWidgets[i];

        /* Creating New Reference of Widget. */
        this.widgets[i] = new Widget();

        /* Copying the widget definition from layout. */
        this.widgets[i].row = widget.row + 1;
        this.widgets[i].col = widget.col + 1;
        this.widgets[i].sizex = widget.sizeX;
        this.widgets[i].sizey = widget.sizeY;
        this.widgets[i].widgetId = widget.widgetId;
        this.widgets[i].widgetType = widget.widgetType;
        this.widgets[i].widgetName = widget.name;
        this.widgets[i].widgetDescription = widget.description;
        this.widgets[i].payload = 'object:' + i;
        this.widgets[i].dataWidget = widget.dataWidget;
        this.widgets[i].tableWidget = widget.gridOptions;
        this.widgets[i].healthWidget = widget.healthWidget;
        //this.widgets[i]['color'] = this.color[i]; //tmp
      }

      // this.widgets = this.sortArray(this.widgets);
    } catch (e) {
      this.log.error('Error while creating/updating dashboard widgets.', e);
    }
  }

  /* Method is used for broadcasting widget actions */
  broadcastWidgetAction(widgetActions: WidgetActionInputs) {
    try {
      /* Handling widget Action in service. */
      switch (widgetActions.widgetAction) {
        /*Informing widgets that data is updated through favorite load/layout load etc. */
        case WIDGET_DATA_UPDATED: {
          this.log.debug('Informing widget for data update operation.');
        }
          break;
        /* Updating widget caption */
        case WIDGET_CAPTION_UPDATED: {
          let actionInfo = new ActionInfo();
          actionInfo.action = WIDGET_CAPTION_UPDATED;
          this.widgetBroadCasterService.next(actionInfo);
        }
          break;
        default: {
          this.log.warn('Running widget broadcast method with unknown operation. operation = ' + widgetActions.widgetAction);
        }
      }

      /* Creating Action Object. */
      let actionInfo = new ActionInfo();
      actionInfo.action = widgetActions.widgetAction;

      /*Observable string streams.*/
      this.widgetBroadCasterService.next(actionInfo);

    } catch (e) {
      this.log.error('Error while broadcasting widget message', e);
    }
  }

  sortArray(arr: Widget[]) {
    return arr.sort(function (a, b) {
      if (a['row'] > b['row'])
        return 1;
      else if (a['row'] < b['row'])
        return -1;
      else if (a['col'] > b['col'])
        return 1;
      else if (a['col'] < b['col'])
        return -1;
      else return 0;
    });
  }

  /**
   * Processing Favorite Graph Data and generate data for each panel.
   */
  processFavoriteGraphData() {
    try {
      let errorMsg = null;

      /* Getting layout and graph data information. */
      let dashboardFavoriteData = this._dataService.getDashboardFavoriteData();

      /* Here Checking for Dashboard Favorite Data Availability. */
      if (!this._dataValidatorService.isValidObject(dashboardFavoriteData)) {
        errorMsg = 'Error in validating favorite data. Please check the favorite and logs on server.';
        console.log(errorMsg);
        return errorMsg;
      }

      /* Now Checking for Error Code. */
      // errorMsg = this._dataValidatorService.getErrorMessageByErrorCode(dashboardFavoriteData.errorCode);
      // if (errorMsg != null) {
      //   console.log(errorMsg);
      //   return errorMsg;
      // }

      /* Now Everything is fine. lets create the data of panels. */

      /*  this.arrPanelData = new Array();  no need to empty panelData Array here because
        we need to check some panel info like zoom state, it will empty after graph processing .*/

      let arrPanelDataArr: DashboardPanelData[] = [];

      /* Tracking Widget Based on panel. */
      /* Widget Number tells that which number of widget used by panel. Widgets may be less/more than favorite panels. */
      let widgetNumber = 0;

      /* Iterating and Processing Each Panel. */
      for (let i = 0; i < dashboardFavoriteData.panelData.length; i++) {

        /* Getting and processing favorite panel Data. */
        arrPanelDataArr[i] = new DashboardPanelData();

        /*Getting Widget Number. */
        /* Here we are checking if widget is less than available panel than repeat the widget. */
        if (this.widgets.length <= widgetNumber) {
          widgetNumber = 0;
        }
        /* Getting Widget. */
        let widget = this.widgets[widgetNumber];
        arrPanelDataArr[i].widgetType = widget.widgetType;
        // console.log('Going to process widget = ', widgetNumber + ', widgetType = ' + widget.widgetType);

        /* Process Graph Type Widget. */
        this.processGraphTypeWidget(dashboardFavoriteData, widget, i, arrPanelDataArr[i]);
        if (widget.widgetType === WidgetType.DATA_TYPE_WIDGET) {
          this.processDataTypeWidget(dashboardFavoriteData, widget, i, arrPanelDataArr[i]);
        } else if (widget.widgetType === WidgetType.TABULER_TYPE_WIDGET) {
          this.processTabulerTypeWidget(dashboardFavoriteData, widget, i, arrPanelDataArr[i]);
        } else if (widget.widgetType === WidgetType.HEALTH_WIDGET) {
          widget.healthWidget = dashboardFavoriteData.dashboardLayoutData.panelLayoutDTO.widgets[widget.widgetId].healthWidget;
          this.processHealthTypeWidget(dashboardFavoriteData, widget, i, arrPanelDataArr[i]);
        }

        /* Changing Widget. */
        widgetNumber = widgetNumber + 1;
      }

      this.arrPanelData = new Array();      // empty old  panelData array object because need to override with new panelData array
      this.arrPanelData = arrPanelDataArr; // assign panels data array to global panelData array object

      /*Updating lower panel. */
      //this.updateLowerPanel();

    } catch (e) {
      console.log('Error while processing data of widget.', e);
    }
  }

  /**
 * Method is used for processing data of graph type widget.
 */
  processGraphTypeWidget(dashboardFavoriteData: DashboardFavoriteData, widget: Widget, panelNumber: number,
    panelData: DashboardPanelData) {
    try {

      /* Getting Chart Type by panel number. */
      let chartType = dashboardFavoriteData.panelData[panelNumber].chartType;
      // if (this._configService.$isCompareMode) {
      //   this._compareService.TimeFormatterForCompare();
      // }

      /* Checking if panelGraphs are avail or not */
      if (dashboardFavoriteData.panelData !== null && (dashboardFavoriteData.panelData[panelNumber].panelGraphs == null ||
        dashboardFavoriteData.panelData[panelNumber].panelGraphs.length === 0)) {
        this.log.errorLog('DashboardWidgetDataService', 'processGraphTypeWidget',
          'panelGraphs are not avail for panel num = ' + panelNumber, null, null);
        /*Checking chart object of panelData  */
        if (panelData.chart == null) {
          panelData.chart = this.getEmptyChart();
          panelData.panelNumber = panelNumber;

          if (dashboardFavoriteData.panelData[panelNumber] !== null &&
            (dashboardFavoriteData.panelData[panelNumber].panelCaption !== '' ||
              dashboardFavoriteData.panelData[panelNumber].panelCaption !== undefined)) {
            panelData.panelTitle = dashboardFavoriteData.panelData[panelNumber].panelCaption;
          }
        }
      } else {
        /* Here we are getting the chart data based on chart type in panel. */
        panelData.chart = this._chartProvider.getChartObjectByChartType(chartType, dashboardFavoriteData, panelNumber, panelData);

        /*Checking chart object of panelData  */
        if (panelData.chart == null) {
          panelData.chart = this.getEmptyChart();
        }

        panelData.panelTitle = dashboardFavoriteData.panelData[panelNumber].panelCaption;
        panelData.panelNumber = panelNumber;
        // set graphTime label on panel
        if (!panelData.isZoom) {
          panelData.graphTimeLabel = dashboardFavoriteData.panelData[panelNumber].graphTimeLabel;
        }
        let titleText = new ChartTitle();
        titleText.style = { 'fontSize': '10px', fontFamily: 'Roboto', fontWeight: '700', 'margin-top': '2px' };

        if (!panelData.isZoom && dashboardFavoriteData.graphTimeMode === 1 && !dashboardFavoriteData.compareMode) {
          let graphTimeLabel = this.getGraphTimeLabel(dashboardFavoriteData, panelNumber);
          if (graphTimeLabel === null || graphTimeLabel === undefined) {
            graphTimeLabel = '';
          }
          titleText.text = graphTimeLabel;
          panelData.chart.title = titleText;
        }

        if (panelData.isZoom) {
          if (chartType === ChartType.LINE_CHART || chartType === ChartType.AREA_CHART ||
            chartType === ChartType.STACKED_AREA_CHART || chartType === ChartType.STACKED_BAR_CHART || chartType ===
            ChartType.BAR_CHART_AVG_ALL || chartType === ChartType.BAR_CHART_AVG_BOTTOM10 || chartType ===
            ChartType.BAR_CHART_AVG_TOP10 || chartType === ChartType.BAR_CHART_AVG_TOP5 || chartType === ChartType.DUAL_AXIS_LINE ||
            chartType === ChartType.DUAL_AXIS_AREA_LINE || chartType === ChartType.DUAL_LINE_BAR ||
            chartType === ChartType.LINE_STACKED) {
            titleText.text = dashboardFavoriteData.graphTimeLabel;
            panelData.chart.title = titleText;
          }
        }
      }
      this.log.info('Panel ' + panelNumber + ' processed successfully.', panelData);
    } catch (e) {
      console.log('Error while processing data of graph type widget.', e);
    }
  }

  /**
   * Method is used for processing data of data type widget.
   */
  processDataTypeWidget(dashboardFavoriteData: DashboardFavoriteData, widget: Widget, panelNumber: number, panelData: DashboardPanelData) {
    try {
      /* Setting panel properties. */
      panelData.panelTitle = dashboardFavoriteData.panelData[panelNumber].panelCaption;
      panelData.panelNumber = panelNumber;
      /* Checking for widget type. */
      /* Header is not needed for Data Widget. */
      panelData.isHeaderReq = false;
      this._widgetDataProcessor.getDataForDataWidget(dashboardFavoriteData, widget, panelNumber, panelData);

    } catch (e) {
      console.log('Error while processing data of data type widget.', e);
    }
  }

  /**
   * Method is used for processing data of tabuler type widget.
   */
  processTabulerTypeWidget(dashboardFavoriteData: DashboardFavoriteData, widget: Widget, panelNumber, panelData: DashboardPanelData) {
    try {

      /* Setting panel properties. */
      panelData.panelTitle = dashboardFavoriteData.panelData[panelNumber].panelCaption;
      panelData.panelNumber = panelNumber;
      /* Checking for widget type. */
      panelData.isHeaderReq = true;

      this._tabulerDataProvider.getDataForTabularWidget(dashboardFavoriteData, widget, panelNumber, panelData);

    } catch (e) {
      console.log('Error while processing data of tabuler type widget.', e);
    }
  }

  /* Method is used for processing data of health type widget */
  processHealthTypeWidget(dashboardFavoriteData: DashboardFavoriteData, widget: Widget,
    panelNumber: number, panelData: DashboardPanelData) {
    try {
      panelData.panelTitle = dashboardFavoriteData.panelData[panelNumber].panelCaption;
      panelData.panelNumber = panelNumber;
      /* Header is not needed for Health Widget. */
      panelData.isHeaderReq = false;

      this._widgetDataProcessor.getDataForHealthWidgetType(dashboardFavoriteData, widget, panelNumber, panelData);
    } catch (e) {
      console.log(e);
      console.log(e);
    }
  }

  /* Getting panel data of specific panel.*/
  getPanelDataByWidgetId(widgetId: number, widgetType: number) {
    let panelNumber = widgetId + this.widgets.length * this._configService.$currentPage;
    try {
      if (panelNumber < this.arrPanelData.length) {
        return this.arrPanelData[panelNumber];
      } else {
        this.arrPanelData[panelNumber] = new DashboardPanelData();
        this.arrPanelData[panelNumber].errorCode = -1;
        this.arrPanelData[panelNumber].panelNumber = panelNumber;
        this.arrPanelData[panelNumber].panelTitle = '';
        if (widgetType === WidgetType.DATA_TYPE_WIDGET) {
          this.arrPanelData[panelNumber].isHeaderReq = false;
          this.arrPanelData[panelNumber].dataWidget = new DataWidget();
        } else {
          this.arrPanelData[panelNumber].isHeaderReq = true;
          this.arrPanelData[panelNumber].chart = this.getEmptyChart();
        }
        return this.arrPanelData[panelNumber];
      }
    } catch (e) {
      console.log('Error while getting data of panel with panel number = ' + panelNumber, e);
      return null;
    }
  }

  /** Getting Empty chart object. */
  getEmptyChart(): Chart {
    try {
      return this._chartProvider.getEmptyChart();
    } catch (e) {
      console.log('Error while getting empty chart object.', e);
    }
  }

  /** This method is responsible to return graphTime label according to selected panel number */
  getGraphTimeLabel(dashboardFavData, panelNum) {
    try {
      let graphTimeLabel = '';
      let panelData = dashboardFavData.panelData[panelNum];
      if (dashboardFavData.graphTimeMode === 1 && panelData.graphTimeLabel !== null && panelData.graphTimeLabel !== '') {
        let viewByLabel = panelData.viewByLabel;
        if (viewByLabel === '-1 Sec' && (this._configService.$productName.toLowerCase() === 'netstorm' || this._configService.$productName.toLowerCase() === 'netcloud')) {
          viewByLabel = 'Auto';
        }
        viewByLabel = viewByLabel.replace('Min', 'M');
        viewByLabel = viewByLabel.replace('Sec', 'S');
        viewByLabel = viewByLabel.replace('Month', 'M\'th');
        viewByLabel = viewByLabel.replace('Hour', 'H');
        let modiGraTime = this.getModGraphTimeLabel(panelData.graphTimeLabel);
        graphTimeLabel = modiGraTime + ' ( ' + viewByLabel + ' )';
        return graphTimeLabel;
      } else {
        return graphTimeLabel;
      }
    } catch (error) {
      console.log('Exception in getGraphTimeLabel method..', error);
      return '';
    }
  }

  /** Here we modify graphtimelabel */
  getModGraphTimeLabel(graphLabel): string {
    try {
      let arrTime = graphLabel.split(' ');
      if (arrTime.length < 5) {
        return graphLabel;
      } else {
        let modiGraphTimeLab = this.customizedGraphTimeLabel(arrTime[0]) + ' ' + arrTime[1] + ' ' + arrTime[2] + ' ' + this.customizedGraphTimeLabel(arrTime[3]) + ' ' + arrTime[4];
        return modiGraphTimeLab;
      }
    } catch (error) {
      console.log('Exception in getModGraphTimeLabel method..', error);
      return graphLabel;
    }
  }

  /**Here customize graphTime label */
  customizedGraphTimeLabel(dateToMod): string {
    try {
      let tempLabel = '';
      let tempArr = dateToMod.split('/');
      if (tempLabel === '') {
        tempLabel = tempArr[0];
      }
      tempLabel = tempLabel + '/' + tempArr[1];
      tempLabel = tempLabel + '/' + tempArr[2].substring(2, 4);
      return tempLabel;
    } catch (error) {
      console.log('Exception in modifyLabel method..', error);
      return dateToMod;
    }
  }

  /*Getting Chart type of input Panel Number. */
  getPanelChartTypeByPanelNumber(panelNum) {
    try {
      if (panelNum < this.arrPanelData.length) {
        return this._dataService.getDashboardFavoriteData().panelData[panelNum].chartType;
      } else {
        return ChartType.LINE_CHART;
      }
    } catch (e) {
      console.log('Error while getting chart type of input panel number. = ', panelNum, e);
      return 0;
    }
  }

  changeActivePageNumber() {
    try {
      this.log.debug('Widget Length:' + this.widgets.length);
      for (let k = 0; k < this.widgets.length; k++) {
        let panelNumber = k + (this._configService.$currentPage * this.widgets.length);

        if (panelNumber < this.arrPanelData.length) {
          let panelData = this.arrPanelData[panelNumber];
          this.validatePanelDataOnPageChange(panelData, this.widgets[k], panelNumber);
        }
      }
      this._configService.$activePanelNumber = this._configService.$activeWidgetId + this._configService.$currentPage * this.widgets.length;
      
      // this.updateLowerPanel();
      let actionInfo = new ActionInfo();
      actionInfo.action = PAGE_DATA_UPDATE;
      this.widgetBroadCasterService.next(actionInfo);
    } catch (e) {
      this.log.error('Error in updating Active Page Number page data', e);
    }
  }

  validatePanelDataOnPageChange(panelData, widget, panelNumber) {
    try {
      let widgetType = widget.widgetType;
      let dashboardFavoriteData = this._dataService.getDashboardFavoriteData();
      if (widgetType === WidgetType.DATA_TYPE_WIDGET && (panelData.dataWidget == null || panelData.dataWidget === undefined)) {
        this.processDataTypeWidget(dashboardFavoriteData, widget, panelNumber, panelData);
      } else if (widgetType === WidgetType.TABULER_TYPE_WIDGET && (panelData.tableWidget == null || panelData.tableWidget === undefined)) {
        this.processTabulerTypeWidget(dashboardFavoriteData, widget, panelNumber, panelData);
      }
    } catch (e) {
      this.log.error('error in validatePanelDataOnPageChange', e);
    }
  }

  /* Getting available widgets array. */
  getWidgets() {
    return this.widgets;
  }

  public get $layoutConfiguration(): WidgetConfiguration {
    return this.layoutConfiguration;
  }

  public set $layoutConfiguration(value: WidgetConfiguration) {
    this.layoutConfiguration = value;
  }
}
