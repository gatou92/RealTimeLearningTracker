# Author: Maria Gatou #

from pymongo import MongoClient
import datetime
from datetime import timedelta, datetime

import sys
from pymongo.errors import ConnectionFailure # For catching exeptions

def func():
# MongoDB connection
    try:
        client = MongoClient("mongodb://username:password@server_address:27017/database_name") # put your own username, password, server_address of the remote server that hosts mongodb database and mongodb database_name
        print "Connected to MongoDB successfully!"
    except ConnectionFailure, e:
        sys.stderr.write("Could not connect to MongoDB: %s" % e)

    db = client.database_name  # put mongodb database_name
    db.drop_collection("metrics")


    # Fetching all the distinct course_learner_id
    curs_id = db.learner_demographic.distinct("course_learner_id")

    #custom record id rather than mongodb default hash id
    cid = 0

    for c in curs_id:
        print "student = ",c
        cid += 1  # increment id

        #Dict  creation
        dict = {}
        dict['_id'] = cid
        dict['Nr_of_videos_watched'] = 0
        dict['Nr_of_submitted_quizzes'] = 0
        dict['Nr_of_forum_contributions'] = 0
        dict['Active_sessions_on_the_platform_in_s'] = 0
        dict['Proportion_of_time_spent_on_quizzes'] = 0
        dict['Time_spent_on_videos_in_s'] = 0
        dict['Total_time_on_the_platform_in_s'] = 0
        dict['Timeliness_of_submitted_quizzes'] = 0

        # Student id
        cursor_glID = db.learner_index.find({"course_learner_id": c}).distinct("global_learner_id")

        for glid in cursor_glID:
            dict['Student_id'] = str(glid)


        # Nr of videos watched
        cursor_video = db.video_interaction.find({"course_learner_id": c}).distinct("video_id")
        count1=0
        for vid in cursor_video:
            count1+=1
            dict['Nr_of_videos_watched'] = count1


        # Nr of submitted quizzes
        cursor_sub = db.submissions.find({"course_learner_id": c}).distinct("question_id")
        count2=0
        for sub in cursor_sub:
            count2+=1
        dict['Nr_of_submitted_quizzes'] = count2


        # Nr of forum contributions
        cursor_forint = db.forum_interaction.find({"course_learner_id": c}).distinct("post_id")
        count3=0
        for post in cursor_forint:
            count3+=1

        dict['Nr_of_forum_contributions'] = count3

        ###################### Active sessions on the platform in sec ###########################

        # Summative duration of quiz sessions
        time1=0
        cursor_quizses = db.quiz_sessions.find({"course_learner_id": c})

        for dur in cursor_quizses:
            time1=time1+float(dur['duration'])


        # Summative duration of forum sessions
        time2=0
        cursor_forumses = db.forum_sessions.find({"course_learner_id": c})

        for dur in cursor_forumses:
            #print dur
            time2=time2+float(dur['duration'])


        # Summative duration of video sessions
        time3=0
        cursor_videoses = db.video_interaction.find({"course_learner_id": c})

        for dur in cursor_videoses:
            time3=time3+float(dur['duration'])

        total_time = time1+time2+time3

        ###########################################################################################

        if(total_time!=0):
            # Proportion of time spent on quizzes
            proportion1 = (time1 / total_time) * 100
        else:
            proportion1=0


        dict['Active_sessions_on_the_platform_in_s'] = total_time
        dict['Proportion_of_time_spent_on_quizzes'] = round(proportion1,1)
        dict['Time_spent_on_videos_in_s'] = time3

        # Total time on the platform

        time4=0
        cursor_ses = db.sessions.find({"course_learner_id": c})
        for ses in cursor_ses:
    
            time4 = time4 + float(ses['duration'])

        dict['Total_time_on_the_platform_in_s'] = time4

        
        # Print the the whole dict
        for k,v in dict.iteritems():
            print k,v

        # Inserting the new dict into the metrics collection
        db.metrics.insert(dict)


func()
