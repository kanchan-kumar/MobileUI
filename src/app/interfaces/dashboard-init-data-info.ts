import { LayoutTypesInfo } from './layout-types-info';

export interface DashboardInitDataInfo {
    currentDateTimestamp: number;
    defaultFavName: string;
    defaultLayoutName: string;
    defaultGraphTime: string;
    defaultViewBy: string;
    timeZoneString: string;
    errorCode: number;
    arrLayoutDTO: LayoutTypesInfo; 
    systemTimeZone: string;
    scenarioName: string;
    projectName: string;
    subProjectName: string; 
    isOnlineTest: boolean;
    controllerName: string; 
    wDConfigurationDTO: any; //DashboardConfigDataInfo;
    isExecutiveDashMode: boolean;
    partitionType: number;
    isPerfDashMode: boolean;
    testStartTimeStamp: number;
    cM_Mode: boolean;
    categoryGraphInfo: any; //CategoryGraphInfo;
    txStatsGraphsAvail: boolean;
    enableEventViewerSet: string[];
    featurePermissionList: any[];
}
