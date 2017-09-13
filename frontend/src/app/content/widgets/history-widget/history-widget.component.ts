import { Component, OnInit } from '@angular/core';
import { Widget } from 'app/content/widgets/widget.model';
import { HistoryItem } from 'app/shared/models/history-item';
import { CategoriesService } from 'app/shared/services/categories.service';
import { HttpService } from 'app/shared/services/http.service';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
import { StatusService } from 'app/shared/services/status.service';


@Component({
  selector: 'app-history-widget',
  templateUrl: './history-widget.component.html'
})
export class HistoryWidgetComponent extends Widget implements OnInit {

  historyItems: HistoryItem[];


  constructor(private httpService: HttpService,
              private moskitoApplicationService: MoskitoApplicationService,
              public categoriesService: CategoriesService,
              public statusService: StatusService) { super(); }

  ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => this.refresh());

    this.refresh();
  }

  public refresh() {
    // Getting list of history items for given application
    this.httpService.getApplicationHistory(this.moskitoApplicationService.currentApplication.name).subscribe((historyItems) => {
      this.historyItems = [];

      for (const historyItem of historyItems) {
        const item = new HistoryItem();
        item.component = this.moskitoApplicationService.getComponent(historyItem.componentName);
        item.oldStatus = historyItem.oldStatus;
        item.newStatus = historyItem.newStatus;
        item.timestamp = historyItem.timestamp;
        item.isoTimestamp = historyItem.isoTimestamp;
        item.oldMessages = historyItem.oldMessages;
        item.newMessages = historyItem.newMessages;

        this.historyItems.push(item);
      }
    });
  }
}
