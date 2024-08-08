import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpWebService } from '../http-web.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {

  pnrNo = window.localStorage.getItem('pnrNumber');
  userid = window.sessionStorage.getItem('userid');
  qrCodeDetl = {
    pnrNo: this.pnrNo,
    userid: this.userid
  };

  trainNo = '';
  trainName = '';
  quotaType = '';
  provisionalNumber = '';
  dateOfBooking: Date;
  class = '';
  fromStn = '';
  dateOfJourney = '';
  toStn = '';
  boardingFrom  = '';
  dateOfBoarding  = '';
  scheduledDeparture  = '';
  reservationUpto = '';
  adult = '';
  child = '';
  mobile  = '';
  address = '';

  TransactionId = '';
  baseFare  = '';
  reservationCharge = '';
  tatkalCharge  = '';
  cateringCharge  = '';
  gst = '';
  totalFare = '';

  name  = '';
  age = '';
  gender  = '';
  concessions = '';
  bookingStatus = '';
  coachNo = '';
  seatNo  = '';
  berth = '';
  adSense = '';
  qrValue = '{\"pnrNo\": ' + this.pnrNo + ', \"userid\": \"' + this.userid + '\" }';

  bookings: any[] = [];
  Bdate: Date;

  constructor(private router: Router, private _httpWebService: HttpWebService) {

  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (window.localStorage.getItem('pnrNumber') != null) {
      this.pnrNo = window.localStorage.getItem('pnrNumber');
      this._httpWebService.myPNRSearch(this.pnrNo)
        .subscribe( resp => {
          this.bookings = resp;
          if (this.bookings.length !== 0) {
            this.bookings.forEach((booking) => {

              this.trainNo = booking.basic.trainNo;
              this.trainName = booking.basic.trainName;
              this.quotaType = booking.basic.quotaType;
              this.provisionalNumber = booking.basic.provisionalNumber;
              this.dateOfBooking = new Date(booking.basic.dateOfBooking * 1);

              this.class = booking.basic.class;
              this.fromStn = booking.basic.fromStn;
              this.dateOfJourney = booking.basic.dateOfJourney;
              this.toStn = booking.basic.toStn;
              this.boardingFrom  = booking.basic.boardingFrom;
              this.dateOfBoarding  = booking.basic.dateOfBoarding;
              this.scheduledDeparture  = booking.basic.scheduledDeparture;
              this.reservationUpto = booking.basic.reservationUpto;
              this.adult = booking.basic.adult;
              this.child = booking.basic.child;
              this.mobile  = booking.basic.mobile;
              this.address = booking.basic.address;

              this.TransactionId = booking.fareDetls.TransactionId;
              this.baseFare  = booking.fareDetls.baseFare;
              this.reservationCharge = booking.fareDetls.reservationCharge;
              this.tatkalCharge  = booking.fareDetls.tatkalCharge;
              this.cateringCharge  = booking.fareDetls.cateringCharge;
              this.gst = booking.fareDetls.gst;
              this.totalFare = booking.fareDetls.totalFare;

              this.name  = booking.passengerDetls.name;
              this.age = booking.passengerDetls.age;
              this.gender  = booking.passengerDetls.gender;
              this.concessions = booking.passengerDetls.concessions;
              this.bookingStatus = booking.passengerDetls.bookingStatus;
              this.coachNo = booking.passengerDetls.coachNo;
              this.seatNo  = booking.passengerDetls.seatNo;
              this.berth = booking.passengerDetls.berth;

              const adNumber = Math.floor(Math.random() * 6) + 1;
              this.adSense = 'Ad' + adNumber.toString()  + '.jpg';

            });
          window.localStorage.removeItem('pnrNumber');
          } else {
            this.router.navigate(['']);
          }
        });

    } else {
      this.router.navigate(['']);
    }
  }

}
