import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Widget } from 'app/content/widgets/widget.model';
import { Chart } from 'app/shared/models/chart';
import { ChartService } from 'app/shared/services/chart.service';
import { HttpService } from 'app/shared/services/http.service';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';


declare const chartEngineIniter: any;


@Component({
  selector: 'app-charts-widget',
  templateUrl: './charts-widget.component.html'
})
export class ChartsWidgetComponent extends Widget implements AfterViewInit, OnInit {

  charts: Chart[];
  chartsDataLoaded: boolean;
  chartBoxesInitialized: boolean;
  fullscreenChart: Chart;

  @ViewChildren('chart_box')
  boxes: QueryList<ElementRef>;


  constructor(private httpService: HttpService, private moskitoApplicationService: MoskitoApplicationService, private chartService: ChartService) {
    super();

    this.chartsDataLoaded = false;
    this.chartBoxesInitialized = false;
  }

  ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => this.createBoxes());

    // Loading charts
    this.httpService.getApplicationCharts(this.moskitoApplicationService.currentApplication.name).subscribe((charts) => {
      this.charts = charts;
      this.chartsDataLoaded = true;
    });
  }

  ngAfterViewInit(): void {
    this.boxes.changes.subscribe(( boxes ) => {
      const boxesAsArray = boxes.toArray();
      if (this.chartsDataLoaded) {
        this.initializeCharts(this.charts, boxesAsArray);
      }
    });
  }

  public initializeCharts(charts: Chart[], chartBoxes: ElementRef[]) {
    for (let i = 0; i < charts.length; i++) {
      this.chartService.initializeChart(charts[i], chartBoxes[i]);
    }
  }

  public refreshCharts(charts: Chart[], chartBoxes: ElementRef[]) {
    for (let i = 0; i < charts.length; i++) {
      this.chartService.refreshChart(charts[i], chartBoxes[i]);
    }
  }

  onChartClick(event, chart) {
    const target = event.currentTarget;

    const body = document.querySelector('body');
    const svg = target.querySelector('svg');

    // Getting first non fullscreen box
    let referenceElement;
    for (const chartBox of this.boxes.toArray()) {
      if (!chartBox.nativeElement.classList.contains('chart_fullscreen')) {
        referenceElement = chartBox.nativeElement.querySelector('svg');
        break;
      }
    }

    body.classList.toggle('fullscreen');
    target.classList.toggle('chart_fullscreen');
    this.fullscreenChart = chart;

    if (!target.classList.contains('chart_fullscreen')) {
      svg.setAttribute('width', referenceElement ? referenceElement.clientWidth : 800);
      svg.setAttribute('height', referenceElement ? referenceElement.clientHeight - 3 : 300);
      this.fullscreenChart = null;
    }

    chartEngineIniter.d3charts.dispatch.refreshLineChart('#' + target.id, true);
  }

  public createBoxes() {
    this.httpService.getApplicationCharts(this.moskitoApplicationService.currentApplication.name).subscribe((charts) => {
      this.charts = charts;
    });
  }

  /**
  *
  */
  public refresh() {
    this.httpService.getApplicationCharts(this.moskitoApplicationService.currentApplication.name).subscribe((charts) => {
      this.refreshCharts(charts, this.boxes.toArray());
    });
  }
}
