import { Component, OnInit } from '@angular/core';
import { MoskitoCategory } from 'app/shared/models/moskito-category';
import { CategoriesService } from 'app/shared/services/categories.service';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';


@Component({
  selector: 'app-categories-filter',
  templateUrl: './categories-filter.component.html'
})
export class CategoriesFilterComponent implements OnInit {

  categories: MoskitoCategory[];


  constructor(private moskitoApplicationService: MoskitoApplicationService, private categoriesService: CategoriesService) {
  }


  public ngOnInit() {
    this.moskitoApplicationService.dataRefreshEvent.subscribe(() => this.refresh());
    this.moskitoApplicationService.applicationChangedEvent.subscribe(() => this.refresh());
    this.refresh();
  }

  public refresh() {
    this.categories = this.categoriesService.getCategories();
  }

  public setFilter(category: MoskitoCategory) {
    this.categoriesService.setFilter(category);
  }
}
