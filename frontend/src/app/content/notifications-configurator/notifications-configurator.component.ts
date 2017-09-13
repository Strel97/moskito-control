import { Component } from '@angular/core';
import { HttpService } from 'app/shared/services/http.service';


@Component({
  selector: 'app-notifications-configurator',
  templateUrl: './notifications-configurator.component.html'
})
export class NotificationsConfiguratorComponent {

  notificationsMuted: boolean;
  notificationsMutingTime: number;
  notificationsRemainingMutingTime: number;


  constructor(private httpService: HttpService) {
    this.notificationsMuted = false;
    this.notificationsMutingTime = 60;
    this.notificationsRemainingMutingTime = 0;
  }


  public muteNotifications() {
    if (this.notificationsMuted) {
      return;
    }

    this.notificationsMuted = true;
    this.notificationsMutingTime = 60;
    this.notificationsRemainingMutingTime = 60;

    this.httpService.muteNotifications();

    // Starting timer
    this.timerTick();
  }

  public unmuteNotifications() {
    this.notificationsMuted = false;
    this.notificationsMutingTime = 60;
    this.notificationsRemainingMutingTime = 0;

    this.httpService.unmuteNotifications();
  }

  private timerTick() {
    setTimeout(() => {
      if (!this.notificationsMuted) { return; }

      this.notificationsRemainingMutingTime--;
      if (this.notificationsRemainingMutingTime > 0) {
        this.timerTick();
      } else {
        this.unmuteNotifications();
      }
    }, 60000);
  }
}
