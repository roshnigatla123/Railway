import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


@Component({
  selector: 'app-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string;
  password: string;
  errors: any;
  validateStatus: boolean;
  errorDetl: string;

  private token: string;

    constructor(private _httpWebService: HttpWebService,  private router: Router) {
      this.validateStatus = false;
      this.errorDetl = '';
    }



    validateSignIn() {

        if (this.username != null) {
          if (EMAIL_REGEX.test(this.username)) {
              this.validateStatus = true;
          } else {
            document.getElementById('username').classList.add('invalid-input');
            document.getElementById('password').classList.add('invalid-input');
            this.validateStatus = false;
            this.errorDetl = 'Enter a valid email';
          }
        }else {
          document.getElementById('username').classList.add('invalid-input');
          document.getElementById('password').classList.add('invalid-input');
          this.validateStatus = false;
          this.errorDetl = 'Email is required';
        }

        if (this.validateStatus) {
          if (this.password == null) {
            document.getElementById('username').classList.add('invalid-input');
            this.errorDetl = 'Password is required';
            this.validateStatus = false;
          }else {
            this.validateStatus = true;
          }
        }

        // end of validation!!!!
      if (this.validateStatus) {
        this._httpWebService.getSignInConfirmation(this.username, this.password)
          .subscribe(resp => {
            const userData = resp;

            if (userData.status === '403') {
              this.errorDetl = 'We could not verify you! Please try again with a valid email';
            }else {

              if (userData.status === 401) {
                window.sessionStorage.setItem('identifier', userData.userid);
                this.router.navigate(['otp/userVerifyChallenge']);
              } else {
                this.token = userData.token;
                window.sessionStorage.setItem('userid', this.username);
                window.sessionStorage.setItem('auth-token', this.token);

                if (userData.route === '/user') {
                  this.router.navigate(['user']);
                } else {
                  this.router.navigate(['admin']);
                }

              }

            }


  // endo of subscribtion
          },
          error => {
              this.errors = error;
              this.router.navigate(['forbidden']);
          });
        }


  // end of function
  }

}
