import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CategoriesFilterComponent } from 'app/sidebar/categories-filter/categories-filter.component';
import { SidebarComponent } from 'app/sidebar/sidebar.component';
import { StatisticsComponent } from 'app/sidebar/statistics/statistics.component';
import { WidgetsToggleComponent } from 'app/sidebar/widgets-toggle/widgets-toggle.component';


/**
 * @author strel
 */
@NgModule({
  declarations: [
    CategoriesFilterComponent,
    StatisticsComponent,
    WidgetsToggleComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    SidebarComponent
  ],
})
export class SidebarModule { }
