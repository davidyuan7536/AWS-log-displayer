import psycopg2
import psycopg2.extensions
import psycopg2.extras
import logging
import csv
import sys
import io
import datetime
from urllib.parse import urlparse
from functools import reduce
from flask import jsonify

def getCursor(connection, db_name, user_name, host_name, password):
    try:
        connection = psycopg2.connect("dbname='%s' user='%s' host='%s' password='%s'" % (db_name, user_name, host_name, password))
        connection.autocommit = True
        cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("SET search_path TO dbo,public;")
        return cursor;
    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def clearDatabase(cursor):
    try:
        cursor.execute("DROP TABLE IF EXISTS dbo.access_log CASCADE;")

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def createViews(cursor):
    try:
        cursor.execute("CREATE OR REPLACE VIEW dbo.Today AS SELECT * FROM dbo.access_log WHERE time_iso8601 > date_trunc('day', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.CurrentWeek AS SELECT * FROM dbo.access_log WHERE time_iso8601 > date_trunc('week', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.CurrentMonth AS SELECT * FROM dbo.access_log WHERE time_iso8601 > date_trunc('month', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.CurrentYear AS SELECT * FROM dbo.access_log WHERE time_iso8601 > date_trunc('year', LOCALTIMESTAMP);")

        cursor.execute("CREATE OR REPLACE VIEW dbo.Yesterday AS SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN date_trunc('day', LOCALTIMESTAMP) - interval '1 day' AND date_trunc('day', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.Last7 AS SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN date_trunc('day', LOCALTIMESTAMP) - interval '7 day' AND date_trunc('day', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.Last30 AS SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN date_trunc('day', LOCALTIMESTAMP) - interval '30 day' AND date_trunc('day', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.MonthCal AS SELECT * FROM dbo.access_log WHERE time_iso8601 > date_trunc('day', LOCALTIMESTAMP) - interval '184 day';")
        cursor.execute("CREATE OR REPLACE VIEW dbo.DayCal AS SELECT * FROM dbo.access_log WHERE time_iso8601 > date_trunc('day', LOCALTIMESTAMP) - interval '21 day';")


        cursor.execute("CREATE OR REPLACE VIEW dbo.LastWeek AS SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN date_trunc('week', LOCALTIMESTAMP) - interval '1 week' AND date_trunc('week', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.LastMonth AS SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN date_trunc('month', LOCALTIMESTAMP) - interval '1 month' AND date_trunc('month', LOCALTIMESTAMP);")
        cursor.execute("CREATE OR REPLACE VIEW dbo.LastYear AS SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN date_trunc('year', LOCALTIMESTAMP) - interval '1 year' AND date_trunc('year', LOCALTIMESTAMP);")
    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def resetDatabase(cursor):
    try:
        clearDatabase(cursor)
        cursor.execute("CREATE TABLE dbo.access_log (id serial PRIMARY KEY, remote_addr varchar,time_iso8601 timestamp,request_time real,request_uri varchar,request_method varchar,status integer,request_length integer,body_bytes_sent integer,bytes_sent integer,http_host varchar,http_referer varchar,http_user_agent varchar);")
        cursor.execute("CREATE UNIQUE INDEX id_idx ON dbo.access_log (id);")
        cursor.execute("CREATE INDEX time_idx ON dbo.access_log (time_iso8601);")
        createViews(cursor)

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def packRows(row_list):
    row_dict = {}
    i = 0
    for row in row_list:
        row_dict[i] = {
            "id": row["id"],
            "remote_addr": row["remote_addr"],
            "time_iso8601": row["time_iso8601"],
            "request_time": row["request_time"],
            "request_uri": row["request_uri"],
            "request_method": row["request_method"],
            "status": row["status"],
            "request_length": row["request_length"],
            "body_bytes_sent": row["body_bytes_sent"],
            "bytes_sent": row["bytes_sent"],
            "http_host": row["http_host"],
            "http_referer": row["http_referer"],
            "http_user_agent": row["http_user_agent"]
        }
        i += 1
    return row_dict

