import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { MoskitoAnalyzeChart } from 'app/content/moskito-analyze/model/moskito-analyze-chart.model';
import { MoskitoAnalyzeRestService } from 'app/content/moskito-analyze/services/moskito-analyze-rest.service';
import { MoskitoAnalyzeService } from 'app/content/moskito-analyze/services/moskito-analyze.service';
import { MoskitoAnalyzeChartConfigurationModalComponent } from 'app/content/moskito-analyze/widgets/moskito-analyze-chart/configuration-modal/ma-chart-configuration-modal.component';
import { Widget } from 'app/content/widgets/widget.model';
import { Chart } from 'app/shared/models/chart';
import { ChartPoint } from 'app/shared/models/chart-point';
import { ChartService } from 'app/shared/services/chart.service';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';


/**
 * Main function of JavaScript D3 library used for rendering charts.
 */
declare const chartEngineIniter: any;


@Component({
  selector: 'app-moskito-analyze-chart',
  templateUrl: './moskito-analyze-chart.component.html',
  styleUrls: ['./moskito-analyze-chart.component.css']
})
export class MoskitoAnalyzeChartComponent extends Widget implements OnInit, AfterViewInit {

  /**
   * List of charts to render.
   */
  charts: Chart[];

  /**
   * List of moskito-analyze chart configurations
   * from 'moskito-analyze.json'
   */
  chartsConfig: MoskitoAnalyzeChart[];

  /**
   * Indicates whether charts data was loaded.
   */
  chartsDataLoaded: boolean;

  /**
   * Indicates whether chart boxes were initialized.
   */
  chartBoxesInitialized: boolean;

  /**
   * Reference to the fullscreen chart.
   */
  fullscreenChart: Chart;

  /**
   * Is data currently loading.
   */
  isLoading: boolean;

  /**
   * Reference to chart boxes.
   */
  @ViewChildren('chart_box')
  boxes: QueryList<ElementRef>;


  constructor(
    public moskitoAnalyze: MoskitoAnalyzeService,
    private application: MoskitoApplicationService,
    private moskitoAnalyzeRestService: MoskitoAnalyzeRestService,
    private chartService: ChartService,
    private cdr: ChangeDetectorRef,
    private modal: NgbModal
  ) {
    super();

    this.chartsDataLoaded = false;
    this.chartBoxesInitialized = false;
    this.isLoading = false;

    this.charts = [];
    this.chartsConfig = [];
  }

  ngOnInit() {
    this.application.dataRefreshEvent.subscribe(() => this.refresh());
    this.application.applicationChangedEvent.subscribe(() => this.createBoxes());

    this.loadChartsConfig();
  }

