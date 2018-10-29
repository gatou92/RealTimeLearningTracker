// Author: Maria Gatou //

//Definition of the metrics to be displayed

/////////////////////////////////////////////////////////
var nrVideos=responseDatas.totalVidWatched;
var nrQuizzes=responseDatas.totalSubmits;
var actSessions= responseDatas.totalSessions;
var timeVideos=responseDatas.totalVidDuration;
if(timeVideos<actSessions){
    var propVideos=Math.round((timeVideos/actSessions)*100);

}else{
    var propVideos=100;
}

var forumContrib=responseDatas.contributions;
/////////////////////////////////////////////////////////

var avnrVideos=responseDatas.averageVidWatched;
var avnrQuizzes=responseDatas.averageSubSubmitted;
var avactSessions=responseDatas.averageActTime;
var avtimeVideos=responseDatas.averageTimeVid;
var avSessions=responseDatas.averageTimeSite;
var avpropVideos=Math.round((avtimeVideos/avSessions)*100);
var avforumContrib=responseDatas.averageForCont;

///////////////////////////////////////////////////////

var bnrVideos=responseDatas.maxVidWatched;
var bvnrQuizzes=responseDatas.maxSubSubmitted;
var bvactSessions=responseDatas.maxActTime;
var bvtimeVideos=responseDatas.maxTimeVid;
var bvSessions=responseDatas.maxTimeSite;
var bvpropVideos=Math.round((bvtimeVideos/bvSessions)*100);
var bvforumContrib=responseDatas.maxForCont;

///////////////////////////////////////////////////////

// Normalized variables with best reaching 80%
if(avnrVideos>bnrVideos){
    var maxNrVideos = Math.round((avnrVideos*100)/80);

} else {
    var maxNrVideos = Math.round((bnrVideos*100)/80);

}

var normNrVideos = Math.round((nrVideos*100)/maxNrVideos);
var normAvNrVideos = Math.round((avnrVideos*100)/maxNrVideos);
var normBeNrVideos = Math.round((bnrVideos*100)/maxNrVideos);

if(avnrQuizzes>bvnrQuizzes){
    var maxNrQuizzes = Math.round((avnrQuizzes*100)/80);

} else {
    var maxNrQuizzes = Math.round((bvnrQuizzes*100)/80);

}

var normNrQuizzes = Math.round((nrQuizzes*100)/maxNrQuizzes);
var normAvNrQuizzes = Math.round((avnrQuizzes*100)/maxNrQuizzes);
var normBeNrQuizzes = Math.round((bvnrQuizzes*100)/maxNrQuizzes);

if(avSessions>bvSessions){
    var maxSessions = Math.round((avSessions*100)/80);

} else {
    var maxSessions = Math.round((bvSessions*100)/80);

}

var normSessions = Math.round((actSessions*100)/maxSessions);
var normAvSessions = Math.round((avSessions*100)/maxSessions);
var normBeSessions = Math.round((bvSessions*100)/maxSessions);


if(avtimeVideos>bvtimeVideos){
    var maxTimeVideos = Math.round((avtimeVideos*100)/80);

} else {
    var maxTimeVideos = Math.round((bvtimeVideos*100)/80);

}

var normTimeVideos  = Math.round((timeVideos*100)/maxTimeVideos);
var normAvTimeVideos = Math.round((avtimeVideos*100)/maxTimeVideos);
var normBeTimeVideos  = Math.round((bvtimeVideos*100)/maxTimeVideos);

if(avpropVideos>bvpropVideos){
    var maxPropVideos = Math.round((avpropVideos*100)/80);

} else {
    var maxPropVideos = Math.round((bvpropVideos*100)/80);

}


var normPropVideos= Math.round((propVideos*100)/maxPropVideos);
var normAvPropVideos= Math.round((avpropVideos*100)/maxPropVideos);
var normBePropVideos = Math.round((bvpropVideos*100)/maxPropVideos);