# sorts with respect to the specified Attribute, optional descending order
def getAll(cursor, limit = 0, offset = 0, sortBy="id", Asc=True):
    try:
        SQL = "SELECT * FROM dbo.access_log ORDER BY %s"
        data = [psycopg2.extensions.AsIs(sortBy)]
        if Asc:
            SQL += " ASC"
        else:
            SQL += " DESC"

        if limit != 0:
            SQL += " LIMIT %s"
            data.insert(len(data), psycopg2.extensions.AsIs(limit))
        SQL += " OFFSET %s"
        data.insert(len(data), psycopg2.extensions.AsIs(offset))

        cursor.execute(SQL, data)
        result = cursor.fetchall()
        rows = packRows(result)


        cursor.execute("SELECT COUNT(*) FROM dbo.access_log;")
        size = cursor.fetchone()
        return {"rows": rows, "size": size[0]}

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getByAttribute(cursor, value, limit = 0, offset = 0, attr="time_iso8601", sortBy="id", Asc=True):
    try:
        SQL = "SELECT COUNT(*) FROM dbo.access_log WHERE %s=%s"
        data = [psycopg2.extensions.AsIs(attr), value]
        cursor.execute(SQL, data) # Note: no % operator
        size = cursor.fetchone()

        SQL = "SELECT * FROM dbo.access_log WHERE %s=%s ORDER BY %s"
        data.insert(len(data), psycopg2.extensions.AsIs(sortBy))
        if Asc:
            SQL += " ASC"
        else:
            SQL += " DESC"

        if limit != 0:
            SQL += " LIMIT %s"
            data.insert(len(data), psycopg2.extensions.AsIs(limit))
        SQL += " OFFSET %s"
        data.insert(len(data), psycopg2.extensions.AsIs(offset))

        cursor.execute(SQL, data) # Note: no % operator
        result = cursor.fetchall()
        rows = packRows(result)

        return {"rows": rows, "size": size[0]};

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getByRange(cursor, minVal, maxVal, limit = 0, offset = 0, attr="time_iso8601", sortBy="id", Asc=True):
    try:
        SQL = "SELECT COUNT(*) FROM dbo.access_log WHERE %s BETWEEN %s AND %s"
        data = [psycopg2.extensions.AsIs(attr), minVal, maxVal]
        cursor.execute(SQL, data) # Note: no % operator
        size = cursor.fetchone()

        SQL = "SELECT * FROM dbo.access_log WHERE %s BETWEEN %s AND %s ORDER BY %s"
        data.append(psycopg2.extensions.AsIs(sortBy))
        if Asc:
            SQL += " ASC"
        else:
            SQL += " DESC"

        if limit != 0:
            SQL += " LIMIT %s"
            data.append(psycopg2.extensions.AsIs(limit))
        SQL += " OFFSET %s"
        data.append(psycopg2.extensions.AsIs(offset))

        cursor.execute(SQL, data) # Note: no % operator
        result = cursor.fetchall()
        rows = packRows(result)

        return {"rows": rows, "size": size[0]};

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getRangeByRecord(cursor, Quest_id, span, limit = 0, offset = 0, attr="time_iso8601", sortBy="id", Asc=True):
    try:
        SQL = "SELECT time_iso8601 FROM dbo.access_log WHERE id = %s"
        data = [psycopg2.extensions.AsIs(Quest_id),]

        cursor.execute(SQL, data)
        t = cursor.fetchone()[0]
        minVal = t - span
        maxVal = t + span
        return getByRange(cursor, minVal, maxVal, limit, offset, attr, sortBy, Asc)
    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getRequestStats(cursor, limit = 0, offset = 0):
    try:
        SQL = "SELECT COUNT(*) FROM (SELECT request_uri FROM dbo.access_log GROUP BY request_uri) AS FOO"
        cursor.execute(SQL) # Note: no % operator
        size = cursor.fetchone()

        SQL = "SELECT request_uri, COUNT(*) AS num_request, AVG(request_length) AS ave_length FROM dbo.access_log GROUP BY request_uri ORDER BY COUNT(*) DESC"
        data = (psycopg2.extensions.AsIs(offset),)
        if limit != 0:
            SQL += " LIMIT %s"
            data = (psycopg2.extensions.AsIs(limit), psycopg2.extensions.AsIs(offset))
        SQL += " OFFSET %s"

        cursor.execute(SQL, data) # Note: no % operator
        result = cursor.fetchall()
        rows = {}
        i = 0
        for row in result:
            rows[i] = {
                "request_uri": row["request_uri"],
                "num_request": int(row["num_request"]),
                "ave_length": float(row["ave_length"])
            }
            i += 1

        return {"rows" : rows, "size": size[0]};

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getURIGroup(cursor, regex_string):
    try:
        regex_list = regex_string.split(',,')
        SQL = "SELECT SUM(c) AS num_request, SUM(d_in) AS data_in, SUM(d_out) AS data_out FROM (SELECT request_uri, COUNT(*) AS c, SUM(request_length) AS d_in, SUM(bytes_sent) AS d_out FROM dbo.access_log GROUP BY request_uri HAVING request_uri ~ %s"
        SQL2 = "SELECT request_uri, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out FROM dbo.access_log GROUP BY request_uri HAVING request_uri ~ %s"
        data = [regex_list[0],]
        for i in range(1, len(regex_list)):
            SQL += " OR request_uri ~ %s"
            SQL2 += " OR request_uri ~ %s"
            data.append(regex_list[i])
        SQL += ") AS FOO"
        cursor.execute(SQL, data)
        res = cursor.fetchone()
        # result_list = [int(x) for x in result[0]]
        result = {"num_request": int(res["num_request"]), "data_in": int(res["data_in"]), "data_out": int(res["data_out"])}

        cursor.execute(SQL2, data)
        res = cursor.fetchall()
        detail = {}
        i = 0
        for row in res:
            detail[i] = {"request_uri" : row["request_uri"], "num_request": row["num_request"], "data_in": row["data_in"], "data_out": row["data_out"]}
            i += 1

        return {"result" : result, "detail" : detail}

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getHostStats(cursor, limit = 0, offset = 0, sort_by_in = True):
    try:
        SQL = "SELECT COUNT(*) FROM (SELECT http_host FROM dbo.access_log GROUP BY http_host) AS FOO"
        cursor.execute(SQL) # Note: no % operator
        size = cursor.fetchone()

        if sort_by_in:
            SQL = "SELECT http_host, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out FROM dbo.access_log GROUP BY http_host ORDER BY SUM(request_length) DESC"
        else:
            SQL = "SELECT http_host, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out FROM dbo.access_log GROUP BY http_host ORDER BY SUM(bytes_sent) DESC"

        data = (psycopg2.extensions.AsIs(offset),)
        if limit != 0:
            SQL += " LIMIT %s"
            data = (psycopg2.extensions.AsIs(limit), psycopg2.extensions.AsIs(offset))
        SQL += " OFFSET %s"

        cursor.execute(SQL, data) # Note: no % operator
        result = cursor.fetchall()
        rows = {}
        i = 0
        for row in result:
            rows[i] = {
                "http_host": row["http_host"],
                "num_request": int(row["num_request"]),
                "data_in": int(row["data_in"]),
                "data_out": int(row["data_out"])
            }
            i += 1

        return {"rows": rows, "size": size[0]};

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def searchAll(cursor, value, limit = 0, offset = 0, Asc=True):
    try:
        SQL = "SELECT COUNT(*) FROM dbo.access_log WHERE remote_addr LIKE '%%%s%%' OR request_uri LIKE '%%%s%%' OR request_method LIKE '%%%s%%' OR http_host LIKE '%%%s%%' OR http_referer LIKE '%%%s%%' OR http_user_agent LIKE '%%%s%%'"
        data_list = [psycopg2.extensions.AsIs(value), psycopg2.extensions.AsIs(value), psycopg2.extensions.AsIs(value), psycopg2.extensions.AsIs(value), psycopg2.extensions.AsIs(value), psycopg2.extensions.AsIs(value)]
        cursor.execute(SQL, data_list) # Note: no % operator
        size = cursor.fetchone()

        SQL = "SELECT * FROM dbo.access_log WHERE remote_addr LIKE '%%%s%%' OR request_uri LIKE '%%%s%%' OR request_method LIKE '%%%s%%' OR http_host LIKE '%%%s%%' OR http_referer LIKE '%%%s%%' OR http_user_agent LIKE '%%%s%%'"

        if limit != 0:
            SQL += " LIMIT %s"
            data_list.insert(len(data_list), psycopg2.extensions.AsIs(limit))
        SQL += " OFFSET %s"
        data_list.insert(len(data_list), psycopg2.extensions.AsIs(offset))

        cursor.execute(SQL, data_list) # Note: no % operator
        result = cursor.fetchall()
        rows = packRows(result)

        return {"rows": rows, "size": size[0]};

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)


