# Author: Maria Gatou #

#Run only this file that integrates all the procedures

import sql2mongodb as sm
import metrics_computation as mc
import profiles_computation as pc

if __name__ == '__main__':

    sm.func()
    mc.func()
    pc.func()
    print "All finished."



