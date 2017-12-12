export class Chart {
    title: any = {};
    chart: any;
    plotOptions: any = {};
    xAxis: any;
    yAxis: any;
    legend: any = {};
    series: any = {};
    tooltip: any = {};
    lang: any = {};
    credits: any = { enabled: false };
    pane: any = {};
    panelNumber = -1;
    type = undefined;
    colorAxis: any;
    exporting: Object = { enabled: false };
    labels = {};
    mapNavigation: any;
    navigation: any;
    animation: false;
    boost = {
      seriesThreshold: 1000,
      useGPUTranslations: false,
      useAlpha: true,
      usePreallocated: false,
      timeRendering: true,
      timeSeriesProcessing: false,
      timeSetup: true
    };
    panelCaption = '';
    constructor() {
    }
  }
  
  export class Series {
    data: any = null;
    name = '';
  }
  