import os
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import psycopg2
import cgitb; cgitb.enable()
import parse
import db_methods
from sandman import app,db
import string
import json
import time
import datetime
from statistics import mean, stdev
import ssl

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
context = (os.path.join(__location__, "my-cert.pem"), os.path.join(__location__, "my-key.pem"))

app = Flask(__name__)

############## SERVER CONFIGURATION ##############

# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['txt', 'log'])

try:
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    print(__location__)
    f = open(os.path.join(__location__, "config.txt"), 'rt')
    config_string = f.read()
except FileNotFoundError as e:
    raise FileNotFoundError(e)
finally:
    f.close()

config_dict = json.loads(config_string)

host_name = config_dict["host_name"]
db_name = config_dict["db_name"]
user_name = config_dict["user_name"]
password = config_dict["password"]
entries_per_page = config_dict["default_entries_per_page"]
# This is the path to the upload directory
app.config['UPLOAD_FOLDER'] = config_dict["UPLOAD_FOLDER"]

# read all group regex from file
try:
    f = open(os.path.join(__location__, "uri_group.txt"), 'rt')
    group_string = f.read()
except FileNotFoundError as e:
    raise FileNotFoundError(e)
finally:
    f.close()

group_dict = json.loads(group_string.replace("\\", r"\\"))

############## END SERVER CONFIGURATION ##############

############## METHODS ##############

# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
@app.route('/index')
def index():
    return render_template('dashboard.html')

@app.route('/api/all')
def all():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        offset = request.args.get('offset', type=int)
        limit = request.args.get('limit', type=int)
        sortBy = request.args.get('sortBy')
        if sortBy != None:
            result = db_methods.getAll(cursor, limit, offset, sortBy, request.args.get('order')=="Asc")
        else:
            result = db_methods.getAll(cursor, limit, offset)
        return jsonify(rows = result["rows"], key= "", size = result["size"])
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/test')
def test():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        cursor.execute("SET search_path TO dbo,public;")
        scope = "(SELECT * FROM dbo.access_log WHERE EXTRACT(DAY FROM time_iso8601)=12 ) AS foo"
        items = "date_trunc('minute', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
    #   scope = request.args.get('scope')
    #   granularity = request.args.get('granularity')
    #   items = "date_trunc('" + granularity + "', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
    #   points = [[time.mktime(t.timetuple())*1000,a,b,c] if isinstance(t, datetime.datetime) else t for (t,a,b,c) in db_methods.getTimePoints(cursor, items, scope, 'minute')]
    # return render_template('test.html', points = points, size = len(points))
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/test2')
def test2():
    return render_template('table.html')

# Specific Attribute values
@app.route('/api/attribute')
def attribute():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        attr = request.args.get('attr')
        sortBy = request.args.get('sortBy')
        offset = request.args.get('offset', type=int)
        limit = request.args.get('limit', type=int)
        if sortBy != None:
            result = db_methods.getByAttribute(cursor, request.args.get('q'), limit, offset, attr, sortBy, request.args.get('order')=="Asc")
        else:
            result = db_methods.getByAttribute(cursor, request.args.get('q'), limit, offset, attr)
        return jsonify(rows = result["rows"], key = attr, size = result["size"])
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/api/time_span')
def time_span():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        minTime = request.args.get('minTime')
        maxTime = request.args.get('maxTime')
        sortBy = request.args.get('sortBy')
        offset = request.args.get('offset', type=int)
        limit = request.args.get('limit', type=int)
        if sortBy != None:
            result = db_methods.getByRange(cursor, minTime, maxTime, limit, offset, "time_iso8601", sortBy, request.args.get('order')=="Asc")
        else:
            result = db_methods.getByRange(cursor, minTime, maxTime, limit, offset)
        return jsonify(rows = result["rows"], key = "", size = result["size"], dataflow = db_methods.getDataFlow(result["rows"]))
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

