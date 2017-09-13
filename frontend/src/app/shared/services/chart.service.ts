import { ElementRef, Injectable } from '@angular/core';
import { Chart } from 'app/shared/models/chart';


declare const chartEngineIniter: any;


interface ChartContent {
  [name: string]: string;
}

@Injectable()
export class ChartService {

  private initializedChartNames: string[];
  private chartsCache: ChartContent;


  constructor() {
    this.initializedChartNames = [];
    this.chartsCache = {};
  }

  public initializeChart(chart: Chart, container: any) {
    if (!chart || !container) {
      return;
    }

    const chartData = [];
    for (const point of chart.points) {
      const jsonWithTimestamp = [point.timestamp];
      for (const value of point.values) {
        // Checking is it really number
        const linePoint = Number(value);
        if (!isNaN(linePoint)) {
          jsonWithTimestamp.push(linePoint);
        }
      }

      chartData.push(jsonWithTimestamp);
    }

    const names = chart.lineNames.map(function (graphNames) {
      return graphNames;
    });

    const domContainer = container.nativeElement ? container.nativeElement : container;

    const chartParams = {
      container: domContainer.id,
      names: names,
      data: chartData,
      colors: [],
      type: 'LineChart',
      title: names,
      dataType: 'datetime',
      previous_chart_params: {},
      options: {
        legendsPerSlice: 5,
        margin: {top: 20, right: 20, bottom: 20, left: 40}
      }
    };

    chartParams.previous_chart_params = {
      width: domContainer.clientWidth,
      height: domContainer.clientHeight
    };

    // Creating chart
    chartEngineIniter.init(chartParams);
  }

  public refreshChart(chart: Chart, container: ElementRef) {
    if (!chart || !container) {
      return;
    }

    const chartData = [];
    for (const point of chart.points) {
      const jsonWithTimestamp = [point.timestamp];
      for (const value of point.values) {
        // Checking is it really number
        const linePoint = Number(value);
        if (!isNaN(linePoint)) {
          jsonWithTimestamp.push(linePoint);
        }
      }

      chartData.push(jsonWithTimestamp);
    }

    const names = chart.lineNames.map(function (graphNames) {
      return graphNames;
    });

    const containerSelector = '#' + container.nativeElement.id;

    chartEngineIniter.d3charts.dispatch.refreshLineCharts({
      'containerId': containerSelector,
      'data': chartData,
      'names': names
    });
  }

  public getChartContent(chartName: string) {
    return this.chartsCache[chartName];
  }

  public buildChartBoxID(chartName: string): string {
    // If chart name is empty generate id
    if (!chartName) {
      return 'chart-' + (Math.floor(Math.random() * 9999) + 1000);
    }

    return chartName.replace(/ /gi, '_');
  }
}
