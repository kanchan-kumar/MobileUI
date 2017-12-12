import { DataWidgetPropsInfo } from './data-widget-props-info';
import { TableWidgetInfo } from '../interfaces/table-widget-info';
import { HealthWidgetInfo } from '../interfaces/health-widget-info';

/**
 * This interface contains the information of single widget in layout.
 */
export interface WidgetInfo {
   widgetId: number;
   widgetType: number;
   dataAttrName: string;
   name: string;
   description: string;
   sizeX: number;
   sizeY: number;
   row: number;
   col: number;
   dataWidget: DataWidgetPropsInfo;
   gridOptions: TableWidgetInfo;
   healthWidget: HealthWidgetInfo;
}