# scope = "(SELECT * FROM dbo.access_log WHERE EXTRACT(DAY FROM time_iso8601)=12 ) AS foo"
# items = "date_trunc('minute', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
# result = lp.getTimePoints(cursor, items, scope, "minute")
def getTimePoints(cursor, items = "date_trunc('day', time_iso8601) AS time, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out", scope = "CurrentMonth", granularity = "day"):
    try:
        SQL = "SELECT %s FROM %s GROUP BY date_trunc( %s , time_iso8601) ORDER BY EXTRACT( %s FROM date_trunc( %s , time_iso8601));"
        data = (psycopg2.extensions.AsIs(items), psycopg2.extensions.AsIs(scope), granularity, psycopg2.extensions.AsIs(granularity), granularity)
        cursor.execute(SQL, data) # Note: no % operator
        result = cursor.fetchall()
        points = {}
        i = 0
        for row in result:
            points[i] = {
                "time": row["time"],
                "num_request": int(row["num_request"]),
                "data_in": int(row["data_in"]),
                "data_out": int(row["data_out"])
            }
            i += 1
        return points

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

# items = "date_trunc('minute', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
# result = lp.getCustomTimePoints(cursor, "2015-06-12 21:30:00", "2015-06-12 21:55:00", items, "minute")
def getCustomTimePoints(cursor, lower, upper, items = "date_trunc('day', time_iso8601) AS time, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out", granularity = "day"):
    try:
        SQL = "SELECT %s FROM (SELECT * FROM dbo.access_log WHERE time_iso8601 BETWEEN %s and %s ) AS foo GROUP BY date_trunc( %s , time_iso8601) ORDER BY EXTRACT( %s FROM date_trunc( %s , time_iso8601));"
        data = (psycopg2.extensions.AsIs(items), lower, upper, granularity, psycopg2.extensions.AsIs(granularity), granularity)
        cursor.execute(SQL, data) # Note: no % operator
        result = cursor.fetchall()
        points = {}
        i = 0
        for row in result:
            points[i] = {
                "time": row["time"],
                "num_request": int(row["num_request"]),
                "data_in": int(row["data_in"]),
                "data_out": int(row["data_out"])
            }
            i += 1
        return points

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getRequestStats(cursor, granularity, time):
    try:
        view = "dbo.temp" + granularity
        # drop existing materialized view
        cursor.execute("DROP MATERIALIZED VIEW IF EXISTS %s;", [psycopg2.extensions.AsIs(view),])

        # create new one
        SQL = "CREATE MATERIALIZED VIEW %s AS SELECT id AS id, remote_addr AS remote_addr, request_time AS request_time, request_uri AS request_uri, request_method AS request_method, request_length AS request_length, bytes_sent AS bytes_sent, http_host AS http_host FROM dbo.access_log WHERE date_trunc(%s, time_iso8601) = %s;"
        data = [psycopg2.extensions.AsIs(view), granularity, time]
        cursor.execute(SQL, data)

        data =  [psycopg2.extensions.AsIs(view),]
        cursor.execute("SELECT AVG(request_time) FROM %s;", data)
        result = {}
        result["avg_request_time"] = float("{0:.3f}".format(float(cursor.fetchone()[0])))

        cursor.execute("SELECT request_method AS method_name, COUNT(*) AS count FROM %s GROUP BY request_method ORDER BY COUNT(*) DESC LIMIT 3;", data)
        methods = cursor.fetchall()
        result["request_method"]={}
        i = 1
        for method_count in methods:
            result["request_method"][i] = {}
            result["request_method"][i]["name"] = method_count["method_name"]
            result["request_method"][i]["count"] = method_count["count"]
            i += 1

        cursor.execute("SELECT remote_addr AS name, COUNT(*) AS count FROM %s GROUP BY remote_addr ORDER BY COUNT(*) DESC LIMIT 3", data)
        addrs = cursor.fetchall()
        result["remote_addr"]={}
        i = 1
        for addr_count in addrs:
            result["remote_addr"][i] = {}
            result["remote_addr"][i]["name"] = addr_count["name"]
            result["remote_addr"][i]["count"] = addr_count["count"]
            i += 1

        cursor.execute("SELECT request_uri AS name, COUNT(*) AS count FROM %s GROUP BY request_uri ORDER BY COUNT(*) DESC LIMIT 3", data)
        uris = cursor.fetchall()
        result["request_uri"]={}
        i = 1
        for uri_count in uris:
            result["request_uri"][i] = {}
            result["request_uri"][i]["name"] = uri_count["name"]
            result["request_uri"][i]["count"] = uri_count["count"]
            i += 1

        cursor.execute("SELECT http_host AS name, COUNT(*) AS count FROM %s GROUP BY http_host ORDER BY COUNT(*) DESC LIMIT 3", data)
        hosts = cursor.fetchall()
        result["http_host"]={}
        i = 1
        for host_count in hosts:
            result["http_host"][i] = {}
            result["http_host"][i]["name"] = host_count["name"]
            result["http_host"][i]["count"] = host_count["count"]
            i += 1
        print(result)
        return result

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getDataStats(cursor, granularity, time, objective):
    try:
        if objective == "data_in":
            obj = "request_length"
        elif objective == "data_out":
            obj = "bytes_sent"
        else:
            return {}

        view = "dbo.temp" + granularity
        # drop existing materialized view
        cursor.execute("DROP MATERIALIZED VIEW IF EXISTS %s;", [psycopg2.extensions.AsIs(view),])

        # create new one
        SQL = "CREATE MATERIALIZED VIEW %s AS SELECT id AS id, remote_addr AS remote_addr, request_time AS request_time, request_uri AS request_uri, request_method AS request_method, request_length AS request_length, bytes_sent AS bytes_sent, http_host AS http_host FROM dbo.access_log WHERE date_trunc(%s, time_iso8601) = %s;"
        data = [psycopg2.extensions.AsIs(view), granularity, time]
        cursor.execute(SQL, data)

        data = [psycopg2.extensions.AsIs(view),]
        cursor.execute("SELECT COUNT(*) FROM %s;", data)
        result = {}
        result["num_request"] = int(cursor.fetchone()[0])

        data = [psycopg2.extensions.AsIs(obj), psycopg2.extensions.AsIs(view), psycopg2.extensions.AsIs(obj)]
        cursor.execute("SELECT request_method AS method_name, SUM(%s) AS count FROM %s GROUP BY request_method ORDER BY SUM(%s) DESC LIMIT 3;", data)
        methods = cursor.fetchall()
        result["request_method"]={}
        i = 1
        for method_count in methods:
            result["request_method"][i] = {}
            result["request_method"][i]["name"] = method_count["method_name"]
            result["request_method"][i]["count"] = method_count["count"]
            i += 1

        cursor.execute("SELECT remote_addr AS name, SUM(%s) AS count FROM %s GROUP BY remote_addr ORDER BY SUM(%s) DESC LIMIT 3", data)
        addrs = cursor.fetchall()
        result["remote_addr"]={}
        i = 1
        for addr_count in addrs:
            result["remote_addr"][i] = {}
            result["remote_addr"][i]["name"] = addr_count["name"]
            result["remote_addr"][i]["count"] = addr_count["count"]
            i += 1

        cursor.execute("SELECT request_uri AS name, SUM(%s) AS count FROM %s GROUP BY request_uri ORDER BY SUM(%s) DESC LIMIT 3", data)
        uris = cursor.fetchall()
        result["request_uri"]={}
        i = 1
        for uri_count in uris:
            result["request_uri"][i] = {}
            result["request_uri"][i]["name"] = uri_count["name"]
            result["request_uri"][i]["count"] = uri_count["count"]
            i += 1

        cursor.execute("SELECT http_host AS name, SUM(%s) AS count FROM %s GROUP BY http_host ORDER BY SUM(%s) DESC LIMIT 3", data)
        hosts = cursor.fetchall()
        result["http_host"]={}
        i = 1
        for host_count in hosts:
            result["http_host"][i] = {}
            result["http_host"][i]["name"] = host_count["name"]
            result["http_host"][i]["count"] = host_count["count"]
            i += 1
        print(result)
        return result

    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

