import { Injectable, NgZone } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';

import * as jQuery from 'jquery';
import * as highcharts from 'highcharts/highcharts.src';

import * as moment from 'moment';
import 'moment-timezone';

import { HighchartExport } from '../constants/common-constants';

import { ChartType } from '../constants/chart-type.enum';
import { Chart, Series } from '../containers/chart';
import { ChartSeries } from '../containers/chart-series';
import { ChartSeriesPoint } from '../containers/chart-series-point';
import { ChartOptions } from '../containers/chart-options';
import { ChartxAxis } from '../containers/chartx-axis';
import { ChartyAxis, YAxisLabel } from '../containers/charty-axis';
import { ChartLegend } from '../containers/chart-legend';
import { ChartTitle } from '../containers/chart-title';
import { Highcharts } from '../constants/common-constants';
import { HighchartMore } from '../constants/common-constants';
import { YAxis, DualChartyAxis } from '../containers/dual-charty-axis';
import { ChartSeriesEvents } from '../containers/chart-series-events';
import { HighMapChart } from '../containers/high-map-chart';
//import { ChartTooltip } from '../containers/chart-tooltip';
//import { ChartTooltipFormatter } from '../containers/chart-tooltip-formatter';
import { ChartPlotOptions, PlotOptions, Dial, Pivot, DataLabel } from '../containers/chart-plot-options';
import { PaneOptions } from '../containers/pane-Options';

import { DashboardConstants, usaStateMap } from '../constants/dashboard-constants';
import { DashboardPanelData } from '../containers/dashboard-panel-data';
import { DashboardFavoriteData } from '../interfaces/dashboard-favorite-data';

//import { DashboardChartEventHandlerService } from '../services/dashboard-chart-event-handler.service';
//import { DashboardWidgetSettingService } from '../services/dashboard-widget-settings.service';
import { DashboardDataValidatorService } from '../services/dashboard-data-validator.service';
import { DashboardConfigDataService } from './dashboard-config-data.service';
import { DashboardDataContainerService } from '../services/dashboard-data-container.service';
import { DashboardDataUtilsService } from '../services/dashboard-data-utils.service';

/*Adding Highchart More dependency Here. */
HighchartMore(highcharts);
// HighchartData(highcharts);
// HighchartBoostCanvas(highcharts);
// HighchartBoost(highcharts);
// HighchartNoDataToDisplay(highcharts);
HighchartExport(highcharts);
// HighchartExportOffline(highcharts);

/*Import highmap js */
// Highmap(highcharts);

/*Import Exporting js*/
HighchartExport(highcharts);


declare namespace Highcharts {
  export interface GlobalOptions {
    timezone: any;
  }
}

/**
 * Service is used for creating chart based on chart Type.
 */
@Injectable()
export class DashboardChartProviderService {
  isEnableCrosshairInChart = true;
  isEnableGridLineInChart = true;

  /*Defining Highcharts global. */
  Highcharts: highcharts.Static;

  constructor(private log: Logger, private _dataVaildator: DashboardDataValidatorService,
    private _config: DashboardConfigDataService, private _dataService: DashboardDataContainerService,
    private _utilsService: DashboardDataUtilsService,
    private _constants: DashboardConstants,
    private ngZone: NgZone ) {

    /* Assigning to current service. */
    this.Highcharts = Highcharts;
    /* Setting Highchart global options. */
    this.setChartGlobalOptions();
    /*Apply code for tooltip delay. */
    this.HighchartTooltipDelay(this.Highcharts);

    /* Putting the definition of service in global object for handling callback methods. */
    window['chartProviderService'] = {
      zone: this.ngZone,
      service: this
    };
  }

    /**
   * Setting Legends on chart like line, Bar, stacked Bar etc.
   */
  applyLegendSettings(legendPosition: string, legend: ChartLegend) {
    try {
      legend.floating = false;
      // legend.useHTML = true;                    /* To enable the use of HTML in the legend. */
      legend.itemStyle = {
        'cursor': 'pointer',
        'fontSize': 11
      };

      legend.labelFormatter = function () {
        let legendArrayGraphName = this.name;
        if (legendArrayGraphName.length > 18) {
          legendArrayGraphName = legendArrayGraphName.substring(0, 15).concat('...');
        }
        return '<span title = \'' + this.name + '\'>' + legendArrayGraphName + ' </span>';
      }
      if (legendPosition === 'right' || legendPosition === 'left') {
        legend.verticalAlign = 'top';
        legend.layout = 'vertical';
        legend.align = legendPosition;
        legend.margin = 100;
        legend.maxHeight = undefined;     /* To set the height of the legend in order to view it. */
        legend.margin = undefined;                      /* To set the margin of the legends dynamically. */
        legend.padding = undefined;                     /* To set the padding of the legends dynamically. */
      } else {
        legend.verticalAlign = 'bottom';
        legend.layout = 'horizontal';
      }

    } catch (e) {
      this.log.error('Error while setting legend on chart', e);
    }
  }

