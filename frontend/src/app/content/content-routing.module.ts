import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContentComponent } from "./content.component";


const routes: Routes = [
  {
    path: 'applications/:app',
    component: ContentComponent
  },
  {
    path: 'moskito-analyze',
    loadChildren: 'app/content/moskito-analyze/moskito-analyze.module#MoskitoAnalyzeModule'
  }
];

/**
 * @author strel
 */
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ContentRoutingModule { }
