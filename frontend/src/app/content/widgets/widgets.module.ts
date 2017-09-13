import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsCategoryFilterPipe } from 'app/content/pipes/components-category-filter.pipe';
import { ComponentsStatusFilterPipe } from 'app/content/pipes/components-status-filter.pipe';
import { HistoryCategoryFilterPipe } from 'app/content/pipes/history-category-filter.pipe';
import { HistoryStatusFilterPipe } from 'app/content/pipes/history-status-filter.pipe';
import { ChartsWidgetComponent } from 'app/content/widgets/charts-widget/charts-widget.component';
import { ComponentInspectionModalComponent } from 'app/content/widgets/component-inspection-modal/component-inspection-modal.component';
import { HistoryWidgetComponent } from 'app/content/widgets/history-widget/history-widget.component';
import { MoskitoBetaComponentsWidgetComponent } from 'app/content/widgets/moskito-beta-components-widget/moskito-beta-components-widget.component';
import { MoskitoComponentsWidgetComponent } from 'app/content/widgets/moskito-components-widget/moskito-components-widget.component';
import { TvWidgetComponent } from 'app/content/widgets/tv-widget/tv-widget.component';
import { SharedModule } from 'app/shared/shared.module';


/**
 * @author strel
 */
@NgModule({
  declarations: [
    ChartsWidgetComponent,
    ComponentInspectionModalComponent,
    HistoryWidgetComponent,
    MoskitoBetaComponentsWidgetComponent,
    MoskitoComponentsWidgetComponent,
    TvWidgetComponent,

    // Pipes
    ComponentsCategoryFilterPipe,
    ComponentsStatusFilterPipe,
    HistoryCategoryFilterPipe,
    HistoryStatusFilterPipe
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot()
  ],
  exports: [
    ChartsWidgetComponent,
    HistoryWidgetComponent,
    MoskitoBetaComponentsWidgetComponent,
    MoskitoComponentsWidgetComponent,
    TvWidgetComponent
  ],
})
export class WidgetsModule { }
