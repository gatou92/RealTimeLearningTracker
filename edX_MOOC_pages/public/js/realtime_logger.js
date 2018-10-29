// Author: Maria Gatou //
////////////////////////////////////////////////
//              Logging User Data             //
///////////////////////////////////////////////


// Some Variables
var chap;
var seq;
var vert;
var origin;
var username;
var userid;
var time;
var timeInterval;
var datas = {};
var responseDatas = {};
var refresh1;
var refresh2;
var refresh3;
var refresh4;
var widgetEvent= $.cookie("widgetEvent");
var openWidget;
var closeWidget;
var showYou;
var hideYou;
var showAvGrad;
var hideAvGrad;
var showBeGrad;
var hideBeGrad;
var minimEvent = $.cookie("minimEvent");



var SERVER_URL = "https://mariagatou2.com"; //replace it with your domain

//Logs user info & course data
function get_data() {
    var d = $.Deferred();
    datas = {};
    username = analytics._user._getTraits().username;
    var url = window.location.href;
    var split = url.split("/");
    chap = split[6];
    datas.week = chap;
    seq = split[7];
    var block = $('#sequence-list .nav-item.active').data('id');
    vert = block.split("@").pop();
    var course = split[4].split(":")[1];
    origin = chap+"/"+seq+"/"+vert;
    userid = analytics.user()._getId();
    datas.id = userid;
    datas.course = course;
    datas.time = new Date();
    datas.index = datas.id + "_" + datas.time.getTime();
    datas.vert = vert;
    d.resolve();
    //Use of promises for defining the sequence of functions
    return d.promise();
}

//Event that is fired when the window is loaded
window.onload = function initMariasListeners() {
    if ((typeof(widgetEvent) === 'undefined') || (widgetEvent==null)){
        widgetEvent=$.cookie("widgetEvent", 1);
    }

    if ((typeof(minimEvent) === 'undefined') || (minimEvent == null)){
        minimEvent = $.cookie("minimEvent", 0);
    }
    //Master sequence of functions
    get_data().pipe(getLog).pipe(dashGen);
    
    //Stores in a variable the time interval in a specific page
    refresh1=setInterval(function() {

        timeInterval = (new Date()-startTime ) / 1000;
        datas.timeInterval = timeInterval;
        //console.log('time passed ', datas.timeInterval);
    
    }, 2 * 1000 /* interval is in milliseconds */ );

    restartTimer();

};

//Event that is fired when the page is reloaded or when user goes to a new sequential
window.onbeforeunload = function () {
    timeSite=timeInterval;
    datas.time = new Date();
    datas.index = datas.id + "_" + datas.time.getTime();
    get_data();
    datas.timeSite = timeSite;
    
    if ((typeof(widgetEvent) === 'undefined') || (widgetEvent==null)){
        widgetEvent=$.cookie("widgetEvent", 1);
    }

    if ((typeof(minimEvent) === 'undefined') || (minimEvent == null)){
        minimEvent = $.cookie("minimEvent", 0);
    }

    postLog().pipe(getLog).pipe(dashGen);
};


//////////////////////////////////////////////
    //          Logging User Time Spent        //
    //////////////////////////////////////////////
var startTime, widgetStart, timeSite;
refresh2=setTimeout(function(){
    startTime=new Date();
}, 1000);




//////////////////////////////////////////////
    //////////////////////////////////////////////


// Event that is fired when user goes to a new vertical //
$(".sequence-nav").unbind('click').click(function () {
    timeSite=timeInterval;
    datas.time = new Date();
    datas.index = datas.id + "_" + datas.time.getTime();
    get_data();
    datas.timeSite = timeSite;
    postLog().pipe(getLog).pipe(dashGen);
});

$(".sequence-bottom").unbind('click').click(function () {
    timeSite=timeInterval;
    datas.time = new Date();
    datas.index = datas.id + "_" + datas.time.getTime();
    get_data();
    datas.timeSite = timeSite;
    postLog().pipe(getLog).pipe(dashGen);
});

///////////////////////////////////////////////////////////

