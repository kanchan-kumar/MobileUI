import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';
import { Widget } from '../containers/widget';
import { DashboardPanelData } from '../containers/dashboard-panel-data';
import { DashboardDataUtilsService } from '../services/dashboard-data-utils.service';
import { DashboardDataValidatorService } from '../services/dashboard-data-validator.service';
import { DashboardFavoriteData } from '../interfaces/dashboard-favorite-data';
import { DataWidget } from '../containers/data-widget';
//import { ErrorCodes } from '../constants/error-codes.enum';
import { AVERAGE, COUNT, LASTSAMPLE, MAXIMUM, MINIMUM, STDDEV } from '../constants/data-widget-attributes.constants';
import { DataWidgetIconNames } from '../constants/data-widget-icon-names';
import { HealthWidget } from '../containers/health-widget';

@Injectable()
export class WidgetDataProcessorService {

  constructor(private log: Logger,
    private _dataUtils: DashboardDataUtilsService,
    private _dataValidator: DashboardDataValidatorService) { }

  /** Processing data for data widget. */
  getDataForDataWidget(dashboardFavoriteData: DashboardFavoriteData, widget: Widget, panelNumber,
    panelData: DashboardPanelData) {
    try {
      /* checking the data widget properties.*/
      if (!this._dataValidator.isValidObject(widget.dataWidget)) {
        /* Creating default instance for data widget. */
        //panelData.errorCode = ErrorCodes.WIDGET_CONFIGURATION_ERROR;
        return;
      }

      /* Getting Properties of first graph. */
      /* Getting Data of Panel. */
      let firstGraphData = dashboardFavoriteData.panelData[panelNumber].panelGraphs[0];

      /* Checking for data type of data widget. */
      panelData.dataWidget = new DataWidget();

      /* Setting common Properties. */
      panelData.dataWidget.dataAttrName = widget.dataWidget.dataAttrName;
      panelData.dataWidget.dataAttrDisplayName = widget.dataWidget.dataDisplayName;
      panelData.dataWidget.dataAttrIconName = widget.dataWidget.dataImgName;

      /*Now updating data widget value. */
      this.updateDataWidgetValue(panelData, firstGraphData);
      dashboardFavoriteData.dashboardLayoutData.panelLayoutDTO.widgets[widget.widgetId].dataWidget = widget.dataWidget;
    } catch (e) {
      this.log.error('Error while generating data for data widget.', e);
      return;
    }
  }

  /**
 * Method is used for updating data widget.
 */
  updateDataWidgetValue(panelData, firstGraphData) {
    try {

      /*Updating Graph color value. */
      // panelData.dataWidget.graphColor = firstGraphData.graphColor;

      switch (panelData.dataWidget.dataAttrName) {
        case AVERAGE:
          panelData.dataWidget.dataAttrValue = this._dataUtils.getNumberWithPrecisionAndComma(firstGraphData.avg);
          break;
        case MINIMUM:
          panelData.dataWidget.dataAttrValue = this._dataUtils.getNumberWithPrecisionAndComma(firstGraphData.min);
          break;
        case MAXIMUM:
          panelData.dataWidget.dataAttrValue = this._dataUtils.getNumberWithPrecisionAndComma(firstGraphData.max);
          break;
        case STDDEV:
          panelData.dataWidget.dataAttrValue = this._dataUtils.getNumberWithPrecisionAndComma(firstGraphData.stdDev);
          break;
        case COUNT:
          panelData.dataWidget.dataAttrValue = this._dataUtils.getNumberWithPrecisionAndComma(firstGraphData.sampleCount);
          break;
        case LASTSAMPLE:
          panelData.dataWidget.dataAttrValue = this._dataUtils.getNumberWithPrecisionAndComma(firstGraphData.lastSample);
          break;
        default:
          panelData.dataWidget.dataAttrValue = '-';
      }
    } catch (e) {
      this.log.error('Error while updating data widget value.', e);
    }
  }

