import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeysPipe } from 'app/shared/pipes/keys.pipe';
import { SanitizeHtmlPipe } from 'app/shared/pipes/sanitarize-html.pipe';
import { CategoriesService } from 'app/shared/services/categories.service';
import { ChartService } from 'app/shared/services/chart.service';
import { HttpService } from 'app/shared/services/http.service';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
import { StatusService } from 'app/shared/services/status.service';
import { WidgetService } from 'app/shared/services/widget.service';
import { TimerComponent } from './timer/timer.component';


export const providers = [
  CategoriesService,
  ChartService,
  HttpService,
  MoskitoApplicationService,
  StatusService,
  WidgetService
];


@NgModule({
   declarations: [
     TimerComponent,

     // Pipes
     KeysPipe,
     SanitizeHtmlPipe
   ],
   exports: [
     // Components
     TimerComponent,

     // Pipes
     KeysPipe,
     SanitizeHtmlPipe
   ],
   imports: [
     BrowserModule
   ],
   providers: [],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...providers]
    };
  }
}
