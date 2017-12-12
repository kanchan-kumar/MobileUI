export class ChartyAxis {
    allowDecimals = true;
    angle = 0;
    breaks: any;
    categories: any;
    gridLineColor = '#525151'; //'#5A6F89';
    crosshair = { width: 1, color: 'black' };
    dateTimeLabelFormats: any;
    endOnTick = true;
    events: any;
    gridLineDashStyle = 'Solid';
    gridLineWidth = 1;
    gridZIndex = 1;
    labels: any;
    lineWidth = 2;
    lineColor = '#000';
    maxPadding = 0.05;
    minPadding = 0.05;
    minorGridLineDashStyle = 'Solid';
    minorGridLineWidth = 1;
    minorTickLength = 2;
    minorTickPosition = 'outside';
    minorTickWidth = 0;
    offset = 0;
    opposite = false;
    plotBands: any;
    plotLines: any;
    reversed = false;
    reversedStacks = true;
    showEmpty = true;
    showFirstLabel = true;
    showLastLabel = true;
    stackLabels: any;
    startOfWeek = 1;
    startOnTick = true;
    tickColor = '#ccd6eb';
    tickLength = 10;
    tickPosition = 'outside';
    tickWidth = 0;
    title: Object = { margin: 5, text: '' };
    type = 'linear';
    visible = true;
    min = 0;
    max = 0;
    tickPixelInterval = 0;
    tickPositions: any;
    pane = 0;
    minorTickColor: any;
  }
  
  export class YAxisLabel {
    rotation: 'auto';
    distance: 20;
    enabled: true;
    style = { color: ' #6e6e70' };
    formatter: any = null;
  }