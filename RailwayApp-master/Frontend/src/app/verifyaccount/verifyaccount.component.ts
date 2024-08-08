import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';



@Component({
  selector: 'app-verifyaccount',
  templateUrl: './verifyaccount.component.html',
  styleUrls: ['./verifyaccount.component.css']
})
export class VerifyaccountComponent implements OnInit {
  otp: string;
  private obtainedotp: string;
  errors: any;
  validateStatus: boolean;
  errorDetl: string;
  mobile: string;

  constructor(private _httpWebService: HttpWebService, private router: Router) {
    this.validateStatus = false;
    this.errorDetl = '';
  }

  ngOnInit() {
  if (window.sessionStorage.getItem('identifier') == null) {
    this.router.navigate(['']);
  }else {
    this._httpWebService.createOTP(window.sessionStorage.getItem('identifier'))
      .subscribe( res => {
        const otpData = res;
        if (otpData.status === '403') {
          this.router.navigate(['']);
        } else {
          // success sends otp2mob, sessionid.
          window.sessionStorage.setItem('session_id', otpData.session_id);
          this.mobile = otpData.phone;
        }
      });
    }
  }



  verifyUser() {
    if ((this.otp != null) && (this.otp !== '')) {
        this.validateStatus = true;
    } else {
      this.errorDetl = 'Invalid OTP';
      this.validateStatus = false;
    }

    if (this.validateStatus) {
      // tslint:disable-next-line:max-line-length
      this._httpWebService.sendOTPVerification(window.sessionStorage.getItem('identifier'), window.sessionStorage.getItem('session_id'), this.otp)
        .subscribe(res => {
          const userData = res;
          console.log(userData);
          if ((userData.session_id === window.sessionStorage.getItem('session_id')) && ((userData.status === '200'))) {
            window.sessionStorage.clear();
            window.sessionStorage.setItem('verified', '200');
            this.router.navigate(['/verifiedOTP']);
          } else {
            this.errorDetl = 'Invalid OTP';
            this.validateStatus = false;
          }
      });
    }
}

}
