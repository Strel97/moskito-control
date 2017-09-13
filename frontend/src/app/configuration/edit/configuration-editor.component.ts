import { Component, Input, OnInit } from '@angular/core';
import { MoskitoAnalyzeRestService } from 'app/content/moskito-analyze/services/moskito-analyze-rest.service';
import { HttpService } from 'app/shared/services/http.service';


@Component({
  selector: 'app-configuration-editor',
  templateUrl: './configuration-editor.component.html',
  styleUrls: ['./configuration-editor.component.css']
})
export class ConfigurationEditorComponent implements OnInit {

  configuration: any;
  text: string;
  options: any = { maxLines: 1000, printMargin: false };

  @Input()
  analyzeMode: boolean;


  constructor(
    private analyzeRest: MoskitoAnalyzeRestService,
    private rest: HttpService
  ) { }

  ngOnInit() {
    if (this.analyzeMode) {
      this.analyzeRest.getPrettyMoskitoAnalyzeConfig().subscribe((configuration) => {
        this.configuration = configuration;
        this.text = JSON.stringify(this.configuration, undefined, 2);
      });
    } else {
      this.rest.getPrettyMoskitoConfiguration().subscribe((configuration) => {
        this.configuration = configuration;
        this.text = JSON.stringify(this.configuration, undefined, 2);
      });
    }
  }

  onChange(event: Event) {

  }
}