if(avforumContrib>bvforumContrib){
    var maxForumContrib = Math.round((avforumContrib*100)/80);

} else {
    var maxForumContrib = Math.round((bvforumContrib*100)/80);

}

var normForumContrib  = Math.round((forumContrib*100)/maxForumContrib);
var normAvForumContrib = Math.round((avforumContrib*100)/maxForumContrib);
var normBeForumContrib  = Math.round((bvforumContrib*100)/maxForumContrib);

/////////////////////////////////////////////////////////////////////////////

//Array with metric names

var metricNames = ['Videos Watched',
'Submitted Quizzes',
'Time on the platform',
'Time watching videos',
'Ratio video-time/total-time',
'Forum contributions'];

//Array with metric units

var metricUnits = ['',
'',
'm',
'm',
'%',
''];

//Defintion of values to be displayed on the tooltip

var values = [nrVideos, nrQuizzes, Math.round(actSessions/60), Math.round(timeVideos/60), propVideos, forumContrib];
var average = [avnrVideos, avnrQuizzes, Math.round(avSessions/60), Math.round(avtimeVideos/60), avpropVideos, avforumContrib];
var best = [bnrVideos, bvnrQuizzes, Math.round(bvSessions/60), Math.round(bvtimeVideos/60), bvpropVideos, bvforumContrib];

//Function that displays the above values on the tooltip

function getSeriesValue(chart, i) {
    
    if(chart.points[i].series.name == 'You')
        return values[chart.x];
    else if(chart.points[i].series.name == 'Average Graduate')
        return average[chart.x];
    else 
        return best[chart.x];
}

//Function that creates a timestamp
function timeStamp() {
  var now = new Date();
  var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate() ];
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

  if( date[1] < 10 ) {
    date[1] = "0" + date[1];
  }
  
  return date.join("-") + "Z" + time.join(":");
}

//Function that creates the bar chart