# span = datetime.timedelta(days=0, hours=0, minutes=1, seconds=0)
# result = lp.getRangeByQuest(cursor, 10, span)
@app.route('/api/time_span_by_request')
def time_span_by_request():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        if request.args.get('w') == None:
            weeks = 0
        else:
            weeks = int(request.args.get('w'))
        if request.args.get('d') == None:
            days = 0
        else:
            days = int(request.args.get('d'))
        if request.args.get('h') == None:
            hours = 0
        else:
            hours = int(request.args.get('h'))
        if request.args.get('m') == None:
            minutes = 0
        else:
            minutes = int(request.args.get('m'))
        if request.args.get('s') == None:
            seconds = 0
        else:
            seconds = int(request.args.get('s'))
        span = datetime.timedelta(days, seconds, 0, 0, minutes, hours, weeks)
        sortBy = request.args.get('sortBy')
        offset = request.args.get('offset', type=int)
        limit = request.args.get('limit', type=int)
        if sortBy != None:
            result = db_methods.getRangeByRecord(cursor, request.args.get('id'), span, limit, offset, sortBy, request.args.get('order')=="Asc")
        else:
            result = db_methods.getRangeByRecord(cursor, request.args.get('id'), span, limit, offset)
        return jsonify(rows = result["rows"], key = "", size = result["size"])
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()


# aggregate requests by uri: [(Request_uri, count, average request_length), (...) ...]
@app.route('/uri_stat')
def uri_stat_page():
    return render_template('uri_stat.html')

@app.route('/api/uri_stat')
def uri_stat():
    connection = None
    offset = request.args.get('offset', type=int)
    limit = request.args.get('limit', type=int)
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        result = db_methods.getRequestStats(cursor, limit, offset)
        return jsonify(rows = result["rows"], size = result["size"])
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

# get dataflow by host [(http_host, count, in, out), (...) ...]
@app.route('/host_stat')
def host_stat_page():
    return render_template('/host_stat.html')

@app.route('/api/host_stat')
def host_stat():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        result = db_methods.getHostStats(cursor, limit, offset)
        offset = request.args.get('offset', type=int)
        limit = request.args.get('limit', type=int)
        return jsonify(rows = result["rows"], size = result["size"])
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/api/searchAll')
def searchAll():
    connection = None
    offset = request.args.get('offset', type=int)
    limit = request.args.get('limit', type=int)
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        result = db_methods.searchAll(cursor, request.args.get('value'), limit, offset)
        return jsonify(rows = result[0], size = result[1])
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/api/time_points')
def time_points():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        # scope = "(SELECT * FROM dbo.access_log WHERE EXTRACT(DAY FROM time_iso8601)=12 ) AS foo"
        # items = "date_trunc('minute', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
        scope = request.args.get('scope')
        granularity = request.args.get('granularity')
        items = "date_trunc('" + granularity + "', time_iso8601) AS time, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out"
        points = db_methods.getTimePoints(cursor, items, scope, granularity)
        return jsonify(points = points)
    except psycopg2.DatabaseError as e:
      return render_template('error.html', msg = e)
    finally:
      if connection:
        connection.close()

@app.route('/api/custom_time_points')
def custom_time_points():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        # items = "date_trunc('minute', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
        # result = lp.getCustomTimePoints(cursor, "2015-06-12 21:30:00", "2015-06-12 21:55:00", items, "minute")
        lower = request.args.get('lower')
        lower.replace('+', ' ')
        upper = request.args.get('upper')
        upper.replace('+', ' ')
        granularity = request.args.get('granularity')
        items = "date_trunc('" + granularity + "', time_iso8601) AS time, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out"
        points = db_methods.getCustomTimePoints(cursor, lower, upper, items, granularity)
        return jsonify(points = points)
    except psycopg2.DatabaseError as e:
      return render_template('error.html', msg = e)
    finally:
      if connection:
        connection.close()

# URI regex GROUPs
@app.route('/api/URIgroups')
def uri_groups():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        result = {}
        detail = {}
        for group_name, group_regex in group_dict.items():
            if group_name == "Comment":
                continue
            temp = db_methods.getURIGroup(cursor, group_regex)
            result[group_name] = temp["result"]
            detail[group_name] = temp["detail"]
        return jsonify(result = result, detail = detail)
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

