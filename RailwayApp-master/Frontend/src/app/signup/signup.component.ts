import { Component, OnInit } from '@angular/core';

import { SignupFormComponent } from '../signup-form/signup-form.component';

@Component({
  selector: 'app-signup',
  moduleId: module.id,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
