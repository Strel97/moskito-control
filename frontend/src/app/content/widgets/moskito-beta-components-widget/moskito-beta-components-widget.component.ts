import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Widget } from 'app/content/widgets/widget.model';
import { Chart } from 'app/shared/models/chart';
import { Connector } from 'app/shared/models/connector';
import { MoskitoApplication } from 'app/shared/models/moskito-application';
import { MoskitoComponent } from 'app/shared/models/moskito-component';
import { Threshold } from 'app/shared/models/threshold';
import { MoskitoComponentUtils } from 'app/shared/moskito-component-utils';
import { CategoriesService } from 'app/shared/services/categories.service';
import { ChartService } from 'app/shared/services/chart.service';
import { HttpService } from 'app/shared/services/http.service';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
import { StatusService } from 'app/shared/services/status.service';
declare const SetupComponentsView: any;


interface ComponentMap {
  [component: string]: any;
}

@Component({
  selector: 'app-beta-components-widget',
  templateUrl: './moskito-beta-components-widget.component.html'
})
export class MoskitoBetaComponentsWidgetComponent extends Widget implements OnInit, AfterViewInit {

  currentApplication: MoskitoApplication;

  components: MoskitoComponent[];
  categories: any;

  componentUtils: MoskitoComponentUtils;

  connector: Connector;
  thresholds: Threshold[];
  accumulatorNames: string[];
  accumulatorCharts: Chart[];

  isLoading: boolean;

  private checkedAccumulatorsMap: ComponentMap;
  private accumulatorChartsMap: ComponentMap;
  private accumulatorChartsDataLoaded: boolean;

  @ViewChildren('chart_box')
  chartBoxes: QueryList<ElementRef>;

  @ViewChildren('componentInspectionModal')
  inspectionModals: QueryList<ElementRef>;


  constructor(
    private httpService: HttpService,
    private moskitoApplicationService: MoskitoApplicationService,
    public categoriesService: CategoriesService,
    public statusService: StatusService,
    private chartService: ChartService
  ) {
    super();
    this.componentUtils = MoskitoComponentUtils;
    this.resetAccumulatorsData();
  }

  ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => {
      this.refresh();
      this.resetAccumulatorsData();
    });

    this.refresh();
  }

  ngAfterViewInit(): void {
    this.chartBoxes.changes.subscribe(( boxes ) => {
      if (this.accumulatorChartsDataLoaded) {
        this.initializeCharts(this.accumulatorCharts);
      }
    });
  }

  getComponentInspectionModalData( componentName: string ) {
     this.resetComponentInspectionData();

    // Getting component's connector information
    this.httpService.getConnectorConfiguration( this.currentApplication.name, componentName ).subscribe(
      ( connector ) => {
        this.connector = connector;

        // Loading data for the first available tab
        if (connector) {
          if (connector.supportsThresholds) {
            this.loadThresholdsData( componentName );
          } else if (connector.supportsAccumulators) {
            this.loadAccumulatorsData( componentName );
          } else if (connector.supportsInfo) {
            this.loadConnectorInformation( componentName );
          }
        }
      },
      ( error ) => {
        console.error('Can\'t obtain connector for component %s: %s', componentName, error);
      }
    );
  }

  public loadThresholdsData( componentName ) {
    if (this.connector.supportsThresholds) {
      this.isLoading = true;
      this.httpService.getThresholds(this.currentApplication.name, componentName).subscribe((thresholds) => {
        this.thresholds = thresholds;
        this.isLoading = false;
      });
    }
  }

  public loadAccumulatorsData( componentName ) {
    if (this.connector.supportsAccumulators) {
      this.isLoading = true;
      this.httpService.getAccumulatorNames(this.currentApplication.name, componentName).subscribe((names) => {
        this.accumulatorNames = names;
        this.isLoading = false;
      });

      // Getting checked accumulator charts
      this.accumulatorCharts = this.accumulatorChartsMap[componentName];
    }
  }

  public loadConnectorInformation( componentName ) {
    if (this.connector.supportsInfo) {
      this.isLoading = true;
      this.httpService.getConnectorInformation(this.currentApplication.name, componentName).subscribe((connector) => {
        if (connector && connector.info) {
          const filteredInformation = {};
          for (const key of Object.keys(connector.info)) {
            if (connector.info.hasOwnProperty(key) && connector.info[key] && connector.info[key] !== 'null') {
              filteredInformation[key] = connector.info[key];
            }
          }

          this.connector.info = filteredInformation;
          this.isLoading = false;
        }
      });
    }
  }

  public toggleAccumulatorChart( event, componentName: string, accumulatorName: string ) {
    const currentApp = this.moskitoApplicationService.currentApplication;
    if (!currentApp) {
      return;
    }

    // Toggling accumulator charts
    const showChart = event.target.checked;

    // Initializing accumulator names array
    if (!this.checkedAccumulatorsMap[componentName]) {
      this.checkedAccumulatorsMap[componentName] = [];
    }

    if (showChart) {
      // If checkbox is checked and there is no accumulator in list, add it
      if (this.checkedAccumulatorsMap[componentName].indexOf(accumulatorName, 0) === -1) {
        this.checkedAccumulatorsMap[componentName].push(accumulatorName);
      }
    } else {
      // Removing accumulator name from list if checkbox is unchecked
      const index = this.checkedAccumulatorsMap[componentName].indexOf(accumulatorName, 0);
      if (index > -1) {
        this.checkedAccumulatorsMap[componentName].splice(index, 1);
      }
    }

    this.httpService.getAccumulatorCharts( currentApp.name, componentName, this.checkedAccumulatorsMap[componentName] ).subscribe(( charts ) => {
      this.accumulatorCharts = charts;
      this.accumulatorChartsMap[componentName] = charts;

      this.accumulatorChartsDataLoaded = true;
    });

    // Scroll top
    this.inspectionModals.forEach((modal: ElementRef) => {
      const modalContent = modal.nativeElement.querySelector('.modal-body');
      if (modalContent) { modalContent.scrollTop = 0; }
    });
  }

  public initializeCharts(charts: Chart[]) {
    if (!charts) {
      return;
    }

    for (const chart of charts) {
      const chartBox = this.chartBoxes.find((element) => {
        return element.nativeElement.id === chart.divId;
      });

      this.chartService.initializeChart(chart, chartBox);
    }
  }

  public resetComponentInspectionData() {
    this.connector = null;
    this.thresholds = [];
    this.accumulatorNames = [];
    this.accumulatorCharts = [];
  }

  public resetAccumulatorsData() {
    this.checkedAccumulatorsMap = {};
    this.accumulatorChartsMap = {};
    this.accumulatorChartsDataLoaded = false;
  }

  public refresh() {
    this.currentApplication = this.moskitoApplicationService.currentApplication;
    this.components = this.moskitoApplicationService.currentApplication.components;
    this.categories = MoskitoComponentUtils.orderComponentsByCategories(this.components);

    // Initialize drag-n-drop and tooltips for components
    setTimeout(() => {
      SetupComponentsView();
    }, 1000);
  }
}