  /**
   * Setting chart Configuration Based on keywords.
   * @returns {undefined}
   */
  setChartGlobalOptions() {
    try {
      /*Checking for Monitoring Mode.*/
      let chartAnimation = false;
      let chartMouseTrackingProp = true;
      let strictlyTrackingProp = false;
      let chartShadow = false;

      /*Default Options.*/
      this.Highcharts.setOptions({
        plotOptions: {
          area: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          line: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          spline: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          series: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          solidgauge: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          pie: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          column: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          bar: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          gauge: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          },
          areaspline: {
            animation: chartAnimation,
            enableMouseTracking: chartMouseTrackingProp,
            stickyTracking: strictlyTrackingProp,
            shadow: chartShadow,
            dataLabels: { style: { 'textShadow': 'false' } }
          }
        },
        chart: {
          reflow: false,
          backgroundColor: null,
          plotShadow: false,
          plotBorderWidth: 0,
          spacingBottom: 4,
          spacingTop: 6,
          spacingLeft: 3,
          spacingRight: 3,
          resetZoomButton: {
            theme: {
              display: 'none'
            }
          },
          events: {
            redraw: function () {
              console.log('highcharts redraw, rendering-done');
              jQuery('body').addClass('rendering-done');
            }
          },
          animation: chartAnimation
        },
        exporting: {
          enabled: true,
          chartOptions: {
            xAxis: {
              labels: {
                style: {
                  fontSize: '10px',
                  fontWeight: '500'
                }
              }
            },
            yAxis: {
              labels: {
                style: {
                  fontSize: '10px',
                  fontWeight: '500'
                }
              }
            }
          }
        },
        tooltip: {
          enabled: true,
          useHTML: true,
          animation: chartAnimation,
          hideDelay: 1,
          followPointer: false,
          style: {
            width: '200px'
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        yAxis: {
          title: { margin: 5, text: '' },
          labels: {
            style: {
              fontSize: '10px',
              fontWeight: '500'
            }
          }
        },
        xAxis: {
          labels: {
            style: {
              fontSize: '10px',
              fontWeight: '500'
            }
          }
        },
        lang: {
          noData: 'Data Not Available',
          loading: 'Data Not Available',
          thousandsSep: ','
        },
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '11px',
            color: '#303030'
          }
        },
        navigation: {
          buttonOptions: {
            height: 1,
            width: 2,
            symbolSize: 12,
            symbolX: 5,
            symbolY: 15,
            symbolStrokeWidth: 2,
            verticalAlign: 'bottom',
            align: 'left',
            y: -5,
          }
        }
      });
    } catch (e) {
      this.log.error('Error while setting highchart global option in chart.', e);
    }
  }

  /**Method is used for delay in tooltip upto specified seconds. */
  HighchartTooltipDelay(H) {
    try {
      let timerId = {};
      H.wrap(H.Tooltip.prototype, 'refresh', function (proceed) {
        if (this.shared) {
          proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
          let seriesName;
          if (Array.isArray(arguments[1])) {
            /*Can be array in case that, it's shared tooltip.*/
            seriesName = 'not_have_now_clear_id';
          } else {
            seriesName = arguments[1].series.name;
          }
          let delayForDisplay = this.chart.options.tooltip.delayForDisplay ? this.chart.options.tooltip.delayForDisplay : 1000;

          if (timerId[seriesName]) {
            clearTimeout(timerId[seriesName]);
            delete timerId[seriesName];
          }

          timerId[seriesName] = window.setTimeout(function () {
            let point = this.refreshArguments[0];
            if (point === this.chart.hoverPoint || jQuery.inArray(this.chart.hoverPoint, point) > -1) {
              proceed.apply(this.tooltip, this.refreshArguments);
            }

          }.bind({
            refreshArguments: Array.prototype.slice.call(arguments, 1),
            chart: this.chart,
            tooltip: this
          }), delayForDisplay);
        }
      });
    } catch (e) {
      this.log.error('Error while applying tooltip delay in highchart object.', e);
    }
  }

  checkConfigurationWindowSettings() {
    try {
      this.isEnableCrosshairInChart = this._dataService.getDashboardConfigData().wDConfigurationDTO['enableCrosshairInChart'];
      if (this.isEnableCrosshairInChart === undefined) {
        this.isEnableCrosshairInChart = this._dataService.getDashboardConfigData().wDConfigurationDTO['isEnableCrosshairInChart'];
      }
      this.isEnableGridLineInChart = this._dataService.getDashboardConfigData().wDConfigurationDTO['enableGridLineInChart'];
      if (this.isEnableGridLineInChart === undefined) {
        this.isEnableGridLineInChart = this._dataService.getDashboardConfigData().wDConfigurationDTO['isEnableGridLineInChart'];
      }
    } catch (error) {
      this.log.error('Error while checkConfigurationWindowSettings...', error);
    }
  }

  /*Set Highchart Dynamic options. */
  setHighchartsDynamicOptions() {
    try {

      /*Getting favorite data. */
      let config = this._dataService.getDashboardConfigData();

      this.log.debug('Setting highchart global configuration.', this.Highcharts);

      /*Checking for configuration object. */
      if (this._dataVaildator.isValidObject(config)) {
        this.setGlobalTimeZoneOffset(config.timeZoneString);
      }
    } catch (e) {
      this.log.error('Error while setting highchart dynamic options.', e);
    }
  }
  /**Setting Timezone offset in highchart. */
  setGlobalTimeZoneOffset(timeZone) {
    try {
      this.Highcharts.setOptions({
        global:
          {
            getTimezoneOffset: function (timestamp) {
              let timezoneOffset = -moment.tz(timestamp, timeZone).utcOffset();
              return timezoneOffset;
            }
          }
      });
    } catch (e) {
      this.log.error(e);
    }
  }

  /**Getting TimeZone Offset based on timestamp and timezone. */
  getTimezoneOffset(timestamp, zone) {
    let timeZoneOffset = -moment.tz(timestamp, zone).utcOffset();
    return timeZoneOffset;
  }

  /* Method is used for getting chart based on chart type. */
  getChartObjectByChartType(chartType: number, dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {
      /* Checking for Chart Type. */
      switch (chartType) {
        case ChartType.LINE_CHART:
          return this.getLineChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_GRAPH:
          return this.getLineChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_LINE_CHART:
          return this.getLineChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.AREA_CHART:
          return this.getAreaChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_AREA_CHART:
          return this.getAreaChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_AREA_CHART:
          return this.getAreaChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.STACKED_AREA_CHART:
          return this.getStackedAreaChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_STACKED_AREA_CHART:
          return this.getStackedAreaChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_STACKED_AREA_CHART:
          return this.getStackedAreaChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.STACKED_BAR_CHART:
          return this.getStackedBarChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_STACKED_BAR_CHART:
          return this.getStackedBarChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_STACKED_BAR_CHART:
          return this.getStackedBarChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.BAR_CHART_AVG_ALL:
          return this.getBarChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.BAR_CHART_AVG_TOP5:
          return this.getBarChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.BAR_CHART_AVG_TOP10:
          return this.getBarChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.BAR_CHART_AVG_BOTTOM10:
          return this.getBarChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_BAR_CHART:
          return this.getBarChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_GRAPH:
          return this.getBarChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.PIE_CHART_AVG_ALL:
          return this.getPieChartForAvgForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_LAST_ALL:
          return this.getPieChartByLastForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_AVG_TOP5:
          return this.getPieChartForAvgForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_LAST_TOP5:
          return this.getPieChartByLastForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_LAST_TOP10:
          return this.getPieChartByLastForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_AVG_TOP10:
          return this.getPieChartForAvgForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_LAST_BOTTOM10:
          return this.getPieChartByLastForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PIE_CHART_AVG_BOTTOM10:
          return this.getPieChartForAvgForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_PIE_CHART:
          return this.getPieChartForPctOrSlab(dashboardFavoriteData, panelNumber);
        case ChartType.SLAB_COUNT_PIE_CHART:
          return this.getPieChartForPctOrSlab(dashboardFavoriteData, panelNumber);

        case ChartType.DONUT_CHART_LAST:
          return this.getDonutChartBasedOnLast(dashboardFavoriteData, panelNumber);
        case ChartType.DONUT_CHART_AVG:
          return this.getDonutChartBasedOnAvg(dashboardFavoriteData, panelNumber);
        case ChartType.SLAB_COUNT_DONUT_CHART:
          return this.getDonutChartForPctOrSlab(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_DONUT_CHART:
          return this.getDonutChartForPctOrSlab(dashboardFavoriteData, panelNumber);

        case ChartType.DIAL_CHART_AVG:
          return this.getDialChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.DIAL_CHART_LAST:
          return this.getDialChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_DIAL_CHART:
          return this.getDialChartForPercentile(dashboardFavoriteData, panelNumber);
        case ChartType.SLAB_COUNT_DIAL_CHART:
          return this.getDialChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.METER_CHART_AVG:
          return this.getMeterChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.METER_CHART_LAST:
          return this.getMeterChartForNormal(dashboardFavoriteData, panelNumber);

        case ChartType.PERCENTILE_METER_CHART:
          return this.getMeterChartForPercentile(dashboardFavoriteData, panelNumber);
        case ChartType.SLAB_COUNT_METER_CHART:
          return this.getMeterChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.DUAL_AXIS_LINE:
          return this.getDualLineChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_DUAL_AXIS_LINE:
          return this.getDualLineChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_DUAL_AXIS_LINE:
          return this.getDualLineChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.DUAL_LINE_BAR:
          return this.getDualLineBarChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_DUAL_LINE_BAR:
          return this.getDualLineBarChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_DUAL_LINE_BAR:
          return this.getDualLineBarChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.LINE_STACKED:
          return this.getLineStackedChartForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_LINE_STACKED_BAR:
          return this.getLineStackedChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_LINE_STACKED_BAR:
          return this.getLineStackedChartForSlabCount(dashboardFavoriteData, panelNumber);

        case ChartType.DUAL_AXIS_AREA_LINE:
          return this.getDualAreaWithMultilineForNormal(dashboardFavoriteData, panelNumber);
        case ChartType.PERCENTILE_DUAL_AXIS_AREA_LINE:
          return this.getDualAreaWithMultiLineChartForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE:
          return this.getDualAreaWithMultiLineChartForSlabCount(dashboardFavoriteData, panelNumber);
        case ChartType.CATEGORY_STACKED_AREA_CHART:
          return this.getStackedAreaForCategoryType(dashboardFavoriteData, panelNumber);
        case ChartType.CATEGORY_STACKED_BAR_CHART:
          return this.getStackedBarForCategoryType(dashboardFavoriteData, panelNumber);

        case ChartType.GEO_MAP_AVG:
          return this.getDataForGeoMap(dashboardFavoriteData, panelNumber);
        case ChartType.GEO_MAP_LAST:
          return this.getDataForGeoMap(dashboardFavoriteData, panelNumber);
        case ChartType.GEO_MAP_MAX:
          return this.getDataForGeoMap(dashboardFavoriteData, panelNumber);
        case ChartType.GEO_MAP_MAX_OF_AVG:
          return this.getDataForGeoMap(dashboardFavoriteData, panelNumber);

        case ChartType.GEO_MAP_EXTENDED_AVG:
          return this.getDataForGeoMapExtended(dashboardFavoriteData, panelNumber);
        case ChartType.GEO_MAP_EXTENDED_LAST:
          return this.getDataForGeoMapExtended(dashboardFavoriteData, panelNumber);
        case ChartType.GEO_MAP_EXTENDED_MAX:
          return this.getDataForGeoMapExtended(dashboardFavoriteData, panelNumber);

        case ChartType.CORRELATED_MULTI_AXES_CHART_AREA:
          return this.getMultiAxesChartConfig(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.CORRELATED_MULTI_AXES_CHART_BAR:
          return this.getMultiAxesChartConfig(dashboardFavoriteData, panelNumber, dashboardPanelData);
        case ChartType.CORRELATED_MULTI_AXES_CHART_LINE:
          return this.getMultiAxesChartConfig(dashboardFavoriteData, panelNumber, dashboardPanelData);

        default:
          return this.getLineChartForNormal(dashboardFavoriteData, panelNumber);
      }

    } catch (e) {
      this.log.error('Error while creating chart object.', e);
      return null;
    }
  }

  /**
   * Updating new sample data in chart object.
   * @param newSampleData
   * @param widgetPanelData
   */
  updatePanelChartInNormalMode(newSampleData: DashboardFavoriteData, widgetPanelData: DashboardPanelData) {
    try {

      /*Getting favorite panel data. */
      let favPanelData = newSampleData.panelData[widgetPanelData.panelNumber];
      /*Checking for favorite panel data availability. */
      if (favPanelData === null || favPanelData === undefined) {
        this.log.error('Favorite panel data not available for panel number = ' + widgetPanelData.panelNumber);
        return;
      }

      /*Checking chart object availability. */
      if (widgetPanelData.chart === undefined) {
        this.log.error('Chart object not available for panel = ' + widgetPanelData.panelNumber + '. Skipping update.');
        return;
      }

      /*Note: All Graphs update handled individually because they update with whole data every time as pie/meter/dial/donut
      have one sample per graph and Percentile/Slab/Bar Top 10 etc have all time for every sample. */
      /*Now updating chart based on chart series type. It may be category type chart, normal series, pie/donut and percentile/slabs. */
      /*Getting favorite panel chart type. */
      let panelChartType = favPanelData.chartType;
      let panelNumber = widgetPanelData.panelNumber;

      if (panelChartType === ChartType.GEO_MAP_AVG
        || panelChartType === ChartType.GEO_MAP_LAST || panelChartType === ChartType.GEO_MAP_MAX
        || panelChartType === ChartType.GEO_MAP_MAX_OF_AVG) {

        widgetPanelData.chart = this.getDataForGeoMap(newSampleData, panelNumber);

      } else if (panelChartType === ChartType.GEO_MAP_EXTENDED_AVG
        || panelChartType === ChartType.GEO_MAP_EXTENDED_LAST || panelChartType === ChartType.GEO_MAP_EXTENDED_MAX) {

        widgetPanelData.chart = this.getDataForGeoMapExtended(newSampleData, panelNumber);

      } else if (panelChartType === ChartType.CORRELATED_MULTI_AXES_CHART_AREA ||
        panelChartType === ChartType.CORRELATED_MULTI_AXES_CHART_BAR ||
        panelChartType === ChartType.CORRELATED_MULTI_AXES_CHART_LINE) {

        widgetPanelData.chart = this.getMultiAxesChartConfig(newSampleData, panelNumber, new DashboardPanelData);
      } else if (panelChartType === ChartType.PIE_CHART_AVG_ALL
        || panelChartType === ChartType.PIE_CHART_AVG_BOTTOM10
        || panelChartType === ChartType.PIE_CHART_AVG_TOP10
        || panelChartType === ChartType.PIE_CHART_AVG_TOP5
        || panelChartType === ChartType.PIE_CHART_LAST_BOTTOM10
        || panelChartType === ChartType.PIE_CHART_LAST_TOP10
        || panelChartType === ChartType.PIE_CHART_LAST_TOP5
        || panelChartType === ChartType.PIE_CHART_LAST_ALL
        || panelChartType === ChartType.PERCENTILE_PIE_CHART
        || panelChartType === ChartType.SLAB_COUNT_PIE_CHART) {

        /*Updating Pie Chart Here. */
        /*Updating series data. */
        let seriesData = null;

        /*Checking for Last Type request. */
        if (panelChartType === ChartType.PIE_CHART_LAST_BOTTOM10
          || panelChartType === ChartType.PIE_CHART_LAST_TOP10
          || panelChartType === ChartType.PIE_CHART_LAST_TOP5
          || panelChartType === ChartType.PIE_CHART_LAST_ALL) {
          seriesData = this.getDataSetForPointsBasedOnLast(newSampleData, panelNumber);
        } else if (panelChartType === ChartType.PERCENTILE_PIE_CHART
          || panelChartType === ChartType.SLAB_COUNT_PIE_CHART) {
          seriesData = this.getDataSetForPointsForPctOrSlab(newSampleData, panelNumber);
        } else {
          /*All other pie type chart goes here. */
          seriesData = this.getDataSetForPieDonutBasedOnAvg(newSampleData, panelNumber);
        }

        /*Note: Other case is not handled here. It must be handled in dataset method. */
        /*Updating Pie chart data set here. */
        widgetPanelData.chart.series = seriesData;

      } else if (panelChartType === ChartType.DONUT_CHART_AVG
        || panelChartType === ChartType.DONUT_CHART_LAST
        || panelChartType === ChartType.SLAB_COUNT_DONUT_CHART
        || panelChartType === ChartType.PERCENTILE_DONUT_CHART) {

        /*Updating Donut Chart Here. */
        /*Updating series data. */
        let seriesData = null;

        /*Checking for Last Type request. */
        if (panelChartType === ChartType.DONUT_CHART_LAST) {
          seriesData = this.getDataSetForPointsBasedOnLast(newSampleData, panelNumber);
        } else if (ChartType.PERCENTILE_DONUT_CHART
          || panelChartType === ChartType.SLAB_COUNT_DONUT_CHART) {
          seriesData = this.getDataSetForPointsForPctOrSlab(newSampleData, panelNumber);
        } else {
          /*All other Donut type chart goes here. */
          seriesData = this.getDataSetForPieDonutBasedOnAvg(newSampleData, panelNumber);
        }

        /*Updating Donut chart data set here. */
        /*Note: Other case is not handled here. It must be handled in dataset method. */
        widgetPanelData.chart.series = seriesData;

      } else if (panelChartType === ChartType.BAR_CHART_AVG_BOTTOM10
        || panelChartType === ChartType.BAR_CHART_AVG_TOP10
        || panelChartType === ChartType.BAR_CHART_AVG_TOP5
      ) {

        /*Updating Bar Chart Here. */
        /*Updating series data. */
        let seriesData = this.getDataSetForSeries(newSampleData, panelNumber);

        /*Updating Dial chart data set here. */
        widgetPanelData.chart.series[0].data = seriesData;

      } else if (panelChartType === ChartType.DIAL_CHART_AVG
        || panelChartType === ChartType.DIAL_CHART_LAST
        || panelChartType === ChartType.SLAB_COUNT_DIAL_CHART
        || panelChartType === ChartType.PERCENTILE_DIAL_CHART) {

        /*Updating Dial Chart Here. */
        /*Updating series data. */
        let seriesData = null;

        /*Checking for Last Type request. */
        if (panelChartType === ChartType.PERCENTILE_DIAL_CHART
          || panelChartType === ChartType.SLAB_COUNT_DIAL_CHART) {
          seriesData = this.getDataSetForDialMeterForPctOrSlab(newSampleData, panelNumber);
        } else {
          /*All other Dial type chart goes here. */
          seriesData = this.getDataSetForDialMeterForNormalType(newSampleData, panelNumber);
        }

        /*Updating Dial chart data set here. */
        widgetPanelData.chart.series[0].data = new Array(seriesData);

      } else if (panelChartType === ChartType.METER_CHART_AVG
        || panelChartType === ChartType.METER_CHART_LAST
        || panelChartType === ChartType.SLAB_COUNT_METER_CHART
        || panelChartType === ChartType.PERCENTILE_METER_CHART) {
        /*Updating Meter Chart Here. */
        /*Updating series data. */
        let seriesData = null;

        /*Checking for Last Type request. */
        if (panelChartType === ChartType.PERCENTILE_METER_CHART
          || panelChartType === ChartType.SLAB_COUNT_METER_CHART) {
          seriesData = this.getDataSetForDialMeterForPctOrSlab(newSampleData, panelNumber);
        } else {
          /*All other Meter type chart goes here. */
          seriesData = this.getDataSetForDialMeterForNormalType(newSampleData, panelNumber);
        }

        /*Updating Meter chart data set here. */
        widgetPanelData.chart.series[0].data = new Array(seriesData);

      } else if (panelChartType === ChartType.PERCENTILE_GRAPH
        || panelChartType === ChartType.PERCENTILE_AREA_CHART
        || panelChartType === ChartType.PERCENTILE_DUAL_AXIS_LINE
        || panelChartType === ChartType.PERCENTILE_STACKED_AREA_CHART
        || panelChartType === ChartType.PERCENTILE_DUAL_LINE_BAR
        || panelChartType === ChartType.PERCENTILE_BAR_CHART
        || panelChartType === ChartType.PERCENTILE_STACKED_BAR_CHART
        || panelChartType === ChartType.PERCENTILE_LINE_STACKED_BAR) {

        /*Updating Percentile Chart Here. */
        /*Updating series data. */
        let seriesData = null;

        /*Updating Percentile Chart Here. */
        if (panelChartType === ChartType.PERCENTILE_DUAL_AXIS_LINE) {
          seriesData = this.getDataSetForPercentileForDualAxis(newSampleData, panelNumber, widgetPanelData);
        } else if (panelChartType === ChartType.PERCENTILE_DUAL_LINE_BAR) {
          seriesData = this.getDataSetForDualLineBarPercentile(newSampleData, panelNumber, widgetPanelData);
        } else if (panelChartType === ChartType.PERCENTILE_BAR_CHART
          || panelChartType === ChartType.PERCENTILE_STACKED_BAR_CHART) {
          seriesData = this.getDataSetForPctForColumnType(newSampleData, panelNumber);
        } else if (panelChartType === ChartType.PERCENTILE_LINE_STACKED_BAR) {
          seriesData = this.getDataSetForLineStackedPercentile(newSampleData, panelNumber, widgetPanelData);
        } else {
          /*All Other chart type of percentile goes here. */
          seriesData = this.getDataSetForPercentile(newSampleData, panelNumber, widgetPanelData);
        }

        /*Updating percentile data. */
        widgetPanelData.chart.series = seriesData;

      } else if (panelChartType === ChartType.SLAB_COUNT_GRAPH
        || panelChartType === ChartType.SLAB_COUNT_LINE_CHART
        || panelChartType === ChartType.SLAB_COUNT_AREA_CHART
        || panelChartType === ChartType.SLAB_COUNT_LINE_STACKED_BAR
        || panelChartType === ChartType.SLAB_COUNT_DUAL_AXIS_LINE
        || panelChartType === ChartType.SLAB_COUNT_STACKED_BAR_CHART
        || panelChartType === ChartType.SLAB_COUNT_STACKED_AREA_CHART
        || panelChartType === ChartType.SLAB_COUNT_DUAL_LINE_BAR
        || panelChartType === ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE) {

        /*Updating Slab Count Chart Here. */
        /*Updating series data. */
        let seriesData = null;

        /*Updating Slab Count Graph Here. */
        if (panelChartType === ChartType.SLAB_COUNT_DUAL_AXIS_LINE) {
          seriesData = this.getDataSetForSlabCountForDualAxis(newSampleData, panelNumber);
        } else if (panelChartType === ChartType.SLAB_COUNT_DUAL_LINE_BAR) {
          seriesData = this.getDataSetForSlabCountForDualAxisLineBar(newSampleData, panelNumber);
        } else if (panelChartType === ChartType.SLAB_COUNT_LINE_STACKED_BAR) {
          seriesData = this.getDataSetForLineStackedSlabCount(newSampleData, panelNumber);
        } else if (panelChartType === ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE) {
          seriesData = this.getDataSetForAreaWithMultilineForSlabCount(newSampleData, panelNumber);
        } else {
          /*All Other chart type of Slab Count Type goes here. */
          seriesData = this.getDataSetForSlabCount(newSampleData, panelNumber);
        }

        /*Updating Slab Count Graph data. */
        widgetPanelData.chart.series = seriesData;

      } else {
        this.log.debug('Updating Series with new sample data on panel = ' + panelNumber);
        let totalSamples = newSampleData.totalSamples;
        let arrTimestamp = newSampleData.arrTimestamp;

        /**Changing Timestamp and total samples based on panel wise graph time. */
        if (newSampleData.graphTimeMode === 1) {
          totalSamples = favPanelData.totalSamples;
          arrTimestamp = favPanelData.arrTimeStamp;
        }

        /*Getting Number of graphs. */
        let numGraphs = favPanelData.numGraphs;

        /*Note: For Dual Graph, graph data is created only for 2 graphs. */
        if (panelChartType === ChartType.DUAL_LINE_BAR || panelChartType === ChartType.DUAL_AXIS_LINE) {
          numGraphs = 2;
        }

        for (let k = 0; k < numGraphs; k++) {
          let panelGraph = favPanelData.panelGraphs[k];

          /*Checking for valid panel graph. */
          if (panelGraph === null || panelGraph === undefined) {
            this.log.warn('Graph data not available for graph = ' + k + ' and panel = ' + panelNumber +
              '. Skip updating series of graph.');
            continue;
          }

          /*Checking for chart series.*/
          if (widgetPanelData.chart.series[k] === undefined || widgetPanelData.chart.series[k] === null) {
            this.log.warn('Series data not available for graph = ' + k + ' and panel = ' +
              panelNumber + '. Skip updating series of graph.');
            continue;
          }

          /*Getting panel graph series. */
          let chartSeries = widgetPanelData.chart.series[k].data;

          /*Now Iterating through samples. */
          for (let i = 0; i < totalSamples; i++) {
            /* Creating Instance of one series. */
            let chartSeriesData = new Array();

            chartSeriesData.push(arrTimestamp[i]);
            /*Checking for NaN samples. */
            if (panelGraph.graphData[i] === this._constants.NAN_SAMPLES) {
              chartSeriesData.push(null);
            } else {
              chartSeriesData.push(panelGraph.graphData[i]);
            }

            /*Checking for moving samples in last N View. */
            /*In Last N View first sample must be removed from series. */
            if (newSampleData.isMovingGraph) {
              chartSeries.splice(0, 1);
            }

            /* Adding series point in series data. */
            chartSeries.push(chartSeriesData);
          }
          /*Updating series data. */
          widgetPanelData.chart.series[k].data = chartSeries;
        }
      }
    } catch (e) {
      this.log.error('Error in updating panel chart data for panel', e);
    }
  }
  

  // /*This Method is used to listen the chart series click Event. */
  // chartEventHandler($event) {
  //   try {
  //     let graphName = $event['point']['series']['name'];
  //     let panelNumber = $event['point']['series']['chart']['userOptions']['panelNumber'];
  //     console.log('chart event handler method called with graph Name = ', graphName, panelNumber);
  //     this._chartEventHandlerService.highlightGraphFromPanel(graphName, panelNumber);
  //   } catch (error) {
  //     console.error('Exception while listen the series click event from chart panel. ', error);
  //   }
  // }

  // /*This Method is used to listen the chart series click Event for Pie and Donut Chart */
  // chartEventHandlerForPieOrDonut($event) {
  //   try {
  //     let graphName = $event['point']['name'];
  //     let panelNumber = parseInt($event['point']['description'], 0);
  //     console.log('chart event handler method called with graph Name = ', graphName, panelNumber);
  //     this._chartEventHandlerService.eventViewerInPie(graphName, panelNumber);
  //     this._chartEventHandlerService.highlightGraphFromPanel(graphName, panelNumber);
  //   } catch (error) {
  //     console.error('Exception while listen the series click event from chart panel. ', error);
  //   }
  // }

  /*This method is used to listen the click event when click on the previous button. */
  previousButtonClickEventHandler($event) {
    try {
      let panelNumber = this['userOptions']['panelNumber'];
      window['chartProviderService'].zone.run((() => {
        window['chartProviderService'].service._chartEventHandlerService.generateGeoMapFromPreviousButton(panelNumber);
      }));
    } catch (error) {
      console.error('Exception while click on the previous button in Geo Map. ', error);
    }
  }

  /**
   * Creating DataSet for Line/Bar/stacked etc for Normal Graph Type.
   * Line/Bar/Area Chart can have many type of dataset including series, category etc.
   */
  getDataSetForSeries(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;
      /* Getting Timestamp array. */
      let arrTimestamp = dashboardFavoriteData.arrTimestamp;

      /* Getting total samples. */
      let totalSamples = dashboardFavoriteData.totalSamples;

      /*Handlig for widgetWise GraphTime */
      if (this.isWidgetWiseGraphTimeApplied(dashboardFavoriteData, panelNumber)) {
        arrTimestamp = panelData.arrTimeStamp;
        totalSamples = panelData.totalSamples;
      }
      let trStartTime;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelData.panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Chart series data. */
        let arrSeriesData = new Array();

        /*Checking for chart data available. */
        let isDataAvailable = true;

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          isDataAvailable = false;
          // continue;
        }

        if (dashboardFavoriteData.compareMode) {

          if (dashboardFavoriteData.compareDataDTO[k] === null || dashboardFavoriteData.compareDataDTO[k] === undefined || dashboardFavoriteData.compareDataDTO[k] === []) {
            continue;
          }
          arrTimestamp = dashboardFavoriteData.compareDataDTO[k].arrZoomedTimeStamp;
          totalSamples = arrTimestamp.length;
        }

        /* Now Iterating through samples. */
        for (let i = 0; i < totalSamples; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new Array();

          chartSeriesData.push(arrTimestamp[i]);

          /*Note: If Series data not available adding series with NaN samples to maintain consistency in update sample. */
          if (!isDataAvailable) {
            chartSeriesData.push(null);
          } else if (graphInfo.graphData[i] === this._constants.NAN_SAMPLES) {
            chartSeriesData.push(null);
          } else {
            if (graphInfo.graphData[i] < 0) {
              chartSeriesData.push(0);
            } else {
              chartSeriesData.push(graphInfo.graphData[i]);
            }
          }

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }

        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        if (dashboardFavoriteData.compareMode) {
          trStartTime = dashboardFavoriteData.compareDataDTO[k].trStartTime;
          chartSeries.trStartTime = trStartTime;
        }

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          if (chartType === ChartType.STACKED_BAR_CHART || chartType === ChartType.BAR_CHART_AVG_ALL
            || chartType === ChartType.BAR_CHART_AVG_TOP5 || chartType === ChartType.BAR_CHART_AVG_TOP10
            || chartType === ChartType.BAR_CHART_AVG_BOTTOM10) {
            chartSeries.borderWidth = 1;
          } else {
            chartSeries.lineWidth = 4;

          }
        }

        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }

  /**
   * Getting empty chart object.
   */
  getEmptyChart(): Chart {
    try {
      /* Creating empty chart object. */
      let emptyChart = new Chart();

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = '';

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      chartOptions.width = 500;
      chartOptions.height = 500;

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = false;

      /* Creating Y Axis Here. */
      let yAxis = new ChartyAxis();

      /* Creating DataSet For Line Chart. */
      let chartSeries = new ChartSeries();
      chartSeries.data = [];

      /* Setting chart object. */
      emptyChart.chart = chartOptions;
      emptyChart.title = title;
      // emptyChart.yAxis = yAxis;
      emptyChart.series = [chartSeries];
      emptyChart.legend = legend;
      emptyChart.lang = { noData: 'Data not available.' };

      return emptyChart;
    } catch (e) {
      this.log.error('Error while getting empty chart configuration', e);
      return null;
    }
  }

  /**
   * Method is used to get line chart configuration.
   */
  getBarChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Bar Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'column';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Bar Chart. */
      let chartSeries = this.getDataSetForSeries(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let primaryAxis = new YAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.type = 'datetime';
     xAxis.events = { setExtremes: function() { return; } };
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let barChart = new Chart();

      /* Setting chart object. */
      barChart.chart = chartOptions;
      barChart.series = chartSeries;
      barChart.title = title;
      barChart.yAxis = primaryAxis;
      barChart.xAxis = xAxis;
      barChart.legend = legend;
//      barChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      barChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      barChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      barChart.plotOptions = { column: { stacking: '', events: seriesEvent } };

      return barChart;

    } catch (e) {
      this.log.error('Error while creating bar chart object.', e);
      return null;
    }
  }

  /**
 * Method is used to get line chart configuration.
 */
  getStackedBarChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'column';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForSeries(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
  //    seriesEvent.click = this.chartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let primaryAxis = new YAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function() { return; } };
      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode, ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let stackedBarChart = new Chart();

      /* Setting chart object. */
      stackedBarChart.chart = chartOptions;
      stackedBarChart.series = chartSeries;
      stackedBarChart.title = title;
      stackedBarChart.yAxis = primaryAxis;
      stackedBarChart.xAxis = xAxis;
      stackedBarChart.legend = legend;
      // stackedBarChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      stackedBarChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      stackedBarChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      stackedBarChart.plotOptions = { column: { stacking: 'normal', events: seriesEvent } };

      return stackedBarChart;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object.', e);
      return null;
    }
  }
  /**
    * Creating DataSet for Bar/stacked bar etc for Normal Graph Type.
    *
    */

  getDataSetForPctForColumnType(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();
        let pctArray = this._dataService.getDashboardConfigData().wDConfigurationDTO.arrPercentileValues;
        pctArray.sort(function (a, b) { return a - b });
        let dataItemCount = pctArray.length;

        for (let j = 0; j < dataItemCount; j++) {

          let value = 0;
          let colorIdx = panelNumber + k;

          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[pctArray[j] - 1];

          if (typeof value === undefined || value === this._constants.NAN_SAMPLES) {
            value = 0;
          }

          arrSeriesData.push(value);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          chartSeries.borderWidth = 1;
        }

        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating data set for percentile type', e);
      return null;
    }
  }
  /**
   * Get data set for Percentile Type.
   */
  getDataSetForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();
        let startIndex = 0;
        let endIndex = graphInfo.graphData.length;
        // if (dashboardPanelData.isZoom) {
        //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
        //   this.log.debug('zoomInfo = ', zoomInfo);
        //   startIndex = zoomInfo['zoomStartTime'];
        //   endIndex = zoomInfo['zoomEndTime'];
        //   this.log.debug(' startIndex = ' + startIndex + ', end = ' + endIndex);
        // }
        for (let j = startIndex; j < endIndex; j++) {
          let chartSeriesData = new ChartSeriesPoint();
          let value = 0;
          let colorIdx = panelNumber + k;

          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[j];

          if (typeof value === undefined || value === this._constants.NAN_SAMPLES) {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }

          chartSeriesData.x = j + 1;
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeries.visible = graphInfo.visible;
        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }

        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating data set for percentile type', e);
      return null;
    }
  }
  /**
   * get data set for slab count graph type.
   */
  getDataSetForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;


      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();

        for (let i = 0; i < graphInfo.graphData.length; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new ChartSeriesPoint();
          let tempIndex;
          for (let aa = 0; aa < panelData.panelGraphs.length; aa++) {
            if (panelData.panelGraphs[aa].slabName != null) {
              tempIndex = aa;
              break;
            }
          }
          let slabName = panelData.panelGraphs[tempIndex].slabName[i];

          let value = 0;
          let colorIdx = panelNumber + k;
          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[i];

          if (typeof value === 'undefined') {
            value = 0;
          }

          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = i;
          chartSeriesData.z = slabName;

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeries.visible = graphInfo.visible;
        if (graphInfo.selected) {
          if (chartType === ChartType.SLAB_COUNT_STACKED_BAR_CHART || chartType === ChartType.SLAB_COUNT_GRAPH) {
            chartSeries.borderWidth = 1;
          } else {
            chartSeries.lineWidth = 4;
          }
        }

        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating slab count dataset', e);
      return null;
    }
  }

  /**
   * get data set for Pie donut chart type.
   */

  getDataSetForPieDonutBasedOnAvg(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Creating Object of one series. */
      let chartSeries = new ChartSeries();

      /* Chart series data. */
      let arrSeriesData = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {
        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];
        // if (dashboardFavoriteData.compareMode) {
        //   if (graphInfo.graphData === null || graphInfo.graphData === undefined || graphInfo.graphData === []) {
        //     let compareData = this._config.$lowerPanelDataForCompare;
        //     graphInfo = compareData['panelData'][panelNumber]['panelGraphs'][k];
        //   }
        // }

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }

        /* Creating Instance of one series. */
        let chartSeriesData = new ChartSeriesPoint();
        if (graphInfo.avg === this._constants.NAN_SAMPLES) {
          chartSeriesData.y = null;
        } else {
          chartSeriesData.y = graphInfo.avg;
        }
        chartSeriesData.name = graphInfo.graphName;
        chartSeriesData.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeriesData.visible = graphInfo.visible;
        chartSeriesData.description = panelNumber + '';

        if (graphInfo.selected) {
          chartSeriesData.sliced = true;
        }

        /* Adding series point in series data. */
        arrSeriesData.push(chartSeriesData);
        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
      }
      /* Now Adding Chart Series in array. */
      arrChartSeries.push(chartSeries);
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating pint type dataset.', e);
      return null;
    }
  }

  /**
   * Get data set for pie and donut chart type.
   */
  getDataSetForPointsBasedOnLast(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Creating Object of one series. */
      let chartSeries = new ChartSeries();

      /* Chart series data. */
      let arrSeriesData = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelData.panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        // if (dashboardFavoriteData.compareMode) {
        //   if (graphInfo.graphData === null || graphInfo.graphData === undefined || graphInfo.graphData === []) {
        //     let compareData = this._config.$lowerPanelDataForCompare;
        //     graphInfo = compareData['panelData'][panelNumber]['panelGraphs'][k];
        //   }
        // }

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }

        /* Creating Instance of one series. */
        let chartSeriesData = new ChartSeriesPoint();
        if (graphInfo.lastSample === this._constants.NAN_SAMPLES) {
          chartSeriesData.y = null;
        } else {
          chartSeriesData.y = graphInfo.lastSample;
        }
        chartSeriesData.name = graphInfo.graphName;
        chartSeriesData.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeriesData.visible = graphInfo.visible;
        chartSeriesData.description = panelNumber + '';
        if (graphInfo.selected) {
          chartSeriesData.sliced = true;
        }

        /* Adding series point in series data. */
        arrSeriesData.push(chartSeriesData);

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;

      }

      /* Now Adding Chart Series in array. */
      arrChartSeries.push(chartSeries);

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating pint type dataset.', e);
      return null;
    }
  }

  /**
   * Creating DataSet for Pie, donut etc.
   * @param dashboardFavoriteData.
   */
  getDataSetForPointsForPctOrSlab(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Chart series data. */
      let arrSeriesData = new Array();

      /* Creating Object of one series. */
      let chartSeries = new ChartSeries();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelData.panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        // if (dashboardFavoriteData.compareMode) {
        //   if (graphInfo.graphData === null || graphInfo.graphData === undefined || graphInfo.graphData === []) {
        //     let compareData = this._config.$lowerPanelDataForCompare;
        //     graphInfo = compareData['panelData'][panelNumber]['panelGraphs'][k];
        //   }
        // }

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }

        /* Creating Instance of one series. */
        let chartSeriesData = new ChartSeriesPoint();

        /*Getting index of pctSlabValue.*/
        let index = panelData['pctOrSlabValue'] - 1;

        if (graphInfo.graphData[index] === this._constants.NAN_SAMPLES) {
          chartSeriesData.y = null;
        } else {
          chartSeriesData.y = graphInfo.graphData[index];
        }
        chartSeriesData.name = graphInfo.graphName;
        chartSeriesData.color = this.setGradientColor(chartType, graphInfo.graphColor);
        chartSeriesData.visible = graphInfo.visible;
        chartSeriesData.description = panelNumber + '';

        if (graphInfo.selected) {
          chartSeriesData.sliced = true;
        }

        /* Adding series point in series data. */
        arrSeriesData.push(chartSeriesData);

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;

      }

      /* Now Adding Chart Series in array. */
      arrChartSeries.push(chartSeries);
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }

  /**
   * Get data set for dial meter chart type for normal.
   */
  getDataSetForDialMeterForNormalType(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<any> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      /*Getting chart type.*/
      let panelChartType = panelData.chartType;
      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;
      /*Number of graphs*/
      let dialGraphExp = panelGraphs[0].dialGraphExp;

      let arr, minimum, maximum, threshold, warning, critical;
      let data = new Array();

      if (dialGraphExp != null) {
        arr = dialGraphExp.split('_');
        minimum = parseFloat(arr[0]);
        maximum = parseFloat(arr[1]);
        threshold = arr[2];
        warning = parseFloat(arr[3]);
        critical = parseFloat(arr[4]);
      }
      let title = panelGraphs[0].graphName;
      let value = 0;
      if (panelChartType === ChartType.DIAL_CHART_LAST || panelChartType === ChartType.METER_CHART_LAST) {
        value = parseFloat((panelGraphs[0].lastSample).toFixed(3));
      } else if (panelChartType === ChartType.DIAL_CHART_AVG || panelChartType === ChartType.METER_CHART_AVG) {
        value = parseFloat((panelGraphs[0].avg).toFixed(3));
      }
      if (value > maximum) {
        maximum = value;
        let diffMin = (((maximum - minimum) / maximum) * 100);
        let diffWarn = (((maximum - warning) / maximum) * 100);
        let diffCri = (((maximum - critical) / maximum) * 100);

        minimum = minimum + ((diffMin * minimum) / 100);
        warning = warning + ((diffWarn * warning) / 100);
        critical = critical + ((diffCri * critical) / 100);
      }
      if (value < minimum) {
        minimum = value;
      }

      value = parseFloat(this._utilsService.getValueWithoutDecimal(value, 0));
      minimum = parseFloat(this._utilsService.getValueWithoutDecimal(minimum, 2));
      maximum = parseFloat(this._utilsService.getValueWithoutDecimal(maximum, 2));
      critical = parseFloat(this._utilsService.getValueWithoutDecimal(critical, 2));
      warning = parseFloat(this._utilsService.getValueWithoutDecimal(warning, 2));

      data.push(title);
      data.push(value);
      data.push(minimum);
      data.push(maximum);
      data.push('>');
      data.push(warning);
      data.push(critical);
      data.push(panelGraphs[0].graphColor);

      return data;

    } catch (e) {
      this.log.error('error while creating dial chart data.', e);
    }
  }

  /**
   * Get data set for dial and meter for PCT or slab count type.
   */
  getDataSetForDialMeterForPctOrSlab(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<any> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;
      /*Number of graphs*/
      let dialGraphExp = panelGraphs[0].dialGraphExp;
      let arr, minimum, maximum, threshold, warning, critical;
      let data = new Array();

      if (dialGraphExp != null) {
        arr = dialGraphExp.split('_');
        minimum = parseFloat(arr[0]);
        maximum = parseFloat(arr[1]);
        threshold = arr[2];
        warning = parseFloat(arr[3]);
        critical = parseFloat(arr[4]);
      }
      let title = panelGraphs[0].graphName;
      let index = panelData['pctOrSlabValue'] - 1;
      let value = panelGraphs[0].graphData[index];

      if (value > maximum) {
        maximum = value;
        let diffMin = (((maximum - minimum) / maximum) * 100);
        let diffWarn = (((maximum - warning) / maximum) * 100);
        let diffCri = (((maximum - critical) / maximum) * 100);

        minimum = minimum + ((diffMin * minimum) / 100);
        warning = warning + ((diffWarn * warning) / 100);
        critical = critical + ((diffCri * critical) / 100);
      }
      if (value < minimum) {
        minimum = value;
      }
      value = parseFloat(this._utilsService.getValueWithoutDecimal(value, 0));
      minimum = parseFloat(this._utilsService.getValueWithoutDecimal(minimum, 2));
      maximum = parseFloat(this._utilsService.getValueWithoutDecimal(maximum, 2));
      critical = parseFloat(this._utilsService.getValueWithoutDecimal(critical, 2));
      warning = parseFloat(this._utilsService.getValueWithoutDecimal(warning, 2));

      data.push(title);
      data.push(value);
      data.push(minimum);
      data.push(maximum);
      data.push('>');
      data.push(warning);
      data.push(critical);
      data.push(panelGraphs[0].graphColor);
      return data;
    } catch (e) {
      this.log.error('error while creating dial chart data.', e);
    }
  }
  /**
     * Method is used to get line chart configuration.
     */
  getLineChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      let isCompare = dashboardFavoriteData.compareMode;

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForSeries(dashboardFavoriteData, panelNumber);

      this.checkConfigurationWindowSettings();
      /* Creating Y Axis Here. */
      let primaryAxis = new YAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();
      if (isCompare) {
        xAxis.type = '';
        xAxis.labels = {
          formatter: function () {
            return moment.tz(this.value, 'GMT').format('HH:mm:ss');
          }
        }
      } else {
        xAxis.type = 'datetime';
      }
      
      xAxis.events = { setExtremes: function() { return; } };

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode, ChartType.NORMAL_GRAPH_TYPE);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating chart object. */
      let lineChart = new Chart();

      /* Setting chart object. */
      lineChart.chart = chartOptions;
      lineChart.series = chartSeries;
      lineChart.title = title;
      lineChart.yAxis = primaryAxis;
      lineChart.xAxis = xAxis;
      lineChart.legend = legend;
      // lineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object*/
      lineChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      lineChart.plotOptions = { spline: { events: seriesEvent } };

      return lineChart;

    } catch (e) {
      this.log.error('Error while creating line chart object.', e);
      return null;
    }
  }
  /**
    * Method is used to get line chart configuration.
    */
  getLineChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];

      this.checkConfigurationWindowSettings();

      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();
      xAxis.events = { setExtremes: function() {return;} };
      xAxis.allowDecimals = false;
      //  xAxis.type = 'datetime';

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone,
      //   this._config.$isCompareMode, ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let lineChart = new Chart();

      /* Setting chart object. */
      lineChart.chart = chartOptions;
      lineChart.series = chartSeries;
      lineChart.title = title;
      lineChart.yAxis = dualAxisArray;
      lineChart.xAxis = xAxis;
      lineChart.legend = legend;
      // lineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      lineChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      lineChart.plotOptions = { spline: { events: seriesEvent } };

      return lineChart;

    } catch (e) {
      this.log.error('Error while creating line chart object.', e);
      return null;
    }
  }

  /**
    * Method is used to get line chart configuration.
    */
  getLineChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      this.checkConfigurationWindowSettings();
      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Getting categories for slab count.*/
      let categories = Array<String>();

      let tempData = panelData.panelGraphs[0];

      let temp = tempData['slabName'];

      if (temp === null) {
        this.log.errorLog('DashboardChartProviderService', 'getLineChartForSlabCount', 'slabName are not avail for panel num  = ' + panelNumber, null, null);
        return null;
      }

      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      let xAxis = new ChartxAxis();
      xAxis.categories = categories;

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);
      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();

      // chartOptions.zoomType = '';
      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForSlabCount(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      // let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let lineChart = new Chart();

      /* Setting chart object. */
      lineChart.chart = chartOptions;
      lineChart.series = chartSeries;
      lineChart.title = title;
      lineChart.xAxis = xAxis;
      lineChart.yAxis = dualAxisArray;
      lineChart.legend = legend;
      // lineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      lineChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      // lineChart.plotOptions = { spline: { events: seriesEvent } };
      return lineChart;

    } catch (e) {
      this.log.error('Error while creating line chart object.', e);
      return null;
    }
  }

  /**
 * Method is used to get area chart configuration.
 */
  getAreaChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'area';

      this.checkConfigurationWindowSettings();

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForSeries(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let primaryAxis = new YAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();
      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function () { return; }};

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone,
      //   this._config.$isCompareMode, ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let areaChart = new Chart();

      /* Setting chart object. */
      areaChart.chart = chartOptions;
      areaChart.series = chartSeries;
      areaChart.title = title;
      areaChart.yAxis = primaryAxis;
      areaChart.xAxis = xAxis;
      areaChart.legend = legend;
      // areaChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      areaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      areaChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      areaChart.plotOptions = { area: { stacking: '', events: seriesEvent } };

      return areaChart;

    } catch (e) {
      this.log.error('Error while creating area chart object.', e);
      return null;
    }
  }

  /**
   * Method is used to get stacked bar chart configuration for slab count.
   */
  getAreaChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'area';

      this.checkConfigurationWindowSettings();


      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }


      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.events = { setExtremes: function() { return; } };
      xAxis.allowDecimals = false;

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let area = new Chart();

      /* Setting chart object. */
      area.chart = chartOptions;
      area.series = chartSeries;
      area.title = title;
      area.yAxis = dualAxisArray;
      area.xAxis = xAxis;
      area.legend = legend;
      // area.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      area.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      area.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      area.plotOptions = { area: { stacking: '', events: seriesEvent } };

      return area;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object for percentile graph type.', e);
      return null;
    }
  }

  /**
 * Method is used to get stacked bar chart configuration for slab count.
 */
  getAreaChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';
      chartOptions.type = 'area';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForSlabCount(dashboardFavoriteData, panelNumber);

      this.checkConfigurationWindowSettings();

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.categories = categories;
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let area = new Chart();

      /* Setting chart object. */
      area.chart = chartOptions;
      area.series = chartSeries;
      area.title = title;
      area.yAxis = dualAxisArray;
      area.xAxis = xAxis;
      area.legend = legend;
      // area.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      area.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      area.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      area.plotOptions = { area: { stacking: '', events: seriesEvent } };

      return area;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object for slab count.', e);
      return null;
    }
  }
  /**
   * Method is used to get stacked area chart configuration.
   */
  getStackedAreaChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'area';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForSeries(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let primaryAxis = new YAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function() { return; }};
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let stackedAreaChart = new Chart();

      /* Setting chart object. */
      stackedAreaChart.chart = chartOptions;
      stackedAreaChart.series = chartSeries;
      stackedAreaChart.title = title;
      stackedAreaChart.yAxis = primaryAxis;
      stackedAreaChart.xAxis = xAxis;
      stackedAreaChart.legend = legend;
      // stackedAreaChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      stackedAreaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      stackedAreaChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      stackedAreaChart.plotOptions = { area: { stacking: 'normal', events: seriesEvent } };
      return stackedAreaChart;

    } catch (e) {
      this.log.error('Error while creating stacked area chart object.', e);
      return null;
    }
  }

  /**
  * Method is used to get stacked bar chart configuration for slab count.
  */
  getStackedAreaChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'area';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.events = { setExtremes: function() { return; }};
      // xAxis.allowDecimals = false;

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let stackedAreaChart = new Chart();

      /* Setting chart object. */
      stackedAreaChart.chart = chartOptions;
      stackedAreaChart.series = chartSeries;
      stackedAreaChart.title = title;
      stackedAreaChart.yAxis = dualAxisArray;
      stackedAreaChart.xAxis = xAxis;
      stackedAreaChart.legend = legend;
      // stackedAreaChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      stackedAreaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      stackedAreaChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      stackedAreaChart.plotOptions = { area: { stacking: 'normal', events: seriesEvent } };
      return stackedAreaChart;

    } catch (e) {
      this.log.error('Error while creating stacked area chart object for percentile graph type.', e);
      return null;
    }
  }

  /**
  * Method is used to get stacked area chart configuration for slab count.
  */
  getStackedAreaChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';
      chartOptions.type = 'area';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForSlabCount(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.categories = categories;
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let stackedAreaChart = new Chart();

      /* Setting chart object. */
      stackedAreaChart.chart = chartOptions;
      stackedAreaChart.series = chartSeries;
      stackedAreaChart.title = title;
      stackedAreaChart.yAxis = dualAxisArray;
      stackedAreaChart.xAxis = xAxis;
      stackedAreaChart.legend = legend;
      // stackedAreaChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      stackedAreaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      stackedAreaChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      stackedAreaChart.plotOptions = { area: { stacking: 'normal', events: seriesEvent } };
      return stackedAreaChart;

    } catch (e) {
      this.log.error('Error while creating stacked area chart object for slab count.', e);
      return null;
    }
  }

  /**
 * Method is used to get stacked bar chart configuration for slab count.
 */
  getStackedBarChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      let pctArr = this._dataService.getDashboardConfigData().wDConfigurationDTO.arrPercentileValues;
      pctArr.sort(function (a, b) { return a - b });
      let categories = [];
      for (let i = 0; i < pctArr.length; i++) {
        categories.push(pctArr[i]);
      }
      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'column';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForPctForColumnType(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.categories = categories;
      xAxis.allowDecimals = false;
      xAxis.events = { setExtremes: function() { return; } };
      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let stackedBarChart = new Chart();

      /* Setting chart object. */
      stackedBarChart.chart = chartOptions;
      stackedBarChart.series = chartSeries;
      stackedBarChart.title = title;
      stackedBarChart.yAxis = dualAxisArray;
      stackedBarChart.xAxis = xAxis;
      stackedBarChart.legend = legend;
      // stackedBarChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      stackedBarChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      stackedBarChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      stackedBarChart.plotOptions = { column: { stacking: 'normal', events: seriesEvent } };
      return stackedBarChart;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object for percentile graph type.', e);
      return null;
    }
  }


  /**
 * Method is used to get stacked bar chart configuration for slab count.
 */
  getStackedBarChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }
      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';
      chartOptions.type = 'column';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForSlabCount(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      // let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.categories = categories;
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let stackedBarChart = new Chart();

      /* Setting chart object. */
      stackedBarChart.chart = chartOptions;
      stackedBarChart.series = chartSeries;
      stackedBarChart.title = title;
      stackedBarChart.yAxis = dualAxisArray;
      stackedBarChart.xAxis = xAxis;
      stackedBarChart.legend = legend;
      // stackedBarChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      stackedBarChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      stackedBarChart.panelCaption = panelData.panelCaption;
      /*seteing Chart series click Event into plotoptions series event.*/
      // stackedBarChart.plotOptions = { column: { stacking: 'normal', events: seriesEvent } };
      return stackedBarChart;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object for slab count.', e);
      return null;
    }
  }

  /**
  * Method is used to get bar chart configuration for slab count.
  */
  getBarChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';
      chartOptions.type = 'column';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForSlabCount(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }


      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.categories = categories;
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let barChart = new Chart();

      /* Setting chart object. */
      barChart.chart = chartOptions;
      barChart.series = chartSeries;
      barChart.title = title;
      barChart.yAxis = dualAxisArray;
      barChart.xAxis = xAxis;
      barChart.legend = legend;
      // barChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      barChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      barChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      barChart.plotOptions = { column: { stacking: '', events: seriesEvent } };
      return barChart;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object for slab count.', e);
      return null;
    }
  }


  /**
 * Method is used to get pie chart configuration.
 */
  getPieChartForAvgForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();

      chartOptions.type = 'pie';

      /*Create data labels here. */
      let dataLabel = new DataLabel();
      dataLabel.enabled = false;

      /*Disable data labels. */
      let chartPlotOptions = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      plotOptions.dataLabels = dataLabel;
      chartPlotOptions.pie = plotOptions;

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForPieDonutBasedOnAvg(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandlerForPieOrDonut.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandlerForPieOrDonut.bind(this);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getPointTooltipFormatter(ChartType.NORMAL_GRAPH_TYPE, 0, '');

      /* Creating chart object. */
      let pieChart = new Chart();

      /* Setting chart object. */
      pieChart.chart = chartOptions;
      pieChart.series = chartSeries;
      pieChart.title = title;
      pieChart.legend = legend;
      // pieChart.tooltip = tooltip;

      /*setting Chart series click Event into plotoptions series event.*/
      pieChart.plotOptions = { pie: { dataLabels: { enabled: false }, point: { events: seriesEvent } } };
      return pieChart;

    } catch (e) {
      this.log.error('Error while creating pie chart object.', e);
      return null;
    }
  }

  /**
* Method is used to get pie chart configuration.
*/
  getPieChartByLastForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'pie';

      /*Create data labels here. */
      let dataLabel = new DataLabel();
      dataLabel.enabled = false;

      /*Disable data labels. */
      let chartPlotOptions = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      plotOptions.dataLabels = dataLabel;
      chartPlotOptions.pie = plotOptions;

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForPointsBasedOnLast(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandlerForPieOrDonut.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandlerForPieOrDonut.bind(this);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getPointTooltipFormatter(ChartType.NORMAL_GRAPH_TYPE, 0, '');

      /* Creating chart object. */
      let pieChart = new Chart();

      /* Setting chart object. */
      pieChart.chart = chartOptions;
      pieChart.series = chartSeries;
      pieChart.title = title;
      pieChart.legend = legend;
      // pieChart.tooltip = tooltip;

      /*setting Chart series click Event into plotoptions series event.*/
      pieChart.plotOptions = { pie: { dataLabels: { enabled: false }, point: { events: seriesEvent } } };
      return pieChart;

    } catch (e) {
      this.log.error('Error while creating pie chart object.', e);
      return null;
    }
  }


  /**
  * Method is used to get pie chart configuration.
  */
  getPieChartForPctOrSlab(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'pie';

      /*Create data labels here. */
      let dataLabel = new DataLabel();
      dataLabel.enabled = false;

      /*Disable data labels. */
      let chartPlotOptions = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      plotOptions.dataLabels = dataLabel;
      chartPlotOptions.pie = plotOptions;

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForPointsForPctOrSlab(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      // let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandlerForPieOrDonut.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandlerForPieOrDonut.bind(this);


      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      let chartType = panelData.chartType;

      // let graphType = this._widgetSettingService.getGraphTypeByChartType(chartType);
      let pctSlabValue = panelData['pctOrSlabValue'];
      let slabNameTooltip = '';
      // if (graphType === 'Slab Count Graph') {
      //   slabNameTooltip = panelData.panelGraphs[0].slabName[pctSlabValue - 1];
      // }
      // tooltip.formatter = new ChartTooltipFormatter().getPointTooltipFormatter(graphType, pctSlabValue, slabNameTooltip);

      /* Creating chart object. */
      let pieChart = new Chart();

      /* Setting chart object. */
      pieChart.chart = chartOptions;
      pieChart.series = chartSeries;
      pieChart.title = title;
      pieChart.legend = legend;
      // pieChart.tooltip = tooltip;

      /*setting Chart series click Event into plotoptions series event.*/
      // pieChart.plotOptions = { pie: { dataLabels: { enabled: false }, point: { events: seriesEvent } } };
      return pieChart;

    } catch (e) {
      this.log.error('Error while creating pie chart object.', e);
      return null;
    }
  }

  /**
  * Method is used to get pie chart configuration.
  */
  getDonutChartForPctOrSlab(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;
      /*Create data labels here. */
      let dataLabel = new DataLabel();
      dataLabel.enabled = false;
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      plotOptions.innerSize = '50%';
      plotOptions.dataLabels = dataLabel;
      chartPlotOption.pie = plotOptions;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'pie';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForPointsForPctOrSlab(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandlerForPieOrDonut.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandlerForPieOrDonut.bind(this);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // let chartType = panelData.chartType;

      // let graphType = this._widgetSettingService.getGraphTypeByChartType(chartType);
      let pctSlabValue = panelData['pctOrSlabValue'];
      // let slabNameTooltip = '';
      // if (graphType === 'Slab Count Graph') {
      //   slabNameTooltip = panelData.panelGraphs[0].slabName[pctSlabValue - 1];
      // }
      // tooltip.formatter = new ChartTooltipFormatter().getPointTooltipFormatter(graphType, pctSlabValue, slabNameTooltip);

      /* Creating chart object. */
      let donutChart = new Chart();

      /* Setting chart object. */
      donutChart.chart = chartOptions;
      donutChart.series = chartSeries;
      donutChart.title = title;
      donutChart.legend = legend;
      // donutChart.tooltip = tooltip;
      donutChart.plotOptions = chartPlotOption;
      /*setting Chart series click Event into plotoptions series event.*/
      donutChart.plotOptions = { pie: { dataLabels: { enabled: false }, innerSize: '50%', point: { events: seriesEvent } } };

      return donutChart;

    } catch (e) {
      this.log.error('Error while creating pie chart object.', e);
      return null;
    }
  }

  /**
   * Method is used to get donut chart configuration.
   */
  getDonutChartBasedOnLast(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Create data labels here. */
      let dataLabel = new DataLabel();
      dataLabel.enabled = false;

      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      plotOptions.innerSize = '50%';
      plotOptions.dataLabels = dataLabel;
      chartPlotOption.pie = plotOptions;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();

      chartOptions.type = 'pie';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForPointsBasedOnLast(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandlerForPieOrDonut.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandlerForPieOrDonut.bind(this);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getPointTooltipFormatter(ChartType.NORMAL_GRAPH_TYPE, 0, '');

      /* Creating chart object. */
      let donutChart = new Chart();

      /* Setting chart object. */
      donutChart.chart = chartOptions;
      donutChart.series = chartSeries;
      donutChart.title = title;

      donutChart.legend = legend;
      // donutChart.tooltip = tooltip;
      donutChart.plotOptions = chartPlotOption;

      /*setting Chart series click Event into plotoptions series event.*/
      donutChart.plotOptions = { pie: { innerSize: '50%', point: { events: seriesEvent } } };
      return donutChart;

    } catch (e) {
      this.log.error('Error while creating donut chart object.', e);
      return null;
    }
  }

  /**
   * Method is used to get donut chart configuration.
   */
  getDonutChartBasedOnAvg(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for area Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Create data labels here. */
      let dataLabel = new DataLabel();
      dataLabel.enabled = false;

      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      plotOptions.innerSize = '50%';
      plotOptions.dataLabels = dataLabel;

      chartPlotOption.pie = plotOptions;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();

      chartOptions.type = 'pie';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For area Chart. */
      let chartSeries = this.getDataSetForPieDonutBasedOnAvg(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandlerForPieOrDonut.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandlerForPieOrDonut.bind(this);

      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getPointTooltipFormatter(ChartType.NORMAL_GRAPH_TYPE, 0, '');

      /* Creating chart object. */
      let donutChart = new Chart();

      /* Setting chart object. */
      donutChart.chart = chartOptions;
      donutChart.series = chartSeries;
      donutChart.title = title;
      donutChart.legend = legend;
      // donutChart.tooltip = tooltip;
      donutChart.plotOptions = chartPlotOption;

      /*setting Chart series click Event into plotoptions series event.*/
      donutChart.plotOptions = { pie: { dataLabels: { enabled: false }, innerSize: '50%', point: { events: seriesEvent } } };

      return donutChart;

    } catch (e) {
      this.log.error('Error while creating donut chart object.', e);
      return null;
    }
  }

  /**
   * get dial chart configuration..
   */
  getDialChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {
      /*Creating chart object.*/
      let dialChart = new Chart();

      /*Creating chart options object.*/
      let chartOptions = new ChartOptions();
      chartOptions.type = 'gauge';
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBackgroundImage = null;
      chartOptions.plotBorderWidth = 0;
      chartOptions.plotShadow = false;
      dialChart.chart = chartOptions;

      /*Creating pane Options.*/
      let paneOptions = new PaneOptions();
      paneOptions.startAngle = -120;
      paneOptions.endAngle = 120;
      dialChart.pane = paneOptions;

      /* Creating DataSet For dial Chart. */
      let dialChartInfo = this.getDataSetForDialMeterForNormalType(dashboardFavoriteData, panelNumber);
      let data = new Array();
      data.push(dialChartInfo);
      /*Getting values from dial chart dataSet*/
      let title = dialChartInfo[0];
      // let value = dialChartInfo[1];
      let minimum = dialChartInfo[2];
      let maximum = dialChartInfo[3];
      let threshold = dialChartInfo[4];
      let warning = dialChartInfo[5];
      let critical = dialChartInfo[6];
      let color = dialChartInfo[7];

      let plotBandColor = [];
      if (threshold === '>') {
        plotBandColor = [{ from: minimum, to: warning, color: '#55BF3B' },
        { from: warning, to: critical, color: '#DDDF0D' },
        { from: critical, to: maximum, color: '#C02316' }];
      } else {
        plotBandColor = [{ from: minimum, to: critical, color: '#C02316' },
        { from: critical, to: warning, color: '#DDDF0D' },
        { from: warning, to: maximum, color: '#55BF3B' }];
      }
      let yAxis = new ChartyAxis();
      yAxis.min = minimum;
      yAxis.max = maximum;
      yAxis.minorTickColor = '#666';
      yAxis.minorTickLength = 10;
      yAxis.minorTickPosition = 'inside';
      yAxis.minorTickWidth = 1;
      yAxis.tickPositions = [minimum, critical, warning, maximum];
      yAxis.tickPixelInterval = 30;
      yAxis.tickLength = 10;
      yAxis.tickColor = null;
      yAxis.minorGridLineDashStyle = '';
      yAxis.minorGridLineWidth = 0;
      yAxis.plotBands = plotBandColor;
      dialChart.yAxis = yAxis;

      /* Creating Plot Options here and set into chart plot options.*/
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      let dial = new Dial();
      dial.backgroundColor = color;
      dial.radius = '100%';
      plotOptions.dial = dial;

      let pivot = new Pivot();
      pivot.backgroundColor = color;
      plotOptions.pivot = pivot;

      chartPlotOption.gauge = plotOptions;
      // dialChart.plotOptions = chartPlotOption;

      /*Creating Series */
      let series = new Series();
      let array = new Array();

      series.name = title;
      series.data = data;
      array.push(series);
      dialChart.series = array;
      return dialChart;
    } catch (e) {
      this.log.error('Error while creating dial chart object.', e);
      return null;
    }
  }

  getDialChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {
      /*Creating chart object.*/
      let dialChart = new Chart();
      /*Creating chart options object.*/
      let chartOptions = new ChartOptions();
      chartOptions.type = 'gauge';
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBackgroundImage = null;
      chartOptions.plotBorderWidth = 0;
      chartOptions.plotShadow = false;
      dialChart.chart = chartOptions;

      /*Creating pane Options.*/
      let paneOptions = new PaneOptions();
      paneOptions.startAngle = -120;
      paneOptions.endAngle = 120;
      dialChart.pane = paneOptions;

      /* Creating DataSet For dial Chart. */
      let dialChartInfo = this.getDataSetForDialMeterForPctOrSlab(dashboardFavoriteData, panelNumber);
      let data = new Array();
      data.push(dialChartInfo);

      /*Getting values from dial chart dataSet*/
      let title = dialChartInfo[0];
      // let value = dialChartInfo[1];
      let minimum = dialChartInfo[2];
      let maximum = dialChartInfo[3];
      let threshold = dialChartInfo[4];
      let warning = dialChartInfo[5];
      let critical = dialChartInfo[6];
      let color = dialChartInfo[7];
      let plotBandColor = [];
      if (threshold === '>') {
        plotBandColor = [{ from: minimum, to: warning, color: '#55BF3B' },
        { from: warning, to: critical, color: '#DDDF0D' }, { from: critical, to: maximum, color: '#C02316' }];
      } else {
        plotBandColor = [{ from: minimum, to: critical, color: '#C02316' },
        { from: critical, to: warning, color: '#DDDF0D' }, { from: warning, to: maximum, color: '#55BF3B' }];
      }
      let yAxis = new ChartyAxis();
      yAxis.min = minimum;
      yAxis.max = maximum;
      yAxis.minorTickColor = '#666';
      yAxis.minorTickLength = 10;
      yAxis.minorTickPosition = 'inside';
      yAxis.minorTickWidth = 1;
      yAxis.tickPositions = [minimum, critical, warning, maximum];
      yAxis.tickPixelInterval = 30;
      yAxis.tickLength = 10;
      yAxis.tickColor = null;
      yAxis.minorGridLineDashStyle = '';
      yAxis.minorGridLineWidth = 0;
      yAxis.plotBands = plotBandColor;
      dialChart.yAxis = yAxis;

      /* Creating Plot Options here and set into chart plot options.*/
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      let dial = new Dial();
      dial.backgroundColor = color;
      dial.radius = '100%';
      plotOptions.dial = dial;
      let pivot = new Pivot();
      pivot.backgroundColor = 'white';
      plotOptions.pivot = pivot;
      chartPlotOption.gauge = plotOptions;

      /*Creating Series */
      let series = new Series();
      let array = new Array();

      series.name = title;
      series.data = data;
      array.push(series);
      dialChart.series = array;
      return dialChart;
    } catch (e) {
      this.log.error('Error while creating dial chart object for slab count.', e);
      return null;
    }
  }

  /**
   * get meter chart configuration for normal type.
   */
  getMeterChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {
      /*Creating chart Options. */
      let chartOptions = new ChartOptions();
      chartOptions.type = 'gauge';
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBackgroundImage = null;
      chartOptions.plotBorderWidth = 0;
      chartOptions.plotShadow = false;

      /*Creating pane Options. */
      let paneOptions = new PaneOptions();
      paneOptions.startAngle = -45;
      paneOptions.endAngle = 45;
      paneOptions.size = '100%';
      paneOptions.center = ['50%', '70%'];
      paneOptions.background = null;
      /* Creating DataSet For dial Chart. */
      let meterChartInfo = this.getDataSetForDialMeterForNormalType(dashboardFavoriteData, panelNumber);
      let data = new Array();
      data.push(meterChartInfo);

      let title = meterChartInfo[0];
      // let value = meterChartInfo[1];
      let minimum = meterChartInfo[2];
      let maximum = meterChartInfo[3];
      let threshold = meterChartInfo[4];
      let warning = meterChartInfo[5];
      let critical = meterChartInfo[6];
      let color = meterChartInfo[7];
      let plotBandColor = [];

      if (threshold === '>') {
        plotBandColor = [{ from: minimum, to: warning, color: '#55BF3B' },
        { from: warning, to: critical, color: '#DDDF0D' },
        { from: critical, to: maximum, color: '#C02316' }];
      } else {
        plotBandColor = [{ from: minimum, to: critical, color: '#C02316' },
        { from: critical, to: warning, color: '#DDDF0D' },
        { from: warning, to: maximum, color: '#55BF3B' }];
      }
      let yAxis = new ChartyAxis();
      yAxis.min = minimum;
      yAxis.max = maximum;
      yAxis.minorTickColor = 'black';
      yAxis.tickColor = 'black';
      yAxis.minorTickLength = 10;
      yAxis.minorTickPosition = 'outside';
      yAxis.minorTickWidth = 1;
      yAxis.tickPositions = [minimum, critical, warning, maximum];
      yAxis.tickPixelInterval = 80;
      yAxis.tickLength = 10;
      yAxis.tickPosition = 'inside';
      yAxis.plotBands = plotBandColor;
      yAxis.minorGridLineDashStyle = '';
      yAxis.minorGridLineWidth = 0;
      let yAxislabels = new YAxisLabel();
      yAxislabels.rotation = 'auto';
      yAxislabels.distance = 20;

      yAxis.labels = yAxislabels;
      /* Creating Plot Options here and set into chart plot options.*/
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      let dial = new Dial();
      dial.backgroundColor = color;
      dial.radius = '100%';
      plotOptions.dial = dial;
      let pivot = new Pivot();
      pivot.backgroundColor = 'white';
      plotOptions.pivot = pivot;
      chartPlotOption.gauge = plotOptions;

      let dataLevels = new DataLabel();
      dataLevels.enabled = true;
      dataLevels.x = 0;
      dataLevels.y = 33.09;

      let series = new Series();
      let array = new Array();
      series.name = title;
      series.data = data;
      array.push(series);

      let meterChart = new Chart();
      meterChart.chart = chartOptions;
      meterChart.pane = paneOptions;
      meterChart.yAxis = yAxis;
      meterChart.series = array;
      return meterChart;
    } catch (e) {
      this.log.error('Error while creating meter chart object.', e);
      return null;
    }
  }

  /**
   * Get meter chart for percentile.
   */
  getMeterChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {
      /*Creating chart Options. */
      let chartOptions = new ChartOptions();
      chartOptions.type = 'gauge';
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBackgroundImage = null;
      chartOptions.plotBorderWidth = 0;
      chartOptions.plotShadow = false;

      /*Creating pane Options. */
      let paneOptions = new PaneOptions();
      paneOptions.startAngle = -45;
      paneOptions.endAngle = 45;
      paneOptions.size = '100%';
      paneOptions.center = ['50%', '70%'];
      paneOptions.background = null;
      /* Creating DataSet For dial Chart. */
      let meterChartInfo = this.getDataSetForDialMeterForPctOrSlab(dashboardFavoriteData, panelNumber);

      let data = new Array();
      data.push(meterChartInfo);
      let title = meterChartInfo[0];
      let minimum = meterChartInfo[2];
      let maximum = meterChartInfo[3];
      let threshold = meterChartInfo[4];
      let warning = meterChartInfo[5];
      let critical = meterChartInfo[6];
      let color = meterChartInfo[7];
      let plotBandColor = [];

      if (threshold === '>') {
        plotBandColor = [{ from: minimum, to: warning, color: '#55BF3B' },
        { from: warning, to: critical, color: '#DDDF0D' },
        { from: critical, to: maximum, color: '#C02316' }];
      } else {
        plotBandColor = [{ from: minimum, to: critical, color: '#C02316' },
        { from: critical, to: warning, color: '#DDDF0D' },
        { from: warning, to: maximum, color: '#55BF3B' }];
      }
      let yAxis = new ChartyAxis();
      yAxis.min = minimum;
      yAxis.max = maximum;
      yAxis.minorTickColor = 'black';
      yAxis.tickColor = 'black';
      yAxis.minorTickLength = 10;
      yAxis.minorTickPosition = 'outside';
      yAxis.minorTickWidth = 1;
      yAxis.tickPositions = [minimum, critical, warning, maximum];
      yAxis.tickPixelInterval = 80;
      yAxis.tickLength = 10;
      yAxis.tickPosition = 'inside';
      yAxis.plotBands = plotBandColor;
      yAxis.minorGridLineDashStyle = '';
      yAxis.minorGridLineWidth = 0;
      let yAxislabels = new YAxisLabel();
      yAxislabels.rotation = 'auto';
      yAxislabels.distance = 20;

      yAxis.labels = yAxislabels;
      /* Creating Plot Options here and set into chart plot options.*/
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      let dial = new Dial();
      dial.backgroundColor = color;
      dial.radius = '100%';
      plotOptions.dial = dial;
      let pivot = new Pivot();
      pivot.backgroundColor = 'white';
      plotOptions.pivot = pivot;

      let dataLevels = new DataLabel();
      dataLevels.enabled = true;
      dataLevels.x = 0;
      dataLevels.y = 33.09;

      chartPlotOption.gauge = plotOptions;
      let series = new Series();
      let array = new Array();
      series.name = title;
      series.data = data;
      array.push(series);

      let meterChart = new Chart();
      meterChart.chart = chartOptions;
      meterChart.pane = paneOptions;
      meterChart.yAxis = yAxis;
      meterChart.series = array;
      return meterChart;

    } catch (e) {
      this.log.error('Error while creating meter chart object for Percentile.', e);
      return null;
    }
  }

  /**
   * Get meter chart configuration for meter for slab count.
   */
  getMeterChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {
      /*Creating chart Options. */
      let chartOptions = new ChartOptions();
      chartOptions.type = 'gauge';
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBackgroundImage = null;
      chartOptions.plotBorderWidth = 0;
      chartOptions.plotShadow = false;

      /*Creating pane Options. */
      let paneOptions = new PaneOptions();
      paneOptions.startAngle = -45;
      paneOptions.endAngle = 45;
      paneOptions.size = '100%';
      paneOptions.center = ['50%', '70%'];
      paneOptions.background = null;
      /* Creating DataSet For dial Chart. */
      let meterChartInfo = this.getDataSetForDialMeterForPctOrSlab(dashboardFavoriteData, panelNumber);
      let data = new Array();
      data.push(meterChartInfo);
      let title = meterChartInfo[0];
      let minimum = meterChartInfo[2];
      let maximum = meterChartInfo[3];
      let threshold = meterChartInfo[4];
      let warning = meterChartInfo[5];
      let critical = meterChartInfo[6];
      let color = meterChartInfo[7];
      let plotBandColor = [];
      if (threshold === '>') {
        plotBandColor = [{ from: minimum, to: warning, color: '#55BF3B' },
        { from: warning, to: critical, color: '#DDDF0D' },
        { from: critical, to: maximum, color: '#C02316' }];
      } else {
        plotBandColor = [{ from: minimum, to: critical, color: '#C02316' },
        { from: critical, to: warning, color: '#DDDF0D' },
        { from: warning, to: maximum, color: '#55BF3B' }];
      }
      let yAxis = new ChartyAxis();
      yAxis.min = minimum;
      yAxis.max = maximum;
      yAxis.minorTickColor = 'black';
      yAxis.tickColor = 'black';
      yAxis.minorTickLength = 10;
      yAxis.minorTickPosition = 'outside';
      yAxis.minorTickWidth = 1;
      yAxis.tickPositions = [minimum, critical, warning, maximum];
      yAxis.tickPixelInterval = 80;
      yAxis.tickLength = 10;
      yAxis.tickPosition = 'inside';
      yAxis.plotBands = plotBandColor;
      yAxis.minorGridLineDashStyle = '';
      yAxis.minorGridLineWidth = 0;
      let yAxislabels = new YAxisLabel();
      yAxislabels.rotation = 'auto';
      yAxislabels.distance = 20;

      yAxis.labels = yAxislabels;
      /* Creating Plot Options here and set into chart plot options.*/
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      let dial = new Dial();
      dial.backgroundColor = color;
      dial.radius = '100%';
      plotOptions.dial = dial;
      let pivot = new Pivot();
      pivot.backgroundColor = 'white';
      plotOptions.pivot = pivot;

      let dataLevels = new DataLabel();
      dataLevels.enabled = true;
      dataLevels.x = 0;
      dataLevels.y = 33.09;

      chartPlotOption.gauge = plotOptions;
      let series = new Series();
      let array = new Array();
      series.name = title;
      series.data = data;
      array.push(series);

      let meterChart = new Chart();
      meterChart.chart = chartOptions;
      meterChart.pane = paneOptions;
      meterChart.yAxis = yAxis;
      meterChart.series = array;
      return meterChart;

    } catch (e) {
      this.log.error('Error while creating meter chart object for slab count.', e);
      return null;
    }
  }

  /**
   * Get dial chart configuartion for percentile.
   */
  getDialChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {
      /*Creating chart object.*/
      let dialChart = new Chart();

      /*Creating chart options object.*/
      let chartOptions = new ChartOptions();
      chartOptions.type = 'gauge';
      chartOptions.plotBackgroundColor = null;
      chartOptions.plotBackgroundImage = null;
      chartOptions.plotBorderWidth = 0;
      chartOptions.plotShadow = false;
      dialChart.chart = chartOptions;

      /*Creating pane Options.*/
      let paneOptions = new PaneOptions();
      paneOptions.startAngle = -120;
      paneOptions.endAngle = 120;
      dialChart.pane = paneOptions;

      /* Creating DataSet For dial Chart. */
      let dialChartInfo = this.getDataSetForDialMeterForPctOrSlab(dashboardFavoriteData, panelNumber);
      let data = new Array();
      data.push(dialChartInfo);
      /*Getting values from dial chart dataSet*/
      let title = dialChartInfo[0];
      // let value = dialChartInfo[1];
      let minimum = dialChartInfo[2];
      let maximum = dialChartInfo[3];
      let threshold = dialChartInfo[4];
      let warning = dialChartInfo[5];
      let critical = dialChartInfo[6];
      let color = dialChartInfo[7];
      let plotBandColor = [];
      if (threshold === '>') {
        plotBandColor = [{ from: minimum, to: warning, color: '#55BF3B' },
        { from: warning, to: critical, color: '#DDDF0D' },
        { from: critical, to: maximum, color: '#C02316' }];
      } else {
        plotBandColor = [{ from: minimum, to: critical, color: '#C02316' },
        { from: critical, to: warning, color: '#DDDF0D' },
        { from: warning, to: maximum, color: '#55BF3B' }];
      }

      let yAxis = new ChartyAxis();
      yAxis.min = minimum;
      yAxis.max = maximum;
      yAxis.minorTickColor = '#666';
      yAxis.minorTickLength = 10;
      yAxis.minorTickPosition = 'inside';
      yAxis.minorTickWidth = 1;
      yAxis.tickPositions = [minimum, critical, warning, maximum];
      yAxis.tickPixelInterval = 30;
      yAxis.tickLength = 10;
      yAxis.tickColor = null;
      yAxis.minorGridLineDashStyle = '';
      yAxis.minorGridLineWidth = 0;
      yAxis.plotBands = plotBandColor;
      dialChart.yAxis = yAxis;

      /* Creating Plot Options here and set into chart plot options.*/
      let chartPlotOption = new ChartPlotOptions();
      let plotOptions = new PlotOptions();
      let dial = new Dial();
      dial.backgroundColor = color;
      dial.radius = '100%';
      plotOptions.dial = dial;
      let pivot = new Pivot();
      pivot.backgroundColor = 'white';
      plotOptions.pivot = pivot;
      chartPlotOption.gauge = plotOptions;

      /*Creating Series */
      let series = new Series();
      let array = new Array();

      series.name = title;
      series.data = data;
      array.push(series);
      dialChart.series = array;

      return dialChart;
    } catch (e) {
      this.log.error('Error while creating dial chart object for Percentile.', e);
      return null;
    }
  }

  /**
  * Method is used to get line chart configuration.
  */
  getBarChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Bar Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      let pctArr = this._dataService.getDashboardConfigData().wDConfigurationDTO.arrPercentileValues;
      pctArr.sort(function (a, b) { return a - b });
      let categories = [];
      for (let i = 0; i < pctArr.length; i++) {
        categories.push(pctArr[i]);
      }
      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'column';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Bar Chart. */
      let chartSeries = this.getDataSetForPctForColumnType(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);


      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      xAxis.events = { setExtremes: function() { return; } };
      xAxis.allowDecimals = false;
      //  xAxis.type = 'datetime';
      xAxis.categories = categories;

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let barChart = new Chart();

      /* Setting chart object. */
      barChart.chart = chartOptions;
      barChart.series = chartSeries;
      barChart.title = title;
      barChart.yAxis = dualAxisArray;
      barChart.xAxis = xAxis;
      barChart.legend = legend;
      // barChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      barChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      barChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      barChart.plotOptions = { column: { stacking: '', events: seriesEvent } };
      return barChart;

    } catch (e) {
      this.log.error('Error while creating bar chart object.', e);
      return null;
    }
  }

  /**
* get data set for slab count graph type for dual axis line bar.
*/
  getDataSetForSlabCountForDualAxisLineBar(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;


      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < 2; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();

        for (let i = 0; i < graphInfo.graphData.length; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new ChartSeriesPoint();
          let tempIndex;
          for (let aa = 0; aa < panelData.panelGraphs.length; aa++) {
            if (panelData.panelGraphs[aa].slabName != null) {
              tempIndex = aa;
              break;
            }
          }
          let slabName = panelData.panelGraphs[tempIndex].slabName[i];

          let value = 0;
          let colorIdx = panelNumber + k;
          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[i];

          if (typeof value === 'undefined') {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = i;
          chartSeriesData.z = slabName;

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          if (k === 1) {
            chartSeries.lineWidth = 4;
          } else {
            chartSeries.borderWidth = 1;
          }
        }

        if (k === 1) {
          chartSeries.yAxis = 1;
        } else {
          chartSeries.type = 'column';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating slab count dataset', e);
      return null;
    }
  }

  getDualLineBarChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForDualAxisBarLine(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y-axis array Here. */
      let dualAxisArray = new Array();

      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function() { return; } };
      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let dualLineChart = new Chart();

      /* Setting chart object. */
      dualLineChart.chart = chartOptions;
      dualLineChart.series = chartSeries;
      dualLineChart.title = title;
      dualLineChart.yAxis = dualAxisArray;
      dualLineChart.xAxis = xAxis;
      dualLineChart.legend = legend;
      // dualLineChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      dualLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      dualLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      dualLineChart.plotOptions = { column: { events: seriesEvent } };

      return dualLineChart;
    } catch (e) {
      this.log.error('Error while  creating dual axis line bar chart object.', e);
    }
  }

  /**
     * Creating DataSet for Line/Bar/stacked etc for Normal Graph Type.
     * Line/Bar/Area Chart can have many type of dataset including series, category etc.
     */
  getDataSetForDualAxisBarLine(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      let chartType = panelData.chartType;

      /* Getting Timestamp array. */
      let arrTimestamp = dashboardFavoriteData.arrTimestamp;

      /* Getting total samples. */
      let totalSamples = dashboardFavoriteData.totalSamples;

      /*Handlig for widgetWise GraphTime */
      if (this.isWidgetWiseGraphTimeApplied(dashboardFavoriteData, panelNumber)) {
        arrTimestamp = panelData.arrTimeStamp;
        totalSamples = panelData.totalSamples;
      }
      let trStartTime;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < 2; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }

        if (dashboardFavoriteData.compareMode) {
          arrTimestamp = dashboardFavoriteData.compareDataDTO[k].arrZoomedTimeStamp;
          totalSamples = arrTimestamp.length;
        }

        /* Chart series data. */
        let arrSeriesData = new Array();

        /* Now Iterating through samples. */
        for (let i = 0; i < totalSamples; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new Array();
          chartSeriesData.push(arrTimestamp[i]);
          if (graphInfo.graphData[i] === this._constants.NAN_SAMPLES) {
            chartSeriesData.push(null);
          } else {
            chartSeriesData.push(graphInfo.graphData[i]);
          }


          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }

        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        if (dashboardFavoriteData.compareMode) {
          trStartTime = dashboardFavoriteData.compareDataDTO[k].trStartTime;
          chartSeries.trStartTime = trStartTime;
        }

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          if (k === 1) {
            chartSeries.lineWidth = 4;
          } else {
            chartSeries.borderWidth = 1;
          }
        }

        if (k === 1) {
          chartSeries.type = 'spline';
          chartSeries.yAxis = 1;
        } else {
          chartSeries.type = 'column';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }


  getDualLineBarChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): any {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForDualLineBarPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);
      /* Creating Y-axis array Here. */
      let dualAxisArray = new Array();

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.events = { setExtremes: function() { return; }};
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let dualLineChart = new Chart();

      /* Setting chart object. */
      dualLineChart.chart = chartOptions;
      dualLineChart.series = chartSeries;
      dualLineChart.title = title;
      dualLineChart.yAxis = dualAxisArray;
      dualLineChart.xAxis = xAxis;
      dualLineChart.legend = legend;
      // dualLineChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      dualLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      dualLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      dualLineChart.plotOptions = { column: { events: seriesEvent } };

      return dualLineChart;
    } catch (e) {
      this.log.error('Error while  creating dual axis line bar chart object for Percentile.', e);
    }
  }

  /**
   * This method is used for getting data set for dual line bar chart in percentile type.
   */
  getDataSetForDualLineBarPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting ChartType */
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < 2; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();
        let startIndex = 0;
        let endIndex = graphInfo.graphData.length;
        // if (dashboardPanelData.isZoom) {
        //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
        //   console.log('zoomInfo = ', zoomInfo);
        //   startIndex = zoomInfo['zoomStartTime'];
        //   endIndex = zoomInfo['zoomEndTime'];
        //   this.log.debug(' startIndex = ' + startIndex + ', end = ' + endIndex);
        // }

        for (let j = startIndex; j < endIndex; j++) {
          let chartSeriesData = new ChartSeriesPoint();
          let value = 0;
          let colorIdx = panelNumber + k;

          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[j];

          if (typeof value === 'undefined') {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = j + 1;
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          if (k === 1) {
            chartSeries.lineWidth = 4;
          } else {
            chartSeries.borderWidth = 1;
          }
        }

        if (k === 1) {
          chartSeries.type = 'spline';
          chartSeries.yAxis = 1;
        } else {
          chartSeries.type = 'column';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating data set for percentile type', e);
      return null;
    }
  }

  /**
    * Creating DataSet for Line/Bar/stacked etc for Normal Graph Type.
    * Line/Bar/Area Chart can have many type of dataset including series, category etc.
    */
  getDataSetForDualAxisLine(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Getting Timestamp array. */
      let arrTimestamp = dashboardFavoriteData.arrTimestamp;

      /* Getting total samples. */
      let totalSamples = dashboardFavoriteData.totalSamples;
      /*Handlig for widgetWise GraphTime */
      if (this.isWidgetWiseGraphTimeApplied(dashboardFavoriteData, panelNumber)) {
        arrTimestamp = panelData.arrTimeStamp;
        totalSamples = panelData.totalSamples;
      }
      let trStartTime;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < 2; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }

        if (dashboardFavoriteData.compareMode) {
          arrTimestamp = dashboardFavoriteData.compareDataDTO[k].arrZoomedTimeStamp;
          totalSamples = arrTimestamp.length;
        }

        /* Chart series data. */
        let arrSeriesData = new Array();

        /* Now Iterating through samples. */
        for (let i = 0; i < totalSamples; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new Array();
          chartSeriesData.push(arrTimestamp[i]);
          if (graphInfo.graphData[i] === this._constants.NAN_SAMPLES) {
            chartSeriesData.push(null);
          } else {
            chartSeriesData.push(graphInfo.graphData[i]);
          }


          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }

        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        if (dashboardFavoriteData.compareMode) {
          trStartTime = dashboardFavoriteData.compareDataDTO[k].trStartTime;
          chartSeries.trStartTime = trStartTime;
        }

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }
        if (k === 1) {
          chartSeries.yAxis = 1;
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }


  getDualLineChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForDualAxisLine(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y-axis array Here. */
      let dualAxisArray = new Array();

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function() { return; } };
      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let dualLineChart = new Chart();

      /* Setting chart object. */
      dualLineChart.chart = chartOptions;
      dualLineChart.series = chartSeries;
      dualLineChart.title = title;
      dualLineChart.yAxis = dualAxisArray;
      dualLineChart.xAxis = xAxis;
      dualLineChart.legend = legend;
      // dualLineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      dualLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      dualLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      dualLineChart.plotOptions = { spline: { events: seriesEvent } };


      return dualLineChart;
    } catch (e) {
      this.log.error('Error while  creating dual line chart object.', e);
    }
  }

  getDualLineBarChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      this.checkConfigurationWindowSettings();

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Getting categories for slab count.*/
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      let xAxis = new ChartxAxis();
      xAxis.categories = categories;
      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForSlabCountForDualAxisLineBar(dashboardFavoriteData, panelNumber);
      /* Creating Y-axis array Here. */
      let dualAxisArray = new Array();

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let dualLineChart = new Chart();

      /* Setting chart object. */
      dualLineChart.chart = chartOptions;
      dualLineChart.series = chartSeries;
      dualLineChart.title = title;
      dualLineChart.yAxis = dualAxisArray;
      dualLineChart.xAxis = xAxis;
      dualLineChart.legend = legend;
      // dualLineChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      dualLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      dualLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      dualLineChart.plotOptions = { column: { events: seriesEvent } };

      return dualLineChart;
    } catch (e) {
      this.log.error('Error while  creating dual axis line bar chart object for slab count.', e);
    }
  }


  getDualLineChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): any {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForPercentileForDualAxis(dashboardFavoriteData, panelNumber, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y-axis array Here. */
      let dualAxisArray = new Array();

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.events = { setExtremes: function() { return; } };
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let dualLineChart = new Chart();

      /* Setting chart object. */
      dualLineChart.chart = chartOptions;
      dualLineChart.series = chartSeries;
      dualLineChart.title = title;
      dualLineChart.yAxis = dualAxisArray;
      dualLineChart.xAxis = xAxis;
      dualLineChart.legend = legend;
      // dualLineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      dualLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      dualLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      dualLineChart.plotOptions = { spline: { events: seriesEvent } };
      return dualLineChart;
    } catch (e) {
      this.log.error('Error while  creating dual axis line chart object for percentile.', e);
    }
  }
  /**
  * Get data set for Percentile Type for dual axis graphs.
  */
  getDataSetForPercentileForDualAxis(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < 2; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();
        let startIndex = 0;
        let endIndex = graphInfo.graphData.length;
        // if (dashboardPanelData.isZoom) {
        //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
        //   console.log('zoomInfo = ', zoomInfo);
        //   startIndex = zoomInfo['zoomStartTime'];
        //   endIndex = zoomInfo['zoomEndTime'];
        //   this.log.debug(' startIndex = ' + startIndex + ', end = ' + endIndex);
        // }
        for (let j = startIndex; j < endIndex; j++) {
          let chartSeriesData = new ChartSeriesPoint();
          let value = 0;
          let colorIdx = panelNumber + k;

          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[j];

          if (typeof value === 'undefined') {
            value = 0;
          }

          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = j + 1;
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }
        if (k === 1) {
          chartSeries.yAxis = 1;
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating data set for percentile type', e);
      return null;
    }
  }

  getDualLineChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): any {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      this.checkConfigurationWindowSettings();

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Getting categories for slab count.*/
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      let xAxis = new ChartxAxis();
      xAxis.categories = categories;

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForSlabCountForDualAxis(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y-axis array Here. */
      let dualAxisArray = new Array();

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let dualLineChart = new Chart();

      /* Setting chart object. */
      dualLineChart.chart = chartOptions;
      dualLineChart.series = chartSeries;
      dualLineChart.title = title;
      dualLineChart.yAxis = dualAxisArray;
      dualLineChart.xAxis = xAxis;
      dualLineChart.legend = legend;
      // dualLineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      dualLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      dualLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      dualLineChart.plotOptions = { spline: { events: seriesEvent } };

      return dualLineChart;
    } catch (e) {
      this.log.error('Error while  creating dual axis line chart object for slab count.', e);
    }
  }
  /**
   * get data set for slab count graph type for dual axis chart.
   */
  getDataSetForSlabCountForDualAxis(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;


      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < 2; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();

        for (let i = 0; i < graphInfo.graphData.length; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new ChartSeriesPoint();
          let tempIndex;
          for (let aa = 0; aa < panelData.panelGraphs.length; aa++) {
            if (panelData.panelGraphs[aa].slabName != null) {
              tempIndex = aa;
              break;
            }
          }
          let slabName = panelData.panelGraphs[tempIndex].slabName[i];

          let value = 0;
          let colorIdx = panelNumber + k;
          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[i];

          if (typeof value === 'undefined') {
            value = 0;
          }

          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = i;
          chartSeriesData.z = slabName;

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }

        if (k === 1) {
          chartSeries.yAxis = 1;
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating slab count dataset', e);
      return null;
    }
  }
  getLineStackedChartForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();
      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForSeries(dashboardFavoriteData, panelNumber);

      /*Checking for all available series. */
      if (chartSeries !== null) {
        /*Iterating through each chart. */
        for (let i = 0; i < chartSeries.length; i++) {
          if (i === 0) {
            chartSeries[i]['type'] = 'spline';
            chartSeries[i]['color'] = this.setGradientColor(ChartType.LINE_CHART, panelData.panelGraphs[i].graphColor);
          } else {
            chartSeries[i]['type'] = 'column';
            chartSeries[i]['color'] = this.setGradientColor(ChartType.LINE_STACKED, panelData.panelGraphs[i].graphColor);
          }
        }
      }

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function() { return; } };
      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let lineStackedChart = new Chart();

      /* Setting chart object. */
      lineStackedChart.chart = chartOptions;
      lineStackedChart.series = chartSeries;
      lineStackedChart.title = title;
      lineStackedChart.yAxis = dualAxisArray;
      lineStackedChart.xAxis = xAxis;
      lineStackedChart.legend = legend;
      // lineStackedChart.tooltip = tooltip;

      /*Setting Panel number into chart object.*/
      lineStackedChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object */
      lineStackedChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      lineStackedChart.plotOptions = { column: { stacking: 'normal', events: seriesEvent } };

      return lineStackedChart;

    } catch (e) {
      this.log.error('Error while creating line stacked chart object.', e);
      return null;
    }
  }

  /**
     * Method is used to get line chart configuration.
     */
  getLineStackedChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForLineStackedPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /* Creating Y Axis Here */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.events = { setExtremes: function() { return; } };
      xAxis.allowDecimals = false;

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let lineStackedChart = new Chart();

      /* Setting chart object. */
      lineStackedChart.chart = chartOptions;
      lineStackedChart.series = chartSeries;
      lineStackedChart.title = title;
      lineStackedChart.xAxis = xAxis;
      lineStackedChart.legend = legend;
      // lineStackedChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineStackedChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      lineStackedChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      lineStackedChart.plotOptions = { column: { events: seriesEvent } };

      return lineStackedChart;

    } catch (e) {
      this.log.error('Error while creating line stacked chart object for Percentile.', e);
      return null;
    }
  }


  /**
     * Method is used to get line chart configuration.
     */
  getLineStackedChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      this.checkConfigurationWindowSettings();

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Getting categories for slab count.*/
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      let xAxis = new ChartxAxis();
      xAxis.categories = categories;

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';
      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForLineStackedSlabCount(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let lineStackedChart = new Chart();

      /* Setting chart object. */
      lineStackedChart.chart = chartOptions;
      lineStackedChart.series = chartSeries;
      lineStackedChart.title = title;
      lineStackedChart.xAxis = xAxis;
      lineStackedChart.legend = legend;
      // lineStackedChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineStackedChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      lineStackedChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      lineStackedChart.plotOptions = { column: { stacking: 'normal', events: seriesEvent } };
      return lineStackedChart;

    } catch (e) {
      this.log.error('Error while creating line stacked chart object for slab count.', e);
      return null;
    }
  }

  /**
 * get data set for slab count graph type for line stacked chart.
 */
  getDataSetForLineStackedSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type */
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;


      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();

        for (let i = 0; i < graphInfo.graphData.length; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new ChartSeriesPoint();
          let tempIndex;
          for (let aa = 0; aa < panelData.panelGraphs.length; aa++) {
            if (panelData.panelGraphs[aa].slabName != null) {
              tempIndex = aa;
              break;
            }
          }
          let slabName = panelData.panelGraphs[tempIndex].slabName[i];

          let value = 0;
          let colorIdx = panelNumber + k;
          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[i];

          if (typeof value === 'undefined') {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = i;
          chartSeriesData.z = slabName;

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          if (k === 0) {
            chartSeries.lineWidth = 4;
          } else {
            chartSeries.borderWidth = 1;
          }
        }

        if (k === 0) {
          chartSeries.type = 'spline';
        } else {
          chartSeries.type = 'column';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating slab count dataset', e);
      return null;
    }
  }

  getDataSetForLineStackedPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting chart type*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();
        let startIndex = 0;
        let endIndex = graphInfo.graphData.length;
        // if (dashboardPanelData.isZoom) {
        //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
        //   console.log('zoomInfo = ', zoomInfo);
        //   startIndex = zoomInfo['zoomStartTime'];
        //   endIndex = zoomInfo['zoomEndTime'];
        //   this.log.debug(' startIndex = ' + startIndex + ', end = ' + endIndex);
        // }
        for (let j = startIndex; j < endIndex; j++) {
          let chartSeriesData = new ChartSeriesPoint();
          let value = 0;
          let colorIdx = panelNumber + k;

          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[j];

          if (typeof value === 'undefined') {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = j + 1;
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          if (k === 0) {
            chartSeries.lineWidth = 4;
          } else {
            chartSeries.borderWidth = 1;
          }
        }

        if (k === 0) {
          chartSeries.type = 'spline';
        } else {
          chartSeries.type = 'column';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating data set for percentile type', e);
      return null;
    }
  }

  /**
   * This method is used for get area and multiple line with dual axis chart for normal type configuartion object.
   */
  getDualAreaWithMultilineForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForAreaWithMultilineForNormal(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      let dualAxisArray = new Array();

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }


      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      xAxis.type = 'datetime';
      xAxis.events = { setExtremes: function() { return; } };
      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.NORMAL_GRAPH_TYPE);

      /* Creating chart object. */
      let areaLineChart = new Chart();

      /* Setting chart object. */
      areaLineChart.chart = chartOptions;
      areaLineChart.series = chartSeries;
      areaLineChart.title = title;
      areaLineChart.yAxis = dualAxisArray;
      areaLineChart.xAxis = xAxis;
      areaLineChart.legend = legend;
      // areaLineChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      areaLineChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      areaLineChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      areaLineChart.plotOptions = { area: { events: seriesEvent } };

      return areaLineChart;

    } catch (e) {
      this.log.error('Error while creating area line chart object for Normal.', e);
      return null;
    }
  }

  /**
   * This method is used for creating dataset for Area with line chart for normal type.
   */
  getDataSetForAreaWithMultilineForNormal(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Getting Timestamp array. */
      let arrTimestamp = dashboardFavoriteData.arrTimestamp;

      /* Getting total samples. */
      let totalSamples = dashboardFavoriteData.totalSamples;

      /*Handlig for widgetWise GraphTime */
      if (this.isWidgetWiseGraphTimeApplied(dashboardFavoriteData, panelNumber)) {
        arrTimestamp = panelData.arrTimeStamp;
        totalSamples = panelData.totalSamples;
      }
      let trStartTime;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelData.panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }

        // if (dashboardFavoriteData.compareMode) {
        //   arrTimestamp = dashboardFavoriteData.compareDataDTO[k].arrZoomedTimeStamp;
        //   totalSamples = arrTimestamp.length;
        // }

        /* Chart series data. */
        let arrSeriesData = new Array();

        /* Now Iterating through samples. */
        for (let i = 0; i < totalSamples; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new ChartSeriesPoint();
          if (graphInfo.graphData[i] === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = graphInfo.graphData[i];
          }
          chartSeriesData.x = arrTimestamp[i];

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }

        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        if (dashboardFavoriteData.compareMode) {
          trStartTime = dashboardFavoriteData.compareDataDTO[k].trStartTime;
          chartSeries.trStartTime = trStartTime;
        }

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }

        if (k === 0) {
          chartSeries.type = 'area';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);;
        } else {
          chartSeries.yAxis = 1;
          chartSeries.type = 'spline';
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }

  /**
   * Method is used to get Area with line chart configuration.
   */
  getDualAreaWithMultiLineChartForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number,
    dashboardPanelData: DashboardPanelData): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = this.getLevelForZoom(dashboardPanelData);

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForAreaLineForPercentile(dashboardFavoriteData, panelNumber, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      /*Creating dual axis array.*/
      let dualAxisArray = [];

      /* Creating Primary Axis Here. */
      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      /* Creating secondary Axis Here. */
      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;
      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }


      dualAxisArray.push(secondaryAxis);

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }

      xAxis.events = { setExtremes: function() { return; } };
      xAxis.allowDecimals = false;
      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.PERCENTILE_GRAPH_TYPE);

      /* Creating chart object. */
      let lineAreaChart = new Chart();

      /* Setting chart object. */
      lineAreaChart.chart = chartOptions;
      lineAreaChart.series = chartSeries;
      lineAreaChart.title = title;
      lineAreaChart.yAxis = dualAxisArray;
      lineAreaChart.xAxis = xAxis;
      lineAreaChart.legend = legend;
      // lineAreaChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineAreaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      lineAreaChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      lineAreaChart.plotOptions = { area: { events: seriesEvent } };

      return lineAreaChart;

    } catch (e) {
      this.log.error('Error while creating line area chart object.', e);
      return null;
    }
  }

  /**
   * Get data set for Percentile Type for area line chart.
   */
  getDataSetForAreaLineForPercentile(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number, dashboardPanelData: DashboardPanelData): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();
        let startIndex = 0;
        let endIndex = graphInfo.graphData.length;

        /* Used to carry out the zoom operation. */
        // if (dashboardPanelData.isZoom) {
        //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
        //   console.log('zoomInfo = ', zoomInfo);
        //   startIndex = zoomInfo['zoomStartTime'];
        //   endIndex = zoomInfo['zoomEndTime'];
        //   this.log.debug(' startIndex = ' + startIndex + ', end = ' + endIndex);
        // }

        for (let j = startIndex; j < endIndex; j++) {
          let chartSeriesData = new ChartSeriesPoint();
          let value = 0;
          let colorIdx = panelNumber + k;

          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[j];

          if (typeof value === undefined || value === this._constants.NAN_SAMPLES) {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = j + 1;
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;
        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }

        if (k === 0) {
          chartSeries.type = 'area';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        } else {
          chartSeries.type = 'spline';
          chartSeries.yAxis = 1;
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating data set for percentile type', e);
      return null;
    }
  }

  /**
     * Method is used to get area line chart configuration object.
     */
  getDualAreaWithMultiLineChartForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      this.checkConfigurationWindowSettings();

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /*Getting categories for slab count.*/
      let categories = Array<String>();
      let tempData = panelData.panelGraphs[0];
      let temp = tempData['slabName'];
      for (let a = 0; a < temp.length; a++) {
        let aa = temp[a];
        categories.push(aa);
      }

      let xAxis = new ChartxAxis();
      xAxis.categories = categories;

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }


      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = '';

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForAreaWithMultilineForSlabCount(dashboardFavoriteData, panelNumber);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      let dualAxisArray = new Array();

      let primaryAxis = new DualChartyAxis();
      primaryAxis.title['text'] = chartSeries[0].name;
      primaryAxis.title['style']['color'] = chartSeries[0].color;

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }


      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();
      secondaryAxis.opposite = true;

      secondaryAxis.title['text'] = chartSeries[1].name;
      secondaryAxis.title['style']['color'] = chartSeries[1].color;

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.SLAB_COUNT_GRAPH_TYPE);

      /* Creating chart object. */
      let lineAreaChart = new Chart();

      /* Setting chart object. */
      lineAreaChart.chart = chartOptions;
      lineAreaChart.series = chartSeries;
      lineAreaChart.title = title;
      lineAreaChart.xAxis = xAxis;
      lineAreaChart.yAxis = dualAxisArray;
      lineAreaChart.legend = legend;
      // lineAreaChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      lineAreaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      lineAreaChart.panelCaption = panelData.panelCaption;
      /*setting Chart series click Event into plotoptions series event.*/
      lineAreaChart.plotOptions = { area: { events: seriesEvent } };

      return lineAreaChart;

    } catch (e) {
      this.log.error('Error while creating line area chart object.', e);
      return null;
    }
  }
  /**
   * get data set for slab count graph type.
   */
  getDataSetForAreaWithMultilineForSlabCount(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;


      /* Now creating array of chart series. */
      let arrChartSeries = new Array();

      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelGraphs.length; k++) {

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Now checking graph availability. */
        if (!this._dataVaildator.isValidObject(graphInfo.graphData)) {
          this.log.log('Graph data not available for graph = ' + graphInfo.graphName);
          continue;
        }
        /* Chart series data. */
        let arrSeriesData = new Array();

        for (let i = 0; i < graphInfo.graphData.length; i++) {
          /* Creating Instance of one series. */
          let chartSeriesData = new ChartSeriesPoint();
          let tempIndex;
          for (let aa = 0; aa < panelData.panelGraphs.length; aa++) {
            if (panelData.panelGraphs[aa].slabName != null) {
              tempIndex = aa;
              break;
            }
          }
          let slabName = panelData.panelGraphs[tempIndex].slabName[i];

          let value = 0;
          let colorIdx = panelNumber + k;
          if (colorIdx > 15) {
            colorIdx = colorIdx % 15;
          }
          value = graphInfo.graphData[i];

          if (typeof value === 'undefined') {
            value = 0;
          }
          if (value === this._constants.NAN_SAMPLES) {
            chartSeriesData.y = null;
          } else {
            chartSeriesData.y = value;
          }
          chartSeriesData.x = i;
          chartSeriesData.z = slabName;

          /* Adding series point in series data. */
          arrSeriesData.push(chartSeriesData);
        }
        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /* Now setting information in chart series. */
        chartSeries.data = arrSeriesData;
        chartSeries.name = graphInfo.graphName;
        chartSeries.color = graphInfo.graphColor;
        chartSeries.visible = graphInfo.visible;

        if (graphInfo.selected) {
          chartSeries.lineWidth = 4;
        }

        if (k === 0) {
          chartSeries.type = 'area';
          chartSeries.color = this.setGradientColor(chartType, graphInfo.graphColor);
        } else {
          chartSeries.type = 'spline';
          chartSeries.yAxis = 1;
        }
        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating slab count dataset for area line chart', e);
      return null;
    }
  }

  getLegendDisplayName(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<string> {
    try {
      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      let arrlegendNamesForDisplay = [];
      for (let k = 0; k < panelData.panelGraphs.length; k++) {
        arrlegendNamesForDisplay.push(panelData.panelGraphs[k].graphName);
      }
      let graphNameArray = this._utilsService.getUniqueNamesOfGraphsToDisplay(arrlegendNamesForDisplay, '>');
      return graphNameArray;
    } catch (e) {
      console.error(e);
    }
  }

  /**
  * creating  data set for Category graph type.
  */
  getDataSetForCategoryGraph(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Array<ChartSeries> {
    try {

      let arrNormal = new Array(); // c1
      let arrSlow = new Array(); // c2
      let arrVerySlow = new Array(); // c3

      let normalRange;
      let slowRange;
      let verySlowRange;

      if (this._dataService.getDashboardConfigData().categoryGraphInfo === null) {
        console.log('category info is null');
        return;
      } else {
        normalRange = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[0].range;
        slowRange = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[1].range;
        verySlowRange = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[2].range;
      }

      /** Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Chart Type.*/
      let chartType = panelData.chartType;

      /** Getting total samples. */
      let totalSamples = dashboardFavoriteData.totalSamples;
      /** Getting Timestamp array. */
      let arrTimestamp = dashboardFavoriteData.arrTimestamp;

      /*Handling for widgetWise GraphTime */
      if (this.isWidgetWiseGraphTimeApplied(dashboardFavoriteData, panelNumber)) {
        arrTimestamp = panelData.arrTimeStamp;
        totalSamples = panelData.totalSamples;
      }
      for (let i = 0; i < totalSamples; i++) {
        /** Now getting Panel Graphs. */
        let normalCount = 0;
        let slowCount = 0;
        let verySlowCount = 0;
        let panelGraphs = panelData.panelGraphs;
        /** Iterating through Number of graphs. */
        for (let k = 0; k < panelData.panelGraphs.length; k++) {
          let panelGraph = panelGraphs[k];
          let value;
          /*Adding empty sample if graph has NaN values.*/
          if (panelGraph.graphData[i] === this._constants.NAN_SAMPLES) {
            value = -1;
          } else {
            value = panelGraph.graphData[i];
          }

          if (typeof value === 'undefined') {
            value = -1;
          }
          if (value >= normalRange && value < slowRange) {
            normalCount++;
          } else if (value >= slowRange && value < verySlowRange) {
            slowCount++;
          } else if (value >= verySlowRange) {
            verySlowCount++;
          }
        }

        /*Adding count to array.*/
        arrNormal.push(normalCount);
        arrSlow.push(slowCount);
        arrVerySlow.push(verySlowCount);
      }
      let arrChartSeries = new Array();
      for (let i = 0; i < 3; i++) {
        let graphName = '';
        let color = '';
        if (i === 0) {
          graphName = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[2].categoryGraphName;
          color = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[2].categoryGraphColor;
        } else if (i === 1) {
          graphName = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[1].categoryGraphName;
          color = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[1].categoryGraphColor;
        } else if (i === 2) {
          graphName = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[0].categoryGraphName;
          color = this._dataService.getDashboardConfigData().categoryGraphInfo.catGraphThreshold[0].categoryGraphColor;
        }

        let value;
        let arrChartSeriesData = new Array();

        for (let k = 0; k < totalSamples; k++) {
          let chartSerieData = new ChartSeriesPoint();

          if (i === 0) {
            value = arrVerySlow[k];
          } else if (i === 1) {
            value = arrSlow[k];
          } else if (i === 2) {
            value = arrNormal[k];
          }
          chartSerieData.x = arrTimestamp[k];
          if (value === this._constants.NAN_SAMPLES) {
            chartSerieData.y = null;
          } else {
            chartSerieData.y = value;
          }
          arrChartSeriesData.push(chartSerieData);
        }
        /** Creating Object of one series. */
        let chartSeries = new ChartSeries();

        /** Now setting information in chart series. */
        chartSeries.data = arrChartSeriesData;
        chartSeries.name = graphName;
        chartSeries.color = this.setGradientColor(chartType, color);
        arrChartSeries.push(chartSeries);
      }
      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }

  /**
     * Method is used to get line chart configuration.
     */
  getStackedAreaForCategoryType(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /** Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /** Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;

      /** Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'area';

      /** Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /** Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForCategoryGraph(dashboardFavoriteData, panelNumber);

      /**Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);

      /** Creating Y Axis Here. */
      let dualAxisArray = [];
      /* Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);
      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /** Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      xAxis.type = 'datetime';

      /** Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode, ChartType.NORMAL_GRAPH_TYPE);

      /** Creating chart object. */
      let stackedAreaChart = new Chart();

      /** Setting chart object. */
      stackedAreaChart.chart = chartOptions;
      stackedAreaChart.series = chartSeries;
      stackedAreaChart.title = title;
      stackedAreaChart.yAxis = dualAxisArray;
      stackedAreaChart.xAxis = xAxis;
      stackedAreaChart.legend = legend;
      // stackedAreaChart.tooltip = tooltip;

      /**Setting Panel number into chart object.*/
      stackedAreaChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      stackedAreaChart.panelCaption = panelData.panelCaption;
      /**seteing Chart series click Event into plotoptions series event.*/
      stackedAreaChart.plotOptions = { area: { stacking: 'normal', events: seriesEvent } };

      return stackedAreaChart;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object.', e);
      return null;
    }
  }

  /**
  * Method is used to get line chart configuration.
  */
  getStackedBarForCategoryType(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /** Creating Chart Title for stacked bar Chart. */
      let title = new ChartTitle();
      title.text = null;

      /** Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';
      chartOptions.type = 'column';

      /** Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = panelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(panelData.legendAlignmentOnWidget, legend);
      this.checkConfigurationWindowSettings();

      /** Creating DataSet For stacked bar Chart. */
      let chartSeries = this.getDataSetForCategoryGraph(dashboardFavoriteData, panelNumber);

      /** Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);

      /** Creating Y Axis Here. */
      let dualAxisArray = [];
      /** Creating Y Axis Here. */
      let primaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        primaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        primaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(primaryAxis);

      let secondaryAxis = new DualChartyAxis();

      if (!this.isEnableGridLineInChart) {
        secondaryAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        secondaryAxis.crosshair['width'] = 0;
      }

      dualAxisArray.push(secondaryAxis);

      /** Creating X Axis Here. */
      let xAxis = new ChartxAxis();

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair['width'] = 0;
        xAxis.crosshair['color'] = 'transparent';
      }
      xAxis.type = 'datetime';

      /** Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = '(Sample)';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode, ChartType.NORMAL_GRAPH_TYPE);

      /** Creating chart object. */
      let stackedBarChart = new Chart();

      /** Setting chart object. */
      stackedBarChart.chart = chartOptions;
      stackedBarChart.series = chartSeries;
      stackedBarChart.title = title;
      stackedBarChart.yAxis = dualAxisArray;
      stackedBarChart.xAxis = xAxis;
      stackedBarChart.legend = legend;
      // stackedBarChart.tooltip = tooltip;

      /**Setting Panel number into chart object.*/
      stackedBarChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      stackedBarChart.panelCaption = panelData.panelCaption;
      /**seteing Chart series click Event into plotoptions series event.*/
      stackedBarChart.plotOptions = { column: { stacking: 'normal', events: seriesEvent } };

      return stackedBarChart;

    } catch (e) {
      this.log.error('Error while creating stacked bar chart object.', e);
      return null;
    }
  }

  /*This Method is used for generate the Geo Map chart object.*/
  getDataForGeoMap(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Panel Caption. */
      let panelCaption = panelData.panelCaption;

      /*Getting Geo Map Color Band */
      let isColorBandRedToGreen = panelData.colorBandRedToGreen;

      /*Getting Tick interval*/
      let tickInterval = panelData.panelGraphs[0].scaleInterval;

      /*Getting Max Scale Value */
      let maxScaleValue = panelData.panelGraphs[0].weightedScaleValue;

      /*Getting Geo Map Key*/
      let mapKey = panelData.panelGraphs[0].mapKey;

      /*Getting Geo Map Threshold value */
      let geoMapThreshold = panelData.geoMapThreshold;

      let lastScaleValue = maxScaleValue - tickInterval;

      /*Getting GGV */
      let ggv = panelData.panelGraphs[0].gGV;

      /*Getting Group Id */
      let groupId = ggv.split('-')[0];

      /*Getting Graph Id */
      let graphId = ggv.split('-')[1];

      /*For Enchanced Tool Tip*/
      let enchancedToolTip = false;

      if ((groupId === '3' || groupId === '4' || groupId === '6') && graphId === '3') {
        enchancedToolTip = true;
      }

      let geomapSeriesData = new Array();

      let geoColorBandArr = [[0, '#03FF00'], [0.5, '#FFFF00'], [1, '#FF0000']];

      if (isColorBandRedToGreen) {
        geoColorBandArr = [[0, '#FF0000'], [0.5, '#FFFF00'], [1, '#03FF00']];
      }

      /* This is done for get the no. of digits after the decimal point in tickInterval*/
      let decimalDigit = tickInterval.toString().split('.');
      if (decimalDigit.length > 1) {
        let digit = decimalDigit[1].length;
        /*This is done because the no. of digits after the decimal point of lastScaleValue is not
        coming equal to the no. of digits after the           decimal point of tick Interval  */
        lastScaleValue = Number(lastScaleValue.toFixed(digit));
      }

      /*Getting Map Data for the Geo Map. */
      let mapData = JSON.parse(panelData.mapData);

      let previousButton = false;
      let previousTitle = 'World Map';

      if (mapKey === 'USA') {
        previousButton = true;
      } else if (usaStateMap[mapKey] !== undefined) {
        previousButton = true;
        previousTitle = 'USA Map';
      }

      /*Getting High Map Chart Object.*/
      let geoMap = new HighMapChart();

      /*Legend for the Map . */
      geoMap.legend = {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom',
        floating: false,
        valueDecimals: 0,
        symbolHeight: 100, // to set the height of the scalebar/legend
        padding: -5,
        symbolPadding: 10,
        y: -40,
        x: 10,
        navigation: { enabled: false }
      };

      /*Geo Map chart setting onject. */
      geoMap.chart = { marginLeft: 50 };

      /*Geo Map Color Axis . */
      geoMap.colorAxis = {
        min: 0,
        max: maxScaleValue,
        stops: geoColorBandArr,
        tickInterval: tickInterval,
        showLastLabel: false,
        labels: {
          align: 'left',
          x: 4,
          useHTML: true,
          formatter: function () {
            if (this.value === lastScaleValue) {
              return '<b>' + '>' + this.value + '</b>';
            } else {
              return '<b>' + this.value + '</b>';
            }
          }
        }
      };

      /*Setting Geo Map Type. */
      geoMap.type = 'map';

      /*Setiing Panel number into chart object.*/
      geoMap.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      geoMap.panelCaption = panelData.panelCaption;
      /*For the custom button tooltip.*/
      // geoMap.lang = {
      //   worldMap: 'World Map',
      //   previous: previousTitle,
      //   zoomIN: 'Zoom In',
      //   zoomOut: 'Zoom Out',
      //   reset: 'Reset'
      // };

      /*For the Geo Map Tooltip*/
      // let tooltip = new ChartTooltip();
      // tooltip.enabled = true;
      // tooltip.delayForDisplay = 100;
      // tooltip.formatter = new ChartTooltipFormatter().getGeoMapToolTip(enchancedToolTip, panelCaption);
      // geoMap.tooltip = tooltip;

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.geoMapClickEventHandler;

      /*Getting Geo Map Series Data. */
      geomapSeriesData = this.getDataSetForGeoMap(panelData, panelNumber);

      geoMap.series = [{ data: geomapSeriesData, mapData: mapData, joinBy: ['name', 'key'], point: { events: seriesEvent } }];

      /*For the Geo Map Custom buttons.*/
      geoMap.exporting = {
        enabled: true,
        buttons: {
          contextButton: {
            enabled: false
          },
          /*This is used to add the custom zoom out button on the Geo map chart*/
          ZoomOutButton: {
            verticalAlign: 'top',
            align: 'right',
            x: 0,
            y: 0,
            height: 1,
            width: 2,
            symbolSize: 12,
            symbolX: 5,
            symbolY: 15,
            symbolStrokeWidth: 0,
            _titleKey: 'zoomOut',
            onclick: function () {
              this.mapZoom(2);
            },
            text: '',
            symbol: 'url(./images/zoomOut.png)', // to add the image
          },
          resetButton: {
            verticalAlign: 'bottom',
            align: 'left',
            x: 25,
            y: -10,
            height: 1,
            width: 2,
            symbolSize: 12,
            symbolX: 20,
            symbolY: 10,
            symbolStrokeWidth: 2,
            _titleKey: 'reset',
            onclick: function () {
              this.mapZoom();
            },
            text: '',
            symbol: 'url(./images/reset.gif)' // to add the image
          },
          ZoomInButton: {
            verticalAlign: 'top',
            align: 'right',
            x: 0,
            y: 0,
            height: 1,
            width: 2,
            symbolSize: 12,
            symbolX: -10,
            symbolY: 15,
            symbolStrokeWidth: 0,
            _titleKey: 'zoomIN',
            onclick: function () {
              this.mapZoom(0.5);
            },
            text: '',
            symbol: 'url(./images/zoomIn.png)', // to add the image
          },
          previousButton: {
            enabled: previousButton,
            verticalAlign: 'bottom',
            align: 'left',
            x: 50,
            y: -10,
            _titleKey: 'previous',
            onclick: this.previousButtonClickEventHandler,
            text: '',
            symbol: 'url(./images/previous.png)',  // to add the image
            symbolX: 20,
            symbolY: 10,
            symbolStrokeWidth: 2,
            height: 1,
            width: 2,
            symbolSize: 12
          },
          worldMapButton: {
            enabled: true,
            verticalAlign: 'bottom',
            align: 'left',
            x: 0,
            y: -10,
            _titleKey: 'worldMap',
            // onclick: this.worldMapClickEventHandler,
            text: '',
            symbol: 'url(./images/worldmap.png)',
            symbolX: 20,
            symbolY: 10,  // to add the image
            symbolStrokeWidth: 2,
            height: 1,
            width: 2,
            symbolSize: 12
          }
        }
      }

      return geoMap;

    } catch (error) {
      this.log.error('Error while creating line Geo Map Chart object.', error);
      return null;
    }
  }

  /*This Method is used to make the Data for the Geo Map*/
  getDataSetForGeoMap(panelData, panelNumber) {
    try {
      let data = new Array();
      let geoMapData = panelData.panelGraphs[0].geoMapDataMap;
      let mapKey = panelData.panelGraphs[0].mapKey;

      if (geoMapData == null) {
        return new Array();
      } else {
        for (let index in geoMapData) {
          if (geoMapData.hasOwnProperty(index)) {

            let value = geoMapData[index];

            if (mapKey === 'custom/world') {
              if (value.countryName === 'USA') {
                value.countryName = 'United States of America';
              }
              if (value.countryName === 'UnitedKingdom') {
                value.countryName = 'United Kingdom';
              }

              let graphName = '';
              let vectorName = '';
              let min = 0.0;
              let max = 0.0;
              let eigthtyPercentile = 0.0;
              let nintyPercentile = 0.0;
              let nintyFivePercentile = 0.0;
              let nintyNinePercentile = 0.0;
              let failure = 0;
              let percentFailure = 0;
              let success = 0;
              let metaData = 'NA';
              let geoMapGraphInfoDTO = value.geoMapGraphInfoDTO;

              if (geoMapGraphInfoDTO !== null && Object.keys(geoMapGraphInfoDTO).length !== 0) {
                let graphNameWithVector = geoMapGraphInfoDTO.graphName;
                min = geoMapGraphInfoDTO.min;
                max = geoMapGraphInfoDTO.max;
                eigthtyPercentile = geoMapGraphInfoDTO.eightyPercentile;
                nintyPercentile = geoMapGraphInfoDTO.nintyPercentile;
                nintyFivePercentile = geoMapGraphInfoDTO.nintyFivePercentile;
                nintyNinePercentile = geoMapGraphInfoDTO.nintyNinePercentile;
                failure = geoMapGraphInfoDTO.failure;
                percentFailure = geoMapGraphInfoDTO.percentFailure;
                success = geoMapGraphInfoDTO.success;
                metaData = geoMapGraphInfoDTO.metaData;
                let temp = graphNameWithVector.split('-');
                graphName = temp[0].trim();
                vectorName = temp[1].trim();
              }

              data.push({
                key: value.countryName,
                value: value.weightedAvg,
                min: min,
                max: max,
                eigthtyPercentile: eigthtyPercentile,
                nintyPercentile: nintyPercentile,
                nintyFivePercentile: nintyFivePercentile,
                nintyNinePercentile: nintyNinePercentile,
                failure: failure,
                percentFailure: percentFailure,
                success: success,
                vectorName: vectorName,
                graphName: graphName,
                metaData: metaData,
                borderColor: 'black',
                borderWidth: 1,
                isCity: false,
                panelNumber: panelNumber

              });
            } else if (mapKey === 'USA') {
              let state = value.geoMapStateDataMap;
              let map = {};
              if (Object.keys(state).length !== 0) {
                for (let stateIndex in state) {
                  if (state.hasOwnProperty(stateIndex)) {
                    let stateValue = state[stateIndex];

                    if (map[stateValue.stateName] !== undefined) {

                    } else {
                      if (stateValue.stateName === 'NewYork') {
                        stateValue.stateName = 'New York';
                      }
                      if (stateValue.stateName === 'NorthCarolina') {
                        stateValue.stateName = 'North Carolina';
                      }
                      if (stateValue.stateName === 'SouthCarolina') {
                        stateValue.stateName = 'South Carolina';
                      }
                      if (stateValue.stateName === 'NorthDakota') {
                        stateValue.stateName = 'North Dakota';
                      }
                      if (stateValue.stateName === 'SouthDakota') {
                        stateValue.stateName = 'South Dakota';
                      }
                      if (stateValue.stateName === 'WestVirginia') {
                        stateValue.stateName = 'West Virginia';
                      }
                      if (stateValue.stateName === 'NewMexico') {
                        stateValue.stateName = 'New Mexico';
                      }
                      if (stateValue.stateName === 'NewHampshire') {
                        stateValue.stateName = 'New Hampshire';
                      }
                      if (stateValue.stateName === 'NewJersey') {
                        stateValue.stateName = 'New Jersey';
                      }
                      if (stateValue.stateName === 'RhodeIsland') {
                        stateValue.stateName = 'Rhode Island';
                      }

                      map[stateValue.stateName] = stateValue.weightedAvg;
                      let cityMap = stateValue.geoMapCityDataMap;
                      let graphName = '';
                      let vectorName = '';
                      let min = 0.0;
                      let max = 0.0;
                      let eigthtyPercentile = 0.0;
                      let nintyPercentile = 0.0;
                      let nintyFivePercentile = 0.0;
                      let nintyNinePercentile = 0.0;
                      let failure = 0;
                      let percentFailure = 0;
                      let success = 0;
                      let geoMapGraphInfoDTO = stateValue.geoMapGraphInfoDTO;
                      let metaData = 'NA';
                      let city = false;
                      if (Object.keys(cityMap).length !== 0) {
                        city = true;
                      }

                      if (geoMapGraphInfoDTO != null && Object.keys(geoMapGraphInfoDTO).length !== 0) {

                        min = geoMapGraphInfoDTO.min;
                        max = geoMapGraphInfoDTO.max;
                        eigthtyPercentile = geoMapGraphInfoDTO.eightyPercentile;
                        nintyPercentile = geoMapGraphInfoDTO.nintyPercentile;
                        nintyFivePercentile = geoMapGraphInfoDTO.nintyFivePercentile;
                        nintyNinePercentile = geoMapGraphInfoDTO.nintyNinePercentile;
                        failure = geoMapGraphInfoDTO.failure;
                        percentFailure = geoMapGraphInfoDTO.percentFailure;
                        success = geoMapGraphInfoDTO.success;
                        metaData = geoMapGraphInfoDTO.metaData;
                        let graphNameWithVector = geoMapGraphInfoDTO.graphName;
                        let temp = graphNameWithVector.split('-');
                        graphName = temp[0].trim();
                        vectorName = temp[1].trim();
                      }

                      data.push({
                        key: stateValue.stateName,
                        value: stateValue.weightedAvg,
                        min: min,
                        max: max,
                        eigthtyPercentile: eigthtyPercentile,
                        nintyPercentile: nintyPercentile,
                        nintyFivePercentile: nintyFivePercentile,
                        nintyNinePercentile: nintyNinePercentile,
                        failure: failure,
                        percentFailure: percentFailure,
                        success: success,
                        vectorName: vectorName,
                        graphName: graphName,
                        metaData: metaData,
                        borderColor: 'black',
                        borderWidth: 1,
                        isCity: city,
                        panelNumber: panelNumber

                      });

                    }

                  }
                }
              }
            } else {
              let state = value.geoMapStateDataMap;

              if (Object.keys(state).length !== 0) {
                for (let stateIndex in state) {
                  if (state.hasOwnProperty(stateIndex)) {
                    let stateValue = state[stateIndex];
                    let cityDataMap = stateValue.geoMapCityDataMap;

                    if (Object.keys(cityDataMap).length !== 0) {
                      let map = {};
                      for (let cityIndex in cityDataMap) {
                        if (cityDataMap.hasOwnProperty(cityIndex)) {
                          let cityValue = cityDataMap[cityIndex];
                          if (map[cityValue.cityName] !== undefined) {

                          } else {
                            map[cityValue.cityName] = cityValue.dataValue;

                            if (cityValue.cityName === 'SanFrancisco') {
                              cityValue.cityName = 'San Francisco';
                            }
                            if (cityValue.cityName === 'LosAngeles') {
                              cityValue.cityName = 'Los Angeles';
                            }

                            let graphName = '';
                            let vectorName = '';
                            let graphNameWithVector = cityValue.graphName;
                            let temp = graphNameWithVector.split('-');
                            graphName = temp[0].trim();
                            vectorName = temp[1].trim();
                            data.push({
                              key: cityValue.cityName,
                              value: cityValue.dataValue,
                              min: cityValue.min,
                              max: cityValue.max,
                              eigthtyPercentile: cityValue.eigthtyPercentile,
                              nintyPercentile: cityValue.nintyPercentile,
                              nintyFivePercentile: cityValue.nintyFivePercentile,
                              nintyNinePercentile: cityValue.nintyNinePercentile,
                              failure: cityValue.failure,
                              percentFailure: cityValue.percentFailure,
                              success: cityValue.success,
                              metaData: cityValue.metaData,
                              vectorName: vectorName,
                              graphName: graphName,
                              borderColor: 'black',
                              borderWidth: 1,
                              isCity: false,
                              panelNumber: panelNumber

                            });

                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return data;
    } catch (error) {
      this.log.error('Error while generate Geo Map Series Data ', error);
      return new Array();
    }
  }

  /*This method is used to generate the Extended Geo Map chart object */
  getDataForGeoMapExtended(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number): Chart {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /*Getting Panel Caption. */
      let panelCaption = panelData.panelCaption;

      /*Getting Geo Map Color Band */
      let isColorBandRedToGreen = panelData.colorBandRedToGreen;

      /*Getting Tick interval*/
      let tickInterval = panelData.panelGraphs[0].scaleInterval;

      /*Getting Max Scale Value */
      let maxScaleValue = panelData.panelGraphs[0].weightedScaleValue;

      /*Getting Geo Map Key*/
      let mapKey = panelData.panelGraphs[0].mapKey;

      /*Getting Geo Map Threshold value */
      let geoMapThreshold = panelData.geoMapThreshold;

      let lastScaleValue = maxScaleValue - tickInterval;

      /*Getting GGV */
      let ggv = panelData.panelGraphs[0].gGV;

      /*Getting Group Id */
      let groupId = ggv.split('-')[0];

      /*Getting Graph Id */
      let graphId = ggv.split('-')[1];

      let geoColorBandArr = [[0, '#03FF00'], [0.5, '#FFFF00'], [1, '#FF0000']];

      if (isColorBandRedToGreen) {
        geoColorBandArr = [[0, '#FF0000'], [0.5, '#FFFF00'], [1, '#03FF00']];
      }

      /* This is done for get the no. of digits after the decimal point in tickInterval*/
      let decimalDigit = tickInterval.toString().split('.');
      if (decimalDigit.length > 1) {
        let digit = decimalDigit[1].length;
        /*This is done because the no. of digits after the decimal point of lastScaleValue is not
        coming equal to the no. of digits after the           decimal point of tick Interval  */
        lastScaleValue = Number(lastScaleValue.toFixed(digit));
      }

      let RBUToolTip = false;

      if (groupId === '107') {
        RBUToolTip = true;
      }

      /*Getting Map Data for the Geo Map. */
      let mapData = JSON.parse(panelData.mapData);

      let geoMapExtMapPointSize = this._dataService.getDashboardConfigData().wDConfigurationDTO.geoMapExtMapPointSize;

      let geoMapExtendedSeriesData = new Array();

      /*Getting Extended Geo Map Series Data. */
      geoMapExtendedSeriesData = this.getDataSetForGeoMapExtended(panelData, panelNumber);

      let geoMapExtended = new HighMapChart();

      /*Legend for the Map . */
      geoMapExtended.legend = {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom',
        floating: false,
        valueDecimals: 0,
        symbolHeight: 100, // to set the height of the scalebar/legend
        padding: -5,
        symbolPadding: 10,
        y: -40,
        x: 10,
        navigation: { enabled: false }
      };

      /*Extended Geo Map chart setting onject. */
      geoMapExtended.chart = { marginLeft: 50 };

      geoMapExtended.type = 'map';

      /*Extended Geo Map Color Axis . */
      geoMapExtended.colorAxis = {
        min: 0,
        max: maxScaleValue,
        stops: geoColorBandArr,
        tickInterval: tickInterval,
        showLastLabel: false,
        labels: {
          align: 'left',
          x: 4,
          useHTML: true,
          formatter: function () {
            if (this.value === lastScaleValue) {
              return '<b>' + '>' + this.value + '</b>';
            } else {
              return '<b>' + this.value + '</b>';
            }
          }
        }
      };


      /*Setiing Panel number into chart object.*/
      geoMapExtended.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      geoMapExtended.panelCaption = panelData.panelCaption;
      /*For the custom button tooltip.*/
      geoMapExtended.lang = {
        zoomIN: 'Zoom In',
        zoomOut: 'Zoom Out'
      };

      /*For the Extended Geo Map Tooltip*/
      geoMapExtended.tooltip = {
        enabled: true,
        delayForDisplay: 500,
        formatter: function () {
          /*This is used for get the arrow icon on perticlar store value on the Color Axis when hover on tooltip*/
          let chart = this.series.chart;
          let mapPoint = chart.series[0].data[0];
          let point = this.point;
          let tooltip = this.series.chart.tooltip;
          mapPoint.value = point.value;
          this.series.chart.colorAxis[0].drawCrosshair(null, mapPoint);

          if (RBUToolTip) {
            if (point.alertFlag) {
              if (point.city === null) {
                return 'Value: ' + point.value + '<br>' + 'State: ' + point.stateName + '<br>' + 'Lat: ' + point.lat + '<br>' +
                  'Lon: ' + point.lon + '<br>' + 'Alert Value: ' + point.alertValue + '<br>' + 'Alert Count: ' + point.alertCount;
              } else {
                return 'Value: ' + point.value + '<br>' + 'State: ' + point.stateName + '<br>' + 'City: ' + point.city + '<br>' +
                  'Lat: ' + point.lat + '<br>' + 'Lon: ' + point.lon + '<br>' + 'Alert Value: ' + point.alertValue + '<br>' +
                  'Alert Count: ' + point.alertCount;
              }
            } else {
              if (point.city === null) {
                return 'Value: ' + point.value + '<br>' + 'State: ' + point.stateName + '<br>' +
                  'Lat: ' + point.lat + '<br>' + 'Lon: ' + point.lon;
              } else {
                return 'Value: ' + point.value + '<br>' + 'State: ' + point.stateName + '<br>' + 'City: ' + point.city + '<br>' +
                  'Lat: ' + point.lat + '<br>' + 'Lon: ' + point.lon;

              }

            }
          } else {
            if (point.alertFlag) {
              return 'Value: ' + point.value + '<br>' + 'State: ' + point.stateName + '<br>' + 'City: ' + point.city + '<br>' +
                point.description + '<br>' + 'Lat: ' + point.lat + '<br>' + 'Lon: ' + point.lon + '<br>' + 'Alert Value: ' +
                point.alertValue + '<br>' + 'Alert Count: ' + point.alertCount;

            } else {
              return 'Value: ' + point.value + '<br>' + 'State: ' + point.stateName + '<br>' + 'City: ' + point.city + '<br>' +
                point.description + '<br>' + 'Lat: ' + point.lat + '<br>' + 'Lon: ' + point.lon;
            }
          }
        }

      };

      /*For the Extended Geo Map custom buttons. */
      geoMapExtended.exporting = {
        enabled: true,
        buttons: {
          /*This is used to hide the context button icon from the Geo map chart*/
          contextButton: {
            enabled: false
          },
          ZoomOutButton: {
            verticalAlign: 'top',
            align: 'right',
            x: 0,
            y: -10,
            height: 1,
            width: 2,
            symbolSize: 12,
            symbolX: 5,
            symbolY: 15,
            symbolStrokeWidth: 0,
            _titleKey: 'zoomOut',
            onclick: function () {
              this.mapZoom(2);
            },
            text: '',
            symbol: 'url(./images/zoomOut.png)', // to add the image
          },
          ZoomInButton: {
            verticalAlign: 'top',
            align: 'right',
            x: 0,
            y: -10,
            height: 1,
            width: 2,
            symbolSize: 12,
            symbolX: -10,
            symbolY: 15,
            symbolStrokeWidth: 0,
            _titleKey: 'zoomIN',
            onclick: function () {
              this.mapZoom(0.5);
            },
            text: '',
            symbol: 'url(./images/zoomIn.png)', // to add the image
          }
        }
      };

      geoMapExtended.series = [{
        data: [],
        mapData: mapData,
        name: 'Population density',
        borderColor: 'gray',
        states: {
          hover: {
            color: '#a4edba'
          },
          select: {
            color: 'black'
          }
        },
      },
      {
        type: 'mappoint',
        name: 'Cities',
        marker: {
          lineColor: 'black',
          lineWidth: 1,
          radius: geoMapExtMapPointSize
        },
        cursor: 'pointer',
        showInLegend: false,
        data: geoMapExtendedSeriesData,
        dataLabels: {
          enabled: false
        },
        point: {
          events: {
            // click: this.geoMapExtendedClickEventHandler
          }
        },

        color: 'red'
      }
      ];

      return geoMapExtended;

    } catch (error) {
      this.log.error('Error while creating Extended Geo Map Chart object.', error);
      return null;
    }
  }

  /*This Method is used to make the Data for the Extended Geo Map*/
  getDataSetForGeoMapExtended(panelData, panelNumber) {
    try {
      let data = new Array();
      let geoMapExtendedData = panelData.panelGraphs[0].geoMapGraphInfoDTOs;
      let mapKey = 'USA';
      let object = {};
      if (geoMapExtendedData == null || geoMapExtendedData === undefined) {
        return new Array();
      } else {
        for (let index in geoMapExtendedData) {
          if (geoMapExtendedData.hasOwnProperty(index)) {
            let value = geoMapExtendedData[index];
            if (value.lat === 0 && value.lon === 0) {
              this.log.debug('Lat & Lon Value is Not coming for the graphName = ' + value.graphName +
                ' , stateName = ' + value.stateName + ' city Name = ' + value.cityName);
              continue;
            }

            object = {
              lat: value.lat,
              lon: value.lon,
              name: value.graphName,
              value: value.dataValue,
              description: value.description,
              stateName: value.stateName,
              city: value.cityName,
              color: value.graphColor,
              alertCount: value.alertCount,
              alertValue: value.alertValue,
              alertFlag: value.alertFlag,
              className: ''
            };
            if (object['value'] === 0) {
              object['color'] = '#A9A9A9';
            }
            if (value.alertFlag) {
              object['className'] = 'blinking-points';
            }
            data.push(object);
          }
        }

        data.sort(function (a, b) {
          return parseFloat(a.value) - parseFloat(b.value);
        });
      }

      return data;
    } catch (error) {
      this.log.error('Error while generate Extended Geo Map Series Data ', error);
      return new Array();
    }
  }


  getMultiAxesChartConfig(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number, dashboardPanelData: DashboardPanelData): Chart {

    /* Creating chart object. */
    let multiAxisChart = new Chart();

    try {

      let selectedPanelData = dashboardFavoriteData.panelData[panelNumber];

      /*Creating Category array for x axis.*/
      let xAxisArrayCat = new Array();

      /* Creating Chart Title for Line Chart. */
      let title = new ChartTitle();
      title.text = null;

      /* Creating Chart Options value. */
      let chartOptions = new ChartOptions();
      // chartOptions.zoomType = 'x';

      this.checkConfigurationWindowSettings();

      /* Creating Chart Legend Here. */
      let legend = new ChartLegend();
      legend.enabled = selectedPanelData.showLegendOnWidget;
      let legendNameArr = this.getLegendDisplayName(dashboardFavoriteData, panelNumber);
      legend.labelFormatter = function () {
        let index = this['index'];
        return legendNameArr[index];
      };
      this.applyLegendSettings(selectedPanelData.legendAlignmentOnWidget, legend);

      let exp = selectedPanelData.panelGraphs[0].dialGraphExp;
      let arr = exp.split('_');
      let baseLinGraph = parseInt(arr[3]);
      let leftYaxis = arr[4].split(',');

      /* Creating DataSet For Line Chart. */
      let chartSeries = this.getDataSetForMultiAxisChart(dashboardFavoriteData, panelNumber, baseLinGraph, dashboardPanelData);

      /*Attaching Series Click Event. */
      let seriesEvent = new ChartSeriesEvents();
      // seriesEvent.click = this.chartEventHandler.bind(this);
      // seriesEvent.legendItemClick = this.legendChartEventHandler.bind(this);

      let multiYAxisArray = new Array();
      let index = 0;
      for (let i = 0; i < selectedPanelData.panelGraphs.length; i++) {

        let graphName = (selectedPanelData.panelGraphs[i].graphName).split('-')[0];

        if (i === baseLinGraph)
          continue;

        if (leftYaxis.indexOf(i + '') > -1) {
          multiYAxisArray[index] = {
            title: {
              text: graphName,
              useHTML: true,
              style: {
                color: selectedPanelData.panelGraphs[i].graphColor,
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }
            },
            labels: {
              style: {
                color: selectedPanelData.panelGraphs[i].graphColor
              },
            },
            gridLineColor: '#5A6F89',
            gridLineWidth: this.isEnableGridLineInChart ? 0.1 : 0,
            opposite: false
          };
        } else {

          multiYAxisArray[index] = {
            title: {
              text: graphName,
              useHTML: true,
              style: {
                color: selectedPanelData.panelGraphs[i].graphColor,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                marginLeft: '-5px'
              }
            },
            labels: {
              style: {
                color: selectedPanelData.panelGraphs[i].graphColor
              },
            },
            gridLineColor: '#5A6F89',
            gridLineWidth: this.isEnableGridLineInChart ? 0.2 : 0,
            opposite: true
          };
        }
        index++;
      }


      for (let bucket_index = 0; bucket_index < selectedPanelData.arrTimestampBuckets.length - 1; bucket_index++) {
        if (bucket_index === selectedPanelData.arrTimestampBuckets.length - 2) {
          xAxisArrayCat[bucket_index] = selectedPanelData.arrTimestampBuckets[bucket_index] + '';
          xAxisArrayCat[bucket_index + 1] = selectedPanelData.arrTimestampBuckets[bucket_index] + '+';
        }
        else
          xAxisArrayCat[bucket_index] = selectedPanelData.arrTimestampBuckets[bucket_index] + '';
      }

      /* Creating X Axis Here. */
      let xAxis = new ChartxAxis();
      xAxis.categories = xAxisArrayCat;
      xAxis.allowDecimals = true;
      xAxis.tickmarkPlacement = 'on';


      /**If Zoom is applied on widget */
      // if (dashboardPanelData.isZoom) {

      //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
      //   this.log.debug('zoomInfo = ', zoomInfo);
      //   let xAxisArrayCatInZoom = new Array();
      //   let startIndex = zoomInfo['zoomStartTime'];
      //   let endIndex = zoomInfo['zoomEndTime'];

      //   if (dashboardPanelData.zoomChartTimeList.length > 1) {
      //     for (let j = dashboardPanelData.zoomChartTimeList.length - 2; j >= 0; j--) {
      //       let diff = endIndex - startIndex;
      //       let perivousZoomInfo = dashboardPanelData.zoomChartTimeList[j];
      //       startIndex = startIndex + perivousZoomInfo['zoomStartTime'];
      //       endIndex = startIndex + diff;
      //     }
      //   }

      //   for (let index = startIndex; index <= endIndex; index++) {
      //     if (index === endIndex && endIndex === selectedPanelData.arrTimestampBuckets.length - 1)
      //       xAxisArrayCatInZoom.push(selectedPanelData.arrTimestampBuckets[index - 1] + '+');
      //     else
      //       xAxisArrayCatInZoom.push(selectedPanelData.arrTimestampBuckets[index] + '');
      //   }
      //   xAxis.categories = xAxisArrayCatInZoom;
      // }

      if (!this.isEnableCrosshairInChart) {
        xAxis.crosshair = { width: 0, color: 'transparent' };
      }

      xAxis.gridLineColor = '#5A6F89';
      xAxis.gridLineWidth = 0.2;

      if (!this.isEnableGridLineInChart) {
        xAxis.gridLineWidth = 0;
      }

      let xAxisLableName = (selectedPanelData.panelGraphs[baseLinGraph].graphName).split('-')[0];
      xAxis.title = { text: xAxisLableName };
      xAxis.events = { setExtremes: function() { return; } };

      // /* Creating the chart tooltip. */

      // /* Creating the chart tooltip. */
      // let tooltip = new ChartTooltip();
      // tooltip.valueSuffix = ' ';
      // tooltip.formatter = new ChartTooltipFormatter().getSeriesTooltipFormatter(this._config.$timeZone, this._config.$isCompareMode,
      //   ChartType.CORRELATED_MULTI_AXES_CHART);



      /* Setting chart object. */
      multiAxisChart.chart = chartOptions;
      multiAxisChart.series = chartSeries;
      multiAxisChart.title = title;
      multiAxisChart.yAxis = multiYAxisArray;
      multiAxisChart.xAxis = xAxis;
      multiAxisChart.legend = legend;
      // multiAxisChart.tooltip = tooltip;
      /*Setting Panel number into chart object.*/
      multiAxisChart.panelNumber = panelNumber;
      /*Setting Panel Caption into chart object.*/
      multiAxisChart.panelCaption = selectedPanelData.panelCaption;

      /*setting Chart series click Event into plotoptions series event.*/
      multiAxisChart.plotOptions = { area: { events: seriesEvent }, spline: { events: seriesEvent }, column: { events: seriesEvent } };

      return multiAxisChart;
    } catch (e) {
      console.log(e);
      return multiAxisChart;
    }
  }

  getDataSetForMultiAxisChart(dashboardFavoriteData: DashboardFavoriteData, panelNumber: number, baseLinGraph: number, dashboardPanelData: DashboardPanelData) {
    try {

      /* Getting Data of Panel. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      let startIndex = 0;
      let endIndex = panelData.arrTimestampBuckets.length - 1;

      /**If Zoom is applied on widget */
      // if (dashboardPanelData.isZoom) {
      //   let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];

      //   startIndex = parseInt(zoomInfo['zoomStartTime']);
      //   endIndex = parseInt(zoomInfo['zoomEndTime']);

      //   if (dashboardPanelData.zoomChartTimeList.length > 1) {
      //     for (let j = dashboardPanelData.zoomChartTimeList.length - 2; j >= 0; j--) {
      //       let diff = endIndex - startIndex;
      //       let perivousZoomInfo = dashboardPanelData.zoomChartTimeList[j];
      //       startIndex = startIndex + perivousZoomInfo['zoomStartTime'];
      //       endIndex = startIndex + diff;
      //     }
      //   }

      // }

      /* Now getting Panel Graphs. */
      let panelGraphs = panelData.panelGraphs;

      /* Now creating array of chart series. */
      let arrChartSeries = new Array();
      let chartType = 'spline';

      if (panelData.chartType === ChartType.CORRELATED_MULTI_AXES_CHART_AREA)
        chartType = 'area';
      else if (panelData.chartType === ChartType.CORRELATED_MULTI_AXES_CHART_BAR)
        chartType = 'column';

      let firstSeries = false;
      let index = 0;
      /* Iterating through Number of graphs. */
      for (let k = 0; k < panelData.panelGraphs.length; k++) {

        if (baseLinGraph !== 0 && k === 0)
          firstSeries = true;
        else if (baseLinGraph === 0 && k === 1)
          firstSeries = true;
        else
          firstSeries = false;

        /* Getting One Graph. */
        let graphInfo = panelGraphs[k];

        /* Chart series data. */
        let arrSeriesData = new Array();


        /* Now Iterating through samples. */
        for (let i = startIndex; i <= endIndex; i++) {
          if (k !== baseLinGraph) {
            /* Adding series point in series data. */
            arrSeriesData.push(graphInfo.graphData[i]);
          }

        }

        /* Creating Object of one series. */
        let chartSeries = new ChartSeries();

        if (k === baseLinGraph) {
          chartSeries.name = graphInfo.graphName;
          chartSeries.type = chartType;

          if (chartType === 'area') {
            chartSeries.color = this.setGradientColor(ChartType.CORRELATED_MULTI_AXES_CHART_AREA, graphInfo.graphColor);

          } else if (chartType === 'column') {
            chartSeries.color = this.setGradientColor(ChartType.CORRELATED_MULTI_AXES_CHART_BAR, graphInfo.graphColor);
          } else {
            chartSeries.color = graphInfo.graphColor;
          }

          chartSeries.data = [];
          chartSeries.lineWidth = 2;
          chartSeries.visible = false;
        }
        else {
          if (firstSeries) {
            chartSeries.name = graphInfo.graphName;
            chartSeries.type = 'area';
            chartSeries.color = this.setGradientColor(ChartType.CORRELATED_MULTI_AXES_CHART_AREA, graphInfo.graphColor);
            chartSeries.data = arrSeriesData;
            chartSeries.yAxis = index;
            chartSeries.lineWidth = 2;
            chartSeries.visible = graphInfo.visible;

          }
          else {

            chartSeries.name = graphInfo.graphName;
            chartSeries.type = chartType;
            if (chartType === 'area') {
              chartSeries.color = this.setGradientColor(ChartType.CORRELATED_MULTI_AXES_CHART_AREA, graphInfo.graphColor);

            } else if (chartType === 'column') {
              chartSeries.color = this.setGradientColor(ChartType.CORRELATED_MULTI_AXES_CHART_BAR, graphInfo.graphColor);
            } else {
              chartSeries.color = graphInfo.graphColor;
            }

            chartSeries.data = arrSeriesData;
            chartSeries.yAxis = index;
            chartSeries.lineWidth = 2;
            chartSeries.visible = graphInfo.visible;

          }
          index++;
        }

        /* Now Adding Chart Series in array. */
        arrChartSeries.push(chartSeries);
      }

      return arrChartSeries;
    } catch (e) {
      this.log.error('Error while creating series type chart dataset.', e);
      return null;
    }
  }

  getOrdinalSuffixPercentile(number) {
    try {
      let val = '';
      let j = number % 10;
      if (j === 1 && number !== 11) {
        val = number + 'st';
        return val;
      }

      if (j === 2 && number !== 12) {
        val = number + 'nd';
        return val;
      }

      if (j === 3 && number !== 13) {
        val = number + 'rd';
        return val;
      }

      val = number + 'th';
      return val;
    } catch (e) {
      console.error(e);
    }
  }
  getLevelForZoom(dashboardPanelData: DashboardPanelData): string {
    try {
      if (dashboardPanelData.isZoom) {
        let zoomInfo = dashboardPanelData.zoomChartTimeList[dashboardPanelData.zoomChartTimeList.length - 1];
        console.log('zoomInfo = ', zoomInfo);
        let startIndex = zoomInfo['zoomStartTime'];
        let endIndex = zoomInfo['zoomEndTime'];
        this.log.debug(' startIndex = ' + startIndex + ', end = ' + endIndex);

        return this.getOrdinalSuffixPercentile(startIndex + 1) + ' to ' + this.getOrdinalSuffixPercentile(endIndex)
          + ' Percentile ';
      } else {
        return null;
      }
    } catch (e) {
      this.log.error(e);
    }
  }

  setGradientColor(chartType, color) {
    try {
      let configWindowObj = this._dataService.getDashboardConfigData().wDConfigurationDTO['gradientColorDTO'];

      if (chartType === ChartType.BAR_CHART_AVG_ALL || chartType === ChartType.BAR_CHART_AVG_BOTTOM10 ||
        chartType === ChartType.BAR_CHART_AVG_TOP10 || chartType === ChartType.BAR_CHART_AVG_TOP5 ||
        chartType === ChartType.PERCENTILE_BAR_CHART || chartType === ChartType.SLAB_COUNT_GRAPH ||
        chartType === ChartType.DUAL_LINE_BAR || chartType === ChartType.PERCENTILE_DUAL_LINE_BAR ||
        chartType === ChartType.SLAB_COUNT_DUAL_LINE_BAR || chartType === ChartType.CORRELATED_MULTI_AXES_CHART_BAR) {
        if (configWindowObj['barChart'] === 1) {
          color = {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, color],
              [1, this.Highcharts.Color(color).brighten(0.6).get('rgb')]
            ]
          }
          return color;
        }
      } else if (chartType === ChartType.AREA_CHART || chartType === ChartType.PERCENTILE_AREA_CHART ||
        chartType === ChartType.SLAB_COUNT_AREA_CHART || chartType === ChartType.DUAL_AXIS_AREA_LINE ||
        chartType === ChartType.PERCENTILE_DUAL_AXIS_AREA_LINE || chartType === ChartType.SLAB_COUNT_DUAL_AXIS_AREA_LINE ||
        chartType === ChartType.CORRELATED_MULTI_AXES_CHART_AREA || chartType === ChartType.CORRELATED_MULTI_AXES_CHART_LINE) {
        if (configWindowObj['areaChart'] === 1) {
          color = {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, color],
              [1, this.Highcharts.Color(color).brighten(0.6).get('rgb')]
            ]
          }
          return color;
        }

      } else if (chartType === ChartType.STACKED_AREA_CHART || chartType === ChartType.PERCENTILE_STACKED_AREA_CHART ||
        chartType === ChartType.SLAB_COUNT_STACKED_AREA_CHART || chartType === ChartType.CATEGORY_STACKED_AREA_CHART) {
        if (configWindowObj['stackedAreaChart'] === 1) {
          color = {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, color],
              [1, this.Highcharts.Color(color).brighten(0.6).get('rgb')]
            ]
          }
          return color;
        }

      } else if (chartType === ChartType.STACKED_BAR_CHART || chartType === ChartType.PERCENTILE_STACKED_BAR_CHART ||
        chartType === ChartType.SLAB_COUNT_STACKED_BAR_CHART || chartType === ChartType.LINE_STACKED ||
        chartType === ChartType.PERCENTILE_LINE_STACKED_BAR || chartType === ChartType.SLAB_COUNT_LINE_STACKED_BAR ||
        chartType === ChartType.CATEGORY_STACKED_BAR_CHART) {
        if (configWindowObj['stackedBarChart'] === 1) {
          color = {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, color],
              [1, this.Highcharts.Color(color).brighten(0.6).get('rgb')]
            ]
          }
          return color;
        }

      } else if (chartType === ChartType.PIE_CHART_AVG_ALL || chartType === ChartType.PIE_CHART_LAST_ALL ||
        chartType === ChartType.PIE_CHART_AVG_TOP5 || chartType === ChartType.PIE_CHART_LAST_TOP5 ||
        chartType === ChartType.PIE_CHART_LAST_TOP10 || chartType === ChartType.PIE_CHART_AVG_TOP10 ||
        chartType === ChartType.PIE_CHART_LAST_BOTTOM10 || chartType === ChartType.PIE_CHART_AVG_BOTTOM10
        || chartType === ChartType.PERCENTILE_PIE_CHART || chartType === ChartType.SLAB_COUNT_PIE_CHART) {
        if (configWindowObj['pieChart'] === 1) {
          color = {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.7 },
            stops: [
              [0, Highcharts.Color(color).brighten(0.9).get('rgba')],
              [1, color] // darken
            ]
          }
          return color;
        }

      } else if (chartType === ChartType.DONUT_CHART_LAST || chartType === ChartType.DONUT_CHART_AVG ||
        chartType === ChartType.PERCENTILE_DONUT_CHART || chartType === ChartType.SLAB_COUNT_DONUT_CHART) {
        if (configWindowObj['donutChart'] === 1) {
          color = {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.7 },
            stops: [
              [0, Highcharts.Color(color).brighten(0.9).get('rgba')],
              [1, color] // darken
            ]
          }
          return color;
        }
      }
      return color;
    } catch (error) {
      this.log.error('Exception in setGradientColor..', error);
    }
  }

  /**This method is used to check either WidgetWiseGraphTime is Applied or global GraphTime */

  isWidgetWiseGraphTimeApplied(dashboardFavoriteData, panelNum) {
    try {

      if (dashboardFavoriteData.graphTimeMode === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.log.error('Exception in isWidgetWiseGraphTimeApplied Method..', error);
      return false;
    }
  }
}
