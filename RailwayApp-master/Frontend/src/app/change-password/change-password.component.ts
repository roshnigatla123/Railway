import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpWebService } from '../http-web.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Validators } from '@angular/forms';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  private RouterCheck: any;
  userid: any;
  data: string;
  email: string;
  password: string;
  cpassword: string;
  validate: any = true;
  errorDetl: any;




  constructor(private Activatedroute: ActivatedRoute, private httpWebService: HttpWebService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.RouterCheck = this.Activatedroute.params
      .subscribe(params => {
        this.userid = params['id'];
      });

    this.RouterCheck = this.Activatedroute.params
      .subscribe(params => {
        this.data = params['shortner'];
      });

    this.httpWebService.validatePasswordChangeRequest(this.userid, this.data)
      .subscribe(resp => {
        const response = resp;
        if (response.status === '403') {
          this.router.navigate(['forbidden']);
        }
      });
  }

  resolved(captchaResponse: string) {
    if (captchaResponse != null) {
      document.getElementById('signin').classList.remove('hidebutt');
    } else {
      document.getElementById('signin').classList.add('hidebutt');
    }
  }


  verifyUser() {
    if (this.password == null || this.password === '') {

        this.errorDetl = 'Enter a Valid password.';
        this.validate = false;
      } else {
          if (this.cpassword == null || this.cpassword === '') {
          this.errorDetl = 'Enter a Valid password.';
          this.validate = false;
          } else {
            if (this.password !== this.cpassword) {
              this.errorDetl = 'Enter a Valid password.';
              this.validate = false;
            }
          }
      }

      if (this.validate) {
        this.httpWebService.updatePasswordRequest(this.userid, this.data, this.password)
          .subscribe(resp => {
            if (resp.status === '200') {
              this.errorDetl = 'Well done! You successfully updated your password!';
              // tslint:disable-next-line:max-line-length
              this.httpWebService.createNotification(this.userid, 'Password Change Successful', this.errorDetl + ' If you did not request this change immediately contact us at support@irctc.in');
            } else {
              this.errorDetl = 'Sorry! Password updation failed!';
              // tslint:disable-next-line:max-line-length
              this.httpWebService.createNotification(this.userid, 'Password Change Failed', this.errorDetl + ' If you did not request this change immediately contact us at support@irctc.in');
            }
          });
      }
  }

}