class URINode:
    def __init__(self, root_name):
        self.name = root_name
        self.value = 0
        self.children = []

    def insertNode(self, path, val):
        self.value += val
        # base case
        if len(path) == 0:
            return
        else:
            for child in self.children:
                # path exist
                if path[0] == child.name:
                    return child.insertNode(path[1:], val)
            # path doesn't exist
            self.children.append(URINode(path[0]))
            self.children[len(self.children)-1].name = path[0]
            return self.children[len(self.children)-1].insertNode(path[1:], val)

    def display(self, indent=0):
        s = ""
        for i in range(indent):
            s += " "
        print(s + self.name + ": " + str(self.value))
        for child in self.children:
            child.display(indent+2)

    def search(self, keyword):
        if keyword in self.name:
            return self.value
        else:
            size = len(self.children)
            if size > 1:
                return reduce(lambda x,y: (x + y.search(keyword)), self.children, 0)
            elif size == 1:
                return self.children[0].search(keyword)
            else:
                return 0

def parseURIs(cursor):
    try:
        SQL = "SELECT COUNT(*), request_uri FROM dbo.access_log GROUP BY request_uri;"

        cursor.execute(SQL)
        result = cursor.fetchall()
        path = [x[1:].split('/') for x in [urlparse(x[1]).path for x in result]]
        count = [x[0] for x in result]

        tree = URINode("root")
        for i in range(len(count)):
            tree.insertNode(path[i], count[i])
        return tree
    except psycopg2.DatabaseError as e:
        raise psycopg2.DatabaseError(e)

