import { Component, OnInit } from '@angular/core';
import { Widget } from 'app/content/widgets/widget.model';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
import { WidgetService } from 'app/shared/services/widget.service';


@Component({
  selector: 'app-widgets-toggle',
  templateUrl: './widgets-toggle.component.html'
})
export class WidgetsToggleComponent implements OnInit {

  widgets: Widget[];


  constructor(private widgetService: WidgetService, private moskitoApplicationService: MoskitoApplicationService) { }

  ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => this.refresh());
    this.refresh();
  }

  public refresh() {
    this.widgets = [];
    const widgetDictionary = this.widgetService.getWidgets();

    for (const widgetName of Object.keys(widgetDictionary)) {
      this.widgets.push(widgetDictionary[widgetName]);
    }
  }

  toggleWidget(widget: Widget) {
    this.widgetService.toggleWidgetEnabled(widget.name);
  }

  isWidgetEnabled(widget: Widget): boolean {
    return this.widgetService.isWidgetEnabled(widget.name);
  }
}
