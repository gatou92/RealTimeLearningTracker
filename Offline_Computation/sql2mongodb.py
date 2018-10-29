# Author: Maria Gatou #

# This code aims to retrieve all the necessary tables from the mysql db and import them as collections to the mongodb database.

import MySQLdb as db1
import paramiko
import sshtunnel
from paramiko import SSHClient
from pymongo import MongoClient
from sshtunnel import SSHTunnelForwarder
import export as ex
from os.path import expanduser


# Initialize the database handles
def func():

    home = expanduser('~')
    mypkey = paramiko.RSAKey.from_private_key_file(home + '/.ssh/id_rsa') #path to your private rsa key
    
    # connect to remote mongodb database
    client     = MongoClient("mongodb://username:password@server_address:27017/database_name") # put your own username, password, server_address of the remote server that hosts mongodb database and mongodb database_name
    db         = client.database_name # put mongodb database_name

    # connect via ssh to remote mysql database
    with sshtunnel.SSHTunnelForwarder(
        ('server_address',22), # put the server_address of the remote server that hosts the mysql database
        ssh_username='ubuntu', # put ssh username
        ssh_private_key=mypkey,
        remote_bind_address=('127.0.0.1', 3306),
        local_bind_address=('0.0.0.0', 10022)
    ) as server:
        cnx = db1.connect(host='127.0.0.1',
        port=server.local_bind_port,
        user     ='...', # put your username
        passwd ='...',  # put your password
        db ='...')     # put the mysql database_name

        cursor     = cnx.cursor()
        print "connected"

        db.drop_collection("assessments")
        db.drop_collection("course_elements")
        db.drop_collection("course_learner")
        db.drop_collection("courses")
        db.drop_collection("learner_demographic")
        db.drop_collection("learner_index")
        db.drop_collection("quiz_questions")
        db.drop_collection("quiz_sessions")
        db.drop_collection("sessions")
        db.drop_collection("submissions")
        db.drop_collection("video_interaction")
        db.drop_collection("forum_interaction")
        db.drop_collection("forum_sessions")
