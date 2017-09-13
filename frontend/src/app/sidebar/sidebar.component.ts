import { Component, OnInit } from '@angular/core';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  version: string;
  configToggle: boolean;


  constructor(private moskitoApplicationService: MoskitoApplicationService) {
  }


  public ngOnInit(): void {
    this.version = this.moskitoApplicationService.version;
    this.configToggle = this.moskitoApplicationService.configToggle;
  }
}
