import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Logger } from '../../../vendors/angular2-logger/core';
import { MenuItem, TreeNode, TreeTableModule, SharedModule } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';

import { Widget } from '../../containers/widget';
import * as jQuery from 'jquery';

import { DashboardPanelData } from '../../containers/dashboard-panel-data';
import { DashboardWidgetDataService } from '../../services/dashboard-widget-data.service';
import { DashboardMenuDef } from '../../containers/dashboard-menu-def';

import { ChartType } from '../../constants/chart-type.enum';
import { WidgetActionInputs } from '../../containers/widget-action-inputs';
import { WidgetType } from '../../constants/widget-type.enum';
import { DashboardDataContainerService } from '../../services/dashboard-data-container.service';
import { DashboardDataUtilsService } from '../../services/dashboard-data-utils.service';
import { DashboardRequestHandlerService } from '../../services/dashboard-request-handler.service';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import { DashboardRestDataApiService } from '../../services/dashboard-rest-data-api.service';
import { Highcharts } from '../../constants/common-constants';
import { UPDATE_WIDGET_ON_WIDGET_RESIZE, PAGE_DATA_UPDATE, WIDGET_DATA_UPDATED } from '../../constants/action';
import { TabularDataProviderService } from '../../services/tabular-data-provider.service';
import { ActionInfo } from '../../containers/action-info';