function loadWidget() {

    $('#widget').highcharts({
        chart: {
            type: 'bar',
            backgroundColor: '#FBFBFB',
            plotShadow: true,
            style: {
                    fontFamily: 'Open Sans, sans-serif'
                }
          
        },
        title: {
            useHTML: true,
            text: 'Your Course Progress'+ " " + "<img src='https://shots.jotform.com/kade/Screenshots/blue_question_mark.png' height='14px' id='logo' style='cursor: pointer;' alt='' /> "+"<div id = 'popUp' style='display:none; position:absolute;  width: 220px; height: 125px; background: #F7F6F4; box-shadow: 5px 5px 5px 5px grey; padding-right:20px;'></div>"+" <div id = 'popUpText' style='display:none; position:absolute;  font-size: 10px; font-family:'Open Sans, sans-serif'; '><br>&nbsp; This widget aims to provide you with real-time <br>&nbsp; feedback on your learning behaviour in order to <br>&nbsp; improve your study plan and earn a better<br>&nbsp; understanding on what it takes to earn a passing <br>&nbsp; grade in the course.<br><br>&nbsp; More info about this widget " + "<div id=sectooltip style='cursor: pointer; display: inline-block; color:#ed0707;'>here</div>"+ "</div>" + "<div id = 'popUp2' style='display:none; position:absolute; top:150px; width:220px; height:140px; background:#F7F6F4; box-shadow: 5px 5px 5px 5px grey; padding-right:20px;'></div>"+ "<div <div id = 'popUpText2' style='display:none; position:absolute; top:150px; font-size: 10px; font-family:'Open Sans, sans-serif';'>&nbsp;For example, if you see the medium blue 'Average<br>&nbsp; Graduate' value for the 'Ratio video-time/total-<br>&nbsp;time' (calculated by dividing the time spent <br>&nbsp; watching videos by your total time spent  in the <br>&nbsp; course environment) is considerably higher than <br>&nbsp; your dark blue value for that metric, then you <br>&nbsp; might benefit from making an extra effort to <br>&nbsp; spend more time watching videos when you are <br>&nbsp; in the course environment. "+ "</div>"
        },
        xAxis: {
            tickInterval: 0,
            labels: {
                formatter: function () {
                    return metricNames[this.value];
                }
            },
          
        },
        yAxis: [{
          
          title: {
                    text: ''
                 },
           labels: {
                    enabled: true,
                    format: '{value}%',
                },
          
            min: 0,
            max:100,
            gridLineColor: '#FBFBFB',
            visible: 'false',
          
           
        
           
        }],
        legend: {
            shadow: true,
            itemStyle: {
                 font: 'Open Sans, sans-serif',
                 color: '#000000',
                 fontSize:'6.5px',
              },
            itemHoverStyle: {
                color: '#FF0000'
            }
        },
        tooltip: {
            shared: true,
            formatter: function () {
                var tooltip_text = '<b>' + metricNames[this.x] + '</b>';
                var unit = metricUnits[this.x];

                for (i = this.points.length - 1; i >= 0; i--) { 
                    tooltip_text += '<br/>' + this.points[i].series.name + ': <b>' + getSeriesValue(this, i) + ' ' + unit + '</b>';
                }

                return tooltip_text;
            },
        },
        plotOptions: {
            bar: {
                grouping: false,
                shadow: true,
                borderWidth: 0.2
            }
        },
        series: [{
            name: 'You',
            color: 'rgb(19, 108, 165)',
            data: [normNrVideos, normNrQuizzes, normSessions, normTimeVideos, normPropVideos, normForumContrib],
            pointPadding:  0.01,
            pointPlacement: -0.1,
            events: {
                show: function () {
                    datas.showYou = timeStamp();
                    // console.log( datas.showYou );
                    postLog();
                },
                hide: function () {
                    datas.hideYou = timeStamp();
                    // console.log( datas.hideYou );
                    postLog();
                }
            }
            
        }, {
            name: 'Average Graduate',
            color: 'rgb(31, 159, 217)',
            data: [normAvNrVideos, normAvNrQuizzes, normAvSessions, normAvTimeVideos, normAvPropVideos, normAvForumContrib],
            pointPadding:  0.2,
            pointPlacement: -0.1,
            events: {

                show: function () {
                    datas.showAvGrad = timeStamp();
                    // console.log( datas.showAvGrad );
                    postLog();
                },
                hide: function () {
                    datas.hideAvGrad = timeStamp();
                    // console.log( datas.hideAvGrad );
                    postLog();
                }
            }
        },
           
           {
            name: 'Most Engaged Graduate',
            color: 'rgb(128, 255, 255)',
            data: [normBeNrVideos, normBeNrQuizzes, normBeSessions, normBeTimeVideos, normBePropVideos, normBeForumContrib],
            pointPadding:  0.45,
            pointPlacement: -0.1,
            events: {
                show: function () {
                    datas.showBeGrad = timeStamp();
                    // console.log( datas.showBeGrad );
                    postLog();
                },
                hide: function () {
                    datas.hideBeGrad = timeStamp();
                    // console.log( datas.hideBeGrad );
                    postLog();
                }
            }
        }
         
           ],
      
      credits: {
            enabled: false
        }
    });
}

loadWidget();

//Question mark tooltip on click
var h = false;
$("#logo").click(function(){
    if (h == false){
        $("#popUp").fadeIn();
        $("#popUpText").fadeIn(function(){h = true;});
    }
    if (h == true){
        $("#popUp").fadeOut();
        $("#popUpText").fadeOut(function(){h=false});
        $("#popUp2").fadeOut();
        $("#popUpText2").fadeOut(function(){t = false});
    }
});


//Second tooltip on hover
var t = false;
$("#sectooltip").hover(function(){
    if (t == false){
        $("#popUp2").fadeIn();
        $("#popUpText2").fadeIn(function(){t = true;});
    }
    if (t == true){
        $("#popUp2").fadeOut();
        $("#popUpText2").fadeOut(function(){t = false});
    }
});