import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})
export class UserNotificationsComponent implements OnInit {

  notifications: any[] = [];
  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._httpWebService.viewNotifications()
      .subscribe(resp => {
          if (resp.length === 0) {
            document.getElementById('message').classList.remove('div-hidden');
            document.getElementById('message').classList.add('div-show');
          } else {
            document.getElementById('message').classList.remove('div-show');
            document.getElementById('message').classList.add('div-hidden');

            this.notifications = resp;
            this.notifications.forEach((notify) => {
              notify.dateOfCreation = new Date(notify.dateOfCreation * 1);
            });
          }
      });
  }

  read(item) {
    this._httpWebService.readNotification(item._id, item.userid);
    document.getElementById('notify_' + item._id).classList.add('div-hidden');
  }

}
