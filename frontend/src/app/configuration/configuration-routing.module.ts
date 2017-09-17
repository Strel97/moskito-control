import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ConfigurationComponent } from "app/configuration/configuration.component";
import { ConfigurationViewerComponent } from "app/configuration/view/configuration-viewer.component";
import { ConfigurationEditorComponent } from "app/configuration/edit/configuration-editor.component";


const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children: [
      { path: 'view', component: ConfigurationViewerComponent },
      { path: 'edit', component: ConfigurationEditorComponent }
    ]
  }
];

/**
 * @author strel
 */
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ConfigurationRoutingModule { }
