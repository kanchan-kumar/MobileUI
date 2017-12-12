import { DataWidgetPropsInfo  } from '../interfaces/data-widget-props-info';
import { TableWidgetInfo } from '../interfaces/table-widget-info';
import { HealthWidgetInfo } from '../interfaces/health-widget-info';

export class Widget {
    widgetId: number;
    widgetType: number;
    widgetName: string;
    widgetDescription: string;
    payload: any = null;
    col: number = 1;
    row: number = 1;
    sizex: number = 1;
    sizey: number = 1;
    dragHandle: string = '.dashboard-drag-panel';
    resizeHandle: string = null;
    fixed: boolean = false;
    draggable: boolean = true;
    resizable: boolean = true;
    borderSize: number = 5;
    maxCols: number = 0;
    minCols: number = 0;
    maxRows: number = 0;
    minRows: number = 0;
    minWidth: number = 0;
    minHeight: number = 0;
    dataWidget: DataWidgetPropsInfo = null;
    tableWidget: TableWidgetInfo = new TableWidget();
    healthWidget: HealthWidgetInfo = null;
    widgetPanelWidth = 0;
    widgetPanelHeight = 0;
    constructor() {
    }
}

export class TableWidget implements TableWidgetInfo {
    enableColumnResizing: boolean;
    enableFiltering: boolean;
    enableGridMenu: boolean;
    enableSorting: boolean;
    fastWatch: boolean;
    rowHeight: number;
    showColumnFooter: boolean;
    showGridFooter: boolean;
    tableHeight: number;
    columnDefs: any[];
    tableType: number;
}
