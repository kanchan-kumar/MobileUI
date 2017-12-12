import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Logger } from '../../vendors/angular2-logger/core';

//services
import { DashboardRestDataApiService } from './dashboard-rest-data-api.service';
import { DashboardDataContainerService } from './dashboard-data-container.service';
import { DashboardConfigDataService } from './dashboard-config-data.service';
import { DashboardDataValidatorService } from './dashboard-data-validator.service';
import { DashboardDataUtilsService } from './dashboard-data-utils.service';

//constants
import { DASHBOARD_INIT_DATA, DASHBOARD_ONLOAD_DATA, DASHBOARD_FAV_TREE_DATA, DASHBOARD_LOADING_FAVORITE_DATA } from '../constants/rest-api-names.constants';

@Injectable()
export class DashboardRequestHandlerService {

  constructor(private log: Logger,
    private _restAPI: DashboardRestDataApiService,
    private _dataService: DashboardDataContainerService,
    private _config: DashboardConfigDataService,
    private _dataValidator: DashboardDataValidatorService,
    private _utils: DashboardDataUtilsService,
    private _http: Http) { }
  
  /**
   * Getting Dashboard Configuration from server through REST API.
   */
  public getDashboardConfiguration() {
    try {
      /* Getting/Creating parameters. */
      let restAPIURL = this._config.getURLWithBasicParamByRESTAPI(DASHBOARD_INIT_DATA);

      this.log.log('URL for getting dashboard configuration = ' + restAPIURL);

      /* Getting configuration data for dashboard. */
      let configSubscription = this._restAPI.getDataByRESTAPI(restAPIURL, '')
        .subscribe(
        result => {
          this.log.debug('Configuration Data recieved successfully from server.', result);

          if (!this._dataValidator.isValidObject(result) || result.errorCode > 0) {
            let msg = 'Error in getting dashboard configuration from server. Please check your network connection.';
            if (result.errorCode) {
              //alert(msg);
              this._utils.showNotification(msg);
              //msg = this._dataValidator.getErrorDefByErrorCode(result.errorCode);
            }

            return;
          } else {
            this._dataService.setDashboardConfigData(result);
          }
        },
        err => {
          this.log.error('Error while getting dashboard configuration data from server', err);
        },
        () => {
          this.log.debug('Dashboard Configuration Request completed successfully. Adding data in data container service.');
          /*unsubscribe/releasing resources.*/
          configSubscription.unsubscribe();
          this.processConfigurationAndFetchData();
        }
      );
    } catch (e) {
      this.log.error('Error on getting dashboard configuration data.', e);
    }
  }

  /**Method is used to process configuration and fetch default Favorite data. */
  private processConfigurationAndFetchData() {
    try {
      /* Now getting Dashboard Layout data and Graph Data. */
      this.getDashboardDataOnLoad();

      /* Getting dashboard favorite tree data in parallel. */
      this.requestFavoriteTreeData();

    } catch (e) {
      this.log.error('Error while processing configuration and getting favorite data on load.', e);
    }
  }

  /**
   * Method is used for getting layout and graph data from server.
   */
  public getDashboardDataOnLoad() {
    try {
      let url = this._config.getURLWithBasicParamByRESTAPI(DASHBOARD_ONLOAD_DATA);

      this.log.debug('URL for getting dashboard layout/graph data = ' + url);

      /* Getting layout/graph data for dashboard on load. */
      let dataSubscription = this._restAPI.getDataByRESTAPI(url, '')
        .subscribe(
        result => {
          this.log.debug('Data recieved successfully for layout/graph from server.', result);
          
          if (!this._dataValidator.isValidObject(result) || result.errorCode > 0 ||
            (!this._dataValidator.isValidObject(result.arrTimestamp) && result.compareMode !== true)) {
            let msg = 'Error in getting dashboard default favorite data from server.' +
              'Please check your network connection/server configuration.';
            if (result.errorCode) {
              //alert(msg);
              this._utils.showNotification(msg);
              this._config._loadingProgress = 'hidden';
              //msg = this._dataValidator.getErrorDefByErrorCode(result.errorCode);
            }
            return;
          }

          this._dataService.updateFavoriteData(result);
          this._config._loadingProgress = 'hidden';
          dataSubscription.unsubscribe();
        },
        err => {
          this.log.error('Error while getting graph/layout data from server', err);
          this.log.debug('Dashboard Data Request completed successfully. Adding data in data container service.');
          let msg = 'Error in getting dashboard default favorite data from server.' +
            'Please check your network connection/server configuration.';

          this._utils.showNotification(msg);
        },
        () => {
          /*unsubscribe/releasing resources.*/
          dataSubscription.unsubscribe();

          this._config._loadingProgress = 'hidden';
        });
    } catch (e) {
      this.log.error('Error in getting dashboard layout and graph data. Please check server error logs.', e);
    }
  }