//Sends a POST request to server
function postLog() {
    var d = $.Deferred();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER_URL + "/api/events",
        "method": "POST",
        "data": {
            "week": datas.week,
            "id": datas.id,
            "course": datas.course,
            "vert": datas.vert,
            "vidID": datas.vidID,
            "quID": datas.quID,
            "vidDuration": datas.vidDuration,
            "timeSite": datas.timeSite,
            "timeInterval": datas.timeInterval,
            "time": datas.time,
            "index": datas.index,
            "thread": datas.thread,
            "resCom":datas.resCom,
            "openWidget":datas.openWidget,
            "closeWidget":datas.closeWidget,
            "showYou": datas.showYou,
            "hideYou": datas.hideYou,
            "showAvGrad": datas.showAvGrad,
            "hideAvGrad": datas.hideAvGrad,
            "showBeGrad": datas.showBeGrad,
            "hideBeGrad": datas.hideBeGrad
        }
    };
    $.ajax(settings).done(function (response) {
        //console.log(response.message);
        d.resolve(); 
    });
    return d.promise();
}

//Sends a GET request to server
function getLog() {
    var d = $.Deferred();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER_URL + "/api/events",
        "method": "GET",
        "data": {
            "week": datas.week,
            "id": datas.id,
            "course": datas.course,
            "vert": datas.vert,
            "time": datas.time,
            "index": datas.index
        }
    };
    $.ajax(settings).done(function (response) {

        responseDatas.totalVidWatched = response.videos;
        //console.log("total videos watched: ", responseDatas.totalVidWatched);

        responseDatas.totalSubmits = response.quizzes;
        //console.log("total quizzes submitted: ", responseDatas.totalSubmits);

        responseDatas.totalThreads = response.threads;
        //console.log("total threads posted: ", responseDatas.totalThreads);

        responseDatas.totalResCom = response.responseComments;
        //console.log("total responses/comments posted: ", responseDatas.totalResCom);

        responseDatas.contributions = Number(responseDatas.totalThreads)+ Number(responseDatas.totalResCom);
        //console.log("total forum contributions: ", responseDatas.contributions );

        if (typeof response.videoDuration !== 'undefined' && response.videoDuration.length > 0) {
            responseDatas.totalVidDuration=response.videoDuration.reduce(add);
            //console.log("total video duration: ", responseDatas.totalVidDuration);
        } else{
            responseDatas.totalVidDuration=0;
            //console.log("total video duration: ", responseDatas.totalVidDuration);
        }

        if (typeof response.timeSite !== 'undefined' && response.timeSite.length > 0) {
            responseDatas.totalTimeSite=response.timeSite.reduce(add);
            //console.log("total timeSite: ", responseDatas.totalTimeSite);
        } else{
            responseDatas.totalTimeSite=0;
            //console.log("total timeSite: ", responseDatas.totalTimeSite);
        }

        if (typeof response.timeInterval !== 'undefined' && response.timeInterval.length > 0) {
            responseDatas.totalTimeInterval=response.timeInterval.reduce(add);
            //console.log("total timeInterval: ", responseDatas.totalTimeInterval);
        } else{
            responseDatas.totalTimeInterval=0;
            //console.log("total timeInterval: ", responseDatas.totalTimeInterval);
        }

        responseDatas.totalSessions = Number(responseDatas.totalTimeInterval)+ Number(responseDatas.totalTimeSite);
        //console.log("total time on the platform: ",  responseDatas.totalSessions );
        
        /////////////////////////////////////////////////////////////////////////////////////
        //                           Log the widget time open/close                        //

       // if (typeof response.openWidget !== 'undefined' && response.openWidget.length > 0) {
       //      responseDatas.totalOpenTime=response.openWidget.reduce(add);
       //      console.log("total time open: ", responseDatas.totalOpenTime);
       //  } else{
       //      responseDatas.totalOpenTime=0;
       //      console.log("total time open: ", responseDatas.totalOpenTime);
       //  }


       // if (typeof response.closeWidget !== 'undefined' && response.closeWidget.length > 0) {
       //      responseDatas.totalCloseTime=response.closeWidget.reduce(add);
       //      console.log("total time close: ", responseDatas.totalCloseTime);
       //  } else{
       //      responseDatas.totalCloseTime=0;
       //      console.log("total time close: ", responseDatas.totalCloseTime);
       //  }

        ///////////////////////////////////////////////////////////////////////////////////
        //                   Log Widget interactions                                     //

        // responseDatas.totalShowYou = response.showYou;
        // console.log("total showYou: ", responseDatas.totalShowYou);

        // responseDatas.totalHideYou = response.hideYou;
        // console.log("total hideYou: ", responseDatas.totalHideYou);

        // responseDatas.totalShowAvGrad = response.showAvGrad;
        // console.log("total showAvGrad: ", responseDatas.totalShowAvGrad);

        // responseDatas.totalHideAvGrad = response.hideAvGrad;
        // console.log("total hideAvGrad: ", responseDatas.totalHideAvGrad);


        // responseDatas.totalShowBeGrad = response.showBeGrad;
        // console.log("total showBeGrad: ", responseDatas.totalShowBeGrad);

        // responseDatas.totalHideBeGrad = response.hideBeGrad;
        // console.log("total hideBeGrad: ", responseDatas.totalHideBeGrad);

        ///////////////////////////////////////////////////////////////////////////////////

        responseDatas.averageVidWatched = response.profiles.avgVidWatched;
        //console.log("average videos watched: ", responseDatas.averageVidWatched);

        responseDatas.averageSubSubmitted = response.profiles.avgSubQuiz;
        //console.log("average quizzes submitted: ", responseDatas.averageSubSubmitted);

        responseDatas.averageActTime = response.profiles.avgActSes;
        //console.log("average active sessions on the platform: ", responseDatas.averageActTime);

        responseDatas.averageForCont = response.profiles.avgForum;
        //console.log("average forum contributions: ", responseDatas.averageForCont);

        // responseDatas.averageTimeQuiz = response.profiles.avTimeQuiz;
        // console.log("average time spent on quizzes: ", responseDatas.averageTimeQuiz);

        responseDatas.averageTimeVid = response.profiles.avgTimeVid;
        //console.log("average time spent on videos: ", responseDatas.averageTimeVid);

        responseDatas.averageTimeSite = response.profiles.avgTimeSite;
        //console.log("average time on the platform: ", responseDatas.averageTimeSite);

        //////////////////////////////////////////////////////////////////////////////////

        responseDatas.maxVidWatched = response.profiles.mostEngVidWatched;
        //console.log("max videos watched: ", responseDatas.maxVidWatched);

        responseDatas.maxSubSubmitted = response.profiles.mostEngSubQuiz;
        //console.log("max quizzes submitted: ", responseDatas.maxSubSubmitted);

        responseDatas.maxActTime = response.profiles.mostEngActSes;
        //console.log("max active sessions on the platform: ", responseDatas.maxActTime);

        responseDatas.maxForCont = response.profiles.mostEngForum;
        //console.log("max forum contributions: ", responseDatas.maxForCont);

        // responseDatas.maxTimeQuiz = response.profiles.maxTimeQuiz;
        // console.log("max time spent on quizzes: ", responseDatas.maxTimeQuiz);

        responseDatas.maxTimeVid = response.profiles.mostEngTimeVid;
        //console.log("max time spent on videos: ", responseDatas.maxTimeVid);

        responseDatas.maxTimeSite = response.profiles.mostEngTimeSite;
        //console.log("max time on the platform: ", responseDatas.maxTimeSite);

        d.resolve();    
    });
    return d.promise();
}


