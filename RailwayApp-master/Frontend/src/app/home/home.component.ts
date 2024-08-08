import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from '../http-web.service';



import { LoginComponent } from '../login/login.component';
import { WelcomeComponent } from '../welcome/welcome.component';


@Component({
  selector: 'app-home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
          } else {
            this.router.navigate(['admin']);
          }
        }
      });
    }

  }

}
