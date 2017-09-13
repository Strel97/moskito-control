import { Component, OnInit } from '@angular/core';
import { Widget } from 'app/content/widgets/widget.model';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';


@Component({
  selector: 'app-tv-widget',
  templateUrl: './tv-widget.component.html'
})
export class TvWidgetComponent extends Widget implements OnInit {

  status: string;


  constructor(private moskitoApplicationService: MoskitoApplicationService) {
    super();
  }

  ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => this.refresh());
    this.refresh();
  }

  public refresh() {
    this.status = this.moskitoApplicationService.currentApplication.applicationColor;
  }
}
