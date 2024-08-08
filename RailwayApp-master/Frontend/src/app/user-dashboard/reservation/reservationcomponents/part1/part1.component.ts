import { Component, OnInit } from '@angular/core';
import { HttpWebService } from '../../../../http-web.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.css']
})
export class Part1Component implements OnInit {

  fromStn = '';
  toStn = '';
  trainNumber: any;
  doj = '';
  msg = '';
  trainArr: any[] = [];


  constructor(private _httpWebService: HttpWebService,  private router: Router) {  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (window.localStorage.getItem('provisionalId') != null) {
      this.router.navigate(['user/booking/payment']);
    }
    this._httpWebService.fetchAllStations(window.sessionStorage.userid)
    .subscribe(resp => {
      const stationData = resp;
      // console.log(stationData);
      const dataList = document.getElementById('json-datalist');

      stationData.forEach(function(station){
        const option = document.createElement('option');
        option.value = station.stn;
        dataList.appendChild(option);
      });

    });
  }


  searchTrains() {
    this._httpWebService.getTrainsBetStn(this.fromStn, this.toStn)
      .subscribe(resp => {
        const trainsFound = resp;


        if (trainsFound.length === 0) {
          this.msg = 'No Trains found between these stations.';
          (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
          document.getElementById('errorAlert').classList.remove('div-hidden');
          document.getElementById('errorAlert').classList.add('div-show');
        } else {
          document.getElementById('errorAlert').classList.remove('div-show');
          document.getElementById('errorAlert').classList.add('div-hidden');

          trainsFound.forEach(trains => {
            if (trains.trainType === 'SUF') {
              trains.trainType = 'SUPERFAST EXPRESS';
            } else if (trains.trainType === 'MEX') {
              trains.trainType = 'MAIL EXPRESS';
            } else if (trains.trainType === 'RAJ') {
              trains.trainType = 'RAJDHANI EXPRESS';
            } else if (trains.trainType === 'SHT') {
              trains.trainType = 'SHATABDI EXPRESS';
            } else if (trains.trainType === 'GBR') {
              trains.trainType = 'GARIB RATH EXPRESS';
            } else if (trains.trainType === 'SUVD') {
              trains.trainType = 'SUVIDHA EXPRESS';
            } else if (trains.trainType === 'DRNT') {
              trains.trainType = 'DURONTO EXPRESS';
            } else {
              trains.trainType = 'Train Type could not be found.';
            }
          });

          this.trainArr = trainsFound;
          document.getElementById('part2').classList.remove('div-hidden');
          document.getElementById('part2').classList.add('div-show');

          document.getElementById('part3').classList.remove('div-hidden');
          document.getElementById('part3').classList.add('div-show');

        }
      });

  }

  loadTrain(trainNo) {
    this.trainNumber = trainNo;
    (<HTMLInputElement> document.getElementById(trainNo)).disabled = true;
    (<HTMLInputElement> document.getElementById(trainNo)).innerHTML = 'SELECTED';
    document.getElementById(trainNo).classList.remove('btn-primary');
    document.getElementById(trainNo).classList.add('btn-success');
  }

  cancel() {
    window.localStorage.clear();
    this.router.navigate(['user']);
  }

  validatePart1() {
    if (this.fromStn !== '' && this.toStn !== '' && this.trainNumber != null && this.doj !== '') {
      window.localStorage.setItem('fromStation', this.fromStn);
      window.localStorage.setItem('toStation', this.toStn);
      window.localStorage.setItem('trainNo', this.trainNumber);
      window.localStorage.setItem('journeyDt', this.doj);

      this.router.navigate(['user/booking/seating/details']);
    } else {
      this.msg = 'Check the details you have entered.';
      (<HTMLInputElement> document.getElementById('errorAlert')).innerHTML = this.msg;
      document.getElementById('errorAlert').classList.remove('div-hidden');
      document.getElementById('errorAlert').classList.add('div-show');
    }
  }

}
