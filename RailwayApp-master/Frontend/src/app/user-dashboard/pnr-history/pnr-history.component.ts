import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-pnr-history',
  templateUrl: './pnr-history.component.html',
  styleUrls: ['./pnr-history.component.css']
})
export class PnrHistoryComponent implements OnInit {

  errors: any;
  userid: string = window.sessionStorage.getItem('userid');
  body: string;

  bookings: any[] = [];

  constructor(private _httpWebService: HttpWebService,  private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._httpWebService.myBookings()
    .subscribe(resp => {
      const bookingData = resp;
      if (bookingData.length === 0 || bookingData == null) {
        document.getElementById('message').classList.remove('div-hidden');
        document.getElementById('message').classList.add('div-show');
      }
      this.bookings = bookingData;
    });
  }

  view_print(item) {
    window.localStorage.setItem('pnrNumber', item.basic.pnrNumber);
    window.open('http://localhost:4200/viewTicket', '_blank');
  }


}
