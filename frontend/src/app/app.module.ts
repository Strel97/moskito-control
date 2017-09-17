import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppComponent } from "app/app.component";
import { ConfigurationModule } from "app/configuration/configuration.module";
import { ConfigurationEditorComponent } from "app/configuration/edit/configuration-editor.component";
import { ContentModule } from "app/content/content.module";
import { HomeComponent } from "app/home/home.component";
import { SharedModule } from "app/shared/shared.module";
import { SidebarModule } from "app/sidebar/sidebar.module";


const appRoutes: Routes = [
  {
    path: 'beta',
    component: HomeComponent
  },
  {
    path: 'configuration',
    component: ConfigurationEditorComponent
  },
  {
    path: '',
    redirectTo: '/beta',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,

    SharedModule.forRoot(),
    ContentModule,
    SidebarModule,
    ConfigurationModule,

    // AppRoutingModule,

    // Angular bootstrap module
    NgbModule.forRoot(),

    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
