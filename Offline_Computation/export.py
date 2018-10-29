# Author: Maria Gatou #

def exp_func(col, cur, titles):
    cus = dict()

    #custom record id rather than mongodb default hash id
    cid = 0

    # cycle through each mySQL row
    for (row) in cur:
        print row
        cid += 1  # increment id
        cus['_id'] = cid

        # check if current row is null
        for i in range(0, len(row)):
            row_title = "".join(titles[i])
            field = str(row[i])
            cus[row_title] = field

        # we've completed processing this row, insert it into mongodb
        id = col.insert_one(cus).inserted_id
        #print id
