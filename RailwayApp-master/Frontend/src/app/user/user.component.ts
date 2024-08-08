import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from '../http-web.service';


import { NavpanelComponent } from '../navpanel/navpanel.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user = '';

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    if (window.sessionStorage.getItem('auth-token') != null) {
      this._httpWebService.verifyUserLogin(window.sessionStorage.getItem('auth-token'))
      .subscribe(resp => {
        const userData = resp;
        if (userData.status === '403') {
          this.router.navigate(['#']);
        } else {
          if (userData.route === '/user') {
            this.router.navigate(['user']);
            this._httpWebService.signInDetails()
              .subscribe( respd => {
                if (respd.status === '200') {
                  this.user = respd.firstName;

                }
              });

          } else {
            this.router.navigate(['admin']);
          }
        }
      });
    } else {
      this.router.navigate(['']);
    }



  }

  logout() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['']);
  }

}
