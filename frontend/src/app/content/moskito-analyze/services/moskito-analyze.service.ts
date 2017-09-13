import { Injectable } from '@angular/core';
import { MoskitoAnalyzeChart } from 'app/content/moskito-analyze/model/moskito-analyze-chart.model';


/**
 * Service containing configuration for MoSKito-Analyze.
 * @author strel
 */
@Injectable()
export class MoskitoAnalyzeService {

  /**
   * MoSKito-Analyze application URL.
   */
  public url: string;

  /**
   * Array of MoSKito-Analyze chart properties
   * used in requests to retrieve charts data.
   */
  public chartsConfig: MoskitoAnalyzeChart[];


  constructor() {
    this.chartsConfig = [];
  }


  /**
   * Formats date in format suitable for MoSKito-Analyze chart data request.
   * @param d Date
   * @returns {string} String in MoSKito-Analyze format
   */
  public formatDate(d: Date): string {
    if (!d) { return ''; }

    const year = d.getFullYear();
    const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

    const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  }

  /**
   * Returns default start date for MoSKito-Analyze requests
   * which is the beginning of the day.
   *
   * @returns {Date}
   */
  public getStartDate(): Date {
    const dayStart = new Date();
    dayStart.setHours(0);
    dayStart.setMinutes(0);
    dayStart.setSeconds(0);

    return dayStart;
  }

  /**
   * Returns default end date for MoSKito-Analyze requests
   * which is current time.
   *
   * @returns {Date}
   */
  public getEndDate(): Date {
    return new Date();
  }
}