@Component({
  selector: 'dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.css'],
  host: { 'style': 'height:100%;width:100%'}
})
export class DashboardWidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget: Widget;

  @Input()
  isSinglePanel: boolean;

  /* Native reference of chart. */
  nativeChartRef: any;

  /* Getting Widget DOM Object */
  @ViewChild('widgetRef') widgetRef: any;
  @ViewChild('widgetRef') HChart: any;

  /* Panel Data Object Here. */
  panelData: DashboardPanelData = null;

  /* Widget Classes. */
  widgetClasses: string[] = ['dashboard-panel', 'dashboard-panel-color'];

  /* Emitting values to the parent on widget operation. */
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();

  /*Data Subscriber of service.*/
  widgetBroadcastListener: Subscription;

  //widgetDataOperationBroadCastListener: Subscription;

  widgetMenuItems: MenuItem[];

  /*Tabular widget Properties. */
  tableScrollHeight: string = null;
  tableScrollWidth: string = null;
  btTableHeight: string = null;

  widgetType: number = 1;

  constructor(private log: Logger,
    private _widgetDataService: DashboardWidgetDataService,
    private _dashboardFavoriteData: DashboardDataContainerService,
    private _requestHandler: DashboardRequestHandlerService,
    private _dataUtils: DashboardDataUtilsService,
    private _configService: DashboardConfigDataService,
    //private _widgetSettingService: DashboardWidgetSettingService,
    private _restAPI: DashboardRestDataApiService,
    private _tabularDataProviderService: TabularDataProviderService) {

    this.widgetBroadcastListener = this._widgetDataService.widgetComProvider$.subscribe(
      action => {
        this.widgetActionHandler(action);
      });
  }

  ngOnInit() {
    try {
      this.log.debug('Processing widget of widget id = ' + this.widget.widgetId);

      this.widgetType = this.widget.widgetType;
      if(this.isSinglePanel && this.widget.widgetType == 2)
        this.widgetType = 1;

      /* Now getting panel data. */
      this.panelData = this._widgetDataService.getPanelDataByWidgetId(this.widget.widgetId, this.widgetType);
     
      /*Handling widget size on widget data update. */
      this.widgetResizeHandler();

      // /* For settimg up the default  selected Widget value */
      // if (this.widget.widgetId === 0) { 
      //   this.onWidgetSelection(null); 
      // }
    } catch (e) {
      this.log.error('Error while generating widget component', e);
    }
  }

  widgetActionHandler(action: ActionInfo) {
    try {
      switch (action.action) {
        case PAGE_DATA_UPDATE:
          this.updateNewPageData();
        break;
        /* This action is used only for handling widgets sizing on data change. */
        case WIDGET_DATA_UPDATED:
          this.widgetResizeHandler();
        break;
      }
    }
    catch(e) {
      this.log.error('widgetActionHandler | exception is = ', e);
    }
  }

  updateNewPageData() {
    try {
      let panelNum = this.widget.widgetId + this._widgetDataService.getWidgets().length * this._configService.$currentPage;

      this.log.debug('Panel Number for new active Page:', panelNum);
      this.panelData = this._widgetDataService.getPanelDataByWidgetId(this.widget.widgetId, this.widget.widgetType);

      this.widgetResizeHandler();
    } catch (e) {
      this.log.error('Error while update New Active Page Data .', e);
    }
  }

  /**Method is used for handle widget resize. */
  widgetResizeHandler() {
    try {
      this.log.debug('Handling widget size on widget data update. widget = ', this.widget);

      /* Updating Widget Specific Information. */
      this.updateWidgetInfo();

      if (this.widget.widgetType === WidgetType.GRAPH_TYPE_WIDGET) {
        this.resizeAndFitChartOnPanel();
      } else if (this.widget.widgetType === WidgetType.DATA_TYPE_WIDGET) {
        this.resizeAndFitDataWidget();
      } else if (this.widget.widgetType === WidgetType.HEALTH_WIDGET) {
        this.resizeAndFitHealthWidget();
      } else if (this.widget.widgetType === WidgetType.TABULER_TYPE_WIDGET) {
        this.resizeAndFitTabularWidget();
      }
      let widgetInputs = new WidgetActionInputs();
      widgetInputs.widgetAction = UPDATE_WIDGET_ON_WIDGET_RESIZE;
      this.widgetAction.emit(widgetInputs);
    } catch (e) {
      this.log.error('Error while positioning/resizing widget based on widget type.', e);
    }
  }

  /* Method is used to resize and fit chart on panel. */
  resizeAndFitChartOnPanel() {
    try {
      this.log.debug('Resize chart on widget with widgetId = ' + this.widget.widgetId);
      this.log.debug('Widget Id = ' + this.widget.widgetId + ', width = ' +
        this.widget.widgetPanelWidth + ', height = ' + this.widget.widgetPanelHeight);

      /* Adjusting height with excluding panel header height. */
      let estimatedWidthHeight = this.widget.widgetPanelHeight - 22;

      if(this.isSinglePanel) {
        estimatedWidthHeight = window.innerHeight - 140;
      }

      /* Adjusting height of legend in Geo Map Chart type*/
      let geoMapLegendHeight = estimatedWidthHeight - 50;

      let panelChartType = ChartType.LINE_CHART;
      /*Getting panel number */
      if (this.panelData !== undefined) {
        let panelNumber = this.panelData.panelNumber;

        if (panelNumber < this._dashboardFavoriteData.getDashboardFavoriteData().panelData.length) {
          panelChartType = this._widgetDataService.getPanelChartTypeByPanelNumber(panelNumber);
        }
      }
      /* Now Resizing chart based on widget width and height. */
      if (this.nativeChartRef !== null && this.nativeChartRef !== undefined) {
        this.nativeChartRef.setSize(this.widget.widgetPanelWidth, estimatedWidthHeight);

        if (panelChartType === ChartType.GEO_MAP_AVG || panelChartType === ChartType.GEO_MAP_LAST ||
          panelChartType === ChartType.GEO_MAP_MAX || panelChartType === ChartType.GEO_MAP_MAX_OF_AVG) {
          /*This is used for incerase the height of the color Axis when resize the panel*/
          this.nativeChartRef.legend.update({ symbolHeight: geoMapLegendHeight });
          this.nativeChartRef.colorAxis[0].update({ height: geoMapLegendHeight });
        }

        if (panelChartType === ChartType.GEO_MAP_EXTENDED_AVG || panelChartType === ChartType.GEO_MAP_EXTENDED_LAST ||
          panelChartType === ChartType.GEO_MAP_EXTENDED_MAX) {

          /*This is used for incerase the height of the color Axis when resize the panel*/
          this.nativeChartRef.legend.update({ symbolHeight: geoMapLegendHeight });
          this.nativeChartRef.colorAxis[0].update({ height: geoMapLegendHeight });

          /*This Section is used for update the color of the store map point according to the color Axis. */
          let points = this.nativeChartRef.series[1].data;

          for (let index in points) {
            if (points.hasOwnProperty(index)) {
              let point = points[index];
              if (point.value !== 0) {
                let color = this.nativeChartRef.colorAxis[0].toColor(point.value, point);
                point.update({ color }, false);
              }
            }
          }
        }
      }
    } catch (e) {
      this.log.error('Error while resizing chart on panel', e);
    }
  }

    /* Method is used to resize and fit Health widget panel. */
  resizeAndFitHealthWidget() {
    try {

      this.log.debug('Resize health widget with widgetId = ' + this.widget.widgetId);
      let currentWidgetHeight = this.widget.widgetPanelHeight;

      if (currentWidgetHeight <= 20) {
        currentWidgetHeight = (this._widgetDataService.$layoutConfiguration.row_height * this.widget.sizey);
      } else {
        currentWidgetHeight = currentWidgetHeight - 23;
      }

      this.log.debug('Widget Id = ' + this.widget.widgetId + ', width = ' + this.widget.widgetPanelWidth +
        ', height = ' + currentWidgetHeight);

      /* Adjusting height with excluding panel header height. */
      this.panelData.healthWidget.healthWidgetHeight = (currentWidgetHeight) + 'px';
    } catch (e) {
      this.log.error('Error while resizing chart on panel', e);
    }
  }

  /* Method is used to resize and fit data widget panel. */
  resizeAndFitDataWidget() {
    try {

      this.log.debug('Resize data widget with widgetId = ' + this.widget.widgetId);
      let currentWidgetHeight = this.widget.widgetPanelHeight;

      if (currentWidgetHeight <= 20) {
        currentWidgetHeight = (this._widgetDataService.$layoutConfiguration.row_height * this.widget.sizey);
      } else {
        currentWidgetHeight = currentWidgetHeight - 23;
      }

      this.log.debug('Widget Id = ' + this.widget.widgetId + ', width = ' + this.widget.widgetPanelWidth +
        ', height = ' + currentWidgetHeight);

      /* Adjusting height with excluding panel header height. */
      this.panelData.dataWidget.dataWidgetHeight = (currentWidgetHeight) + 'px';

    } catch (e) {
      console.log(e);
      // this.log.error('Error while resizing chart on panel', e);
    }
  }

    /* Method is used to resize and fit tabular widget in panel. */
  resizeAndFitTabularWidget() {
    try {

      this.log.debug('Resize tabular widget with widgetId = ' + this.widget.widgetId);

      /* Getting Current Widget Width and Height. */
      this.tableScrollWidth = this.widget.widgetPanelWidth + 'px';
      let scrollHeight = this.widget.widgetPanelHeight;

      if (scrollHeight <= 20) {
        scrollHeight = (this._widgetDataService.$layoutConfiguration.row_height * this.widget.sizey) - 40;
      } else {
        scrollHeight = scrollHeight - 55;
      }

      if (scrollHeight <= 20) {
        this.btTableHeight = (this._widgetDataService.$layoutConfiguration.row_height * this.widget.sizey) - 20 + 'px';
      } else {
        this.btTableHeight = this.widget.widgetPanelHeight - 20 + 'px';
      }

      this.log.debug('Widget Id = ' + this.widget.widgetId + ', width = ' +
        this.tableScrollWidth + ', height = ' + scrollHeight);

      /* Adjusting height with excluding panel header height. */
      this.tableScrollHeight = scrollHeight + 'px';
    } catch (e) {
      // this.log.error('Error while resizing chart on panel', e);
      console.log(e);
    }
  }

  /* Getting Chart Native Reference. */
  load(nativeChartRef) {
    try {
      this.nativeChartRef = nativeChartRef;  
      this.log.debug('Now chart width = ' + this.nativeChartRef['chartWidth'] +
        ', and chart height = ' + this.nativeChartRef['chartHeight']);
        setTimeout(()=> {
          /*Updating Widget Information. */
            this.updateWidgetInfo();
      
          /* Now resizing chart on Panel. */
            this.resizeAndFitChartOnPanel();
        }, 0);

      let chartType = this._widgetDataService.getPanelChartTypeByPanelNumber(this.panelData.panelNumber);
      // if (this._configService.$isCompareMode) {
      //   if (!this._dataUtils.isPercentileGraph(chartType) && !this._dataUtils.isSlabCountGraph(chartType)) {
      //     this.nativeChartRef['xAxis'][0].update({ type: '' });
      //     this.nativeChartRef['xAxis'][0].update({
      //       labels: {
      //         formatter: function () {
      //           let val = Highcharts.dateFormat('%W', this.value);
      //           return val;
      //         }
      //       }
      //     });
      //     this.nativeChartRef['xAxis'][0].update({ categories: null });
      //   } else if (this._dataUtils.isPercentileGraph(chartType)) {
      //     if (!(chartType === ChartType.PERCENTILE_BAR_CHART) && !(chartType === ChartType.PERCENTILE_STACKED_BAR_CHART)) {
      //       this.nativeChartRef['xAxis'][0].update({ categories: null });
      //     }
      //     this.nativeChartRef['xAxis'][0].update({
      //       labels: {
      //         formatter: function () {
      //           return this.value;
      //         }
      //       }
      //     });
      //   } else if (this._dataUtils.isSlabCountGraph(chartType)) {
      //     this.nativeChartRef['xAxis'][0].update({
      //       labels: {
      //         formatter: function () {
      //           return this.value;
      //         }
      //       }
      //     });
      //   }
      // }
      
      /* For setting plotband color null when converting any other chart type fro meter or dial. */
      if (chartType === ChartType.DIAL_CHART_AVG || chartType === ChartType.DIAL_CHART_LAST || chartType === ChartType.METER_CHART_AVG
        || chartType === ChartType.METER_CHART_LAST) {
        let plotBandColor = this.panelData.chart.yAxis.plotBands;
        this.nativeChartRef['yAxis'][0].update({ plotBands: plotBandColor });
      }

    } catch (e) {
      this.log.error('Error while getting native chart object on load event.', e);
    }
  }

