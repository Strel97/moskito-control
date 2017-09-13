import { EventEmitter, Injectable } from '@angular/core';
import { MoskitoApplication } from 'app/shared/models/moskito-application';
import { MoskitoComponent } from 'app/shared/models/moskito-component';


@Injectable()
export class MoskitoApplicationService {

  version = '1.1.1-SNAPSHOT';
  configToggle = false;

  applications: MoskitoApplication[];
  currentApplication: MoskitoApplication;

  /**
   * Indicates whether MoSKito-Analyze tab is selected.
   */
  moskitoAnalyzeMode: boolean;

  dataRefreshEvent: EventEmitter<void>;
  applicationChangedEvent: EventEmitter<void>;

  /**
   * Analog of java {@code pageContext.request.contextPath}.
   * Contains name of tomcat web application.
   */
  private applicationContextPath: string;


  constructor() {
    this.dataRefreshEvent = new EventEmitter<void>();
    this.applicationChangedEvent = new EventEmitter<void>();
  }

  public refreshData() {
    this.dataRefreshEvent.emit();
  }

  public switchApplication(app: MoskitoApplication)  {
    if (!app) { return; }

    this.currentApplication = app;
    this.applicationChangedEvent.emit();
  }

  public setMoskitoAnalyzeMode(mode: boolean) {
    this.moskitoAnalyzeMode = mode;
  }

  public getComponent(componentName: string): MoskitoComponent {
    if (!componentName) { return; }

    for (const component of this.currentApplication.components) {
      if (component.name === componentName) {
        return component;
      }
    }

    return null;
  }

  public setApplicationContextPath(path: string) {
    this.applicationContextPath = path;
  }

  public getApplicationContextPath(): string {
    return this.applicationContextPath;
  }
}
