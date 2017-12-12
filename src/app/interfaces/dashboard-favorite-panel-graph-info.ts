/**
 * This interface is used for containing information of panel graph and its data.
 */
export interface DashboardFavoritePanelGraphInfo {
      graphName: string;
      graphData: number[];
      min: number;
      max: number;
      avg: number;
      stdDev: number;
      lastSample: number;
      sampleCount: number;
      gGV: string;
      graphColor: string;
      slabName: string[];
      dialGraphExp: string;
      errorCode: number;
      weightedScaleValue: number;
      scaleInterval: number;
      mapKey: string;
      percentChange: string;
      visible: boolean;
      derived: boolean;
      geoMapDataMap: Object;
      selected: boolean;
      geoMapGraphInfoDTOs: Object;
      graphFieldInfo: any[];
      graphStatType: any;
    }
    