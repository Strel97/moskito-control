import { Pipe, PipeTransform } from '@angular/core';
import { HistoryItem } from 'app/shared/models/history-item';


/**
 * History items pipe used to filter history items by
 * specified component category. Filter is triggered by scan column
 * item toggles in Category section.
 *
 * @author strel
 */
@Pipe({ name: 'historyByCategoryFilter' })
export class HistoryCategoryFilterPipe implements PipeTransform {

  /**
   * Filters list of history items by specified component category.
   * If category name is empty, filter is bypassed.
   *
   * @param historyItems List of history items to filter
   * @param category Affected component category name used as filter
   * @returns List of filtered history items
   */
  transform(historyItems: HistoryItem[], category?: string): HistoryItem[] {
    if (!historyItems) {
      return [];
    }

    if (!category) {
      return historyItems;
    }

    const filteredHistoryItems = [];

    for (const item of historyItems) {
      if (item.component && item.component.category === category) {
        filteredHistoryItems.push(item);
      }
    }

    return filteredHistoryItems;
  }
}
