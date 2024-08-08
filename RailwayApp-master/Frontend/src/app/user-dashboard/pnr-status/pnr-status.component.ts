import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-pnr-status',
  templateUrl: './pnr-status.component.html',
  styleUrls: ['./pnr-status.component.css']
})
export class PnrStatusComponent implements OnInit {
  errors: any;
  userid: string = window.sessionStorage.getItem('userid');
  pnrNo = '';

  bookings: any[] = [];

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  searchPNR() {
    window.scrollTo(0, 0);
    document.getElementById('message').classList.remove('div-show');
    document.getElementById('message').classList.add('div-hidden');
    this.bookings = [];
    if (this.bookings.length === 0) {
      document.getElementById('message').classList.remove('div-hidden');
      document.getElementById('message').classList.add('div-show');
    }

    this._httpWebService.myPNRSearch(this.pnrNo)
    .subscribe(resp => {
      const bookingData = resp;
      if (bookingData.length === 0) {
        document.getElementById('message').classList.remove('div-hidden');
        document.getElementById('message').classList.add('div-show');
      } else {
        document.getElementById('message').classList.remove('div-show');
        document.getElementById('message').classList.add('div-hidden');
        this.bookings = bookingData;
      }

    });
  }


  view_print(item) {
    window.localStorage.setItem('pnrNumber', item.basic.pnrNumber);
    window.open('http://localhost:4200/viewTicket', '_blank');
  }


}
