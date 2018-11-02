// Author: Maria Gatou //

//Definition of the metrics 

///////////////////////////////////////////////////////////
var nrVideos=responseDatas.totalVidWatched;
var nrQuizzes=responseDatas.totalSubmits;
var actSessions= responseDatas.totalSessions;
var timeVideos=responseDatas.totalVidDuration;

if(timeVideos<=actSessions && actSessions!=0){
    var propVideos=Math.round((timeVideos/actSessions)*100);

}else if(timeVideos>actSessions){
    var propVideos=100;
}else if(timeVideos==actSessions && actSessions==0){
    var propVideos=0;
}

var forumContrib=responseDatas.contributions;
///////////////////////////////////////////////////////////

var avnrVideos=responseDatas.averageVidWatched;
var avnrQuizzes=responseDatas.averageSubSubmitted;
var avactSessions=responseDatas.averageActTime;
var avtimeVideos=responseDatas.averageTimeVid;
var avSessions=responseDatas.averageTimeSite;
var avpropVideos=Math.round((avtimeVideos/avSessions)*100);
var avforumContrib=responseDatas.averageForCont;
///////////////////////////////////////////////////////////

var bnrVideos=responseDatas.maxVidWatched;
var bvnrQuizzes=responseDatas.maxSubSubmitted;
var bvactSessions=responseDatas.maxActTime;
var bvtimeVideos=responseDatas.maxTimeVid;
var bvSessions=responseDatas.maxTimeSite;
var bvpropVideos=Math.round((bvtimeVideos/bvSessions)*100);
var bvforumContrib=responseDatas.maxForCont;
///////////////////////////////////////////////////////////

// Initialization of engagement metrics 
var nrVideosEng;
var nrQuizzesEng;
var actSessionsEng;
var propVideosEng;
var timeVideosEng;
var forumContribEng;

//Function that computes user's engagement

function engagement(){
    
    if(avnrVideos>=bnrVideos){
        avnrVideosEng=100;
        benrVideosEng=Math.round((bnrVideos*100)/avnrVideos);

        if(nrVideos>=avnrVideos){
            nrVideos=avnrVideos;
        } 
        nrVideosEng=Math.round((nrVideos/avnrVideos)*100);

    } else {
        benrVideosEng=100;
        avnrVideosEng=Math.round((avnrVideos*100)/bnrVideos);

        if(nrVideos>=bnrVideos){
            nrVideos=bnrVideos;
        } 
        nrVideosEng=Math.round((nrVideos/bnrVideos)*100);
    }


    if(avnrQuizzes>=bvnrQuizzes){
        avnrQuizzesEng=100;
        benrQuizzesEng=Math.round((bvnrQuizzes*100)/avnrQuizzes);

        if(nrQuizzes>=avnrQuizzes){
            nrQuizzes=avnrQuizzes;
        } 
        nrQuizzesEng=Math.round((nrQuizzes/avnrQuizzes)*100);

    } else {
        benrQuizzesEng=100;
        avnrQuizzesEng=Math.round((avnrQuizzes*100)/bvnrQuizzes);

        if(nrQuizzes>=bvnrQuizzes){
            nrQuizzes=bvnrQuizzes;
        } 
        nrQuizzesEng=Math.round((nrQuizzes/bvnrQuizzes)*100);
    }


    if(avSessions>=bvSessions){
        avactSessionsEng=100;
        beactSessionsEng=Math.round(((bvSessions/3600)*100)/(avSessions/3600));

        if(actSessions>=avSessions){
            actSessions=avSessions;
        } 
        actSessionsEng=Math.round((actSessions/3600)/(avSessions/3600)*100);

    } else {
        beactSessionsEng=100;
        avactSessionsEng=Math.round(((avSessions/3600)*100)/(bvSessions/3600));

        if(actSessions>=bvSessions){
            actSessions=bvSessions;
        } 
        actSessionsEng=Math.round((actSessions/3600)/(bvSessions/3600)*100);
    }


    if(avpropVideos>=bvpropVideos){
        avpropVideosEng=100;
        bepropVideosEng=Math.round((bvpropVideos*100)/avpropVideos);

        if(propVideos>=avpropVideos){
        propVideos=avpropVideos;
        } 
        propVideosEng= Math.round((propVideos/avpropVideos)*100);

    } else {
        bepropVideosEng=100;
        avpropVideosEng=Math.round((avpropVideos*100)/bvpropVideos);

        if(propVideos>=bvpropVideos){
        propVideos=bvpropVideos;
        } 
        propVideosEng= Math.round((propVideos/bvpropVideos)*100);

    }


    if(avtimeVideos>=bvtimeVideos){
        avtimeVideosEng=100;
        betimeVideosEng=Math.round(((bvtimeVideos/3600)*100)/(avtimeVideos/3600));

        if(timeVideos>=avtimeVideos){
        timeVideos=avtimeVideos;
        } 
        timeVideosEng=Math.round((timeVideos/3600)/(avtimeVideos/3600)*100);


    } else {
        betimeVideosEng=100;
        avtimeVideosEng=Math.round(((avtimeVideos/3600)*100)/(bvtimeVideos/3600));

        if(timeVideos>=bvtimeVideos){
        timeVideos=bvtimeVideos;
        } 
        timeVideosEng=Math.round((timeVideos/3600)/(bvtimeVideos/3600)*100);

    }

    if(avforumContrib>=bvforumContrib){
        avforumContribEng=100;
        beforumContribEng=Math.round((bvforumContrib*100)/avforumContrib);

        if(forumContrib>=avforumContrib){
        forumContrib=avforumContrib;
        } 
        forumContribEng=Math.round((forumContrib/avforumContrib)*100);


    } else {
        beforumContribEng=100;
        avforumContribEng=Math.round((avforumContrib*100)/bvforumContrib);

        if(forumContrib>=bvforumContrib){
        forumContrib=bvforumContrib;
        } 
        forumContribEng=Math.round((forumContrib/bvforumContrib)*100);

    }

    averageEngagement= Math.round((avnrVideosEng+avnrQuizzesEng+avactSessionsEng+avpropVideosEng+avtimeVideosEng+ avforumContribEng)/6);
    // console.log(averageEngagement, avnrVideosEng, avnrQuizzesEng,avactSessionsEng, avpropVideosEng,  avtimeVideosEng  );

    bestEngagement= Math.round((benrVideosEng+benrQuizzesEng+beactSessionsEng+bepropVideosEng+betimeVideosEng+beforumContribEng )/6);
    // console.log(bestEngagement, benrVideosEng, benrQuizzesEng,beactSessionsEng, bepropVideosEng,  betimeVideosEng  );

    userEngagement= Math.round((nrVideosEng+nrQuizzesEng+actSessionsEng+propVideosEng+timeVideosEng+forumContribEng )/6);
    // console.log(userEngagement, nrVideosEng, nrQuizzesEng,actSessionsEng, propVideosEng,  timeVideosEng  );
    
    if(averageEngagement>bestEngagement){
        bestEngagement= Math.round((bestEngagement*100)/averageEngagement);
        userEngagement= Math.round((userEngagement*100)/averageEngagement);
        averageEngagement=100;

    }else {
        averageEngagement=Math.round((averageEngagement*100)/bestEngagement);
        userEngagement=Math.round((userEngagement*100)/bestEngagement);
        bestEngagement=100;
    }
}


