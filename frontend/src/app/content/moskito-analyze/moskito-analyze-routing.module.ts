import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MoskitoAnalyzeComponent } from "app/content/moskito-analyze/moskito-analyze.component";


const routes: Routes = [
  {
    path: '',
    component: MoskitoAnalyzeComponent
  }
];

/**
 * @author strel
 */
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MoskitoAnalyzeRoutingModule { }
