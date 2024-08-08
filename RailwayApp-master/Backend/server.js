var express = require('express');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express()
const accountSid = 'twilio-accountSid';
const authToken = 'twilio-authToken';


var twilio = require('twilio');

// Schema Models --
Trains = require('./train-schema');
Stations =  require('./station-schema');
Users =  require('./users-schema');
RqOTP = require('./reqotp-schema');
Booking = require('./booking-schema');
Password_Change = require('./password_detl-schema');
Notify = require('./notif-schema');



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

mongoose.connect('mongodb://localhost/crisDB').then(
        () => {console.log("DB connected.")},
        err => {console.log(err)}
    );
var db = mongoose.connection;

app.use(bodyParser.json({
    extended: true      // to support JSON-encoded bodies
}));







// ******** REST APIS ******** //

app.get('/', function(req, res, next){
    res.sendStatus(404)
});


app.get('/api/trains', function(req, res, next){
    Trains.getTrains(function(err, train){
        if(err)
            console.log('Error occured: --------> '+ err);
        res.json(train)
    });
});


app.get('/api/stations', function(req, res, next){
    Stations.getStations(function(err, station){
        if(err)
            console.log('Error occured: --------> '+ err);
        res.json(station)
    });
});



app.post('/login', function(req, res){
    var cred = req.body;

    Users.createToken(cred.identifier, function(err, user){
        if(err)
            console.log('Error occured: --------> '+ err);
        else{

            if(user == null){
                res.json({
                    status: "403"
                });
            } else {
                if(cred.identifier==user.email&&cred.password==user.password){

                    if(user.sessionStatus==="Not Verified"){
                        res.json({
                            userid: cred.identifier,
                            status: 401
                        });
                    } else {

                        var data = {
                            "email": user.email,
                            "session_id": uuidv4(),
                            "creation_time": Date.now(),
                        };

                        if(user.userType=="admin")
                            routes = "/admin";
                        else
                            routes = "/user";


                        jwt.sign({data}, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', {expiresIn: '24h'}, (err, token) =>{
                            var messagePayload = {
                                "token": token,
                                "route": routes,
                                "status": "200"
                            };
                            updateTokenLogin(user.email, token, res, messagePayload);
                        });
                    }

                }else{
                    res.json({
                        status: "403"
                    });
                }
            }

        }

    });


});



app.post('/login/signOn', verifyToken, function(req, res){
    token=req.token;
    jwt.verify(req.token, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', (err, authData) => {
        if(err){
            res.sendStatus(403)
        } else {
            tokenVerification(authData.data.email, token, res);
        }
    });


});



app.post('/signUpUser', function(req, res){
    userData = req.body;
    Users.createUser(userData, function(err, user){
        if (err) {
            console.log('Error occured: --------> '+ err);
        } else {
            res.send(user);
        }
    });

});


app.post('/verifyUserChallenge', function(req, res){
    userId = req.body;
    Users.checkUserStatus(userId.identifier, function(err, user){
        if(err) {
            console.log('Error occured: --------> '+ err);
        } else {
            if(user.sessionStatus === 'Not Verified') {

                const otpDetails = {
                    "email": user.email,
                    "session_id": uuidv4(),
                    "otpn": genOTP(),
                    "type": "User-Auth",
                    "status": "Not Verified"
                };

                RqOTP.requestOTPGeneration(otpDetails);
                sendOTP(otpDetails.session_id, user.countryCode, user.phone, otpDetails.otpn, res);

                // call otp builder requestOTPGeneration
            } else {
                res.sendStatus(403);
            }
        }
    });
});



app.post('/verifyOTP', function(req, res){
    otpResponse = req.body;
    RqOTP.verifyResponse(otpResponse.identifier, otpResponse.session_id, otpResponse.otpn, function(err, otpVer){
        if(err){
            console.log('Error occured: --------> '+ err);
        } else {
            updateOTPStatus(otpResponse.identifier, otpVer[0]._id, otpVer[0].session_id, res);
        }
    });
});



app.post('/api/stations/betw', function(req, res){
    stationDetl = req.body;
    Trains.getTrains(stationDetl.station1, stationDetl.station2, function(err, station){
        if(err)
            console.log('Error occured: --------> '+ err);
        else{
            res.json(station);
        }
    });
});