# http://localhost:5000/calendar?domain=month&obj=num_request
@app.route('/calendar')
def cal():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)

        # scope = "(SELECT * FROM dbo.access_log WHERE EXTRACT(DAY FROM time_iso8601)=12 ) AS foo"
        # items = "date_trunc('minute', time_iso8601), COUNT(*), SUM(request_length), SUM(bytes_sent)"
        domain = request.args.get('domain')
        if domain == "month":
            scope = "dbo.MonthCal"
            granularity = "day"
        elif domain == "day":
            scope = "dbo.DayCal"
            granularity = "hour"
        # elif domain == "hour":
        #     scope = "dbo.access_log"
        #     granularity = "minute"
        else:
            return render_template('error.html', msg = "Calendar requires a 'domain' parameter choosing from 'month', 'day', 'hour'")

        items =  "date_trunc('" + granularity + "', time_iso8601) AS time, COUNT(*) AS num_request, SUM(request_length) AS data_in, SUM(bytes_sent) AS data_out"
        t = request.args.get('time')
        # DEFAULT LOAD for intial rendering uses view DayCal - loads only data from -21 days to now
        #                                             MonthCal - Loads only data from -184 days(-6 months) to now
        if t == None:
            start = 0
            # points = [(t.timestamp(), data_in, data_out) if isinstance(t, datetime.datetime) else t for (t, data_in, data_out) in  db_methods.getTimePoints(cursor, items, scope, granularity)]
            points = db_methods.getTimePoints(cursor, items, scope, granularity)

        else:
            target_time = datetime.datetime.strptime(t, "%Y-%m-%dT%H:%M:%S")
            start = time.mktime(target_time.timetuple())
            # span = datetime.timedelta(days, seconds, 0, 0, minutes, hours, weeks)
            if granularity == "hour":
                # CUSTOM LOAD for a given time - loads only data from -10days to +14days
                points = db_methods.getCustomTimePoints(cursor, target_time - datetime.timedelta(10, 0, 0, 0, 0, 0, 0), target_time + datetime.timedelta(0, 0, 0, 0, 0, 0, 2), items, granularity)
            else: # day
                # CUSTOM LOAD for a given time - loads only data from -62days to 92days
                points = db_methods.getCustomTimePoints(cursor, target_time - datetime.timedelta(62, 0, 0, 0, 0, 0, 0), target_time + datetime.timedelta(92, 0, 0, 0, 0, 0, 0), items, granularity)

        objective = request.args.get('obj')
        if objective == None or objective not in ["num_request", "data_in", "data_out"]:
            return render_template('error.html', msg = "Calendar requires a 'obj' parameter choosing from 'num_request', 'data_in', 'data_out'")

        result = {}
        res_list = []
        for i, point in points.items():
            result[point["time"].timestamp()] = point[objective]
            res_list.append(point[objective])

        # empty
        if not res_list:
            colors = [0,1,2,3,4,5]
        else:
            m = mean(res_list)
            sd = stdev(res_list, m)
            colors = []
            i = m-2*sd
            bar = m+2.5*sd
            inc = 0.5*sd
            while i < bar:
                if i >= 0:
                    colors.append(int(i))
                i += inc

        return_html = "calendar_" + domain + ".html"
        return render_template(return_html, result = result, obj = objective, colors = colors, start = start)

    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/calendar_stats')
def calendar_stats():
    granularity = request.args.get('granularity')
    obj = request.args.get('obj')
    # 2015-06-03T00:00:00
    time = request.args.get('time', 0, type=str)
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        if obj == "num_request":
            result = db_methods.getRequestStats(cursor, granularity, time)
            return jsonify(result = result)
        else:
            result = db_methods.getDataStats(cursor, granularity, time, obj)
            return jsonify(result = result)

    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

@app.route('/all_stats')
def all_stats():
    obj = request.args.get('obj')
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        if obj == "num_request":
            result = db_methods.getRequestStats(cursor, granularity, time)
            return jsonify(result = result)
        else:
            result = db_methods.getDataStats(cursor, granularity, time, obj)
            return jsonify(result = result)

    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

# remote_addr
# time_iso8601
# request_time
# request_uri
# request_method
# status
# request_length
# body_bytes_sent
# bytes_sent
# http_host
# http_referer
# http_user_agent

# @app.route('/upload', methods=['POST'])
# def upload():
#     file = request.files['file']
#     if file and allowed_file(file.filename):
#         filename = file.filename
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#         fileTemp = open('%s/%s' % (app.config['UPLOAD_FOLDER'], filename), 'rt')
#         tempString = fileTemp.read()
#         fileTemp.close()
#         tempString.rstrip()
#         db_methods.loadString(tempString)
#         os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#         #return redirect(url_for('uploaded_file', filename=filename))
#         return("Upload Success!")
#
# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'],
#                                filename)
#
# remove all records
@app.route('/remove_all', methods=['GET','POST'])
def remove_all():
    connection = None
    try:
        cursor = db_methods.getCursor(connection, db_name, user_name, host_name, password)
        db_methods.clearDatabase(cursor)
        return render_template('index.html')
    except psycopg2.DatabaseError as e:
        return render_template('error.html', msg = e)
    finally:
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(
        host="127.0.0.1",
        port=int("5000"),
        debug=True,
        threaded=True,
        ssl_context=context
    )
