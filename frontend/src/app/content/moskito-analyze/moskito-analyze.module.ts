import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { MoskitoAnalyzeComponent } from './moskito-analyze.component';
import { MoskitoAnalyzeRestService } from './services/moskito-analyze-rest.service';
import { MoskitoAnalyzeService } from './services/moskito-analyze.service';
import { MoskitoAnalyzeChartConfigurationModalComponent } from './widgets/moskito-analyze-chart/configuration-modal/ma-chart-configuration-modal.component';
import { MoskitoAnalyzeChartComponent } from './widgets/moskito-analyze-chart/moskito-analyze-chart.component';


@NgModule({
  declarations: [
    MoskitoAnalyzeComponent,
    MoskitoAnalyzeChartComponent,
    MoskitoAnalyzeChartConfigurationModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MultiselectDropdownModule
  ],
  exports: [
    MoskitoAnalyzeComponent
  ],
  providers: [
    MoskitoAnalyzeRestService,
    MoskitoAnalyzeService
  ],
  entryComponents: [
    MoskitoAnalyzeChartConfigurationModalComponent
  ]
})
export class MoskitoAnalyzeModule {
}