//function takes a string to be sent via xhr and turns it back into an object to make it easier
//to read on the console
function splitParamString(input) {
    if(input == null){
        return {};
    }
    var params = input.split("&");
    var paramObject = {};
    params.forEach(function(element) {
        var keyValue = element.split("=");
        paramObject[keyValue[0]]=keyValue[1];
    });
    return paramObject;
}

//Goal: log all data that is sent in xhr post requests to console before they are sent
var vidlog;
var plays = [];
var pauses = [];
var durVid;
var vidSum = [];
var url = document.URL;

// This will break studio if it runs inside of it, so this IF statement make it so the XHR intercept only fires if not in studio
if (intercepted == undefined){
    var intercepted = false
}

if (url.includes('studio') === false && intercepted == false) {
    intercepted = true;
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        vidlog = splitParamString(data);
        vidlog.time = new Date();
        var listening = true;
        if (listening && vidlog.event_type === "play_video") {
            listening = false;
            setTimeout(function () {
                listening = true
            }, 2000);
            plays.push(vidlog.time);
            addUp();
        } else if (listening && vidlog.event_type === "pause_video") {
            listening = false;
            setTimeout(function () {
                listening = true
            }, 2000);
            pauses.push(vidlog.time);
            addUp();
        } else if (vidlog.event_type === "problem_check") {
            datas.quID = vidlog.event.split("_")[1];
            //console.log("quid:",datas.quID);
            postLog().pipe(getLog).pipe(realUpdate).pipe(refreshInterval);
        }else if (vidlog.thread_type) {
            datas.thread = vidlog.time;
            //console.log("thread: ", datas.thread);
            postLog().pipe(getLog).pipe(realUpdate).pipe(refreshInterval);
        } else if (vidlog.body && !vidlog.thread_type){
            datas.resCom = vidlog.time;
            //console.log("response-comment: ", datas.resCom);
            postLog().pipe(getLog).pipe(realUpdate).pipe(refreshInterval);
        }
        origSend.call(this,data);
    };
}
// Takes the Pauses and Plays arrays and finds total duration between play and pause events
function addUp() {
    for (i=0; i<= pauses.length-1; i++) {
        vidSum[i] = pauses[i] - plays[i];
    }
    durVid = vidSum.reduce(add, 0) / 1000;
    datas.vidDuration=durVid;
    if (durVid >= 30 ) {
        datas.vidID = vidlog.event.split("%")[5];
        //console.log("vidid:",datas.vidID);
        postLog().pipe(getLog).pipe(realUpdate).pipe(refreshInterval);
    } else if (durVid < 30) {
        //console.log("not finished yet");
    }
}