app.post('/api/booking/provisional', function(req, res){
    bookingData = req.body;
    provId = genProvId();

    adultNo = 0;
    children = 0;
    tatkalChrge = 0;
    cuisineChrge = 0;

    if (bookingData.reservationType === 'TATKAL'){
        tatkalChrge = 650;
    }

    if(parseInt(bookingData.age)>3){
        adultNo = 1;
    } else {
        children = 0;
    }

    if(bookingData.mealType === 'VEG'){
        cuisineChrge = 170;
    } else if(bookingData.mealType === 'NON-VEG') {
        cuisineChrge = 250;
    } else if(bookingData.mealType === 'NO-FOOD') {
        cuisineChrge = 0;
    } else {
       cuisineChrge = 0;
    }


    const completeData = {
        userid: bookingData.userid,
        reservationType: bookingData.reservationType,
        provisionalNumber: provId,
        pnrNumber: 'not yet generated',
        pnrStatus: 'payment not done',
        fromStn: bookingData.fromStn,
        toStn: bookingData.toStn,
        journeyDt: bookingData.journeyDt,
        trainNo: bookingData.trainNo,
        coachNo: 'not allotted',
        seatNo: 'not allotted',
        bookingDt: bookingData.bookingDt,
        bookingStatus: 'not paid',
        name: bookingData.name,
        age: bookingData.age,
        adult: adultNo.toString(),
        child: children.toString(),
        gender: bookingData.gender,
        mobile: bookingData.mobile,
        address: bookingData.address,
        quotaType: bookingData.quotaType,
        nationality: bookingData.nationality,
        identitytype: bookingData.identitytype,
        identityNumber: bookingData.identityNumber,
        berth: bookingData.berth,
        class: bookingData.class,
        mealType: bookingData.mealType,
        concessions: bookingData.concessions,
        baseFare: "not calculated",
        cateringCharge: cuisineChrge.toString(),
        reservationCharge: "40",
        tatkalCharge: tatkalChrge.toString(),
        gst: "not calculated",
        totalFare: "not calculated",
        TransactionId: 'payment not done',
        debitCardId: 'payment not done',
        payersDetl: 'payment not done',
        cardValidDt: 'payment not done',
        paymentDt: 'payment not done',
        payConfirmation:'payment not done'
    };

    calculateFare(completeData, res);
});


app.post('/api/payment/getDetails', function(req, res){
    const provId = req.body;

    Booking.generatePayouts(provId.provisionalNumber, function(err, payment){
        if(err)
            console.log('Error occured: --------> '+ err);
        else{
            res.send(payment);
        }
    });
});


app.post('/api/payment/verify', function(req, res){
    const otpDetails = req.body;
    const new_session = uuidv4();
    const new_otp = genOTP();


    messagingData = {
        userid: otpDetails.identifier,
        mobile: '',
        session_id: new_session,
        otp: new_otp,
        type: 'Payment Transaction',
        status: 'Not Verified',
        pnrStatus: 'Generating PNR',
        bookingStatus: 'Payment process initiated',
        trainNo: otpDetails.trainNo,
        provisionalNumber: otpDetails.provisionalNumber,
        totalFare: otpDetails.totalFare,
        debitCardId: otpDetails.cardNo,
        payersDetl: otpDetails.holder_name,
        cardValidDt: otpDetails.validTill
    };

    Users.basicDetls(messagingData.userid, function(err, user){
        if(err) {
            console.log('Error occured: --------> '+ err);
        } else {
            messagingData.mobile = user.phone;
            console.log(messagingData.mobile);
            const otp_create = {
                email: messagingData.userid,
                session_id: messagingData.session_id,
                otpn: messagingData.otp,
                type: messagingData.type,
                status: messagingData.status
            };
            RqOTP.requestOTPGeneration(otp_create);
            console.log("OTP Created");
            const update_booking = {
                "pnrStatus": messagingData.pnrStatus,
                "bookingStatus": messagingData.bookingStatus,
                "debitCardId": messagingData.debitCardId,
                "payersDetl": messagingData.payersDetl,
                "cardValidDt": messagingData.cardValidDt
            };
            Booking.update_with_OTP(messagingData.provisionalNumber, update_booking, function(err, booked){
                if(err){
                    console.log('Error occured: --------> '+ err);
                } else {
                    console.log("Update Successful");
                    const smsBody = 'OTP for IRCTC payment is '+messagingData.otp+', for booking against Train No - '+messagingData.trainNo+'. The provisional booking number is '+messagingData.provisionalNumber;
                    console.log(smsBody);
                    sendTransactionalMsg(messagingData.session_id, '+91', messagingData.mobile, smsBody, res);
                }
            });

        }

    });

});



