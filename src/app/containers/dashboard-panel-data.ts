import { Chart } from './chart';
import { DataWidget } from './data-widget';
import { TabularData } from './tabular-data';
import { HealthWidget } from './health-widget';

/**
 * Dashboard data for individual panel. Panel Can be any type like(Graph/Data/Tabular etc).
 */
export class DashboardPanelData {
  panelNumber: number = -1;
  widgetType = 1;
  chart: Chart = null;
  errorCode: number = -1;
  errorMsg: string = null;
  panelTitle: string = null;
  isHeaderReq = true;
  dataWidget: DataWidget = null;
  tableWidget: TabularData = null;
  originalPanelTitle = null;
  isZoom = false;
  zoomChartTimeList = null;
  isFirstUndoZoomApplied = false;
  healthWidget: HealthWidget = null;
  isBtAggAvailable = false;
  graphTimeLabel = '';
}
