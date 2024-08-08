import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../../../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-part2',
  templateUrl: './part2.component.html',
  styleUrls: ['./part2.component.css']
})
export class Part2Component implements OnInit {

  genderList: any[] = [];
  berthList: any[] = [];
  mealList: any[] = [];
  nationList: any[] = [];
  concessionList: any[] = [];
  vCardList: any[] = [];
  quotaList: any[] = [];
  classList: any[] = [];
  reservelist: any[] = [];

  reservationType = '';
  name = '';
  age = '';
  gender = '';
  mobile = '';
  address = '';
  quota = '';
  nationPref = '';
  vcardtype = '';
  vcardname = '';
  berth = '';
  classPref = '';
  mealType = '';
  conssPref = '';

  msg = '';
  validate = true;

  constructor(private _httpWebService: HttpWebService,  private router: Router) {
    this.berthList = ['LOWER', 'MIDDLE', 'UPPER', 'SIDE LOWER', 'SIDE UPPER'];
    this.mealList = ['NON-VEG', 'VEG', 'NO-FOOD'];
    this.nationList = ['INDIAN', 'NRI', 'FOREIGNER'];
    this.concessionList = ['GENERAL-NO CONCESSION', 'DIVYANGJAN', 'ESCOT', 'PRESS PERSON', 'PRESS SPOUSE'];
    this.vCardList = ['PASSPORT', 'AADHAAR', 'VOTER ID-EPIC', 'PAN'];
    this.quotaList = ['SENIOR CITIZEN', 'GENERAL', 'DIVYANGJAN', 'LADIES'];
    this.classList = ['1A', '2A', 'SL'];
    this.genderList = ['MALE', 'FEMALE', 'OTHERS'];
    this.reservelist = ['GENERAL', 'TATKAL'];
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    let dataList = document.getElementById('genderlist');

    this.genderList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('berthlist');
    this.berthList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('meallist');
    this.mealList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('nationlist');
    this.nationList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('concessionlist');
    this.concessionList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('vcardlist');
    this.vCardList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('quotalist');
    this.quotaList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('class-list');
    this.classList.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

    dataList = document.getElementById('reservelist');
    this.reservelist.forEach(function(item) {
      const option = document.createElement('option');
      option.value = item;
      dataList.appendChild(option);
    });

  }

  createPnr() {
    this.validate = true;

    if (this.reservationType == null || this.reservationType === '') {
      this.msg = 'Oh snap! Enter your reservationType and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.name == null || this.name === '') {
      this.msg = 'Oh snap! Enter your name and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.age == null || this.age === '') {
      this.msg = 'Oh snap! Enter your age and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.gender == null || this.gender === '') {
      this.msg = 'Oh snap! Enter your gender and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.mobile == null || this.mobile === '') {
      this.msg = 'Oh snap! Enter your mobile number and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.address == null || this.address === '') {
      this.msg = 'Oh snap! Enter your address and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.quota == null || this.quota === '') {
      this.msg = 'Oh snap! Enter your quota and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.nationPref == null || this.nationPref === '') {
      this.msg = 'Oh snap! Enter your nationality and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.vcardtype == null || this.vcardtype === '') {
      this.msg = 'Oh snap! Enter your Identity Type and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.vcardname == null || this.vcardname === '') {
      this.msg = 'Oh snap! Enter your Identity Number and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.berth == null || this.berth === '') {
      this.msg = 'Oh snap! Enter your berth preference and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.classPref == null || this.classPref === '') {
      this.msg = 'Oh snap! Enter your class preference and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.mealType == null || this.mealType === '') {
      this.msg = 'Oh snap! Enter your meal preference and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }

    if (this.conssPref == null || this.conssPref === '') {
      this.msg = 'Oh snap! Enter your concession preference and try submitting again.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
      this.validate = false;
    }



    if (this.validate) {
      window.scrollTo(0, 0);
      document.getElementById('overlay').style.display = 'block';
      // tslint:disable-next-line:max-line-length
      this._httpWebService.createProvisionalId(this.reservationType, this.name, this.age, this.gender, this.mobile, this.address, this.quota, this.nationPref, this.vcardtype, this.vcardname, this.berth, this.classPref, this.mealType, this.conssPref)
      .subscribe(resp => {
        const bookingSuccess = resp;
        window.localStorage.clear();
        window.localStorage.setItem('provisionalId', bookingSuccess.provisionalNumber);
        // tslint:disable-next-line:max-line-length
        this._httpWebService.createNotification(window.sessionStorage.getItem('userid'), 'Provisional Booking Successful', 'Your provisional booking succeded! Continue to confirm booking....');
        this.router.navigate(['user/booking/payment']);
      });
    }
  }





}
