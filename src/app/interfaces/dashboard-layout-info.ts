import { PanelLayoutInfo } from './panel-layout-info';

/**
 * This interface is the main interface for layout structure of graphical/favorite view.
 */
export interface DashboardLayoutInfo {
  colMargin: number;
  columns: number;
  layoutId: number;
  layoutJSONName: string;
  panelLayoutDTO: PanelLayoutInfo;
  rowHeight: number;
  rowMargin: number;
  fitToScreen?: boolean;
}