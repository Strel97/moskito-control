import { Injectable } from '@angular/core';
import { MoskitoCategory } from 'app/shared/models/moskito-category';
import { MoskitoComponentUtils } from 'app/shared/moskito-component-utils';
import { MoskitoApplicationService } from 'app/shared/services/moskito-application.service';
/**
 * Manages {MoskitoComponent} categories. Used to retrieve possible
 * categories from components and stores currently applied category filter.
 *
 * @author strel
 */
@Injectable()
export class CategoriesService {

  /**
   * Default category, indicating that component belongs to
   * all possible categories.
   */
  public defaultCategory = new MoskitoCategory('All Categories', true);

  /**
   * Moskito component category used as filter for
   * components and history items.
   */
  private filter: MoskitoCategory;


  constructor(private moskitoApplicationService: MoskitoApplicationService) {
    this.filter = this.defaultCategory;
  }


  /**
   * Builds list of all possible categories from
   * current application components.
   *
   * @returns {Array} current application categories
   */
  public getCategories(): MoskitoCategory[] {
    // Getting list of current application components
    const components = this.moskitoApplicationService.currentApplication.components;

    const categoriesDictionary = {};

    // Adding default category to dictionary
    this.defaultCategory.status = MoskitoComponentUtils.getWorthComponentStatus(components);
    this.defaultCategory.components = components;
    categoriesDictionary[this.defaultCategory.name] = this.defaultCategory;

    // Building categories for all components
    for (const component of components) {
      let category = categoriesDictionary[component.category];
      if (!category) {
        category = new MoskitoCategory();
        category.name = component.category;
        category.status = component.color;
        category.active = false;
        category.all = false;
        category.components = [];
      }

      // Changing category status to worth
      category.status = MoskitoComponentUtils.getWorthStatus([component.color, category.status]);
      category.components.push(component);

      categoriesDictionary[component.category] = category;
    }

    // Moving categories from dictionary to array
    const categories = [];
    for (const categoryName of Object.keys(categoriesDictionary)) {
      categories.push(categoriesDictionary[categoryName]);
    }

    return categories;
  }

  public resetFilter() {
    this.filter = this.defaultCategory;
  }

  public setFilter(filter: MoskitoCategory) {
    this.filter = filter;
  }

  public getFilter(): MoskitoCategory {
    return this.filter;
  }

  public getFilterString(): string {
    return this.filter === this.defaultCategory ? '' : this.filter.name;
  }
}
