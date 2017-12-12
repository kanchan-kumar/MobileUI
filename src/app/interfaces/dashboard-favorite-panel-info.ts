import { DashboardFavoritePanelGraphInfo } from './dashboard-favorite-panel-graph-info';

/**
 * This interface containing information about the single favorite panel and its graph.
 */
export interface DashboardFavoritePanelInfo {
  panelNumber: number;
  numGraphs: number;
  panelCaption: string;
  chartType: number;
  showLegends: boolean;
  panelGraphs: DashboardFavoritePanelGraphInfo[];
  arrTimeStamp: number[];
  others: number;
  errorCode: number;
  isMinMaxGraph: boolean;
  showLegendOnWidget: boolean;
  legendAlignmentOnWidget: string;
  mapData: string;
  geoMapThreshold: string;
  colorBandRedToGreen: boolean;
  enableRankAndScore: boolean;
  pctOrSlabValue: any;
  graphStatsType: any;
  btSplitInfo: string;
  arrTimestampBuckets: number[];
  activePartitionName:number;
  avgCount:number;
  avgCounter:number;
  currentDateTime:string;
  refreshPanelGraphs:boolean;
  lastAvgSampleTime:number;
  isMovingGraph:boolean;
  maxSample:number;
  totalSamples:number;
  viewByLabel:string;
  graphTime:string;
  graphTimeLabel:string;
  panelFavRelativePath:string;
  panelFavName:string;
  lastSampleTime:number;
}