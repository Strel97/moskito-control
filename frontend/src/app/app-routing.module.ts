import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "app/home/home.component";
import { NgModule } from "@angular/core";
import { ConfigurationComponent } from "app/configuration/configuration.component";
import { ConfigurationViewerComponent } from "app/configuration/view/configuration-viewer.component";
import { ConfigurationEditorComponent } from "app/configuration/edit/configuration-editor.component";


const routes: Routes = [
  {
    path: 'beta',
    component: HomeComponent/*,
    children: [
      {
        path: '',
        loadChildren: 'app/content/content.module#ContentModule'
      }
    ]*/
  },
  {
    path: 'configuration',
    // loadChildren: 'app/configuration/configuration.module#ConfigurationModule'
    component: ConfigurationComponent,
    children: [
      { path: 'view', component: ConfigurationViewerComponent },
      { path: 'edit', component: ConfigurationEditorComponent }
    ]
  },
  {
    path: '',
    redirectTo: '/beta',
    pathMatch: 'full'
  }
];

/**
 * @author strel
 */
@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