  /* Method is used for getting health widget data */
  getDataForHealthWidgetType(dashboardFavoriteData: DashboardFavoriteData, widget: Widget, panelNumber,
    panelData: DashboardPanelData) {
    try {
      /* checking the health widget properties.*/
      if (!this._dataValidator.isValidObject(widget.healthWidget)) {
        /* Creating default instance for data widget. */
        //panelData.errorCode = ErrorCodes.WIDGET_CONFIGURATION_ERROR;
        return;
      }

      let criticalOperator = widget.healthWidget.healthWidgetSeverityDef.criticalMSRString;
      let criticalRange = widget.healthWidget.healthWidgetSeverityDef.criticalValue;
      let percentageFirstForCritical = widget.healthWidget.healthWidgetRuleInfo.criticalPct;
      let statusFirstForCritical = widget.healthWidget.healthWidgetRuleInfo.criticalSeverity;
      let operatorForCritical = widget.healthWidget.healthWidgetRuleInfo.criticalCondition;
      let percentageSecondForCritical = widget.healthWidget.healthWidgetRuleInfo.criticalAnotherPct;

      let majorOperator = widget.healthWidget.healthWidgetSeverityDef.majorMSRString;
      let majorRange = widget.healthWidget.healthWidgetSeverityDef.majorValue;
      let percentageFirstForMajor = widget.healthWidget.healthWidgetRuleInfo.majorPct;
      let statusFirstForMajor = widget.healthWidget.healthWidgetRuleInfo.majorSeverity;
      let operatorForMajor = widget.healthWidget.healthWidgetRuleInfo.majorCondition;
      let percentageSecondForMajor = widget.healthWidget.healthWidgetRuleInfo.majorAnotherPct;

      /* Checking for values of health widget. */
      panelData.healthWidget = new HealthWidget();
      /* Setting common Properties. */
      panelData.healthWidget.dataAttrName = widget.healthWidget.dataAttrName;

      let panelGraphs = dashboardFavoriteData.panelData[panelNumber].panelGraphs;

      /* variables for counting status of each graph in selected panel */
      let countForCritical = 0;
      let countForMajor = 0;
      let countForNormal = 0;
      let criticalExpression = criticalOperator + ' ' + criticalRange;
      let majorExpression = majorOperator + ' ' + majorRange;

      /* Now checking critical, major or normal value for each graph at selected panel number */
      for (let i = 0; i < panelGraphs.length; i++) {
        let dataAttrValue = panelGraphs[i][panelData.healthWidget.dataAttrName];
        if (eval(dataAttrValue + criticalExpression)) {
          countForCritical++;
        } else if (eval(dataAttrValue + majorExpression)) {
          countForMajor++;
        } else {
          countForNormal++;
        }
      }

      let totalGraphs = panelGraphs.length;
      let criticalPercentage = (countForCritical / totalGraphs) * 100;
      let majorPercentage = (countForMajor / totalGraphs) * 100;
      let status;

      if (statusFirstForCritical === 'Critical') {
        if (operatorForCritical == null || operatorForCritical === undefined ||
          operatorForCritical === 'undefined' || operatorForCritical === '') {
          if (eval(percentageFirstForCritical + '<' + '=' + criticalPercentage)) {
            status = 'Critical';
            this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
            return;
          }
        }
        else if (eval(percentageFirstForCritical + '<' + '=' + criticalPercentage +
          operatorForCritical + percentageSecondForCritical + '<' + '=' + majorPercentage)) {
          status = 'Critical';
          this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
          return;
        }
      } else if (statusFirstForCritical === 'Major') {
        if (operatorForCritical == null || operatorForCritical === undefined ||
          operatorForCritical === 'undefined' || operatorForCritical === '') {
          if (eval(percentageFirstForCritical + '<' + '=' + majorPercentage)) {
            status = 'Critical';
            this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
            return;
          }
        } else if (eval(percentageFirstForCritical + '<' + '=' + majorPercentage +
          operatorForCritical + percentageSecondForCritical + '<' + '=' + criticalPercentage)) {
          status = 'Critical';
          this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
          return;
        }
      }
      if (statusFirstForMajor === 'Critical') {
        if (operatorForMajor == null || operatorForMajor === undefined ||
          operatorForMajor === 'undefined' || operatorForMajor === '') {
          if (eval(percentageFirstForMajor + '<' + '=' + criticalPercentage)) {
            status = 'Major';
            this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
            return;
          } else {
            status = 'Normal';
            this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
            return;
          }
        }
        if (eval(percentageFirstForMajor + '<' + '=' + criticalPercentage +
          operatorForMajor + percentageSecondForMajor + '<' + '=' + majorPercentage)) {
          status = 'Major';
          this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
          return;
        } else {
          status = 'Normal';
          this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
          return;
        }
      } else if (statusFirstForMajor === 'Major') {
        if (operatorForMajor == null || operatorForMajor === undefined ||
          operatorForMajor === 'undefined' || operatorForMajor === '') {
          if (eval(percentageFirstForMajor + '<' + '=' + majorPercentage)) {
            status = 'Major';
            this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
            return;
          } else {
            status = 'Normal';
            this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
            return;
          }
        }
        if (eval(percentageFirstForMajor + '<' + '=' + majorPercentage +
          operatorForMajor + percentageSecondForMajor + '<' + '=' + criticalPercentage)) {
          status = 'Major';
          this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
          return;
        } else {
          status = 'Normal';
          this.updateHealthWidgetData(status, panelData, widget, dashboardFavoriteData);
          return;
        }
      }
    } catch (e) {
      this.log.error('Error while generating data for data widget.', e);
      return;
    }
  }

  /* Method is used to uodate data of health widget */
  updateHealthWidgetData(status, panelData: DashboardPanelData, widget: Widget, dashboardFavoriteData: DashboardFavoriteData) {
    try {
      let healthWidgetInfo = this._dataUtils.getHealthWidgetInfo(status);
      let healthWidget = {
        'dataAttrName': widget.healthWidget.dataAttrName,
        'dataImgName': healthWidgetInfo.dataImgName,
        'bgColor': healthWidgetInfo.bgColor,
        'fontColor': healthWidgetInfo.fontColor,
        'healthWidgetSeverityDef': widget.healthWidget.healthWidgetSeverityDef,
        'healthWidgetRuleInfo': widget.healthWidget.healthWidgetRuleInfo,
        'severity': status
      }
      widget.healthWidget = healthWidget;
      panelData.healthWidget.healthAttrIconName = widget.healthWidget.dataImgName;
      panelData.healthWidget.graphColor = widget.healthWidget.bgColor;
      panelData.healthWidget.healthStatus = widget.healthWidget.severity;
      dashboardFavoriteData.dashboardLayoutData.panelLayoutDTO.widgets[widget.widgetId].healthWidget = widget.healthWidget;
    } catch (e) {
      this.log.error(e);
    }
  }
}
