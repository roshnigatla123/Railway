import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { QRCodeModule } from 'angularx-qrcode';



import { AppComponent } from './app.component';

// Home Page Components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';

// Signup Page Components
import { SignupComponent } from './signup/signup.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';


import { HttpWebService } from './http-web.service';
import { ForbiddenComponent } from './forbidden/forbidden.component';


import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';


import { VerifyaccountComponent } from './verifyaccount/verifyaccount.component';
import { SignupsuccessComponent } from './signupsuccess/signupsuccess.component';
import { VerifiedUserComponent } from './verified-user/verified-user.component';
import { NavpanelComponent } from './navpanel/navpanel.component';


import { HomeViewComponent } from './home-view/home-view.component';


import { ProfileViewComponent } from './user-dashboard/profile-view/profile-view.component';
import { ReservationComponent } from './user-dashboard/reservation/reservation.component';
import { PnrStatusComponent } from './user-dashboard/pnr-status/pnr-status.component';
import { PnrHistoryComponent } from './user-dashboard/pnr-history/pnr-history.component';
import { UserNotificationsComponent } from './user-dashboard/user-notifications/user-notifications.component';
import { ExplIndiaComponent } from './user-dashboard/expl-india/expl-india.component';
import { ExplMaharajaComponent } from './user-dashboard/expl-maharaja/expl-maharaja.component';
import { ExplSeasonsComponent } from './user-dashboard/expl-seasons/expl-seasons.component';


import { ProfileAdminComponent } from './admin-dashboard/profile-admin/profile-admin.component';
import { BookingVerificationComponent } from './admin-dashboard/booking-verification/booking-verification.component';
import { PassengerListComponent } from './admin-dashboard/passenger-list/passenger-list.component';
import { TrainsScheduleComponent } from './admin-dashboard/trains-schedule/trains-schedule.component';
import { AdminNotificationsComponent } from './admin-dashboard/admin-notifications/admin-notifications.component';


import { Part1Component } from './user-dashboard/reservation/reservationcomponents/part1/part1.component';
import { Part2Component } from './user-dashboard/reservation/reservationcomponents/part2/part2.component';
import { Part3Component } from './user-dashboard/reservation/reservationcomponents/part3/part3.component';


import { TickerComponent } from './ticker/ticker.component';
import { ChangePasswordComponent } from './change-password/change-password.component';




const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent},
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'signupsuccess', component: SignupsuccessComponent },
  { path: 'otp/userVerifyChallenge', component: VerifyaccountComponent },
  { path: 'verifiedOTP', component: VerifiedUserComponent },
  { path: 'viewTicket', component: TickerComponent },
  { path: 'passwordUpdate/:id/:shortner', component: ChangePasswordComponent },

  { path: 'admin', component: AdminComponent, children: [
    { path: '', component: HomeViewComponent },
    { path: 'profile', component: ProfileAdminComponent },
    { path: 'bookingVerification', component: BookingVerificationComponent },
    { path: 'passengerList', component: PassengerListComponent },
    { path: 'trainsNow', component: TrainsScheduleComponent },
    { path: 'notifications', component: AdminNotificationsComponent },
  ]},

  { path: 'user', component: UserComponent,  children: [
    { path: '', component: HomeViewComponent },
    { path: 'profile', component: ProfileViewComponent },
    { path: 'booking', component: ReservationComponent, children: [
      { path: '', component: Part1Component },
      { path: 'seating/details', component: Part2Component },
      { path: 'payment', component: Part3Component },
    ] },
    { path: 'pnrstatus', component: PnrStatusComponent },
    { path: 'pnrhistory', component: PnrHistoryComponent },
    { path: 'notifications', component: UserNotificationsComponent },
    { path: 'exploreindia', component: ExplIndiaComponent },
    { path: 'exploremaharajas', component: ExplMaharajaComponent },
    { path: 'seasonal', component: ExplSeasonsComponent },
  ]},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    WelcomeComponent,
    SignupComponent,
    SignupFormComponent,
    ForgotpasswordComponent,
    ForbiddenComponent,
    UserComponent,
    AdminComponent,
    VerifyaccountComponent,
    SignupsuccessComponent,
    VerifiedUserComponent,
    NavpanelComponent,
    HomeViewComponent,
    ProfileViewComponent,
    ReservationComponent,
    PnrStatusComponent,
    PnrHistoryComponent,
    UserNotificationsComponent,
    ExplIndiaComponent,
    ExplMaharajaComponent,
    ExplSeasonsComponent,
    BookingVerificationComponent,
    PassengerListComponent,
    TrainsScheduleComponent,
    AdminNotificationsComponent,
    ProfileAdminComponent,
    Part1Component,
    Part2Component,
    Part3Component,
    TickerComponent,
    ChangePasswordComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpModule,
    FormsModule,
    RecaptchaModule.forRoot(),
    QRCodeModule
  ],
  providers: [HttpWebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
