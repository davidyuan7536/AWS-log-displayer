import psycopg2
import psycopg2.extensions
import logging
import csv
import sys
import io
import re

class LogParser():

    def __init__(self):
        pass

    # Exceptions
    class ParseError(Exception):
        pass
    class WrongNumberOfFieldsError(Exception):
        pass
    class RemoteAddressError(Exception):
        pass
    class TimeStampError(Exception):
        pass
    class RequestTimeError(Exception):
        pass
    class RequestMethodError(Exception):
        pass
    class StatusError(Exception):
        pass
    class RequestLengthError(Exception):
        pass
    class BodyBytesSentError(Exception):
        pass
    class BytesSentError(Exception):
        pass
    class MissingArgumentError(Exception):
        pass

    # check sanity before parsing for one row.
    # return a list of 12 strings if valid, or throws an according exception
    def parseRow(self, toParse):

        f = io.StringIO(toParse)
        reader = csv.reader(f, delimiter=',')
        for row in reader:
            if len(row) != 12:
                # logging.error("Number of Fields Doesn't Match")
                raise self.WrongNumberOfFieldsError("Number of Fields Doesn't Match")

            #  0 remote_addr varchar
            if not (row[0] == "-" or re.match('^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$', row[0])):
                raise self.RemoteAddressError("invalid remote_addr: " + row[0])

            #  1 time_iso8601 timestamp
            if not (re.match('^[0-9]{4}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\+[0-9]{2}:[0-9]{2}$', row[1])):
                raise self.TimeStampError("invalid timestamp: " + row[1])
            #  2 request_time real
            if not (re.match('^[0-9]+\.[0-9]{3}$', row[2])):
                raise self.RequestTimeError("invalid request_time: " + row[2])
            #  3 request_uri varchar
            #  4 request_method varchar
            if (row[4] == ""):
                raise self.RequestMethodError("empty request_method " + row[4])
            #  5 status integer
            if not (re.match('^[1-5][0-9]{2}$', row[5])):
                raise self.StatusError("invalid status: " + row[5])
            #  6 request_length integer
            if not (re.match('^[0-9]+$', row[6])):
                raise self.RequestLengthError("invalid request_length: " + row[6])
            #  7 body_bytes_sent integer
            if not (re.match('^[0-9]+$', row[7])):
                raise self.BodyBytesSentError("invalid body_bytes_sent: " + row[7])
            #  8 bytes_sent integer
            if not (re.match('^[0-9]+$', row[8])):
                raise self.BytesSentError("invalid bytes_sent: " + row[8])
            #  9 http_host varchar
            #  10 http_referer varchar
            #  11 http_user_agent varchar
            return row

    # takes a row and a cursor and tries to insert into table al
    def loadRow(self,tuple, cursor):
        try:
            row = self.parseRow(tuple)

            try:
                cursor.execute("INSERT INTO access_log (remote_addr,time_iso8601,request_time,request_uri,request_method,status,request_length,body_bytes_sent,bytes_sent,http_host,http_referer,http_user_agent) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]))
            except (psycopg2.DatabaseError) as e:
                raise psycopg2.DatabaseError(e)

        except (self.WrongNumberOfFieldsError, self.RemoteAddressError, self.TimeStampError, self.RequestTimeError, self.RequestMethodError, self.StatusError, self.RequestLengthError, self.BodyBytesSentError, self.BytesSentError) as e:
            raise self.ParseError(e)

    # takes a string and tries to parse and insert every row into table db.al
    # complete the successful rows and logs the unseccesful ones for reference
    # returns nothing
    def loadString(self, stringToLoad, host_name="v-dev-ubusvr-1", db_name="cloud_access_logs", user_name="ryan.dai", password="ryan.dai"):
        stringToLoad = stringToLoad.rstrip()
        if stringToLoad == "":
            return
        connection = None
        try:
            connection = psycopg2.connect("dbname='%s' user='%s' host='%s' password='%s'" % (db_name, user_name, host_name, password))
            connection.autocommit = True
            cursor = connection.cursor()
            cursor.execute("SET search_path TO dbo,public;")
            log = ""
            linenumber = 0
            f = stringToLoad.splitlines()

            for row in f:
                linenumber += 1
                try:
                    self.loadRow(str(row), cursor)
                except (psycopg2.DatabaseError, self.ParseError) as e:
                    # raise self.ParseError(e)
                    log += "line " + str(linenumber) + ': ' + str(e) + '\n'
            # connection.commit()
            if log != "":
                raise psycopg2.DatabaseError(log)
        except psycopg2.DatabaseError as e:
            raise psycopg2.DatabaseError(e)

    # takes a file and tries to parse and insert every row into table db.al
    # complete the successful rows and logs the unseccesful ones for reference
    # returns nothing
    def loadFiles(self, host_name="v-dev-ubusvr-1", db_name="cloud_access_logs", user_name="ryan.dai", password="ryan.dai"):
        if len(sys.argv) < 2:
            raise self.MissingArgumentError('At least one log file needed')
        try:
            for i in range(1, len(sys.argv)):
                file = open(sys.argv[i], 'rt')
                try:
                    connection = None
                    try:
                        connection = psycopg2.connect("dbname='%s' user='%s' host='%s' password='%s'" % (db_name, user_name, host_name, password))
                        connection.autocommit = True
                        cursor = connection.cursor()
                        cursor.execute("SET search_path TO dbo,public;")
                        log = ""
                        linenumber = 0

                        for row in file:
                            linenumber += 1
                            try:
                                self.loadRow(str(row), cursor)
                            except (psycopg2.DatabaseError, self.ParseError) as e:
                                log += "line " + str(linenumber) + ': ' + str(e) + '\n'
                        # connection.commit()
                        if log != "":
                            logging.error(log)

                    except psycopg2.DatabaseError as e:
                        # print ("DB Error: %s", e)
                        raise psycopg2.DatabaseError(e)
                    finally:
                        if connection:
                            connection.close()
                finally:
                    file.close()
        except FileNotFoundError as f:
            raise FileNotFoundError(f)



if __name__ == '__main__':
    connection = None
    lp = LogParser()

    try:
        lp.loadFiles()
        # cursor.execute("SET search_path TO dbo,public;")
        # scope = "(SELECT * FROM dbo.access_log WHERE EXTRACT(MONTH FROM time_iso8601)=6 ) AS foo"
        # items = "date_trunc('hour', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
        # result = lp.getCustomTimePoints(cursor, "2015-06-01 00:01:00", "2015-06-30 23:59:59", items, "hour")

    #   reset
        # lp.clearDatabase(cursor)
        # lp.createViews(cursor)
        # lp.loadFiles()
    except (psycopg2.DatabaseError, LogParser.MissingArgumentError) as e:
      print(e)
    finally:
      if connection:
        connection.close()



# TESTING PURPOSE

# cursor.execute('SELECT version()')
# ver = cursor.fetchone()
# print(ver)

# cursor.execute("CREATE TABLE HELLOIAMHERE (id serial PRIMARY KEY, num integer, data varchar);")
# cursor.execute("INSERT INTO HELLOIAMHERE (num, data) VALUES (%s, %s)",(100, "abc'def"))

# cursor.execute("SET search_path TO dbo,public;")
# cursor.execute("DROP TABLE al")
# cursor.execute("CREATE TABLE dbo.al (remote_addr varchar,time_iso8601 varchar,request_time varchar,request_uri varchar,request_method varchar,status varchar,request_length varchar,body_bytes_sent varchar,bytes_sent varchar,http_host varchar,http_referer varchar,http_user_agent varchar);")
# cursor.execute("INSERT INTO al (remote_addr,time_iso8601,request_time,request_uri,request_method,status,request_length,body_bytes_sent,bytes_sent,http_host,http_referer,http_user_agent) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",("10.64.9.7","2015-06-12T21:00:08+00:00","0.000","/HealthCheck","GET","200","121","0","217","10.64.10.110","-","ELB-HealthChecker/1.0"))

# output_file = open(sys.argv[2], 'wt')
# try:
#     # writer = csv.writer(output_file)
#     output_file.write(str(text).strip('[]'))
# finally:
#     output_file.close()