  /* Method is used for getting favorite tree data. */
  requestFavoriteTreeData() {
    try {
      /* Composing URL. */
      let restAPIURL = this._config.getURLWithBasicParamByRESTAPIForFAV(DASHBOARD_FAV_TREE_DATA);
      /* Getting favorite tree data for dashboard. */
      let dataSubscription = this._restAPI.getDataByRESTAPI(restAPIURL, '')
        .subscribe(
        result => {
          this.log.log('Favorite tree data recieved successfully from server.', result);
          /* Now getting Dashboard Layout data and Graph Data. */
          this._dataService.updateFavoriteTreeData(result);
          dataSubscription.unsubscribe();
        },
        err => { this.log.error('Error while getting favorite tree data from server', err); },
        () => {
          this.log.debug('Dashboard favorite tree data request completed successfully. Adding data in data container service.');
          /*unsubscribe/releasing resources.*/
          dataSubscription.unsubscribe();
        }
        );
    } catch (e) {
      this.log.error('Error while getting data of favorite tree.', e);
    }
  }

    /**
  * Method is used for loading favorite data and update data in panel On Favorire load
  */
  public loadFavoriteData(event) {
    try {
      this.log.debug('loadFavoriteUtils : DashboardLoadFavDataService ');
      /*starting progess bar */

      //this._progessBar.startProgressBar('loading Favorite :' + event.item.label + '  please wait...');
      
      this._config._loadingProgress = '';
      /*defining url to laod favorie */
      let fav_load_url = this._config.getURLWithBasicParamByRESTAPI(DASHBOARD_LOADING_FAVORITE_DATA);
      this.log.debug('loadFavoriteUtils : DashboardLoadFavDataService =' + fav_load_url);

      /*if favorite has no relative path ,we add relative path with favorite name*/
      if (event.item.data === undefined || event.item.data === null) {
        event.item.data = event.item.label;
      }

      let isCompare = false; //this._config.$isCompareMode;

      fav_load_url = fav_load_url + '&favNameWithRelPath=' + event.item.data + '&favName=' +
        event.item.label + '&isCompared=' + isCompare + '&selPanelIndex=' + this._config.$activePanelNumber;
      let favDataSubscription = this._restAPI.getDataByRESTAPI(fav_load_url, '')
        .subscribe(
        result => {
          this.log.debug('Favorite data recieved successfully from server.', result);

          if (!this._dataValidator.isValidObject(result) || result.errorCode > 0 ||
            (!this._dataValidator.isValidObject(result.arrTimestamp) && result.compareMode !== true)) {
            let msg = 'Error in getting dashboard favorite data from server.' +
              'Please check your network connection/server configuration.';
            if (result.errorCode) {
              msg = result.errorCode; //this._dataValidator.getErrorDefByErrorCode(result.errorCode);
            }

            this._utils.showNotification(msg);
            //this._utils.showNotificationMessage(msg, 'error', 'top', true);
            /*Stopping progess bar*/
            //this._progessBar.stopProgressBar();
            this._config._loadingProgress = 'hidden';
            return;
          }

          /*calling method for updating Favorite data on service.*/
          this._dataService.updateFavoriteData(result);
          /*Stopping progess bar*/
          //this._progessBar.stopProgressBar();
          this._config._loadingProgress = 'hidden';

          this._utils.showNotification('Favorite ' + event.item.label + ' loaded successfully.');
          //this._utils.showNotificationMessage('Favorite ' + event.item.label + ' loaded successfully.',
            //'success', 'bottom', false);
          favDataSubscription.unsubscribe();
        },
        err => {
          this.log.debug('Error while getting favorite data from server', err);
          //this._progessBar.stopProgressBar();
          this._config._loadingProgress = 'hidden';
          let msg = 'Error in getting dashboard favorite data from server.' +
            'Please check your network connection/server configuration.';
            this._utils.showNotification(msg);
          //this._utils.showNotificationMessage(msg, 'error', 'top', true);
        },
        () => {
          this.log.debug('Dashboard favorite data request completed successfully. Adding data in data container service.');
          /*unsubscribe/releasing resources.*/
          favDataSubscription.unsubscribe();
          //this._progessBar.stopProgressBar();
          this._config._loadingProgress = 'hidden';
        });
    } catch (e) {
      this.log.error('Error in  loadFavoriteData method.', e);
      //this._progessBar.stopProgressBar();
      this._config._loadingProgress = 'hidden';
    }
  }

}
