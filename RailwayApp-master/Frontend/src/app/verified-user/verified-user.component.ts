import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-verified-user',
  templateUrl: './verified-user.component.html',
  styleUrls: ['./verified-user.component.css']
})
export class VerifiedUserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if (window.sessionStorage.getItem('verified') === '200') {
      window.sessionStorage.clear();
    } else {
      this.router.navigate(['']);
    }
  }

}
