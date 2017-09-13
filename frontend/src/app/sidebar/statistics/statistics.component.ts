import { Component, OnInit } from '@angular/core';
import { StatusStatistics } from 'app/shared/models/status-statistic';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
import { StatusService } from 'app/shared/services/status.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent implements OnInit {

  statistics: StatusStatistics[];


  constructor(private moskitoApplicationService: MoskitoApplicationService, private statusService: StatusService) { }

  public ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => this.refresh());
    this.refresh();
  }

  public refresh() {
    this.statistics = [];

    const statsDictionary = StatusStatistics.getDefaultStatistics();
    for (const component of this.moskitoApplicationService.currentApplication.components) {
      if (!statsDictionary[component.color]) {
        statsDictionary[component.color] = 0;
      }

      statsDictionary[component.color] += 1;
    }

    // Transfer status dictionary to array of statistics objects
    for (const status of Object.keys(statsDictionary)) {
      this.statistics.push(new StatusStatistics(status, statsDictionary[status]));
    }
  }

  public setStatusFilter(status: string) {
    this.statusService.setFilter(status);
  }
}
