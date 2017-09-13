import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigurationModule } from 'app/configuration/configuration.module';
import { ContentComponent } from 'app/content/content.component';
import { MoskitoAnalyzeModule } from 'app/content/moskito-analyze/moskito-analyze.module';
import { NotificationsConfiguratorComponent } from 'app/content/notifications-configurator/notifications-configurator.component';
import { WidgetsModule } from 'app/content/widgets/widgets.module';
import { SharedModule } from 'app/shared/shared.module';


/**
 * @author strel
 */
@NgModule({
  declarations: [
    NotificationsConfiguratorComponent,
    ContentComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot(),

    MoskitoAnalyzeModule,
    WidgetsModule,

    ConfigurationModule
  ],
  exports: [
    ContentComponent
  ],
})
export class ContentModule { }
