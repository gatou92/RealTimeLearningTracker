# Author: Maria Gatou #

from pymongo import MongoClient
import datetime
from datetime import timedelta, datetime
import math
import sys
from pymongo.errors import ConnectionFailure  # For catching exeptions


def func():
    # MongoDB connection
    try:
        client = MongoClient("mongodb://username:password@server_address:27017/database_name") # put your own username, password, server_address of the remote server that hosts mongodb database and mongodb database_name
        print "Connected to MongoDB successfully!"
    except ConnectionFailure, e:
        sys.stderr.write("Could not connect to MongoDB: %s" % e)

    db = client.database_name # put mongodb database_name

    ######### Computation of the total graduates ##########
    cursor = db.learner_index.find().distinct("course_learner_id")

    totalGraduates = 0
    for c in cursor:
        totalGraduates += 1
    print totalGraduates

    ######### Computation of the 10% of the graduates ##########
    proportion = int(totalGraduates * 0.1)
    print proportion

    ######### Computation of the 5% of the graduates ##########
    fivePerc = int(totalGraduates * 0.05)
    print fivePerc

    #############################################################

    # Computation of the average graduate profile
    res1 = db.metrics.aggregate(
        [
            {"$sort": {"Nr_of_videos_watched": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgVideos": {"$avg": "$Nr_of_videos_watched"},
                    },
            },
        ]
    )

    # for row in res1:
    #     print row


    res2 = db.metrics.aggregate(
        [
            {"$sort": {"Active_sessions_on_the_platform_in_s": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgActSes": {"$avg": "$Active_sessions_on_the_platform_in_s"},
                    },

            },

        ]
    )

    # for row in res2:
    #     print row

    res3 = db.metrics.aggregate(
        [
            {"$sort": {"Nr_of_forum_contributions": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgForCont": {"$avg": "$Nr_of_forum_contributions"},
                    },

            },

        ]
    )

    # for row in res3:
    #     print row

    res4 = db.metrics.aggregate(
        [
            {"$sort": {"Proportion_of_time_spent_on_quizzes": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgTimeQuiz": {"$avg": "$Proportion_of_time_spent_on_quizzes"},
                    },

            },

        ]
    )

    # for row in res4:
    #     print row

    res5 = db.metrics.aggregate(
        [
            {"$sort": {"Nr_of_submitted_quizzes": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgQuizzes": {"$avg": "$Nr_of_submitted_quizzes"},
                    },

            },

        ]
    )

    # for row in res5:
    #     print row

    res6 = db.metrics.aggregate(
        [
            {"$sort": {"Time_spent_on_videos_in_s": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgTimeVideos": {"$avg": "$Time_spent_on_videos_in_s"},
                    },

            },

        ]
    )

    # for row in res6:
    #     print row

    res7 = db.metrics.aggregate(
        [
            {"$sort": {"Total_time_on_the_platform_in_s": -1}},
            {"$skip": fivePerc},
            {"$limit": totalGraduates - 2 * fivePerc},
            {
                "$group":
                    {
                        "_id": "null",
                        "avgTimeSite": {"$avg": "$Total_time_on_the_platform_in_s"},
                    },

            },

        ]
    )

    # for row in res7:
    #     print row

    # Computation of the most engaged graduate profile

    res8 = db.learner_index.aggregate(
        [
            {
                "$lookup": {
                    "from": "course_learner",
                    "localField": "course_learner_id",
                    "foreignField": "course_learner_id",
                    "as": "courseIndex"
                }
            },
            {"$lookup": {
                "from": "metrics",
                "localField": "global_learner_id",
                "foreignField": "Student_id",
                "as": "learmetrics"
                }
            }
        ]

    )


    student_id = []

    nr_of_vid = []
    video_eng = []

    nr_of_quiz = []
    quiz_eng = []

    time_site = []
    time_site_eng = []

    time_vid = []
    time_vid_eng = []

    forum_contr = []
    forum_eng = []

    act_sess = []
    act_sess_eng = []

    time_quiz = []
    time_quiz_eng = []
    engagement = []

    for row in res8:
        student_id.append(row["learmetrics"][0]["Student_id"])
        nr_of_vid.append(row["learmetrics"][0]["Nr_of_videos_watched"])
        nr_of_quiz.append(row["learmetrics"][0]["Nr_of_submitted_quizzes"])
        time_site.append(row["learmetrics"][0]["Total_time_on_the_platform_in_s"])
        time_vid.append(row["learmetrics"][0]["Time_spent_on_videos_in_s"])
        forum_contr.append(row["learmetrics"][0]["Nr_of_forum_contributions"])
        act_sess.append(row["learmetrics"][0]["Active_sessions_on_the_platform_in_s"])
        time_quiz.append(row["learmetrics"][0]["Proportion_of_time_spent_on_quizzes"])

    for i in range(0, len(nr_of_vid)):
        video_eng.append((nr_of_vid[i]*100)/max(nr_of_vid))
        quiz_eng.append((nr_of_quiz[i]*100)/max(nr_of_quiz))
        time_site_eng.append((time_site[i] * 100) / max(time_site))
        time_vid_eng.append((time_vid[i] * 100) / max(time_vid))
        forum_eng.append((forum_contr[i] * 100) / max(forum_contr))
        act_sess_eng.append((act_sess[i] * 100) / max(act_sess))
        time_quiz_eng.append((time_quiz[i] * 100) / max(time_quiz))

        engagement.append(int((video_eng[i]+quiz_eng[i]+time_site_eng[i]+time_vid_eng[i]+forum_eng[i]+
                          act_sess_eng[i]+time_quiz_eng[i])/7))


    m = engagement.index(max(engagement))




    dict = {}

    for it1, it2, it3, it4, it5, it6, it7 in zip(res1, res2, res3, res4, res5, res6, res7):
        dict['name'] = "Profiles"
        dict['avgVidWatched'] = int(it1['avgVideos'])
        dict['avgActSes'] = int(it2['avgActSes'])
        dict['avgForum'] = int(it3['avgForCont'])
        dict['avgTimeQuiz'] = int(it4['avgTimeQuiz'])
        dict['avgSubQuiz'] = int(it5['avgQuizzes'])
        dict['avgTimeVid'] = int(it6['avgTimeVideos'])
        dict['avgTimeSite'] = int(it7['avgTimeSite'])

    dict['mostEngVidWatched'] = math.ceil(nr_of_vid[m])
    dict['mostEngActSes'] = math.ceil(act_sess[m])
    dict['mostEngForum'] = math.ceil(forum_contr[m])
    dict['mostEngTimeQuiz'] = math.ceil(time_quiz[m])
    dict['mostEngSubQuiz'] = math.ceil(nr_of_quiz[m])
    dict['mostEngTimeVid'] = math.ceil(time_vid[m])
    dict['mostEngTimeSite'] = math.ceil(time_site[m])


    # Print the whole dict
    for k, v in dict.iteritems():
        print k, v

    # Inserting the new dict into the profiles collection
    db.events.insert(dict)


func()