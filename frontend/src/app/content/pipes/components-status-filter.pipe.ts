import { Pipe, PipeTransform } from '@angular/core';
import { MoskitoComponent } from 'app/shared/models/moskito-component';


/**
 * Components pipe used to filter components by
 * specified health status. Filter is triggered by scan column
 * item toggles in Statistics section.
 *
 * @author strel
 */
@Pipe({ name: 'componentsByStatusFilter' })
export class ComponentsStatusFilterPipe implements PipeTransform {

  /**
   * Filters Moskito components by specified health status.
   * If status name is empty, filter is bypassed.
   *
   * @param components List of Moskito components to filter
   * @param status Health status used as filter
   * @returns List of filtered Moskito components
   */
  transform(components: MoskitoComponent[], status?: string): MoskitoComponent[] {
    if (!components) {
      return [];
    }

    if (!status) {
      return components;
    }

    const filteredComponents = [];

    for (const component of components) {
      if (component.color === status) {
        filteredComponents.push(component);
      }
    }

    return filteredComponents;
  }
}
