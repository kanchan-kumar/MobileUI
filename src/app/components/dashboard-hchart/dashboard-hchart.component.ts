import {
  Input, ElementRef, Component, Output,
  KeyValueDiffers, KeyValueDiffer, EventEmitter, OnInit, OnDestroy
} from '@angular/core';

import * as Highcharts from 'highcharts/highcharts.src';
import { Logger } from '../../../vendors/angular2-logger/core';
import * as jQuery from 'jquery';

@Component({
  selector: 'Hchart',
  template: '',
  styleUrls: ['./dashboard-hchart.component.css']
})
export class DashboardHchartComponent implements OnInit, OnDestroy {

  @Output() load = new EventEmitter<any>();
  chart: any;
  element: ElementRef;
  private userOpts: any;
  private baseOpts: any;
  differ: KeyValueDiffer<any, any>;
  @Input() type = 'Chart';

  @Input() set options(opts: any) {
    this.userOpts = opts;
    this.init();
  };

  ngOnDestroy() {
    if (this.chart != null) {
      this.chart.destroy();
    }
  }

  ngOnInit() {
  }

  private init() {
    if (this.userOpts && this.baseOpts) {

      if (this.differ.diff(this.userOpts)) {
        this.drawChart();
        this.push();
      }
    }
  }

  drawChart(): void {
    try {
       this.log.timeLog('HChart', 'drawChart', 'Draw Chart Start');
      if (!this.userOpts) {
        this.log.errorLog('HChart', 'drawChart', 'User Options to draw chart is not available.');
        this.log.debug('User chart options =', this.userOpts);
        return;
      }

      if (this.userOpts.series || this.userOpts.data) {
        if (this.chart) {
          this.chart.destroy();
        }
        if (!this.userOpts.chart) {
          this.userOpts.chart = {};
        }
        this.userOpts.chart.renderTo = this.element.nativeElement;
        this.log.logging('HChart', 'drawChart', this.userOpts);
        if (this.type === 'Map') {
          this.chart = new Highcharts[this.type](jQuery.extend(true, {}, this.userOpts));
        } else {
          this.chart = new Highcharts[this.type](this.userOpts);
        }
      } else {
        this.log.errorLog('HChart', 'drawChart', 'Invalid User Options to draw chart.');
        console.dir(this.userOpts);
      }
       this.log.timeLog('HChart', 'drawChart', 'Draw Chart Complete');
    } catch (e) {
      console.error(e);
    }
  }

  push() {
    this.log.debug('Chart Object =', this.chart);
    let event = {
      context: this.chart
    };
    this.load.emit(event);
  }

  public get kchart(): any {
    return this.chart;
  }

  constructor(element: ElementRef, _differs: KeyValueDiffers, private log: Logger) {
    this.element = element;
    this.differ = _differs.find({}).create();
    this.baseOpts = this.createBaseOpts(this, this.element.nativeElement);
  }

  createBaseOpts(chartCmp, element) {
    let opts: any;
    try {
      opts = {
        chart: {
          renderTo: element,
          events: {}
        },
        plotOptions: {
          series: {
            events: {},
            point: {
              events: {}
            }
          }
        },
        xAxis: {
          events: {}
        },
        yAxis: {
          events: {}
        }
      };
    } catch (e) {
      console.error(e);
    }
    return opts;
  }
}
