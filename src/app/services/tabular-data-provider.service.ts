import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';

import { Widget } from '../containers/widget';
import { DashboardPanelData } from '../containers/dashboard-panel-data';
import { DashboardFavoriteData } from '../interfaces/dashboard-favorite-data';
import { ChartType } from '../constants/chart-type.enum';
import { TabularData } from '../containers/tabular-data';
import { TabularDataColumns } from '../containers/tabular-data-columns';

import { DashboardDataValidatorService } from '../services/dashboard-data-validator.service';
import { DashboardDataUtilsService } from '../services/dashboard-data-utils.service';

@Injectable()
export class TabularDataProviderService {

  constructor( private log: Logger,
               private _dataValidator: DashboardDataValidatorService,
               private _dataUtilService: DashboardDataUtilsService ) { }

  /**Method is used for generating data for tabular widget. */
  getDataForTabularWidget(dashboardFavoriteData: DashboardFavoriteData, widget: Widget, panelNumber,
    panelData: DashboardPanelData) {
    try {
      /* checking the data widget properties.*/
      if (!this._dataValidator.isValidObject(widget.tableWidget)) {
        /* Creating default instance for table widget here. */
        //panelData.errorCode = ErrorCodes.WIDGET_CONFIGURATION_ERROR;
        return;
      }
      /*Setting Panel Data for tabular widget. */
      panelData.tableWidget = new TabularData();
      if (widget.tableWidget.tableType == ChartType.TABULAR_VECTOR_BASED) {

        panelData.tableWidget.tableColumns = this.getColDefForTabularVectorBasedWidget(widget, dashboardFavoriteData, panelNumber);
        panelData.tableWidget.tableData =
          this.genearteTableWidgetDataForVectorBased(dashboardFavoriteData, panelData.tableWidget.tableColumns, panelNumber);
      } else if (dashboardFavoriteData.panelData[panelNumber].btSplitInfo != null &&
        dashboardFavoriteData.panelData[panelNumber].btSplitInfo !== undefined
        && dashboardFavoriteData.panelData[panelNumber].btSplitInfo.trim() !== '' &&
        dashboardFavoriteData.panelData[panelNumber].btSplitInfo !== 'NA') {
        panelData.tableWidget.tableColumns = this.getColDefForTabularWidget(widget);
        let arrSelectedFields = dashboardFavoriteData.panelData[panelNumber].btSplitInfo.split(',');
        panelData.tableWidget.tableData = this.generateAggTableWidgetData(dashboardFavoriteData,
          panelData.tableWidget.tableColumns, panelNumber, arrSelectedFields, null, '');
        panelData.isBtAggAvailable = true;
      } else {
        panelData.tableWidget.tableColumns = this.getColDefForTabularWidget(widget);

        panelData.tableWidget.tableData =
          this.generateTableWidgetData(dashboardFavoriteData, panelData.tableWidget.tableColumns, panelNumber);
        panelData.isBtAggAvailable = false;
      }
    } catch (e) {
      this.log.error('Error while creating data for tabular widget.', e);
    }
  }

  /**
   * Getting column definition for table widget having vector based tabular type.
   */
  getColDefForTabularVectorBasedWidget(widget: Widget, dashboardFavoriteData: DashboardFavoriteData,
    panelNum: number): TabularDataColumns[] {
    try {
      let panel = dashboardFavoriteData.panelData[panelNum];
      let arrGraphs = ['Vector Name'];
      let isScoreEnabled = panel.enableRankAndScore;
      if (isScoreEnabled) {
        arrGraphs = ['Rank', 'Apdex Score', 'Vector Name'];
      }
      let rowIdx = arrGraphs.length;

      for (let i = 0; i < panel.panelGraphs.length; i++) {
        console.log("graphName = ", panel.panelGraphs[i].graphName);
        let graphName = panel.panelGraphs[i].graphName;
        let actualGraphName = graphName;
        let graphVectorName = 'NA';

        // if (this._configService.$isCompareMode) {
        //   if (graphName === null || graphName === undefined || graphName === "") {
        //     graphName = this._configService.$lowerPanelDataForCompare['panelData'][panelNum]['panelGraphs'][i]['graphName'];
        //   }
        // }

        if (graphName.indexOf('-') > 0) {
          actualGraphName = graphName.substring(0, graphName.indexOf("-")).trim();
          graphVectorName = graphName.substring(graphName.indexOf("-") + 1, graphName.length).trim();
        }

        /*Checking if graph already exist.*/
        if (arrGraphs.indexOf(actualGraphName) < 0) {
          arrGraphs.push(actualGraphName);
        }
      }
      let index = 0;
      let arrGraphColumns = new Array();
      for (let i = 0; i < arrGraphs.length; i++) {
        let tableCol = {};
        let colWidth = (arrGraphs.length < 5) ? '50%' : '20%';
        if (arrGraphs[i] == 'Vector Name') {
          tableCol = {
            field: index + '',
            displayName: arrGraphs[i],
            dataAttrName: arrGraphs[i],
            width: colWidth
          };
        } else {
          tableCol = {
            field: index + '',
            cellClass: 'grid-align',
            displayName: arrGraphs[i],
            dataAttrName: arrGraphs[i],
            width: colWidth
          };
        }
        arrGraphColumns.push(tableCol);
        index++;
      }

      widget.tableWidget.columnDefs = arrGraphColumns;
      /*Creating array of table cols. */
      let arrTableCols = new Array();

      /*Iterating through columns. */
      for (let i = 0; i < widget.tableWidget.columnDefs.length; i++) {
        /* Adding column based on table configuration. */
        let tableCol = new TabularDataColumns();
        let tableWidgetCol = widget.tableWidget.columnDefs[i];

        tableCol.header = tableWidgetCol.displayName;
        tableCol.field = tableWidgetCol.dataAttrName;
        tableCol.sortable = true;

        /*Adding in Array. */
        arrTableCols.push(tableCol);
      }

      return arrTableCols;

    } catch (e) {
      this.log.error('Error while creating data for tabular widget for vector based.', e);
      return [];
    }
  }