##################################################################################
#assessments collection

        collection = db.assessments

        assessments_titles = (
                       'assessment_id',   'course_learner_id',
                       'max_grade', 'grade'
        )


        query = ("""SELECT ass.assessment_id, ass.course_learner_id, ass.max_grade, ass.grade
                    FROM assessments AS ass
                    INNER JOIN course_learner
                    ON ass.course_learner_id=course_learner.course_learner_id  """)
                   # WHERE course_learner.certificate_status = 'downloadable'  """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, assessments_titles)

        ##################################################################################
        #course_elements collection
        collection = db.course_elements

        courel_titles = (
                       'element_id',   'element_type',
                       'week', 'course_id'
        )


        query = ( "SELECT *"
                  "FROM course_elements" )

        cursor.execute( query )

        ex.exp_func(collection, cursor, courel_titles)



        ##################################################################################
        #courses collection
        collection = db.courses

        cour_titles = (
                       'course_id',   'course_name',
                       'start_time', 'end_time'
        )


        query = ( "SELECT *"
                  "FROM courses" )

        cursor.execute( query )

        ex.exp_func(collection, cursor, cour_titles)



        ##################################################################################
        #learner_demographic collection
        collection = db.learner_demographic

        leardem_titles = (
                       'course_learner_id',   'gender',
                       'year_of_birth', 'level_of_education', 'country'
        )


        query = ("""SELECT ld.course_learner_id, ld.gender, ld.year_of_birth, ld.level_of_education, ld.country
                    FROM learner_demographic AS ld
                    INNER JOIN course_learner
                    ON ld.course_learner_id=course_learner.course_learner_id """)

        cursor.execute( query )


        ex.exp_func(collection, cursor, leardem_titles)

        ##################################################################################
        #learner_index collection
        collection = db.learner_index

        learin_titles = (
                       'global_learner_id',   'course_id',
                       'course_learner_id'
        )

        query = ("""SELECT li.global_learner_id, li.course_id, li.course_learner_id
                        FROM learner_index AS li
                        INNER JOIN course_learner
                        ON li.course_learner_id=course_learner.course_learner_id """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, learin_titles)



        ##################################################################################
        #quiz_questions collection
        collection = db.quiz_questions

        quizq_titles = (
                       'question_id',   'question_type',
                       'question_weight', 'question_due'
        )


        query = (""" SELECT qq.question_id, qq.question_type, qq.question_weight, qq.question_due
                    FROM quiz_questions as qq
                    INNER JOIN (SELECT sub.submission_id, sub.course_learner_id, sub.question_id, sub.submission_timestamp
                                        FROM submissions AS sub
                                        INNER JOIN course_learner
                                        ON sub.course_learner_id=course_learner.course_learner_id) as jtable
                    ON qq.question_id = jtable.question_id """
        )

        cursor.execute( query )

        ex.exp_func(collection, cursor, quizq_titles)


        ##################################################################################
        #quiz_sessions collection
        collection = db.quiz_sessions

        quizs_titles = (
                       'session_id',  'course_learner_id', 'start_time', 'end_time', 'duration'
        )

        query = ("""SELECT qs.session_id, qs.course_learner_id, qs.start_time, qs.end_time, qs.duration
                           FROM quiz_sessions AS qs
                           INNER JOIN course_learner
                           ON qs.course_learner_id=course_learner.course_learner_id """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, quizs_titles)


        ##################################################################################
        #sessions collection
        collection = db.sessions

        sess_titles = (
                       'session_id',   'course_learner_id',
                       'start_time', 'end_time', 'duration'
        )

        query = ("""SELECT s.session_id, s.course_learner_id, s.start_time, s.end_time, s.duration
                               FROM sessions AS s
                               INNER JOIN course_learner
                               ON s.course_learner_id=course_learner.course_learner_id  """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, sess_titles)

        ##################################################################################
        #submissions collection
        collection = db.submissions

        sub_titles = (
                       'submission_id',   'course_learner_id',
                       'question_id','submission_timestamp'
        )

        query = ("""SELECT sub.submission_id, sub.course_learner_id, sub.question_id, sub.submission_timestamp
                                   FROM submissions AS sub
                                   INNER JOIN course_learner
                                   ON sub.course_learner_id=course_learner.course_learner_id """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, sub_titles)



        ##################################################################################
        #video_interaction collection
        collection = db.video_interaction

        vidi_titles = (
                       'interaction_id',   'course_learner_id',
                       'video_id','duration','times_forward_seek','duration_forward_seek','times_backward_seek','duration_backward_seek','times_speed_up','times_speed_down','times_pause','duration_pause','start_time','end_time'
        )

        query = ("""SELECT vi.interaction_id, vi.course_learner_id, vi.video_id, vi.duration,vi.times_forward_seek, vi.duration_forward_seek, vi.times_backward_seek, vi.duration_backward_seek, vi.times_speed_up, vi.times_speed_down, vi.times_pause, vi.duration_pause, vi.start_time, vi.end_time
                                       FROM video_interaction AS vi
                                       INNER JOIN course_learner
                                       ON vi.course_learner_id=course_learner.course_learner_id """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, vidi_titles)

        ##################################################################################
        #course_elements collection
        collection = db.course_learner

        courlear_titles = (
                       'course_learner_id',   'final_grade',
                       'enrollment_mode', 'certificate_status', 'register_time'
        )


        query = ( """SELECT *
                  FROM course_learner """ )

        cursor.execute( query )


        ex.exp_func(collection, cursor, courlear_titles)

        ##################################################################################
        #forum_interaction collection
        collection = db.forum_interaction

        forint_titles = (
                       'post_id',   'course_learner_id',
                       'post_type','post_timestamp','post_parent_id','post_thread_id'
        )

        query = ("""SELECT fi.post_id, fi.course_learner_id, fi.post_type, fi.post_timestamp, fi.post_parent_id, fi.post_thread_id
                                           FROM forum_interaction AS fi
                                           INNER JOIN course_learner
                                           ON fi.course_learner_id=course_learner.course_learner_id """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, forint_titles)

        ##################################################################################
        #forum_sessions collection
        collection = db.forum_sessions

        forses_titles = (
                       'session_id',   'course_learner_id',
                       'times_search', 'start_time', 'end_time','duration','relevent_element_id'
        )

        query = ("""SELECT fs.session_id, fs.course_learner_id, fs.times_search, fs.start_time, fs.end_time, fs.duration, fs.relevent_element_id
                                               FROM forum_sessions AS fs
                                               INNER JOIN course_learner
                                               ON fs.course_learner_id=course_learner.course_learner_id  """)

        cursor.execute( query )

        ex.exp_func(collection, cursor, forses_titles)

        cursor.close()
        cnx.close()
func()