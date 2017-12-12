import { ChartEvents } from './chart-events';

export class ChartOptions {
  type = 'spline';
  alignTicks = true;
  animation = false;
  backgroundColor = 'transparent';
  borderColor = ' #335cad';
  borderWidth = 0;
  borderRadius = 0;
  defaultSeriesType = 'line';
  plotBackgroundColor = 'transparent';
  plotBackgroundImage: any;
  plotBorderColor = '#cccccc';
  plotBorderWidth = 0;
  plotShadow = false;
  reflow = false;
  renderTo: any;
  resetZoomButton: any = {
    theme: {
      display: 'none'
    },
    position: {}
  };
  shadow = false;
  showAxes = false;
  spacing: number[] = [6, 3, 4, 3];
  style: any;
  width = 150;
  height = 120;
  zoomType = false;
  events: any;
}