  /**
    * This method is used for generating table widget data object for tabular vector based.
    * @param dashboardFavoriteData
    * @param tableCols
    * @param panelNumber
    */
  genearteTableWidgetDataForVectorBased(dashboardFavoriteData: DashboardFavoriteData,
    tableCols: TabularDataColumns[], panelNumber) {
    try {
      console.log('tableCols ==== ', tableCols);
      let arrWidgetTable = new Array();
      let panel = dashboardFavoriteData.panelData[panelNumber];
      let arrVectors = [];
      let arrGraphs = ['Vector Name'];
      if (panel.enableRankAndScore) {
        arrGraphs = ['Rank', 'Apdex Score', 'Vector Name'];
      }
      let rowIndex = arrGraphs.length;

      for (let i = 0; i < panel.panelGraphs.length; i++) {

        let graphName = panel.panelGraphs[i].graphName;
        let actualGraphName = graphName;
        let graphVectorName = 'NA';

      //  if (this._configService.$isCompareMode) {
      //     if (graphName === "" || graphName === null || graphName === undefined) {
      //       panel = this._configService.$lowerPanelDataForCompare['panelData'][panelNumber];
      //       graphName = this._configService.$lowerPanelDataForCompare['panelData'][panelNumber]['panelGraphs'][i]['graphName'];
      //     }
      //   }

        if (graphName.indexOf('-') > 0) {
          actualGraphName = graphName.substring(0, graphName.indexOf("-")).trim();
          graphVectorName = graphName.substring(graphName.indexOf("-") + 1, graphName.length).trim();
        }

        /*Checking if vector already exist.*/
        if (arrVectors.indexOf(graphVectorName) < 0) {
          arrVectors.push(graphVectorName);
        }

        /*Checking if graph already exist.*/
        if (arrGraphs.indexOf(actualGraphName) < 0) {
          arrGraphs.push(actualGraphName);
        }
      }

      let arrVectorScore = new Array();

      if (panel.enableRankAndScore) {
        for (let k = 0; k < arrVectors.length; k++) {
          arrVectorScore.push(this.getScoreValueToDiplay(panel, arrVectors[k]));
        }

        let length = arrVectorScore.length;
        for (let i = 0; i < length - 1; i++) {
          /* Number of passes  */
          /*min holds the current minimum number position for each pass; i holds the Initial min number */
          let min = i;
          for (let j = i + 1; j < length; j++) {
            if (arrVectorScore[j] > arrVectorScore[min]) {
              min = j;
            }
          }
          if (min != i) {

            let score = arrVectorScore[i];
            arrVectorScore[i] = arrVectorScore[min];
            arrVectorScore[min] = score;

            /*Now Swap in vector array also based on score array. */
            let vector = arrVectors[i];
            arrVectors[i] = arrVectors[min];
            arrVectors[min] = vector;
          }
        }
      }
      let index = 0;
      for (let i = 0; i < arrVectors.length; i++) {
        let rowData = {};
        for (let k = 0; k < tableCols.length; k++) {
            let column = tableCols[k];
            console.log(" arrVectors ===  "+ arrVectors[i], +" , column === ", column.field );
           if(column.field == 'Rank') {
                 rowData[column.field] = i + 1;
           } else if( column.field == 'Apdex Score') {
                rowData[column.field] = arrVectorScore[i];
           } else if(column.field == 'Vector Name') {
               rowData[column.field] = arrVectors[i];
            } else {
          let graphName = '';
          if (arrVectors[i] == 'NA') {
            graphName = arrGraphs[k];
          } else {
            graphName = arrGraphs[k] + ' - ' + arrVectors[i];
          }
          let graphInfo = this.getGraphInfoByComleteGraphName(panel, graphName);

          if (graphInfo == null) {
            rowData[column.field] = '-';
          } else {
            rowData[column.field] = this._dataUtilService.getNumberWithFixedDecimalAndComma(graphInfo.avg);
          }
        }
        }
        arrWidgetTable.push(rowData);
      }
      this.log.debug('arrWidgetTable =  ', arrWidgetTable);
      return arrWidgetTable;
    } catch (e) {
      this.log.error('error while creating tabular widget data for vector based.', e);
    }
  }

