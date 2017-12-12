import { Injectable } from '@angular/core';
import { Logger } from '../../vendors/angular2-logger/core';
import { DashboardRestDataApiService } from '../services/dashboard-rest-data-api.service';
import { DashboardDataContainerService } from '../services/dashboard-data-container.service';

import { DASHBOARD_REST_API_PATH } from '../constants/rest-api-names.constants';

@Injectable()
export class DashboardConfigDataService {
  private protocol: string = 'http'; //location.protocol;
  private host = '10.10.50.11'; //   
  private port = '8002'; //location.port; 
  private clientConnectionKey = null;
  private userName = 'netstorm';
  private userPass = '';
  private userGroup = 'netstorm';
  private testRun = '2229';
  private productName = 'netstorm';
	private productType = '';
	private userType = 'Engineer';
	private userRole = 'Standard';
	private serverIP: string = null;
	private appPath: string = null;
	private serverType = '';
	private serverTitle = '';
  private productMode = '';
  private workPath = '';
  private controllerName = '';
  private continouseMode = 'false';
  
  private navWidth = 0;
  private defaultInterval = 10000;
  private currentPage = 0;
  private totalpages = 1;

  private activePanelNumber = 0;
  private activeWidgetId = 0;

  /* used for show vector in title of widget */
  private lastNForPanelCaption = 'Last 2 Levels';

  /* Configuration from server through REST API. */
  private timeZone = 'Asia/Kolkata';

  private timeZoneId = '(IST)';

  private runningTest = '';

  /* Relative path of default favorite for compare */
  private dashboardDefaultFavoritePath: string;
  
  _loadingProgress: string = 'hidden';
  _isSinglePanelViewMode: boolean = false;

  constructor(private log: Logger, private _restAPI: DashboardRestDataApiService,
    private _dataService: DashboardDataContainerService) {
      this.serverIP = '//' + this.host + ':' + this.port + '/';
      this.appPath = this.serverIP + 'ProductUI';

      let timestamp = new Date().getTime();
      this.clientConnectionKey = this.userName + '.' + this.testRun + '.' + timestamp;
    }

  /**
   * Method is used for getting URL.
   */
  public getHostURL() {
    try {
      //return this._productConfig.getINSAggrPrefix() + this._navService.getDCNameForScreen('dashboard');
      return '//' + this.host + ':' + this.port;
    } catch (e) {
      this.log.error(e);
      return null;
    }
  }

  /** Method is used for getting URL by REST API name. */
  public getURLWithBasicParamByRESTAPI(apiName: string): string {
    return this.getHostURL() + this.getURLParamByRESTAPIName(apiName);
  }

  /**
   * Method is used for getting common URL Parameters of REST API by API Name.
   */
  public getURLParamByRESTAPIName(apiName: string) {
    try {
      return DASHBOARD_REST_API_PATH + apiName + '?client_connection_key=' +
        this.clientConnectionKey + '&userName=' + this.userName + '&testRun=' + this.testRun + '&prodType=' + this.productName
        + '&productType=' + this.productName;
    } catch (e) {
      this.log.error(e);
      return null;
    }
  }

  /** Method is used for getting URL by REST API name. */
  public getURLWithBasicParamByRESTAPIForFAV(apiName: string): string {
    return this.getHostURL() + this.getURLParamByRESTAPIName(apiName) + '&product=' + this.productName;
  }

  public get $productName(): string {
    return this.productName;
  }

  public set $productName(value: string) {
    this.productName = value;
  }

  public get $currentPage(): number {
    return this.currentPage;
  }

  public set $currentPage(value: number) {
    this.currentPage = value;
  }

  public get $totalpages(): number {
    return this.totalpages;
  }

  public set $totalpages(value: number) {
    this.totalpages = value;
  }

  public set $lastNForPanelCaption(value: string) {
    this.lastNForPanelCaption = value;
  }

  public get $lastNForPanelCaption(): string {
    return this.lastNForPanelCaption;
  }

  public get $activePanelNumber(): number {
    return this.activePanelNumber;
  }

  public set $activePanelNumber(value: number) {
    this.activePanelNumber = value;
  }

  public get $dashboardDefaultFavoritePath(): string {
    return this.dashboardDefaultFavoritePath;
  }

  public set $dashboardDefaultFavoritePath(value: string) {
    this.dashboardDefaultFavoritePath = value;
  }

  public get $activeWidgetId(): number {
    return this.activeWidgetId;
  }

  public set $activeWidgetId(value: number) {
    this.activeWidgetId = value;
  }

  public get $serverIP(): string {
		return this.serverIP;
	}

	public set $serverIP(value: string) {
		this.serverIP = value;
  }
  
  public get $testRun(): string {
    return this.testRun;
  }

  public set $testRun(value: string) {
    this.testRun = value;
  }

  public get $protocol(): string {
		return this.protocol;
	}

	public set $protocol(value: string) {
		this.protocol = value;
	}

	public get $host(): string {
		return this.host;
	}

	public set $host(value: string) {
		this.host = value;
	}

	public get $port(): string {
		return this.port;
	}

	public set $port(value: string) {
		this.port = value;
	}

	public get $userName(): string {
		return this.userName;
	}

	public set $userName(value: string) {
		this.userName = value;
	}

	public get $userType(): string {
		return this.userType;
	}

	public set $userType(value: string) {
		this.userType = value;
  }
  
  public get $userGroup(): string {
		return this.userGroup;
	}

	public set $userGroup(value: string) {
		this.userGroup = value;
	}

	public get $userRole(): string {
		return this.userRole;
	}

	public set $userRole(value: string) {
		this.userRole = value;
	}

	public get $productType(): string {
		return this.productType;
	}

	public set $productType(value: string) {
		this.productType = value;
	}

	public get $serverType(): string {
		return this.serverType;
	}

	public set $serverType(value: string) {
		this.serverType = value;
	}

	public get $serverTitle(): string {
		return this.serverTitle;
	}

	public set $serverTitle(value: string) {
		this.serverTitle = value;
	}

	public get $productMode(): string {
		return this.productMode;
	}

	public set $productMode(value: string) {
		this.productMode = value;
	}

	public get $timeZone(): string {
		return this.timeZone;
	}

	public set $timeZone(value: string) {
		this.timeZone = value;
	}

	public get $workPath(): string {
		return this.workPath;
	}

	public set $workPath(value: string) {
		this.workPath = value;
	}

	public get $controllerName(): string {
		return this.controllerName;
	}

	public set $controllerName(value: string) {
		this.controllerName = value;
  }
  
  public get $continouseMode(): string {
    return this.continouseMode;
  }

  public set $continouseMode(value: string) {
    this.continouseMode = value;
  }

  public get $timeZoneId(): string {
    return this.timeZoneId;
  }

  public set $timeZoneId(value: string) {
    this.timeZoneId = value;
  }

  public get $runningTest(): string {
    return this.runningTest;
  }

  public set $runningTest(value: string) {
    this.runningTest = value;
  }

  public get $userPass() {
    return this.userPass;
  }

  public set $userPass(value: string) {
    this.userPass = value;
  }
}
