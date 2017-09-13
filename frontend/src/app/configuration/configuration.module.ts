import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AceEditorModule } from 'ng2-ace-editor';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationEditorComponent } from './edit/configuration-editor.component';
import { ConfigurationViewerComponent } from './view/configuration-viewer.component';


/**
 * @author strel
 */
@NgModule({
  declarations: [
    ConfigurationViewerComponent,
    ConfigurationEditorComponent,
    ConfigurationComponent
  ],
  exports: [
    ConfigurationViewerComponent,
    ConfigurationEditorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,

    AceEditorModule
  ]
})
export class ConfigurationModule { }