/*Updating widget information including widget width and height. */
updateWidgetInfo() {
  try {
    /* Getting Current Widget Width and Height. */
    let currentWidgetWidth = this.widgetRef['nativeElement'].clientWidth;
    let currentWidgetHeight = this.widgetRef['nativeElement'].clientHeight;

    if (currentWidgetWidth > 0) {
      this.widget.widgetPanelWidth = currentWidgetWidth;
    }

    if (currentWidgetHeight > 0) {
      this.widget.widgetPanelHeight = currentWidgetHeight;
    }

    /*Now updating the caption width. */
    if (this.panelData === undefined || this.panelData === null) {
      this.panelData = this._widgetDataService.getPanelDataByWidgetId(this.widget.widgetId, this.widget.widgetType);
    }
    this.adjustPanelCaption();

  } catch (e) {
    this.log.error('Error while generating widget information.', e);
  }
}

  /**Method is used for adjusting panel caption width based on widget width. */
  adjustPanelCaption() {
    try {
      this.log.debug('lastNForPanelCaption value in widget component..', this._configService.$lastNForPanelCaption);
      let valueOfLastN = this._configService.$lastNForPanelCaption;
      let length = valueOfLastN.slice(5, 6);
      let lengthOfLastN = parseInt(length, 2);
      if (this.widget === undefined || this.widget.widgetPanelWidth <= 0) {
        this.log.info('Widget width not available for widget Id = ' + this.widget.widgetId);
        return;
      }
      let title = this.panelData.originalPanelTitle;
      let widgetCaption = '';
      if (title == null || title === undefined) {
        widgetCaption = this.panelData.panelTitle;
      } else {
        let index = title.indexOf('-');
        let fullVector = title.slice(index + 1);
        this.log.debug('vector name is.', fullVector);
        if (title.endsWith(fullVector)) {
          let vecName = fullVector.split('>');
          let graphLength = (title.length) - (fullVector.length);
          let graphName = title.substring(0, graphLength);
          let panelTitle = '';
          let finalCaption;
          if (lengthOfLastN === undefined && vecName.length >= 2) {
            let defaultLength = vecName.length - 2;
            for (let i = defaultLength; i < vecName.length; i++) {
              if (i === defaultLength && !(title.length === fullVector.length)) {
                panelTitle += vecName[i];
              } if (i !== defaultLength && !(title.length === fullVector.length)) {
                panelTitle += '>' + vecName[i];
              } if (title.length === fullVector.length) {
                if (i === defaultLength) {
                  panelTitle += vecName[i];
                } else {
                  panelTitle += '>' + vecName[i];
                }
              }
            }
            if (title.length === fullVector.length) {
              finalCaption = panelTitle;
            } else {
              finalCaption = graphName + panelTitle;
            }
            widgetCaption = finalCaption;
            this.panelData.panelTitle = widgetCaption;
            this.log.debug('widgetCaption is.', widgetCaption);
          } else if (lengthOfLastN !== undefined && vecName.length >= lengthOfLastN) {
            let len = vecName.length - lengthOfLastN;
            for (let i = len; i < vecName.length; i++) {
              if (i === len && !(title.length === fullVector.length)) {
                panelTitle += vecName[i];
              } if (i !== len && !(title.length === fullVector.length)) {
                panelTitle += '>' + vecName[i];
              } if (title.length === fullVector.length) {
                if (i === len) {
                  panelTitle += vecName[i];
                } else {
                  panelTitle += '>' + vecName[i];
                }
              }
            }
            if (title.length === fullVector.length) {
              finalCaption = panelTitle;
            } else {
              finalCaption = graphName + panelTitle;
            }
            widgetCaption = finalCaption;
            this.log.debug('widgetCaption', widgetCaption);
          }
        }
      }
      /*Checking if no condition matched.*/
      if (widgetCaption === undefined || widgetCaption === '') {
        widgetCaption = this.panelData.originalPanelTitle;
      }
      this.panelData.panelTitle = widgetCaption;

      /*Now Calculation the text truncation.*/
      /*Based on font size 12px - Need to change if font size is changed in future. Size of 4 icons.*/
      let iconWidth = 90;

      /*In Case of Data Type Widget, widget only have one icon.*/
      if (this.widget.widgetType === WidgetType.DATA_TYPE_WIDGET || this.widget.widgetType === WidgetType.HEALTH_WIDGET) {
        iconWidth = 30;
      }

      /*Checking if panel Caption is already processed before. */
      if (this.panelData.originalPanelTitle !== null) {
      } else {
        /*Setting for later use in resize widget as panel caption must use original(without trimmed). */
        this.panelData.originalPanelTitle = widgetCaption;
      }

      /*Now Calculating widget Caption area.*/
      let widgetCaptionArea = this.widget.widgetPanelWidth - iconWidth;

      /*Now according to font size 12 px. One character taking 7px approx. So calculating avail characters to show in caption area.*/
      let numWidgetCaptionChars = widgetCaptionArea / 7;

      if (widgetCaption !== null && numWidgetCaptionChars > 0 && widgetCaption.length > numWidgetCaptionChars) {
        this.panelData.panelTitle = String(widgetCaption).substring(0, numWidgetCaptionChars) + '..';
      }
    } catch (e) {
      this.log.error('Error while adjusting panel caption of widget = ' + this.widget.widgetId, e);
    }
  }

  ngOnDestroy() {
    if(this.widgetBroadcastListener)
      this.widgetBroadcastListener.unsubscribe();
  }
}
