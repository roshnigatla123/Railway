import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../../../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-part3',
  templateUrl: './part3.component.html',
  styleUrls: ['./part3.component.css']
})
export class Part3Component implements OnInit {
  trainNo = '';
  provisionalId = '';
  totalFare = '';

  cardNo = '';
  monthexp = '';
  yearexp = '';
  cvv = '';
  dname = '';
  otp_sent = '';

  monthlist: any[] = [];
  yearlist: any[] = [];
  mobileN = '';
  msg = '';
  validate = true;
  trainArr: any[] = [];

  constructor(private _httpWebService: HttpWebService,  private router: Router) {
      // tslint:disable-next-line:max-line-length
      this.monthlist = ['JAN-01', 'FEB-02', 'MAR-03', 'APR-04', 'MAY-05', 'JUN-06', 'JUL-07', 'AUG-08', 'SEP-09', 'OCT-10', 'NOV-11', 'DEC-12'];
      this.yearlist = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'];
   }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._httpWebService.fetchFareDetails(window.localStorage.getItem('provisionalId'))
      .subscribe(resp => {
        const fareDetails = resp;
        this.trainNo = fareDetails[0].trainNo;
        this.provisionalId = fareDetails[0].provisionalNumber;
        this.totalFare = fareDetails[0].totalFare;

        this.trainArr = fareDetails;
        const monthData = this.monthlist;
        let dataList = document.getElementById('monthlist');

        monthData.forEach(function(month){
          const option = document.createElement('option');
          option.value = month;
          dataList.appendChild(option);
        });

        const yearData = this.yearlist;
        dataList = document.getElementById('yearlist');
        yearData.forEach(function(year){
          const option = document.createElement('option');
          option.value = year;
          dataList.appendChild(option);
        });

        window.localStorage.clear();
      });
  }

  proceedToPay() {
    this.validate = true;
    document.getElementById('errorAlert').classList.remove('div-show');
    document.getElementById('errorAlert').classList.add('div-hidden');


    if (this.cardNo == null || this.cardNo === '') {
      this.msg = 'Oh snap! Enter your card number and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.monthexp == null || this.monthexp === '') {
      this.msg = 'Oh snap! Enter your month of expiry and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.yearexp == null || this.yearexp === '') {
      this.msg = 'Oh snap! Enter your year of expiry and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.cvv == null || this.cvv === '') {
      this.msg = 'Oh snap! Enter your cvv/cvc and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.dname == null || this.dname === '') {
      this.msg = 'Oh snap! Enter your card holders name and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.validate) {
      const validTill = this.monthexp + ' ' + this.yearexp;
      this._httpWebService.generatePayment(this.trainNo, this.provisionalId, this.totalFare, this.cardNo, this.dname, validTill)
        .subscribe(resp => {
          const otpDetails = resp;
          if (otpDetails.status === '200') {
            this.mobileN = 'Message has been sent to ' + otpDetails.phone;
            window.sessionStorage.setItem('session_id', otpDetails.session_id);

            document.getElementById('part2').classList.remove('div-hidden');
            document.getElementById('part2').classList.add('div-show');
          } else {
            this.router.navigate(['user']);
          }
      });
    }
  }


  validateOTP() {
    window.scrollTo(0, 0);
    document.getElementById('overlay').style.display = 'block';
    this._httpWebService.verifyPayment(this.provisionalId, this.otp_sent, this.totalFare)
      .subscribe(resp => {
        if (resp.status === '200') {
          window.scrollTo(0, 0);
          window.sessionStorage.removeItem('session_id');
          document.getElementById('overlay').style.display = 'none';
          this.msg = 'Payment Was Successful!';
          // tslint:disable-next-line:max-line-length
          this._httpWebService.createNotification(window.sessionStorage.getItem('userid'), 'Payment Successful', 'Your payment was successful, for the Provisional ID: ' + this.provisionalId + ' and paid ₹ ' + this.totalFare);
          (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
          document.getElementById('errorAlert').classList.remove('div-hidden');
          document.getElementById('errorAlert').classList.add('div-show');
          document.getElementById('errorAlert').classList.remove('alert-danger');
          document.getElementById('errorAlert').classList.add('alert-success');
          document.getElementById('proceed').classList.add('div-hidden');
          document.getElementById('part2').classList.remove('div-show');
          document.getElementById('part2').classList.add('div-hidden');
          document.getElementById('verfied').classList.add('div-hidden');
        } else {
          window.scrollTo(0, 0);
          window.sessionStorage.removeItem('session_id');
          document.getElementById('overlay').style.display = 'none';
          // tslint:disable-next-line:max-line-length
          this._httpWebService.createNotification(window.sessionStorage.getItem('userid'), 'Payment Un-successful', 'Your payment was un-successful, for the Provisional ID: ' + this.provisionalId + ' and amounting to ₹ ' + this.totalFare);
          this.msg = 'Payment Failed. Please try later.';
          (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
          document.getElementById('errorAlert').classList.remove('div-hidden');
          document.getElementById('errorAlert').classList.add('div-show');
          document.getElementById('proceed').classList.add('div-hidden');
          document.getElementById('part2').classList.remove('div-show');
          document.getElementById('part2').classList.add('div-hidden');
          document.getElementById('verfied').classList.add('div-hidden');
        }

      });
  }

}
