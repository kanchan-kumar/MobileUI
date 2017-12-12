export class HighMapChart {
    title: any = {};
    chart: any;
    plotOptions: any = {};
    xAxis: any = {};
    yAxis: any = {};
    legend: any = {};
    series: any = null;
    tooltip: any = {};
    lang: Object = {};
    credits: Object = { enabled: false };
    pane: any = {};
    panelNumber = -1;
    type = undefined;
    colorAxis: any = {};
    exporting: any = {};
    labels: any = {};
    mapNavigation: any = {};
    navigation: any = {};
    boost: any = {};
    panelCaption = '';
    animation: false;
    seriesBoostThreshold: number;
    constructor() {
    }
}