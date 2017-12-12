import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CavissonUIRoutingModule } from './routes/cavisson-ui.routing.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

/**Customized Vender API Modules. */
import { Logger, Options as LoggerOptions, Level as LoggerLevel } from '../vendors/angular2-logger/core';

import { DashboardPaginatorModule } from '../vendors/prime-ng/paginator/paginator';

/**External Library Imports. */
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatTableModule,
  MatFormFieldModule,
  MatSortModule,
  MatPaginatorModule,
  MatSelectModule
} from '@angular/material';

import { OnsenModule } from 'ngx-onsenui';

import { PanelMenuModule, DataTableModule } from 'primeng/primeng';

/**Global Classes */

/**Filters/Providers. */

/**Services. */
import { MenuNavigatorService } from './services/menu-navigator.service';

/**Components */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { DashboardContainerComponent } from './components/dashboard-container/dashboard-container.component';
import { DashboardLeftPanelComponent } from './components/dashboard-left-panel/dashboard-left-panel.component';
import { DashboardTopPanelComponent } from './components/dashboard-top-panel/dashboard-top-panel.component';
import { DashboardLowerPanelComponent } from './components/dashboard-lower-panel/dashboard-lower-panel.component';
import { DashboardRightPanelComponent } from './components/dashboard-right-panel/dashboard-right-panel.component';

/*Importing Common Providers.*/
import { DashboardConstants } from './constants/dashboard-constants';

/* Importing Services. */
import { DashboardConfigDataService } from './services/dashboard-config-data.service';
import { DashboardRestDataApiService } from './services/dashboard-rest-data-api.service';
import { DashboardDataContainerService } from './services/dashboard-data-container.service';
import { DashboardDataValidatorService } from './services/dashboard-data-validator.service';
import { DashboardRequestHandlerService } from './services/dashboard-request-handler.service';
import { DashboardDataProcessorService } from './services/dashboard-data-processor.service';
import { DashboardWidgetDataService } from './services/dashboard-widget-data.service';
import { DashboardChartProviderService } from './services/dashboard-chart-provider.service';
import { DashboardDataUtilsService } from './services/dashboard-data-utils.service';
import { WidgetDataProcessorService } from './services/widget-data-processor.service';
import { TabularDataProviderService } from './services/tabular-data-provider.service';
import { DashboardAuthService } from './services/dashboard-auth.service';

import { DashboardWidgetComponent } from './components/dashboard-widget/dashboard-widget.component';
import { DashboardHchartComponent } from './components/dashboard-hchart/dashboard-hchart.component';
import { DashboardTestRunComponent } from './components/dashboard-test-run/dashboard-test-run.component';
import { DashboardMainNavComponent } from './components/dashboard-main-nav/dashboard-main-nav.component';

import { AuthGuard } from './components/_guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardContainerComponent,
    DashboardLeftPanelComponent,
    DashboardTopPanelComponent,
    DashboardLowerPanelComponent,
    DashboardRightPanelComponent,
    DashboardWidgetComponent,
    DashboardHchartComponent,
    DashboardTestRunComponent,
    DashboardMainNavComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CavissonUIRoutingModule,
    OnsenModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    PanelMenuModule,
    DashboardPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    DataTableModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  entryComponents: [
    DashboardLeftPanelComponent,
    DashboardTopPanelComponent,
    DashboardRightPanelComponent
  ],
  providers: [
    /*Providers. */
    { provide: LoggerOptions, useValue: { level: LoggerLevel.WARN } },
    Logger,
    MenuNavigatorService,
    DashboardConstants,

    /*Services. */
    DashboardRequestHandlerService,
    DashboardRestDataApiService,
    DashboardConfigDataService,
    DashboardDataContainerService,
    DashboardDataValidatorService,
    DashboardDataProcessorService,
    DashboardWidgetDataService,
    DashboardChartProviderService,
    DashboardDataUtilsService,
    WidgetDataProcessorService,
    TabularDataProviderService,
    DashboardAuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class CavissonUIModule { }