// Returns the Sum of an Array
function add(a, b) {
    return a + b;
}

//Function that generates the different versions of the widget in a pop-up window
function dashGen(){
    var d = $.Deferred();

    // Assign Experimental Conditions based on user_id
    if(parseInt(datas.id)%4==0){
        
    } else if(parseInt(datas.id)%4==1){
        if(minimEvent==1){
            $(".btn-minimize").html("+");
            document.getElementById("btn").style.visibility= "visible" ;
            $(".btn-minimize").click(function(){

                $.getScript('/static/simple_version.js');
                document.getElementById("widget").style.height= "250px" ;
                document.getElementById("widget").style.visibility= "visible" ;
                
                    if($(this).html() == "-"){
                        $(this).html("+");
                        $.cookie("widgetEvent", 0);
                        document.getElementById("widget").style.display= "none" ;
                        $.cookie("minimEvent", 1);
                    }
                    else{
                        $(this).html("-");
                        $.cookie("widgetEvent", 1);
                        document.getElementById("widget").style.height= "250px" ;
                        document.getElementById("widget").style.display= "block" ;
                        $.cookie("minimEvent", 0);
                    }
                clearInterval(refresh3);
                clearTimeout(refresh4);
                restartTimer().pipe(postLog);

              d.resolve();    
          
        });
        } else{
            $.getScript('/static/simple_version.js');
            document.getElementById("widget").style.height= "250px" ;
            document.getElementById("widget").style.visibility= "visible" ;
            $(".btn-minimize").html("-");
            document.getElementById("btn").style.visibility= "visible" ;
            $(".btn-minimize").click(function(){
                    if($(this).html() == "-"){
                        $(this).html("+");
                        $.cookie("widgetEvent", 0);
                        $.cookie("minimEvent", 1);
                    }
                    else{
                        $(this).html("-");
                        $.cookie("widgetEvent", 1);
                        $.cookie("minimEvent", 0);
                    }
                clearInterval(refresh3);
                clearTimeout(refresh4);
                restartTimer().pipe(postLog);


              $(this).toggleClass('btn-plus');
              $("#widget").slideToggle();
              d.resolve();    
            });
        } //end of else minevent
        
         

    } else if(parseInt(datas.id)%4==2){
        if(minimEvent==1){
            $(".btn-minimize").html("+");
            document.getElementById("btn").style.visibility= "visible" ;
            $(".btn-minimize").click(function(){

                $.getScript('/static/intermediate_version.js');
                document.getElementById("widget").style.visibility= "visible" ;
                
                    if($(this).html() == "-"){
                        $(this).html("+");
                        $.cookie("widgetEvent", 0);
                        document.getElementById("widget").style.display= "none" ;
                        $.cookie("minimEvent", 1);
                    }
                    else{
                        $(this).html("-");
                        $.cookie("widgetEvent", 1);
                        document.getElementById("widget").style.display= "block" ;
                        $.cookie("minimEvent", 0);
                    }
                clearInterval(refresh3);
                clearTimeout(refresh4);
                restartTimer().pipe(postLog);

              d.resolve();    
          
        });
        } else{
            $.getScript('/static/intermediate_version.js');
            document.getElementById("widget").style.visibility= "visible" ;
            $(".btn-minimize").html("-");
            document.getElementById("btn").style.visibility= "visible" ;
            $(".btn-minimize").click(function(){
                    if($(this).html() == "-"){
                        $(this).html("+");
                        $.cookie("widgetEvent", 0);
                        $.cookie("minimEvent", 1);
                    }
                    else{
                        $(this).html("-");
                        $.cookie("widgetEvent", 1);
                        $.cookie("minimEvent", 0);
                    }
                clearInterval(refresh3);
                clearTimeout(refresh4);
                restartTimer().pipe(postLog);


              $(this).toggleClass('btn-plus');
              $("#widget").slideToggle();
              d.resolve();    
            });
        } //end of else minevenet
        
            


    } else if(parseInt(datas.id)%4==3){

        if(minimEvent==1){
            $(".btn-minimize").html("+");
            document.getElementById("btn").style.visibility= "visible" ;
            $(".btn-minimize").click(function(){

                $.getScript('/static/complex_version.js');
                document.getElementById("widget").style.visibility= "visible" ;
                
                    if($(this).html() == "-"){
                        $(this).html("+");
                        $.cookie("widgetEvent", 0);
                        document.getElementById("widget").style.display= "none" ;
                        $.cookie("minimEvent", 1);
                    }
                    else{
                        $(this).html("-");
                        $.cookie("widgetEvent", 1);
                        document.getElementById("widget").style.display= "block" ;
                        $.cookie("minimEvent", 0);
                    }
                
                clearInterval(refresh3);
                clearTimeout(refresh4);
                restartTimer().pipe(postLog);


              d.resolve();    
          
        });
        } else{
            $.getScript('/static/complex_version.js');
            document.getElementById("widget").style.visibility= "visible" ;
            $(".btn-minimize").html("-");
            document.getElementById("btn").style.visibility= "visible" ;
            $(".btn-minimize").click(function(){
                    if($(this).html() == "-"){
                        $(this).html("+");
                        $.cookie("widgetEvent", 0);
                        $.cookie("minimEvent", 1);
                    }
                    else{
                        $(this).html("-");
                        $.cookie("widgetEvent", 1);
                        $.cookie("minimEvent", 0);
                    }
                
                clearInterval(refresh3);
                clearTimeout(refresh4);
                restartTimer().pipe(postLog);


              $(this).toggleClass('btn-plus');
              $("#widget").slideToggle();
              d.resolve();    
            });
        } //end of else minevent 
        
     

    } else{}
   
    return d.promise();
}