  /**
   * Getting column definition for table widget.
   */
  getColDefForTabularWidget(widget): TabularDataColumns[] {
    try {

      /*Creating array of table cols. */
      let arrTableCols = new Array();

      /*Iterating through columns. */
      for (let i = 0; i < widget.tableWidget.columnDefs.length; i++) {
        /* Adding column based on table configuration. */
        let tableCol = new TabularDataColumns();
        let tableWidgetCol = widget.tableWidget.columnDefs[i];

        tableCol.header = tableWidgetCol.displayName;
        tableCol.field = tableWidgetCol.dataAttrName;
        tableCol.sortable = true;

        /*Adding in Array. */
        arrTableCols.push(tableCol);
        if(arrTableCols[i].field === 'ggv')
          {
            arrTableCols.splice(i , 1);
          }
      }

      return arrTableCols;

    } catch (e) {
      this.log.error('Error while creating data for tabular widget.', e);
      return [];
    }
  }

  /**
   * This method is used for getting graph info by graph name.
   * @param panelData
   * @param graphName
   */
  getGraphInfoByComleteGraphName(panelData: any, graphName: string): any {
    try {
      for (let i = 0; i < panelData.panelGraphs.length; i++) {
        if (panelData.panelGraphs[i].graphName == graphName) {
          return panelData.panelGraphs[i];
        }
      }
    } catch (e) {
      this.log.error('error in creating complete graph info', e);
    }
  }

  /*Method is used to find the score based on vector name.*/
  getScoreValueToDiplay(panelData, vector) {
    try {
      if (panelData.hmGraphScore === null) {
        return 0.0;
      }
      let matchedValue = 0.0;
      for (let key in panelData.hmGraphScore) {
        let value = panelData.hmGraphScore[key];
        console.log('key = ', key + 'value = ' + value);
        if (key.trim() == vector.trim()) {
          matchedValue = value;
        }
      }

      return matchedValue;
    } catch (e) {
      console.error(e);
      return 0.0;
    }
  }

