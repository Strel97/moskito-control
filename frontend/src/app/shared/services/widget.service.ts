import { Injectable } from '@angular/core';


@Injectable()
export class WidgetService {

  private widgets = {
    'status': {
      name: 'status',
      component: 'MoskitoComponentsWidget',
      displayName: 'Status',
      className: 'statuses',
      icon: 'fa fa-adjust',
      enabled: false
    },
    'tv': {
      name: 'tv',
      component: 'TvWidget',
      displayName: 'TV',
      className: 'tv',
      icon: 'fa fa-smile-o',
      enabled: false
    },
    'charts': {
      name: 'charts',
      component: 'ChartsWidget',
      displayName: 'Charts',
      className: 'charts',
      icon: 'fa fa-bar-chart-o',
      enabled: true
    },
    'history': {
      name: 'history',
      component: 'HistoryWidget',
      displayName: 'History',
      className: 'history',
      icon: 'fa fa-bars',
      enabled: true
    },
    'statusBeta': {
      name: 'statusBeta',
      component: 'MoskitoBetaComponentsWidget',
      displayName: 'Status (beta)',
      className: 'statuses',
      icon: 'fa fa-adjust',
      enabled: true
    }
  };


  constructor() { }

  public isWidgetEnabled(widget: string): boolean {
    return this.widgets[widget] && this.widgets[widget].enabled;
  }

  public setWidgetEnabled(widget: string, enabled: boolean) {
    if (this.widgets[widget]) {
      this.widgets[widget].enabled = enabled;
    }
  }

  public toggleWidgetEnabled(widget: string) {
    if (this.widgets[widget]) {
      this.widgets[widget].enabled = !this.widgets[widget].enabled;
    }
  }

  public hideWidget(widget: string) {
    if (this.widgets[widget]) {
      this.widgets[widget].enabled = false;
    }
  }

  public showWidget(widget: string) {
    if (this.widgets[widget]) {
      this.widgets[widget].enabled = true;
    }
  }

  public getWidgets() {
    return this.widgets;
  }
}