app.post('/api/payment/verifiedUser', function(req, res){
    const bodyParams = req.body;

    const bookingUpdates = {
        provisionalNumber: bodyParams.provisionalNumber,
        pnrNumber: genProvId(),
        pnrStatus: 'BOOKING SUCCESSFUL',
        coachNo: Math.random().toString().slice(2,7),
        seatNo: Math.random().toString().slice(2,6),
        bookingStatus: 'BOOKED',
        TransactionId: tranID(),
        paymentDt: Date.now(),
        payConfirmation: 'PAYMENT VERIFIED'
    };


    RqOTP.verifyResponse(bodyParams.identifier, bodyParams.session_id, bodyParams.otp, function(err, otpDetails){
        if(err) {
            console.log('Error occured: --------> '+ err);
        } else {
            if(otpDetails != null) {
                otp_id = otpDetails._id;
                RqOTP.updateStatus(otp_id, function(err, otpStatus){
                    if(err) {
                        console.log('Error occured: --------> '+ err);
                    } else {
                        Booking.confirmBooking(bookingUpdates, function(err, booked){
                            if(err) {
                                console.log('Error occured: --------> '+ err);
                            } else {
                                //sendEmailConfirmation(bodyParams.identifier, bookingUpdates.pnrNumber);

                                const mes_notify = {
                                    userid: bodyParams.identifier,
                                    dateOfCreation: Date.now(),
                                    title: 'Booking Confirmed and Payment Successful',
                                    description: 'Your Booking against Provisional Booking number: ' + bookingUpdates.provisionalNumber + ' is Successful and your transaction id: ' + bookingUpdates.TransactionId + '. PNR number generated! PNR number: '+ bookingUpdates.pnrNumber,
                                    status: 'UNREAD'
                                }
                                Notify.createNotification(mes_notify);

                                smsBody = 'Transaction Successful. ₹ '+ bodyParams.totalFare + ' debited frm ur A/c. PNR NO: '+ bookingUpdates.pnrNumber + '. Thanks for choosing IRCTC.'
                                sendSmsConfirmation(bodyParams.identifier, smsBody, res);
                            }
                        })
                    }
                });
            }
        }
    });
});



app.post('/api/booking/history', function(req, res) {
    const user_s = req.body;
    const userid = user_s.identifier;

    var fullyBooked = [];
    Booking.myBookings(userid, function(err, bookings){
        if(err){
            console.log('Error occured: --------> '+ err);
        } else {

            bookings.forEach((booking) => {

                let bookingDetls = {
                    userid: userid,
                    basic: {
                        pnrNumber: booking.pnrNumber,
                        trainNo: booking.trainNo,
                        trainName: 'traintable',
                        quotaType: booking.quotaType,
                        provisionalNumber: booking.provisionalNumber,
                        dateOfBooking: booking.bookingDt,
                        class: booking.class,
                        fromStn: booking.fromStn,
                        dateOfJourney: booking.journeyDt,
                        toStn: booking.toStn,
                        boardingFrom: booking.fromStn,
                        dateOfBoarding: booking.journeyDt,
                        scheduledDeparture: 'traintable',
                        reservationUpto: booking.toStn,
                        adult: booking.adult,
                        child: booking.child,
                        mobile: booking.mobile,
                        address: booking.address
                    },
                    fareDetls: {
                        TransactionId: booking.TransactionId,
                        baseFare: booking.baseFare,
                        reservationCharge: booking.reservationCharge,
                        tatkalCharge: booking.tatkalCharge,
                        cateringCharge: booking.cateringCharge,
                        gst: booking.gst,
                        totalFare: booking.totalFare,
                    },
                    passengerDetls: {
                        name: booking.name,
                        age: booking.age,
                        gender: booking.gender,
                        concessions: booking.concessions,
                        bookingStatus: booking.bookingStatus,
                        coachNo: booking.coachNo,
                        seatNo: booking.seatNo,
                        berth: booking.berth
                    }
                };

                fullyBooked.push(bookingDetls);
            });

            var trains_searched = [];
            fullyBooked.forEach((booking_temp) => {
                let trains_temp = {
                    "trainNo": parseInt(booking_temp.basic.trainNo)
                };

                trains_searched.push(trains_temp);
            });

            Trains.getTrainName_DepAtFromStn(trains_searched, function(err, trains_found){
                if(err){
                    console.log('Error occured: --------> '+ err);
                } else {

                    fullyBooked.forEach((booking_temp) => {
                        let train_no = parseInt(booking_temp.basic.trainNo);

                        trains_found.forEach((train_s) => {
                            if(train_s.trainNo === train_no){
                                booking_temp.basic.trainName = train_s.trainName;
                                booking_temp.basic.scheduledDeparture = train_s.depAtFromStn;
                            }
                        });
                    });

                    res.json(fullyBooked);
                }
            });
        }

    });

});


