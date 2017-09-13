import { Component, OnInit } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';


@Component({
  selector: 'app-configuration-viewer',
  templateUrl: './configuration-viewer.component.html',
  styleUrls: ['./configuration-viewer.component.css']
})
export class ConfigurationViewerComponent implements OnInit {

  configuration: any;


  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.httpService.getMoskitoConfiguration().subscribe(( configuration ) => {
      this.configuration = configuration;
    });
  }
}
