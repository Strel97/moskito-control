import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Chart } from 'app/shared/models/chart';
import { Connector } from 'app/shared/models/connector';
import { HistoryItem } from 'app/shared/models/history-item';
import { MoskitoApplication } from 'app/shared/models/moskito-application';
import { MoskitoComponent } from 'app/shared/models/moskito-component';
import { SystemStatus } from 'app/shared/models/system-status';
import { Threshold } from 'app/shared/models/threshold';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';


class AccumulatorChartParameters {
  application: string;
  component: string;
  accumulators: string[];

  constructor(application: string, component: string, accumulators: string[]) {
    this.application = application;
    this.component = component;
    this.accumulators = accumulators;
  }
}

/**
 * Service responsible for communicating with Moskito-control REST services.
 * @author strel
 */
@Injectable()
export class HttpService {

  private url;
  private json_header = new Headers({ 'Content-Type': 'application/json' });


  constructor(private http: Http, private moskitoApplicationService: MoskitoApplicationService) {

    // Subtracting path to root of application
    const href = window.location.href;
    const javaAppPathIndex = href.indexOf('beta');
    this.url = href.substring(0, javaAppPathIndex === -1 ? href.length : javaAppPathIndex);
    this.url = this.url.endsWith('/') ? this.url : this.url + '/';

    this.moskitoApplicationService.setApplicationContextPath(window.location.pathname.replace('beta', ''));
    // this.changeServer('http://burgershop-control.demo.moskito.org/moskito-control/');
    // this.changeServer("http://localhost:8088/");
  }


  changeServer( url: string ) {
    this.url = url;
    this.moskitoApplicationService.setApplicationContextPath(window.location.pathname.replace('beta', ''));
    // this.moskitoApplicationService.setApplicationContextPath('http://burgershop-control.demo.moskito.org/moskito-control/');
    // this.moskitoApplicationService.setApplicationContextPath("http://localhost:8088/");
    this.moskitoApplicationService.refreshData();
  }

  public getUrl(): string {
    return this.url;
  }

  getMoskitoApplications(): Observable<MoskitoApplication[]> {
    return this.http.get(this.url + 'rest/control').map((resp ) => {
      return resp.json().applications;
    });
  }

  getApplicationComponents(appName: string): Observable<MoskitoComponent[]> {
    return this.http.get(this.url + 'rest/control').map((resp) => {
      const applications: MoskitoApplication[] = resp.json().applications;

      for (const app of applications) {
        if (app.name === appName) {
          return app.components;
        }
      }

      return [];
    });
  }

  getMoskitoStatus(): Observable<SystemStatus> {
    return this.http.get(this.url + 'rest/status').map((resp) => {
      const response = resp.json();
      const moskitoStatus = new SystemStatus();

      // Getting application statuses
      for (const appName of Object.keys(response.statuses)) {
        moskitoStatus.applicationStatuses.push( response.statuses[appName] );
      }

      // Getting updater statuses
      moskitoStatus.chartsUpdater = response.updaterStatuses.charts;
      moskitoStatus.statusUpdater = response.updaterStatuses.status;

      return moskitoStatus;
    });
  }

  getMoskitoConfiguration(): Observable<any> {
    return this.http.get(this.url + 'rest/configuration').map((resp) => {
      return resp.json();
    });
  }

  getPrettyMoskitoConfiguration(): Observable<any> {
    return this.http.get(this.url + 'rest/configuration/pretty').map((resp) => {
      return resp.json();
    });
  }

  getApplicationHistory(application: string): Observable<HistoryItem[]> {
    return this.http.get(this.url + 'rest/history/' + application).map((resp) => {
      return resp.json().historyItems;
    });
  }

  getComponentHistory(application: string, component: string): Observable<HistoryItem[]> {
    return this.http.get(this.url + `rest/history/${application}/${component}`).map((resp) => {
      return resp.json().historyItems;
    });
  }

  getApplicationCharts(application: string): Observable<Chart[]> {
    return this.http.get(this.url + 'rest/charts/points/' + application).map((resp) => {
      return resp.json().charts;
    });
  }

  getThresholds(application: string, component: string): Observable<Threshold[]> {
    return this.http.get(this.url + 'rest/thresholds/' + application + '/' + component).map((resp) => {
      return resp.json().thresholds;
    });
  }

  getAccumulatorNames(application: string, component: string): Observable<string[]> {
    return this.http.get(this.url + 'rest/accumulators/' + application + '/' + component).map((resp) => {
      return resp.json().names;
    });
  }

  getAccumulatorCharts(application: string, component: string, accumulators: string[]): Observable<Chart[]> {
    const params = new AccumulatorChartParameters(application, component, accumulators);
    return this.http.post(this.url + 'rest/accumulators/charts', params, { headers: this.json_header }).map((resp) => {
      return resp.json().charts;
    });
  }

  getConnectorConfiguration(application: string, component: string): Observable<Connector> {
    return this.http.get(this.url + 'rest/connectors/configuration/' + application + '/' + component).map((resp) => {
      return resp.json().connectorConfiguration;
    });
  }

  getConnectorInformation(application: string, component: string): Observable<any> {
    return this.http.get(this.url + 'rest/connectors/information/' + application + '/' + component).map((resp) => {
      return resp.json().connectorInformation;
    });
  }

  muteNotifications() {
    this.http.get(this.url + 'rest/notifications/mute').subscribe();
  }

  unmuteNotifications() {
    this.http.get(this.url + 'rest/notifications/unmute').subscribe();
  }
}
