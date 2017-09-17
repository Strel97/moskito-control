import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AceEditorModule } from "ng2-ace-editor";
import { ConfigurationComponent } from "./configuration.component";
import { ConfigurationEditorComponent } from "./edit/configuration-editor.component";
import { ConfigurationViewerComponent } from "./view/configuration-viewer.component";


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
    CommonModule,
    RouterModule,

    // ConfigurationRoutingModule,

    AceEditorModule
  ]
})
export class ConfigurationModule { }