  /*Method used to generate the table widget data for the BT data */
  generateAggTableWidgetData(dashboardFavoriteData: DashboardFavoriteData,
    tableCols: TabularDataColumns[], panelNumber, arrSelectedSplitFields, previousPanelData,event) {
    try {

      this.log.debug(dashboardFavoriteData, tableCols, panelNumber, arrSelectedSplitFields);
      var tableRowArr = [];
      /*Creating an object for getting the format of the data for the Aggregate Table Data... */

      let gGvColExist = false;

      for (let col = 0; col < tableCols.length; col++) {
        if (tableCols[col].field === 'ggv') {
          gGvColExist = true;
        }
      }

      if (!gGvColExist) {
        let newGgvCol = new TabularDataColumns();
        newGgvCol.field = 'ggv';
        newGgvCol.style = { width: '0px' };
        tableCols.push(newGgvCol);
      }

      let newRowArray = [];

      /**Getting panel data based on panel number. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];
      for (let i = 0; i < panelData.numGraphs; i++) {
        let aggTableData = {
          value: {},
          leaf: false,
          checked: false,
          children: []
        };

        /*Getting panel graph. */
        let panelGraph = panelData.panelGraphs[i];

        this.log.debug(panelData.numGraphs, panelData.panelGraphs.length);

        /*Now creating row of table. */
        let tableRow = {};
        let graphName = this._dataUtilService.getValidGraphNameForAgg(panelGraph.graphName, '>');
        /*Now filling data based on table column by iterating column loop. */
        for (let k = 0; k < tableCols.length; k++) {

          /*Getting table column. */
          let column = tableCols[k];
          this.log.debug(column);
          switch (column.field) {
           /*case 'checkbox':
             tableRow['checked'] = false;
             break;*/
            case 'graphName':
              tableRow['graphName'] = graphName;
              break;
            case 'avg':
              tableRow['avg'] = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.avg);
              break;
            case 'min':
              tableRow['min'] = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.min);
              break;
            case 'max':
              tableRow['max'] = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.max);
              break;
            case 'sampleCount':
              tableRow['sampleCount'] = this._dataUtilService.getNumberWithComma(panelGraph.sampleCount);
              break;
            case 'lastSample':
              tableRow['lastSample'] = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.lastSample);
              break;
            case 'stddev':
              tableRow['stddev'] = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.stdDev);
              break;
            case 'ggv':
              tableRow['ggv'] = panelGraph.gGV;
              column.hidden = true;
              break;
          }
        }

        /*Declaring the values and leaf nodes of the treetable... */
        aggTableData.value = tableRow;
        let graph = graphName;
        if (graph.indexOf(':') > -1) {
          graph = graphName.split(':')[0];
          this.log.debug(arrSelectedSplitFields);
          this.log.debug(graph);
          this.log.debug(arrSelectedSplitFields.indexOf(graph));
          this.log.debug(arrSelectedSplitFields.length - 1);
          if (arrSelectedSplitFields.indexOf(graph) === (arrSelectedSplitFields.length - 1)) {
            aggTableData.leaf = true;
          }
        } else {
          aggTableData.leaf = false;
        }
        this.log.debug(aggTableData);
        newRowArray.push(aggTableData);
      }
      if (previousPanelData !== null) {
        event.node.children = newRowArray;
        for (let i = 0; i < arrSelectedSplitFields.length; i++) {
          if (previousPanelData[i] !== undefined) {
            previousPanelData[i].tableWidget.tableData[0] = event.node;
          }
        }
      }
          else {
        let newRowArrayForFav = [];
        newRowArrayForFav.push(newRowArray[0]);
        for (let i = 1; i < panelData.numGraphs; i++) {

          if (dashboardFavoriteData.panelData[panelNumber].panelGraphs[i].graphFieldInfo === null ||
            dashboardFavoriteData.panelData[panelNumber].panelGraphs[i].graphFieldInfo === undefined) {
            newRowArrayForFav.push(newRowArray[i]);

          }
          else {
            let parent = newRowArrayForFav[newRowArrayForFav.length - 1];
            let graphFieldInfoLength = dashboardFavoriteData.panelData[panelNumber].panelGraphs[i].graphFieldInfo.length;

            if (graphFieldInfoLength === 3)
            { parent.children[parent.children.length - 1].children[parent.children.children.length - 1].push(newRowArray[i]); }
            else if (graphFieldInfoLength === 2)
            { parent.children[parent.children.length - 1].children.push(newRowArray[i]); }
            else
            { parent.children.push(newRowArray[i]); }

            newRowArrayForFav[newRowArrayForFav.length - 1] = parent;
          }
        }
        this.log.debug(newRowArrayForFav);
        newRowArray = newRowArrayForFav;
      }

      this.log.debug(newRowArray);
      return newRowArray;

    } catch (error) {

    }
  }

  /**Generating data for tabular widget. */
  generateTableWidgetData(dashboardFavoriteData: DashboardFavoriteData,
    tableCols: TabularDataColumns[], panelNumber): any[] {
    try {

      /*Checking for table columns. */
      if (tableCols == null || tableCols.length === 0) {
        this.log.error('Table columns are not available for table widget. panel number = ' + panelNumber);
        return [];
      }

      /*Creating array of table rows. */
      let arrTableRows = new Array();

      /**Getting panel data based on panel number. */
      let panelData = dashboardFavoriteData.panelData[panelNumber];

      /**Now iterating for all panel graphs. */
      for (let i = 0; i < panelData.numGraphs; i++) {

        /*Getting panel graph. */
        let panelGraph = panelData.panelGraphs[i];

        /*Now creating row of table. */
        let tableRow = {};

        /*Now filling data based on table column by iterating column loop. */
        for (let k = 0; k < tableCols.length; k++) {
          /*Getting table column. */
          let column = tableCols[k];
          let columnValue = '-';

          switch (column.field) {
            case 'graphName':
              columnValue = panelGraph.graphName;
              break;
            case 'avg':
              columnValue = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.avg);
              break;
            case 'min':
              columnValue = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.min);
              break;
            case 'max':
              columnValue = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.max);
              break;
            case 'sampleCount':
              columnValue = this._dataUtilService.getNumberWithComma(panelGraph.sampleCount);
              break;
            case 'lastSample':
              columnValue = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.lastSample);
              break;
            case 'stddev':
              columnValue = this._dataUtilService.getNumberWithFixedDecimalAndComma(panelGraph.stdDev);
              break;
          }

          /*Inserting value in table row based on column name. */
          tableRow[column.field] = columnValue;
        }

        /*Inserting table row in array of rows. */
        arrTableRows.push(tableRow);
      }
      return arrTableRows;
    } catch (e) {
      this.log.error('Error while generating data for tabular widget.', e);
      return [];
    }
  }

}