engagement();


//Array with metric names

var metricNames = ['My Engagement %'];

//Array with metric units

var metricUnits = ['%'];

//Defintion of values to be displayed on the tooltip

var values = [userEngagement];
var average = [averageEngagement];
var best = [bestEngagement];

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
            width: 350,
            height: 250,
            type: 'bar',
            backgroundColor: '#FBFBFB',
            plotShadow: true,
            style: {
                    fontFamily: 'Open Sans, sans-serif'
                }
          
        },
        title: {
            useHTML: true,
            text: 'Your Course Progress'+ " " + "<img src='https://shots.jotform.com/kade/Screenshots/blue_question_mark.png' height='14px' id='logo' style='cursor: pointer;' alt='' /> "+"<div id = 'popUp' style='display:none; position:absolute;  width: 220px; height: 125px; background: #F7F6F4; box-shadow: 5px 5px 5px 5px grey; padding-right:20px;'></div>"+" <div id = 'popUpText' style='display:none; position:absolute;  font-size: 10px; font-family:'Open Sans, sans-serif'; '><br>&nbsp; This widget aims to provide you with real-time <br>&nbsp; feedback on your learning behaviour in order to <br>&nbsp; improve your study plan and earn a better<br>&nbsp; understanding on what it takes to earn a passing <br>&nbsp; grade in the course.<br><br>&nbsp; More info about this widget " + "<div id=sectooltip style='cursor: pointer; display: inline-block; color:#ed0707;'>here</div>"+ "</div>" + "<div id = 'popUp2' style='display:none; position:absolute; top:150px; width:220px; height:40px; background:#F7F6F4; box-shadow: 5px 5px 5px 5px grey; padding-right:20px;'></div>"+ "<div <div id = 'popUpText2' style='display:none; position:absolute; top:150px; font-size: 10px; font-family:'Open Sans, sans-serif';'>&nbsp;Try to be engaged in more activities during the<br>&nbsp;course to make your dark blue bar grow."+ "</div>"

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
            data: [userEngagement],
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
            data: [averageEngagement],
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
            data: [100],
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