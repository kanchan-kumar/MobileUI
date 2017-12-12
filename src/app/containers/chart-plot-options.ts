export class ChartPlotOptions {
    area: PlotOptions;
    column: PlotOptions;
    pie: PlotOptions;
    gauge: PlotOptions;
}

export class PlotOptions {
    allowPointSelect = false;
    animation = false;
    color: any;
    connectEnds = true;
    connectNulls = false;
    cropThreshold = 300;
    dashStyle = 'Solid';
    enableMouseTracking: true;
    events: any;
    lineWidth = 2;
    selected = false;
    shadow = false;
    showCheckbox = false;
    showInLegend = false;
    softThreshold = false;
    stickyTracking = false;
    threshold = 0;
    tooltip: any;
    turboThreshold = 500;
    visible = true;
    zoneAxis = 'y';
    stacking = 'normal';
    innerSize: any = '0%';
    dial: any;
    pivot: any;
    dataLabels: any = {};
}

export class Dial {
    radius = '';
    backgroundColor = null;
}
export class Pivot {
    backgroundColor = '#FFF';
}
export class DataLabel {
    defer = false;
    enabled = false;
    x = 0;
    y = 0;
}