app.post('/api/booking/pnr/search', function(req, res){
    const userid = req.body.identifier;
    const pnr = req.body.pnrNumber;

    var fullyBooked = [];
    Booking.pnrSearch(userid, pnr, function(err, bookings){
        if(err){
            console.log('Error occured: --------> '+ err);
        } else {

            bookings.forEach((booking) => {

                let bookingDetls = {
                    userid: userid,
                    basic: {
                        pnrNumber: booking.pnrNumber,
                        trainNo: booking.trainNo,
                        trainName: 'traintable',
                        quotaType: booking.quotaType,
                        provisionalNumber: booking.provisionalNumber,
                        dateOfBooking: booking.bookingDt,
                        class: booking.class,
                        fromStn: booking.fromStn,
                        dateOfJourney: booking.journeyDt,
                        toStn: booking.toStn,
                        boardingFrom: booking.fromStn,
                        dateOfBoarding: booking.journeyDt,
                        scheduledDeparture: 'traintable',
                        reservationUpto: booking.toStn,
                        adult: booking.adult,
                        child: booking.child,
                        mobile: booking.mobile,
                        address: booking.address
                    },
                    fareDetls: {
                        TransactionId: booking.TransactionId,
                        baseFare: booking.baseFare,
                        reservationCharge: booking.reservationCharge,
                        tatkalCharge: booking.tatkalCharge,
                        cateringCharge: booking.cateringCharge,
                        gst: booking.gst,
                        totalFare: booking.totalFare,
                    },
                    passengerDetls: {
                        name: booking.name,
                        age: booking.age,
                        gender: booking.gender,
                        concessions: booking.concessions,
                        bookingStatus: booking.bookingStatus,
                        coachNo: booking.coachNo,
                        seatNo: booking.seatNo,
                        berth: booking.berth
                    }
                };

                fullyBooked.push(bookingDetls);
            });

            var trains_searched = [];
            fullyBooked.forEach((booking_temp) => {
                let trains_temp = {
                    "trainNo": parseInt(booking_temp.basic.trainNo)
                };

                trains_searched.push(trains_temp);
            });

            Trains.getTrainName_DepAtFromStn(trains_searched, function(err, trains_found){
                if(err){
                    console.log('Error occured: --------> '+ err);
                } else {

                    fullyBooked.forEach((booking_temp) => {
                        let train_no = parseInt(booking_temp.basic.trainNo);

                        trains_found.forEach((train_s) => {
                            if(train_s.trainNo === train_no){
                                booking_temp.basic.trainName = train_s.trainName;
                                booking_temp.basic.scheduledDeparture = train_s.depAtFromStn;
                            }
                        });
                    });

                    res.json(fullyBooked);
                }
            });
        }

    });
});



app.post('/password/verifyUser', function(req, res) {
    userid = req.body.identifier;
    mobile = '';


    Users.basicDetls(userid, function(err, user) {
        if(err) {
           console.log('Error occured: --------> '+ err);
       } else {
            mobile = user.phone;
            session_id = uuidv4();
            shortener = genOTP();
            status = 'New Link';

            jwt.sign({session_id}, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', {expiresIn: '24h'}, (err, token) =>{
                const passData = {
                    userid: userid,
                    shortener: shortener,
                    sessionId: token,
                    status: status
                };
                Password_Change.createPasswordChangeToken(passData);
                createdLink = 'http://localhost:4200/passwordUpdate/'+userid+'/'+shortener;
                changedSendLink(createdLink, '+91', mobile, res);
            });
       }
    });
});

app.post('/password/verify/shortener', function(req, res){
    passwDetl = req.body;


    Password_Change.verifyPasswordChangeRequest(passwDetl.identifier, passwDetl.shortLink, function(err, pass) {
        if(err) {
            console.log('Error occured: --------> '+ err);
            const payload = {
                status: "403"
            }
            res.send(payload);
        } else {
            if(pass != null){
                jwt.verify(pass.sessionId, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', (err1, authData) => {
                    if(err1){
                        const payload = {
                            status: "403"
                        }
                        res.send(payload);
                    } else {
                        const payload = {
                            status: "200"
                        }
                        res.send(payload);
                    }
                });
            } else {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            }

        }
    });
});


