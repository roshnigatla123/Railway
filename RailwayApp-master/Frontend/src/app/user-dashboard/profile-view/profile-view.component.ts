import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from '../../http-web.service';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  profiles: any[] = [];

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._httpWebService.profileDetlCheck()
      .subscribe(resp => {
        if (resp.status = '200') {
          this.profiles.push(resp);
        } else {
          this.profiles = [];
        }
      });
  }

}
