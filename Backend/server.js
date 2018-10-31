// Author: Maria Gatou //

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var mongoose   = require('mongoose');
var mongodb = require('mongodb');
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// Event models lives here
var Event     = require('./app/models/event');

// Build the connection string
// var dbURL = 'mongodb://localhost:27017/RTlog';
var dbURL = 'mongodb://username:password@server_address:27017/database_name'; // put your own username, password, server_address of the remote server that hosts mongodb and mongodb database_name

// Create the database connection
mongoose.connect(dbURL);


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURL);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth-Token, Content-Type, Accept, Authorization, X-CSRFToken, chap, seq, vert");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


// configure body parser, get data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-CSRFToken, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    req.header("Access-Control-Allow-Origin", "*");
    req.header("Access-Control-Allow-Headers", "*");
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});



// on routes that end in /events
// ----------------------------------------------------
router.route('/events')

// create an event (accessed at POST https://server:port/api/events)
    .post(function(req, res) {

        //console.log("POST request fired");

        var event = new Event();    // create a new instance of the event model
        event.week        = req.body.week;  // set the events week (comes from the request)
        event.id          = req.body.id;
        event.course      = req.body.course;
        event.time        = req.body.time;
        event.index       = req.body.index;
        event.vert        = req.body.vert;
        event.vidID       = req.body.vidID;
        event.quID        = req.body.quID;
        event.vidDuration     = req.body.vidDuration;
        event.timeSite        = req.body.timeSite;
        event.timeInterval    = req.body.timeInterval;
        event.thread         = req.body.thread;
        event.resCom         = req.body.resCom;
        event.openWidget     = req.body.openWidget;
        event.closeWidget    =req.body.closeWidget;
        event.showYou        =req.body.showYou;
        event.hideYou        =req.body.hideYou;
        event.showAvGrad     =req.body.showAvGrad;
        event.hideAvGrad     =req.body.hideAvGrad;
        event.showBeGrad     =req.body.showBeGrad;
        event.hideBeGrad     =req.body.hideBeGrad;

        event.save(function(err) {
            if (err)
                return res.send(err);

            res.json({message: "POST event created!"});
                
        });

    })


    // get all the events (accessed at GET http://localhost:8080/api/events)
    .get(function(req, res) {
        Event.distinct("vidID", {
            id: req.query.id,
            week: req.query.week,
            course: req.query.course
        },function(err, videos) {
            if (err) {
                console.log("db error");
                return res.send(err);
            }
            Event.distinct("quID", {
                id: req.query.id,
                week: req.query.week,
                course: req.query.course
            }, function(err, quizzes){
                if (err) {
                console.log("db error");
                return res.send(err);
                }
                Event.distinct("thread", {
                    id: req.query.id,
                    week: req.query.week,
                    course: req.query.course
                }, function(err, threads){
                    if (err){
                        console.log("db error");
                        return res.send(err);
                    }
                    Event.distinct("resCom", {
                        id: req.query.id,
                        week: req.query.week,
                        course: req.query.course
                    }, function(err, responseComments){
                        if(err){
                            console.log("db error");
                            return res.send(err);
                        }
                        Event.distinct("vidDuration", {
                            id: req.query.id,
                            week: req.query.week,
                            course: req.query.course
                        }, function(err, videoDuration){
                            if(err){
                                console.log("db error");
                                return res.send(err);
                            }
                            Event.distinct("timeSite", {
                                id: req.query.id,
                                week: req.query.week,
                                course: req.query.course
                            }, function(err, timeSite){
                                if(err){
                                    console.log("db error");
                                    return res.send(err);
                                }
                                Event.find({name:"Profiles"},
                                    function(err, r){
                                        if(err){
                                            console.log("db error");
                                            return res.send(err);
                                        }
                                        Event.distinct("timeInterval", {
                                            id: req.query.id,
                                            week: req.query.week,
                                            course: req.query.course
                                        }, function(err, timeInterval){
                                            if(err){
                                                console.log("db error");
                                                return res.send(err);
                                            }
                                            // Event.distinct("openWidget", {
                                            //     id: req.query.id,
                                            //     week: req.query.week,
                                            //     course: req.query.course
                                            // }, function(err, openWidget){
                                            //     if(err){
                                            //         console.log("db error");
                                            //         return res.send(err);
                                            //     }
                                            //     Event.distinct("closeWidget", {
                                            //         id: req.query.id,
                                            //         week: req.query.week,
                                            //         course: req.query.course
                                            //     }, function(err, closeWidget){
                                            //         if(err){
                                            //             console.log("db error");
                                            //             return res.send(err);
                                            //         }
                                            //         Event.distinct("showYou", {
                                            //             id: req.query.id,
                                            //             week: req.query.week,
                                            //             course: req.query.course

                                            //         }, function(err, showYou){
                                            //             if(err){
                                            //                 console.log("db error");
                                            //                 return res.send(err);
                                            //             }
                                            //             Event.distinct("hideYou", {
                                            //                 id: req.query.id,
                                            //                 week: req.query.week,
                                            //                 course: req.query.course

                                            //             }, function(err, hideYou){
                                            //                 if(err){
                                            //                     console.log("db error");
                                            //                     return res.send(err);
                                            //                 }
                                            //                 Event.distinct("showAvGrad", {
                                            //                     id: req.query.id,
                                            //                     week: req.query.week,
                                            //                     course: req.query.course

                                            //                 }, function(err, showAvGrad){
                                            //                     if(err){
                                            //                         console.log("db error");
                                            //                         return res.send(err);
                                            //                     }
                                            //                     Event.distinct("hideAvGrad", {
                                            //                         id: req.query.id,
                                            //                         week: req.query.week,
                                            //                         course: req.query.course

                                            //                     }, function(err, hideAvGrad){
                                            //                         if(err){
                                            //                             console.log("db error");
                                            //                             return res.send(err);
                                            //                         }
                                            //                         Event.distinct("showBeGrad", {
                                            //                              id: req.query.id,
                                            //                              week: req.query.week,
                                            //                              course: req.query.course

                                            //                         }, function(err, showBeGrad){
                                            //                             if(err){
                                            //                                 console.log("db error");
                                            //                                 return res.send(err);
                                            //                             }
                                            //                             Event.distinct("hideBeGrad", {
                                            //                                  id: req.query.id,
                                            //                                  week: req.query.week,
                                            //                                  course: req.query.course

                                            //                             }, function(err, hideBeGrad){
                                            //                                 if(err){
                                            //                                     console.log("db error");
                                            //                                     return res.send(err);
                                            //                                 }
                                                                            
                                                    
                                            
                                    
                                            res.json({videos:videos.length,
                                                      quizzes:quizzes.length,
                                                      threads:threads.length,
                                                      responseComments:responseComments.length,
                                                      videoDuration:videoDuration,
                                                      timeSite:timeSite,
                                                      profiles:r[0],
                                                      timeInterval:timeInterval});
                                                      // openWidget:openWidget,
                                                      // closeWidget: closeWidget,
                                                      // showYou: showYou.length,
                                                      // hideYou: hideYou.length,
                                                      // showAvGrad: showAvGrad.length,
                                                      // hideAvGrad: showAvGrad.length,
                                                      // showBeGrad: showBeGrad.length,
                                                      // hideBeGrad: hideBeGrad.length});

                                            //                             });

                                            //                         });


                                            //                     });
                                                             

                                            //                 });   


                                            //             });

                                            //         });


                                            //     });

                                            // });
                                        });

                                });
                            });
                        });

                    });
                });

            });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen("8080", function(){
  console.log('Server is up!');
}); 