  ngAfterViewInit(): void {
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

  openChartConfigurationModal(action: string)
  openChartConfigurationModal(action: string, chart?: MoskitoAnalyzeChart) {
    const modalRef = this.modal.open(MoskitoAnalyzeChartConfigurationModalComponent, { windowClass: 'in custom-modal' });
    modalRef.componentInstance.chart = chart ? chart : new MoskitoAnalyzeChart();
    modalRef.componentInstance.action = action;

    modalRef.componentInstance.onChartConfigurationUpdate.subscribe((updatedChart: MoskitoAnalyzeChart) => this.updateChart(updatedChart));
    modalRef.componentInstance.onChartConfigurationCreate.subscribe((newChart: MoskitoAnalyzeChart) => this.createChart(newChart));
  }

  /**
   * Creates new chart and loads data for chart.
   * @param chart {@link MoskitoAnalyzeChart}.
   */
  createChart(chart: MoskitoAnalyzeChart) {
    this.moskitoAnalyzeRestService.createMoskitoAnalyzeChart(chart).subscribe(() => {
      this.chartsConfig.push(chart);
      this.cdr.detectChanges();

      this.retrieveChartData(chart, () => {
        const chartIndex = this.chartsConfig.length - 1;
        const chartBoxes = this.boxes.toArray();

        this.chartService.initializeChart(this.charts[chartIndex], chartBoxes[chartIndex]);
      });
    });
  }

  /**
   * Updates existing chart.
   * @param chart {@link MoskitoAnalyzeChart}.
   */
  updateChart(chart: MoskitoAnalyzeChart) {
    this.moskitoAnalyzeRestService.updateMoskitoAnalyzeChart(chart).subscribe(() => {
      // Finding chart index in array
      const chartIndex = this.chartsConfig.findIndex((c: MoskitoAnalyzeChart) => {
        return c.id === chart.id;
      });

      // Replacing chart configuration
      this.chartsConfig[chartIndex] = chart;
      this.cdr.detectChanges();

      // Loading chart data for updated configuration
      this.retrieveChartData(chart, () => {

        // TODO: Chart refresh won't work
        const chartBoxes = this.boxes.toArray();
        this.chartService.initializeChart(this.charts[chartIndex], chartBoxes[chartIndex]);
      });
    });
  }

  /**
   * Removes chart and reloads config.
   * @param chart {@link MoskitoAnalyzeChart}.
   */
  removeChart(chart: MoskitoAnalyzeChart) {
    this.moskitoAnalyzeRestService.removeMoskitoAnalyzeChart(chart).subscribe(() => {
      const chartIndex = this.chartsConfig.findIndex((c: MoskitoAnalyzeChart) => {
        return c.id === chart.id;
      });

      this.chartsConfig.splice(chartIndex, 1);
    });
  }

  /**
   * On click listener for charts. Toggles 'fullscreen' mode for charts.
   * @param event {@link Event}
   * @param chart Chart reference.
   */
  onChartClick(event, chart) {
    const target = event.currentTarget;

    const body = document.querySelector('body');
    const svg = target.querySelector('svg');

    // Getting first non fullscreen box to copy width and height
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

  /**
   * Creates chart boxes and loads data for them.
   */
  public createBoxes() {
    this.retrieveChartsData();
  }

  /**
   * Refreshes Moskito-Analyze charts data.
   */
  public refresh() {
    this.retrieveChartsData(() => {
      this.refreshCharts(this.charts, this.boxes.toArray());
    });
  }

  /**
   * Gets Moskito-Analyze charts configuration (moskito-analyze.json).
   */
  private loadChartsConfig() {
    // Retrieving charts configuration for further request on moskito-analyze
    this.moskitoAnalyzeRestService.getChartsConfig().subscribe((chartsConfig) => {
      const charts = [];

      chartsConfig.forEach((conf) => {
        const chart = new MoskitoAnalyzeChart();

        chart.id = UUID.UUID();
        chart.caption = conf.caption;
        chart.name = conf.name;
        chart.interval = conf.interval;
        chart.type = conf.type;
        chart.hosts = conf.hosts;
        chart.producer = conf.producer;
        chart.stat = conf.stat;
        chart.value = conf.value;

        chart.startDate = new Date(conf.startDate);
        chart.endDate = new Date(conf.endDate);

        charts.push(chart);
      });

      this.moskitoAnalyze.chartsConfig = charts;
      this.chartsConfig = charts;

      this.cdr.detectChanges();

      // After charts parameters retrieved send request to Moskito-Analyze
      // to get chart data itself.
      const chartBoxes = this.boxes.toArray();
      for (let i = 0; i < this.chartsConfig.length; i++) {
        const chart = this.chartsConfig[i];
        this.retrieveChartData(chart, () => {
          this.chartService.initializeChart(this.charts[i], chartBoxes[i]);
        });
      }
    });
  }

  private retrieveChartData(chartConfig: MoskitoAnalyzeChart, afterLoad = () => { }) {
    chartConfig.loading = true;
    this.moskitoAnalyzeRestService.getChartsDataForPeriod(chartConfig.type, this.moskitoAnalyzeRestService.buildChartRequest(chartConfig)).subscribe((data) => {
      const chart = new Chart();
      chart.name = chartConfig.caption;

      // Going through charts data response to get point values
      chart.points = [];
      chart.lineNames = [];

      for (const chartData of data) {
        const chartPoint = new ChartPoint();

        const pointValues = [];
        for (const value of chartData.values) {
          for (const lineName in value) {
            if (value.hasOwnProperty(lineName)) {
              // If no such line in array, add it
              if (chart.lineNames.indexOf(lineName) === -1) {
                // First we should render default line and next baseline
                // Order in array is important
                if (lineName.indexOf('baseline') === -1) {
                  chart.lineNames.unshift(lineName);
                } else {
                  chart.lineNames.push(lineName);
                }
              }

              // Add value in position, where appropriate line name is stored
              pointValues.splice(chart.lineNames.indexOf(lineName), 0, value[lineName]);
            }
          }
        }

        chartPoint.values = pointValues;
        chartPoint.timestamp = chartData.millis;

        chart.points.push(chartPoint);
      }

      // Finding chart config index in array as it is the same as in charts array
      const id = this.chartsConfig.findIndex(
        (c: MoskitoAnalyzeChart) => c.id === chartConfig.id
      );

      // Replacing chart
      if (id >= 0) {
        this.charts[id] = chart;
      } else {
        this.charts.push(chart);
      }

      this.isLoading = false;
      this.chartsDataLoaded = true;

      chartConfig.loading = false;

      afterLoad();
    });
  }

  /**
   * Retrieves Moskito-Analyze charts data and calls afterLoad function
   * after successful data load.
   *
   * @param afterLoad Function to call after successful charts data load.
   */
  private retrieveChartsData(afterLoad = () => { }) {
    for (const chart of this.chartsConfig) {
      this.retrieveChartData(chart, afterLoad);
    }
  }
}
