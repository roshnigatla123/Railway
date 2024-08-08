import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../http-web.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  username = '';
  errorDetl = '';
  constructor(private httpWebService: HttpWebService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  verifyUser() {
    if (this.username != null || this.username !== '') {
      if (EMAIL_REGEX.test(this.username)) {
        this.httpWebService.sendPasswordChangeRequest(this.username);
        this.errorDetl = 'Message has been sent to your mobile for password change request.';
        // tslint:disable-next-line:max-line-length
        this.httpWebService.createNotification(this.username, 'Password Change Request', this.errorDetl + ' If you did not request this change immediately contact us at support@irctc.in');
      } else {
        this.errorDetl = 'Please enter a valid email.';
      }

    } else {
      this.errorDetl = 'Please enter a valid email.';
    }
  }

}