def getDataFlow(rows):
    in_total = 0
    out_total = 0
    for i,row in rows.items():
        in_total += row["request_length"]
        out_total += row["bytes_sent"]
    return {"data_in": in_total, "data_out": out_total}


if __name__ == '__main__':
    connection = None

    try:
        cursor = getCursor(connection, "cloud_access_logs", "ryan.dai", "v-dev-ubusvr-1", "ryan.dai")
        # getRequestStatsByDay(cursor, "2015-07-03 00:00:00")

        # result = getDataFlow(getByRange(cursor, "2015-06-12 21:00:00", "2015-06-12 21:01:00")[0])
        # print(result)

        # result = getURIGroup(cursor, '^/CustomerPortal((?!Script).)*$')
        # print([int(x) for x in result[0]])

        # tree = parseURIs(cursor)
        # tree.display()
        # print(tree.search("js"))

        # print(path)
        # print(count)


        # span = datetime.timedelta(days=0, hours=0, minutes=1, seconds=0)
        # print(getRangeByRecord(cursor, 10, span, 0, 0, "time_iso8601", "id", False))

        # cursor.execute("SET search_path TO dbo,public;")
        # scope = "(SELECT * FROM dbo.access_log WHERE EXTRACT(MONTH FROM time_iso8601)=6 ) AS foo"
        # items = "date_trunc('hour', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
        # result = getCustomTimePoints(cursor, "2015-06-01 00:01:00", "2015-06-30 23:59:59", items, "hour")

        # print([x for (a,x,b,c,d,e,f,g,h,i,j,k,l) in searchAll(cursor, "chrome"))

    #   reset
        # clearDatabase(cursor)
        createViews(cursor)
    except psycopg2.DatabaseError as e:
      print(e)
    finally:
      if connection:
        connection.close()
