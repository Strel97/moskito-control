import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ChartProducer } from 'app/content/moskito-analyze/model/chart-producer.model';
import { MoskitoAnalyzeChartConfigRequest } from 'app/content/moskito-analyze/model/moskito-analyze-chart-config-request.model';
import { MoskitoAnalyzeChartsRequest } from 'app/content/moskito-analyze/model/moskito-analyze-chart-request.model';
import { MoskitoAnalyzeChart } from 'app/content/moskito-analyze/model/moskito-analyze-chart.model';
import { Producer } from 'app/content/moskito-analyze/model/producer.model';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
import { Observable } from 'rxjs/Observable';
import { MoskitoAnalyzeService } from './moskito-analyze.service';


/**
 * Service responsible for communicating with Moskito-Analyze REST services.
 * @author strel
 */
@Injectable()
export class MoskitoAnalyzeRestService {

  constructor(
    private http: Http,
    private application: MoskitoApplicationService,
    private moskitoAnalyze: MoskitoAnalyzeService
  ) {
  }

  /**
   * Builds chart data request to Moskito-Analyze.
   *
   * @param chart Chart configuration / parameters.
   * @returns {MoskitoAnalyzeChartsRequest} JSON request to Moskito-Analyze.
   */
  public buildChartRequest(chart: MoskitoAnalyzeChart): MoskitoAnalyzeChartsRequest {
    const request = new MoskitoAnalyzeChartsRequest();

    request.interval = chart.interval;
    request.hosts = chart.hosts;

    const producer = new ChartProducer();
    producer.producerId = chart.producer;
    producer.stat = chart.stat;
    producer.value = chart.value;

    request.producers = [producer];

    const utcStartDate = new Date(chart.startDate.getUTCFullYear(), chart.startDate.getUTCMonth(), chart.startDate.getUTCDate(), chart.startDate.getUTCHours(), chart.startDate.getUTCMinutes());
    request.startDate = this.moskitoAnalyze.formatDate(utcStartDate);

    const utcEndDate = new Date(chart.endDate.getUTCFullYear(), chart.endDate.getUTCMonth(), chart.endDate.getUTCDate(), chart.endDate.getUTCHours(), chart.endDate.getUTCMinutes());
    request.endDate = this.moskitoAnalyze.formatDate(utcEndDate);

    return request;
  }

  /**
   * @returns General MoSKito-Analyze configuration, particularly analyze application URL and hosts list.
   */
  public getMoskitoAnalyzeConfig(): Observable<any> {
    return this.http.get(this.application.getApplicationContextPath() + 'rest/analyze/configuration').map(( resp ) => {
      return resp.json();
    });
  }

  /**
   * @returns Moskito-Analyze configuration as it's defined in JSON configuration file
   */
  public getPrettyMoskitoAnalyzeConfig(): Observable<string> {
    return this.http.get(this.application.getApplicationContextPath() + 'rest/analyze/configuration/pretty').map(( resp ) => {
      return resp.json();
    });
  }

  /**
   * Adds new MoSKito-Analyze chart configuration bean.
   * @param chart Chart to add
   */
  public createMoskitoAnalyzeChart(chart: MoskitoAnalyzeChart): Observable<void> {
    const requestData = new MoskitoAnalyzeChartConfigRequest();
    requestData.fromAnalyzeChart(chart);

    return this.http.post(this.application.getApplicationContextPath() + 'rest/analyze/chart/create', requestData).map(( resp ) => {
      return resp.json();
    });
  }

  /**
   * Updates existing MoSKito-Analyze configuration bean.
   * @param chart Updated chart.
   */
  public updateMoskitoAnalyzeChart(chart: MoskitoAnalyzeChart): Observable<void> {
    const requestData = new MoskitoAnalyzeChartConfigRequest();
    requestData.fromAnalyzeChart(chart);

    return this.http.post(this.application.getApplicationContextPath() + 'rest/analyze/chart/' + chart.name + '/update', requestData).map(( resp ) => {
      return resp.json();
    });
  }

  /**
   * Removes MoSKito-Analyze chart configuration bean.
   * @param chart Chart to remove.
   */
  public removeMoskitoAnalyzeChart(chart: MoskitoAnalyzeChart): Observable<void> {
    return this.http.get(this.application.getApplicationContextPath() + 'rest/analyze/chart/' + chart.name + '/remove').map(( resp ) => {
      return resp.json();
    });
  }

  /**
   * @returns Chart properties used as request parameters for MoSKito-Analyze chart REST resource.
   */
  public getChartsConfig(): Observable<any> {
    return this.http.get(this.application.getApplicationContextPath() + 'rest/analyze/charts').map(( resp ) => {
      return resp.json().charts;
    });
  }

  /**
   * Request to Moskito-Analyze REST endpoint for getting chart data for given period.
   * @param requestType Request type, i.e. type of chart values to show (average, total).
   * @param requestData Request parameters.
   * @returns Charts data.
   */
  public getChartsDataForPeriod(requestType: string, requestData: MoskitoAnalyzeChartsRequest): Observable<any> {
    return this.http.post(this.moskitoAnalyze.url + 'charts/' + requestType, requestData).map(( resp ) => {
      return resp.json().results.charts;
    });
  }

  /**
   * @returns List of all available producers from moskito-analyze
   */
  public getProducers(): Observable<Producer[]> {
    return this.http.get(this.moskitoAnalyze.url + 'producers/all').map(( resp ) => {
      return resp.json().results.producers;
    });
  }
}
