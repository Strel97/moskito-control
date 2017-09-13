import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Chart } from 'app/shared/models/chart';
import { MoskitoApplication } from 'app/shared/models/moskito-application';
import { MoskitoComponent } from 'app/shared/models/moskito-component';
import { Threshold } from 'app/shared/models/threshold';
import { ChartService } from 'app/shared/services/chart.service';
import { HttpService } from 'app/shared/services/http.service';


@Component({
  selector: 'app-component-inspection-modal',
  templateUrl: './component-inspection-modal.component.html'
})
export class ComponentInspectionModalComponent implements OnInit, AfterViewInit {

  @Input()
  application: MoskitoApplication;

  @Input()
  component: MoskitoComponent;

  thresholds: Threshold[];
  accumulatorNames: string[];
  accumulatorCharts: Chart[];
  checkedAccumulators: string[];

  accumulatorChartsDataLoaded: boolean;

  @ViewChildren('chart_box')
  chartBoxes: QueryList<ElementRef>;


  constructor(
    private httpService: HttpService,
    private chartService: ChartService
  ) {
  }

  ngOnInit() {
    // Getting list of thresholds
    this.httpService.getThresholds( this.application.name, this.component.name ).subscribe(( thresholds ) => {
      this.thresholds = thresholds;
    });

    // Getting list of accumulator names
    this.httpService.getAccumulatorNames( this.application.name, this.component.name ).subscribe(( names ) => {
      this.accumulatorNames = names;
    });

    this.accumulatorCharts = [];
    this.checkedAccumulators = [];
  }

  ngAfterViewInit(): void {
    this.chartBoxes.changes.subscribe(( boxes ) => {
      if (this.accumulatorChartsDataLoaded) {
        this.initializeCharts(this.accumulatorCharts, boxes.toArray());
      }
    });
  }

  public toggleAccumulatorChart( event, accumulatorName: string ) {
    // Toggling accumulator charts
    const showChart = event.target.checked;

    if (showChart) {
      // If checkbox is checked and there is no accumulator in list, add it
      if (this.checkedAccumulators.indexOf(accumulatorName, 0) === -1) {
        this.checkedAccumulators.push(accumulatorName);
      }
    } else {
      // Removing accumulator name from list if checkbox is unchecked
      const index = this.checkedAccumulators.indexOf(accumulatorName, 0);
      if (index > -1) {
        this.checkedAccumulators.splice(index, 1);
      }
    }

    this.httpService.getAccumulatorCharts( this.application.name, this.component.name, this.checkedAccumulators ).subscribe(( charts ) => {
      this.accumulatorCharts = charts;
      this.accumulatorChartsDataLoaded = true;
    });
  }

  public initializeCharts(charts: Chart[], chartBoxes: ElementRef[]) {
    if (!charts || !chartBoxes) {
      return;
    }

    for (let i = 0; i < charts.length; i++) {
      this.chartService.initializeChart(charts[i], chartBoxes[i]);
    }
  }
}
