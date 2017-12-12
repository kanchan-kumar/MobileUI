import { DashboardLayoutInfo } from './dashboard-layout-info';
import { DashboardFavoritePanelInfo } from './dashboard-favorite-panel-info';

/**
 * This interface is main data layer replica of DTO sended by server for accessing json information.
 * Please check the field name with json field name if not accessable.
 */
export interface DashboardFavoriteData {
  favoriteName: string;
  favoriteDesc: string;
  favRelPath: string;
  graphTime: string;
  graphTimeLabel: string;
  viewByLabel: string;
  currentDateTime: string;
  totalSamples: number;
  maxSample: number;
  numPanels: number;
  timeZoneId: string;
  errorCode: number;
  arrTimestamp: number[];
  lastSampleTime: number;
  panelData: DashboardFavoritePanelInfo[];
  isMovingGraph: boolean;
  avgCount: number;
  avgCounter: number;
  lastAvgSampleTime: number;
  refreshPanelGraphs: boolean;
  interval: number;
  errorMessage: string;
  selectedPanelNum: number;
  layoutId: number;
  dashboardLayoutData: DashboardLayoutInfo;
  compareMode: boolean;
  compareDataDTO: Object;
  gdfVersion: number;
  activePartitionName: string;
  bestViewByList: string[];
  pause: boolean;
  showDiscontinuedEnable: boolean;
  updateTS: number;
  updateBy:string;
  isPublic:boolean;
  graphTimeMode: number;
}