app.post('/password/changePassword', function(req, res){
    passwDetl = req.body;

    Password_Change.verifyPasswordChangeRequest(passwDetl.identifier, passwDetl.shortLink, function(err, pass) {
        if(err) {
            console.log('Error occured: --------> '+ err);
            const payload = {
                status: "403"
            }
            res.send(payload);

        } else {
            if(pass != null){
                jwt.verify(pass.sessionId, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', (err1, authData) => {
                    if(err1){
                        const payload = {
                            status: "403"
                        }
                        res.send(payload);
                    } else {

                        Password_Change.updatePasswordStatus(passwDetl.identifier, passwDetl.shortLink, function(err2, pass) {
                            if(err2){
                                console.log('Error occured: --------> '+ err2);
                                const payload = {
                                    status: "403"
                                }
                                res.send(payload);
                            } else {
                                Users.updatePassword(passwDetl.identifier, passwDetl.password, function(err3, pass) {
                                    if(err3){
                                        console.log('Error occured: --------> '+ err3);
                                        const payload = {
                                            status: "403"
                                        }
                                        res.send(payload);
                                    } else {
                                        const payload = {
                                            status: "200"
                                        }
                                        res.send(payload);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            }

        }
    });


});



app.post('/api/myprofile/details', function(req, res) {
    Users.profileDetails(req.body.identifier, function(err, user) {
        if(err){
            console.log('Error occured: --------> '+ err);
            const payload = {
                status: "403"
            }
            res.send(payload);
        } else {
            if(user == null) {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            } else {
                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dob: user.dob,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    country: user.country,
                    pin: user.pin,
                    countryCode: user.countryCode,
                    phone: user.phone,
                    email: user.email,
                    aadhar: user.aadhar,
                    pan: user.pan,
                    occupation: user.occupation,
                    status: "200"
                };
                res.send(userData);
            }
        }
    });

});



app.post('/api/sigin/details', function(req, res) {
    Users.basicDetls(req.body.identifier, function(err, user) {
        if(err){
            console.log('Error occured: --------> '+ err);
            const payload = {
                status: "403"
            }
            res.send(payload);
        } else {
            if(user == null) {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            } else {
                const userData = {
                    firstName: user.firstName,
                    email: user.email,
                    status: "200"
                };
                res.send(userData);
            }
        }
    });

});




app.post('/api/notification/create', function(req, res) {
    const message_notify = {
        userid: req.body.userid,
        dateOfCreation: req.body.dateOfCreation,
        title: req.body.title,
        description: req.body.description,
        status: 'UNREAD'
    }
    Notify.createNotification(message_notify);
});



app.post('/api/notification/view', function(req, res) {
    Notify.notificationUnRead(req.body.identifier, function(err, notify) {
        if(err){
            console.log('Error occured: --------> '+ err);
        } else {
            res.send(notify);
        }
    });
});


app.post('/api/notification/read', function(req, res) {
    Notify.notificationRead(req.body.idrq, req.body.identifier, function(err, notify) {
        if(err){
            console.log('Error occured: --------> '+ err);
        } else {
            res.sendStatus(200);
        }
    });
});





// ******** METHODS FOR DIFFERENT TASKS ******** //
// FORMAT OF TOKEN
// Authorization: <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const reqHeader = req.headers['authorization'];
  // Check if reqHeader is undefined
  if(typeof reqHeader !== 'undefined') {
    // Get token from reqHeader
    req.token = reqHeader;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}


// GUID FOR SESSION

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function genOTP() {
    return 'xxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function tranID() {
    return 'xxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function genProvId() {
    return Math.random().toString().slice(2,11);
}

function sendOTP(session_id, countryCode, rec_number, otp_m, res){
    receiver_N = countryCode+rec_number;
    hashed_N = countryCode + ' ***** *' + rec_number.substring(6, rec_number.length);
    otp_message = 'Your user verification OTP for IRCTC is ' + otp_m;
    console.log(otp_message);
    console.log("Sending OTP to "+receiver_N);




    var client = new twilio(accountSid, authToken);
    client.messages.create({
        body: otp_message,
        to: receiver_N,  // Text this number
        from: '+447481337058' // From a valid Twilio number
    })
    .then((message) => {
        console.log("Message Sent --> "+ message.sid);
    });


    res.json({
        session_id: session_id,
        phone: hashed_N,
        status: "200"
    });

}


function sendTransactionalMsg(session_id, countryCode, rec_number, smsBody, res){
    receiver_N = countryCode+rec_number;
    hashed_N = countryCode + ' ***** *' + rec_number.substring(6, rec_number.length);
    otp_message = smsBody;
    console.log(otp_message);
    console.log("Sending OTP to "+receiver_N);


    var client = new twilio(accountSid, authToken);
    client.messages.create({
        body: otp_message,
        to: receiver_N,  // Text this number
        from: '+447481337058' // From a valid Twilio number
    })
    .then((message) => {
        console.log("Message Sent --> "+ message.sid);
    });


    res.json({
        session_id: session_id,
        phone: hashed_N,
        status: "200"
    });

}




function updateOTPStatus(user, otpid, s_id, res){
    RqOTP.updateStatus(otpid, function(err, otp){
        if(err){
            console.log('Error occured: --------> '+ err);
        } else {
            Users.updateUserStatus(user, function(err, user){
                if(err){
                    console.log('Error occured: --------> '+ err);
                } else {
                    const payload = {
                        'session_id': s_id,
                        'status': '200'
                    };
                    res.send(payload);
                }
            });
        }
    });
}




function updateTokenLogin(email, token, res, carrier){
    Users.updateToken(email, "Signed In", token, function(err, user){
        if(err)
            console.log('Error occured: --------> '+ err);
        else{
            res.json(carrier);
        }

    });
}


function tokenVerification(email, token, res){

    Users.verifyToken(email, function(err, user){
        if(err)
            console.log('Error occured: --------> '+ err);
        else{
            if(token==user.currentSession&&user.sessionStatus=="Signed In"){
                if(user.userType=="admin")
                    routes = "/admin";
                else
                    routes = "/user";

                res.json({
                    route: routes,
                    status: "200"
                });

            } else {
                res.json({
                    status: "403"
                });
            }


        }
    });

}


function calculateFare(bookingData, res){
    baseCharge = 0;
    Trains.baseFares(bookingData.trainNo, function(err, train){
        if(err)
            console.log('Error occured: --------> '+ err);
        else{
            if (bookingData.class == '1A'){
                baseCharge = parseInt(train.AC1Tier);
            } else if ( bookingData.class == '2A'){
                baseCharge = parseInt(train.AC2Tier);
            } else {
                baseCharge = parseInt(train.sleeperClass);
            }

            totalCharge = baseCharge + parseInt(bookingData.cateringCharge) + parseInt(bookingData.reservationCharge) + parseInt(bookingData.tatkalCharge);
            if(bookingData.child === '1')
                totalCharge = totalCharge/2;
            gst = Math.round(totalCharge*0.18);
            fare = Math.round(totalCharge + gst);

            bookingData.baseFare = baseCharge.toString();
            bookingData.gst = gst.toString();
            bookingData.totalFare = fare.toString();

            createBookings(bookingData, res);
        }
    });
}


function createBookings(bData, res){
    Booking.createBooking(bData);

    const responseId = {
        'provisionalNumber': bData.provisionalNumber,
    }
    res.send(responseId);
}


function sendSmsConfirmation(identifier, smsBody, res){
    Users.basicDetls(identifier, function(err, user){

        receiver_N = '+91'+user.phone;
        otp_message = smsBody;
        console.log("Sending OTP to "+receiver_N);


        var client = new twilio(accountSid, authToken);
        client.messages.create({
            body: otp_message,
            to: receiver_N,  // Text this number
            from: '+447481337058' // From a valid Twilio number
        })
        .then((message) => {
            console.log("Message Sent --> "+ message.sid);

            if(message.sid){
                res.json({
                    status: "200"
                });
            } else {
                res.json({
                    status: "403"
                });
            }
        });


    });
}


function changedSendLink(smsBody, countryCode, mobile, res) {
    receiver_N = countryCode+mobile;
    otp_message = smsBody;
    console.log("Sending OTP to "+receiver_N);


    var client = new twilio(accountSid, authToken);
    client.messages.create({
        body: otp_message,
        to: receiver_N,  // Text this number
        from: '+447481337058' // From a valid Twilio number
    })
    .then((message) => {
        console.log("Message Sent --> "+ message.sid);
        if(message.sid){
            res.json({
                status: "200"
            });
        } else {
            res.json({
                status: "403"
            });
        }
    });
}




// ****** APP SERVER RUNNING LOG ****** //
app.listen(3000, () => console.log('Server Running on port 3000.'))
