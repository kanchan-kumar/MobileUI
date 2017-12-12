import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/Material';
import { MatTableDataSource, MatPaginator, MatSort, Sort } from '@angular/material';
import { DashboardTestRunInfo } from '../../interfaces/dashboard-test-run-info';
import { DashboardAuthService } from '../../services/dashboard-auth.service';
import { Subscription } from 'rxjs/Subscription';
import { DashboardConfigDataService } from '../../services/dashboard-config-data.service';
import { Router } from '@angular/router';

import * as ons from 'onsenui';

@Component({
  // selector: 'ons-page',
  selector: 'app-dashboard-test-run',
  templateUrl: './dashboard-test-run.component.html',
  styleUrls: ['./dashboard-test-run.component.css']
})

export class DashboardTestRunComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['testMode', 'testRun', 'startTime', 'startedBy'];
  testRunData: DashboardTestRunInfo[] = [];
  dataSource: MatTableDataSource<DashboardTestRunInfo> = new MatTableDataSource(this.testRunData);
  dataSubscription: Subscription;
  filterSubscription: Subscription;

  totalRecords: number = 0;
  searchTestData = new FormControl('', []);
  renderedData: DashboardTestRunInfo[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) _paginator: MatPaginator;

  setHeight: string = '345px';

  constructor(private _router: Router,
    private _authService: DashboardAuthService,
    private _configService: DashboardConfigDataService,
    private _changeDetection: ChangeDetectorRef,
    private _zone: NgZone) {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this._paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Filter Selected';

    this._paginator.page.subscribe(($event) => {
      let tableData = this.renderedData.slice();

      if (!tableData)
        tableData = [];

      let tmpData = this.paginate(tableData);
      this.dataSource = new MatTableDataSource(tmpData);
    });

    this.dataSubscription = this._authService.getTestRunData().subscribe(res => {
      this.testRunData = res;
      this.totalRecords = this.testRunData.length;

      this.filterSubscription = this._authService.getFilteredData('', '00:30:00-NA', '7').subscribe(res => {
        this.loadTable(res);
      });
    });

    if (!ons.orientation.isPortrait()) {
      this.setHeight = '200px';
    }
    else {
      this.setHeight = '340px';
    }

    /***this is to handle the orientation of mobile view */
    ons.orientation.on('change', (event) => {
      if (!event.isPortrait) {
        this.setHeight = '210px';
      }
      else {
        this.setHeight = '345px';
      }
    });
  }

  loadTable(data) {
    try {
      let dataToBeFiltered = data.slice();
      this.renderedData = this.paginate(dataToBeFiltered);
      this.dataSource = new MatTableDataSource(this.renderedData);
      // this._changeDetection.detectChanges();
    }
    catch (e) {
      console.log(e);
    }
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    try {

    }
    catch (e) {
      console.log(e);
    }
  }

  searchResult() {
    try {
      this._configService._loadingProgress = '';
      this.filterSubscription = this._authService.getFilteredData(this.searchTestData.value).subscribe(res => {

        this.loadTable(res);
        this._configService._loadingProgress = 'hidden';

        // if (!this._changeDetection['destroyed'])
        //   this._changeDetection.detectChanges();
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  showAllResult() {
    try {
      this.searchTestData.setValue('');
      this._configService._loadingProgress = '';
      this.filterSubscription = this._authService.getFilteredData('').subscribe(res => {
        this.loadTable(res);
        this._configService._loadingProgress = 'hidden';

        // if (!this._changeDetection['destroyed'])
        //   this._changeDetection.detectChanges();
      });
    }
    catch (e) {
      console.log(e);
      this._configService._loadingProgress = 'hidden';
    }
  }

  sortData(sort: Sort) {
    const data = this.renderedData.slice();
    if (!sort.active || sort.direction == '') {
      this.testRunData = data;
      return;
    }

    this.renderedData = data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (sort.active) {
        case 'testRun': [propertyA, propertyB] = [a.testRun, b.testRun]; break;
        case 'startTime': [propertyA, propertyB] = [a.startTime, b.startTime]; break;
        case 'runTime': [propertyA, propertyB] = [a.startedBy, b.startedBy]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (sort.direction == 'asc' ? 1 : -1);
    });

    this.dataSource = new MatTableDataSource(this.renderedData);
  }

  openWebDashboard(testRun) {
    this._configService.$testRun = testRun;

    this._zone.run(() => {
      this._router.navigate(['/home/dashboard']);
    });
  }

  paginate(data) {
    try {
      if (this._paginator) {
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        return data.splice(startIndex, this._paginator.pageSize);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }

    if (!this._changeDetection['destroyed']) {
      this._changeDetection.detach();
    }
  }
}