//Function that updates the widget in real-time
function realUpdate(){
    var d = $.Deferred();

    if(parseInt(datas.id)%4==0){

    } else if(parseInt(datas.id)%4==1){
        $.getScript('/static/simple_version.js');
         d.resolve(); 

    } else if(parseInt(datas.id)%4==2){
        $.getScript('/static/intermediate_version.js');
         d.resolve(); 

    } else if(parseInt(datas.id)%4==3){
        $.getScript('/static/complex_version.js');
        d.resolve(); 

    } else{}

    return d.promise();  

}

//Function that refreshes the timer
function refreshInterval(){
    var d = $.Deferred();
    clearInterval(refresh1);
    //console.log('stopped interval');

    clearTimeout(refresh2);
    //console.log('stopped timeout');

    setTimeout(function(){
    //console.log("Started again timeout");
    startTime=new Date();
    }, 1000);

    setInterval(function() {
        //console.log('Started again interval');
    
        timeInterval = (new Date()-startTime ) / 1000;
        datas.timeInterval = timeInterval;
        //console.log('time now ', datas.timeInterval);
    
    }, 2 * 1000 /* interval is in milliseconds */ );
    
    d.resolve(); 
    return d.promise();  
}

//Function that refreshes the timer for the widget
function restartTimer(){
    var d = $.Deferred();

    refresh4=setTimeout(function(){
    widgetStart=new Date();
    }, 1000);
    
   
   refresh3=setInterval(function() {

    wtime = (new Date()-widgetStart ) / 1000;
    if ($.cookie("widgetEvent") == 1){
        openWidget = wtime;
        datas.openWidget=openWidget;
        //console.log('widget was open for: ', openWidget);

    }else{
        closeWidget = wtime;
        datas.closeWidget=closeWidget;
        //console.log('widget was closed for: ', closeWidget);
    }

    }, 2 * 1000 /* interval is in milliseconds */ );
    

    d.resolve(); 
    return d.promise();  

}