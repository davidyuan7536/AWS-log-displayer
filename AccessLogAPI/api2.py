import os
from flask import Flask, Blueprint, render_template, request, redirect, url_for, send_from_directory, jsonify
# from flask_sslify import SSLify
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
from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()
import csv

from ldap3 import Server, Connection, ALL




context = ('my-cert.pem', 'my-key.pem')

app = Flask(__name__)
# sslify = SSLify(app)
# print(sslify)


############## SERVER CONFIGURATION ##############

##################################################

@app.route('/')
@app.route('/index')
@app.route('/login')
@app.route('/index.html')
@app.route('/login.html')
def index():
    return render_template('login.html')

@app.route('/dashboard.html')
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/graphStats.html')
def graphStats():
    return render_template('graphStats.html')

@app.route('/graphTerms.html')
def graphTerms():
    return render_template('graphTerms.html')

@app.route('/aggregations.html')
def aggregations():
    return render_template('aggregations.html')

@app.route('/testing.html')
def testing():
    return render_template('testing.html')

@app.route('/credentials', methods=['GET', 'POST'])
def credentials():
    username = request.form.get('username')
    password = request.form.get('password')
    s = Server('elysium.laserfiche.com',use_ssl=True,get_info=ALL)
    c = Connection(s, user=username, password=password)
    if not c.bind():
        print('error in bind', c.result)
        return jsonify(loginSuccess = "no")
    else:
        return jsonify(loginSuccess = "yes")


@app.route('/templates/<path:path>')
def send_html(path):
    return send_from_directory('templates', path)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/images/<path:path>')
def send_image(path):
    return send_from_directory('images', path)

@app.route('/download_table')
def download_table():
    __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
    data = request.args.get('data', type=list)
    with open(os.path.join(__location__, "download\data.csv"), 'w+', newline='') as f:
    #     writer = csv.writer(tsvfile, delimiter=',', newline='\n')
        print(data)
    #     # for row in request.args.get('data'):
    #     #     writer.writerow(row)


    return send_from_directory('', "download/data.csv")

@app.route('/table')
def table():
    page_size = request.args.get("page_size")
    if (page_size == None):
        page_size = 20
    page_number = request.args.get("page_number")
    if (page_number == None):
        page_number = 1
    total_size = request.args.get("total_size")
    if (total_size == None):
        total_size = 0
    total_page = request.args.get("total_page")
    if (total_page == None):
        total_page = 0
    sortby = request.args.get("sortby")
    if (sortby == None):
        sortby = "time_iso8601"
    order = request.args.get("order")
    if (order == None):
        order = "asc"
    columns = request.args.get("columns")
    if (columns == None):
        columns = []
    display_time_format = request.args.get("display_time_format")
    if (display_time_format == None):
        display_time_format =  1  # time_format.UTC
    display_status_color = request.args.get("display_status_color")
    if (display_status_color == None):
        display_status_color = 1

    return render_template('table.html', page_size = page_size, page_number = page_number, total_size = total_size, total_page = total_page, sortby = sortby, order = order, columns = columns, display_time_format = display_time_format, display_status_color = display_status_color)

@app.route('/calendar')
def calendar():
    return render_template('calendar.html', start=0)

@app.route('/test')
def test():
    return render_template('filter_form.html')

@app.route('/elasticsearch/filterOptions', methods=['GET', 'POST'])
def elasticsearchFilterOptions():

    mustData = request.form.get('mustData')
    mustNotData = request.form.get('mustNotData')
    shouldData = request.form.get('shouldData')


    mustData = json.loads(mustData)

    mustNotData = json.loads(mustNotData)

    shouldData = json.loads(shouldData)

    sortBy = request.form.get('sortBy')
    offset = request.form.get('offset', type=int)
    limit = request.form.get('limit', type=int)
    order = request.form.get('order')

    if sortBy != None:
        elasticsearchResult = es.search(index="log_index", doc_type = "log", body = { "from" : offset, "size" : limit, "sort" : [{sortBy : { "order": order}}],"query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}} })
    else:
        elasticsearchResult = es.search(index="log_index", doc_type = "log", body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}} })
    return jsonify(rows = elasticsearchResult["hits"]['hits'], size = elasticsearchResult["hits"]['total'])

@app.route('/elasticsearch/regex', methods=['GET', 'POST'])
def elasticsearchRegex():


    groupName = request.form.get('groupName')
    groupedFieldStats = request.form.get('groupedFieldStats')
    sortBy = request.form.get('sortBy')
    offset = request.form.get('offset', type=int)
    limit = request.form.get('limit', type=int)
    order = request.form.get('order')

    mustData = request.form.get('mustData')
    mustNotData = request.form.get('mustNotData')
    shouldData = request.form.get('shouldData')

    mustData = json.loads(mustData)
    mustNotData = json.loads(mustNotData)
    shouldData = json.loads(shouldData)

    shouldData2 = []


    try:
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        f = open(os.path.join(__location__, "uri_group.txt"), 'rt')
        regex_string = f.read()
    except FileNotFoundError as e:
        raise FileNotFoundError(e)
    finally:
        f.close()

    regex_string = regex_string.split('\n')
    tempLen = len(regex_string)
    count = 0
    while (count < tempLen):
        regex_line = regex_string[count].split(":")
        regex_line_temp = regex_line[0]
        regex_line_temp = regex_line_temp[1:-2]
        if regex_line_temp == groupName:
            length = len(regex_line[0]) + 2
            regex_line_temp2 = regex_string[count]
            regex_line_temp2 = regex_line_temp2[length:]
            regex_line_temp2 = regex_line_temp2[1:-2]
            regex_query = regex_line_temp2.split(",,")
            tempLen2 = len(regex_query)
            index = 0
            while(index < tempLen2):
                final_query_no_lookahead = ""
                regex_query_single = regex_query[index]
                regex_query_single = regex_query_single.split("\\")
                # print(regex_query[index])
                # print('\n')
                tempLen3 = len(regex_query_single)
                counter = 0
                while(counter < tempLen3):
                    # print(regex_query_single[counter])
                    # print('\n')
                    if counter == 0:
                        final_query_no_lookahead = regex_query_single[counter]
                    else:
                        final_query_no_lookahead = final_query_no_lookahead + "\\" + regex_query_single[counter]
                    counter = counter + 1



                shouldData2.insert(0, {"regexp":{"request_uri": final_query_no_lookahead}})
                if final_query_no_lookahead[0] != '/':
                    final_query_no_lookahead2 = "/" + final_query_no_lookahead
                    shouldData2.insert(0, {"regexp":{"request_uri": final_query_no_lookahead2}})

                # print(final_query_no_lookahead)
                # print('\n')
                # print(final_query_no_lookahead2)

                index = index + 1

        count = count + 1

    mustData.insert(0, {"bool" : {"should" : shouldData2}})



    if sortBy != None:
        elasticsearchResult = es.search(index="log_index", body = { "from" : offset, "size" : limit, "sort" : [{sortBy : { "order": order}}], "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}}, "aggs" : {groupedFieldStats + "_stats": { "stats" : { "field" : groupedFieldStats}}} })
    else:
        elasticsearchResult = es.search(index="log_index", body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}}, "aggs" : {groupedFieldStats + "_stats" : { "stats" : { "field" : groupedFieldStats}}} })
    return jsonify(rows = elasticsearchResult["hits"]['hits'], grouping = elasticsearchResult["aggregations"],  size = elasticsearchResult["hits"]['total'])


    # regex_list = regex_string.split(',,')

    #
    # if sortBy != None:
    #     elasticsearchResult = es.search(index="log_index", body = {"from" : offset, "size" : limit, "sort" : [{sortBy : { "order": order}}], "query" : {"match" : {attr : q}} })
    # else:
    #     elasticsearchResult = es.search(index="log_index", body = {"from" : offset, "size" : limit, "query" : {"match" : {attr : q}}})
    # return jsonify(rows = elasticsearchResult["hits"]['hits'], size = elasticsearchResult["hits"]['total'])
    #

@app.route('/elasticsearch/dateHistogram', methods=['GET', 'POST'])
def elasticsearchDateHistogram():

    datetimeNow = request.form.get('datetimeNow')
    user = request.form.get('user')

    mustData = request.form.get('mustData')
    mustNotData = request.form.get('mustNotData')
    shouldData = request.form.get('shouldData')


    mustData = json.loads(mustData)

    mustNotData = json.loads(mustNotData)

    shouldData = json.loads(shouldData)

    sortBy = request.form.get('sortBy')
    offset = request.form.get('offset', type=int)
    limit = request.form.get('limit', type=int)
    order = request.form.get('order')

    granularity = request.form.get('granularity')
    bucketData = request.form.get('bucketData')
    bucketDataAnalyze = request.form.get('bucketDataAnalyze')


    if sortBy != None:
        es.create(index="log_index", doc_type = "user_action_log", body = {"user" : user, "date" : datetimeNow, "api_request" : "dateHistogram", "must_filter" : mustData, "must_not_filter" : mustNotData, "shoud_filter" : shouldData, "aggregation" : bucketData, "aggregation_type" : bucketDataAnalyze, "granularity" : granularity, "offset" : offset, "limit" : limit, "sort_by" : sortBy, "order" : order})
        elasticsearchResult = es.search(index="log_index", doc_type = "log", body = { "from" : offset, "size" : limit, "sort" : [{sortBy : { "order": order}}], "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"dateHistogram" : {"date_histogram" : {"field" : "time_iso8601", "interval" : granularity, "order" : { "dataAnalyzeReturned" : order }},"aggs" : {"dataAnalyzeReturned" : { bucketDataAnalyze : { "field" : bucketData } }}}} })
    else:
        es.create(index="log_index", doc_type = "user_action_log", body = {"user" : user, "date" : datetimeNow, "api_request" : "dateHistogram", "must_filter" : mustData, "must_not_filter" : mustNotData, "shoud_filter" : shouldData, "aggregation" : bucketData, "aggregation_type" : bucketDataAnalyze, "granularity" : granularity, "offset" : offset, "limit" : limit})
        elasticsearchResult = es.search(index="log_index", doc_type = "log", body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"dateHistogram" : {"date_histogram" : {"field" : "time_iso8601", "interval" : granularity, "order" : { "dataAnalyzeReturned" : order }},"aggs" : {"dataAnalyzeReturned" : { bucketDataAnalyze : { "field" : bucketData } }}}} })
    return jsonify(rows = elasticsearchResult["hits"]['hits'], grouping = elasticsearchResult["aggregations"]["dateHistogram"],  size = elasticsearchResult["hits"]['total'])

@app.route('/elasticsearch/aggregation', methods=['GET', 'POST'])
def elasticsearchAggregation():



    datetimeNow = request.form.get('datetimeNow')
    user = request.form.get('user')

    mustData = request.form.get('mustData')
    mustNotData = request.form.get('mustNotData')
    shouldData = request.form.get('shouldData')
    mustData = json.loads(mustData)
    mustNotData = json.loads(mustNotData)
    shouldData = json.loads(shouldData)



    offset = request.form.get('offset', type=int)
    limit = request.form.get('limit', type=int)


    aggregation1 = request.form.get('aggregation1')
    aggregationType1 = request.form.get('aggregationType1')

    aggregation2 = request.form.get('aggregation2')
    aggregationType2 = request.form.get('aggregationType2')

    aggregationSize1 = request.form.get('aggregationSize1')
    aggregationSize2 = request.form.get('aggregationSize2')


    if aggregation2 != None:
        if aggregationSize2 != None:
            # es.create(index="log_index", doc_type = "user_action_log", body = {"user" : user, "date" : datetimeNow, "api_request" : "aggregation", "must_filter" : mustData, "must_not_filter" : mustNotData, "shoud_filter" : shouldData, "aggregation_1" : aggregation1, "aggregation_type_1" : aggregationType1, "aggregation_2" : aggregation2, "aggregation_type_2" : aggregationType2, "aggregationSize1" : aggregationSize1, "aggregationSize2" : aggregationSize2, "offset" : offset, "limit" : limit})

            elasticsearchResult = es.search(index="log_index", doc_type = "log", timeout = 120, body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"aggregation1" : {aggregationType1 : {"field" : aggregation1, "size" : aggregationSize1}, "aggs" : {"aggregation2" : { aggregationType2 : { "field" : aggregation2, "size" : aggregationSize2 } }}}} })
        else:
            # es.create(index="log_index", doc_type = "user_action_log", body = {"user" : user, "date" : datetimeNow, "api_request" : "aggregation", "must_filter" : mustData, "must_not_filter" : mustNotData, "shoud_filter" : shouldData, "aggregation_1" : aggregation1, "aggregation_type_1" : aggregationType1, "aggregation_2" : aggregation2, "aggregation_type_2" : aggregationType2, "aggregationSize1" : aggregationSize1, "offset" : offset, "limit" : limit})

            elasticsearchResult = es.search(index="log_index", doc_type = "log", timeout = 120, body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"aggregation1" : {aggregationType1 : {"field" : aggregation1, "size" : aggregationSize1}, "aggs" : {"aggregation2" : { aggregationType2 : { "field" : aggregation2} }}}} })
    else:
        if aggregationSize1 != None:
            # es.create(index="log_index", doc_type = "user_action_log", body = {"user" : user, "date" : datetimeNow, "api_request" : "aggregation", "must_filter" : mustData, "must_not_filter" : mustNotData, "shoud_filter" : shouldData, "aggregation_1" : aggregation1, "aggregation_type_1" : aggregationType1, "aggregationSize1" : aggregationSize1, "offset" : offset, "limit" : limit})

            elasticsearchResult = es.search(index="log_index", doc_type = "log", timeout = 120, body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"aggregation1" : {aggregationType1 : {"field" : aggregation1, "size" : aggregationSize1}}} })
        else:
            elasticsearchResult = es.search(index="log_index", doc_type = "log", timeout = 120, body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"aggregation1" : {aggregationType1 : {"field" : aggregation1}}} })
    return jsonify(rows = elasticsearchResult["hits"]['hits'], grouping = elasticsearchResult["aggregations"]["aggregation1"],  size = elasticsearchResult["hits"]['total'])


@app.route('/elasticsearch/dateHistogramTerm', methods=['GET', 'POST'])
def elasticsearchDateHistogramTerm():

    datetimeNow = request.form.get('datetimeNow')
    user = request.form.get('user')

    mustData = request.form.get('mustData')
    mustNotData = request.form.get('mustNotData')
    shouldData = request.form.get('shouldData')


    mustData = json.loads(mustData)

    mustNotData = json.loads(mustNotData)

    shouldData = json.loads(shouldData)

    offset = request.form.get('offset', type=int)
    limit = request.form.get('limit', type=int)

    granularity = request.form.get('granularity')
    bucketData = request.form.get('bucketData')
    bucketDataSize = request.form.get('bucketDataSize')




    elasticsearchResult = es.search(index="log_index", doc_type = "log", body = { "from" : offset, "size" : limit, "query" : {"filtered" : { "filter" : {"bool" : {"must" : mustData, "must_not" : mustNotData, "should" : shouldData}}}},  "aggs" : {"dateHistogram" : {"date_histogram" : {"field" : "time_iso8601", "interval" : granularity},"aggs" : {"aggregation1" : { "terms" : { "field" : bucketData, "size" : bucketDataSize } }}}} })
    return jsonify(rows = elasticsearchResult["hits"]['hits'], grouping = elasticsearchResult["aggregations"]["dateHistogram"],  size = elasticsearchResult["hits"]['total'])

@app.route('/calendar_point', methods=['GET', 'POST'])
def calendar_point():

    # returnCount = False
    granularity = request.form.get('granularity')
    # obj = request.form.get('obj')
    # if obj == "num_request":
    #     returnCount = True
    method = request.form.get('method')

    must = json.loads(request.form.get('must'))
    mustNot = json.loads(request.form.get('mustNot'))
    should = json.loads(request.form.get('should'))

    elasticsearchResult = es.search(index="log_index",
        body ={
                "from": 0,
                "size": 0,
                "query":
                    {"filtered":
                        {"filter":
                            {"bool":
                                {"must": must,
                                "must_not": mustNot,
                                "should": should}
                            }
                        }
                    },
                "aggs":
                    {"calendar_point":
                        {"date_histogram":
                            {"field": "time_iso8601",
                            "interval": granularity
                            },
                        "aggs":
                            {"bytes_received":
                                {method:
                                    {"field" : "bytes_received" }
                                },
                             "bytes_sent":
                                {method:
                                    {"field" : "bytes_sent" }
                                }
                            }
                        }
                    }
                }
            )

    result = {"num_request": {}, "bytes_received": {}, "bytes_sent": {}}
    res_list = {"num_request": [], "bytes_received": [], "bytes_sent": []}
    for item in elasticsearchResult["aggregations"]["calendar_point"]["buckets"]:
        result["num_request"][str(item["key"]/1000)] = item["doc_count"]
        res_list["num_request"].append(item["doc_count"])
        result["bytes_received"][str(item["key"]/1000)] = item["bytes_received"]["value"]
        res_list["bytes_received"].append(item["bytes_received"]["value"])
        result["bytes_sent"][str(item["key"]/1000)] = item["bytes_sent"]["value"]
        res_list["bytes_sent"].append(item["bytes_sent"]["value"])

    colors = {"num_request": [], "bytes_received": [], "bytes_sent": []}
    # empty
    if not res_list["num_request"]:
        colors = {"num_request": [0,1,2,3,4,5], "bytes_received": [0,1,2,3,4,5], "bytes_sent": [0,1,2,3,4,5]}
    else:
        for k, l in res_list.items():
            m = mean(l)
            sd = stdev(l, m)
            i = m-2*sd
            bar = m+2.5*sd
            inc = 0.5*sd
            while i < bar:
                if i >= 0:
                    colors[k].append(int(i))
                i += inc

    return jsonify(result  = result, colors = colors)

@app.route('/calendar_stat', methods=['GET', 'POST'])
def calendar_stat():

    # get filters including time range

    must = json.loads(request.form.get('must'))
    mustNot = json.loads(request.form.get('mustNot'))
    should = json.loads(request.form.get('should'))

    print(must)
    # number of requests
    elasticsearchResult = es.search(index="log_index",
        body =  {"query" : {
                  "filtered" : {
                     "filter" : {
                        "bool" : {
                          "must" : must,
                          "must_not" : mustNot,
                          "should" : should
                        }
                       }
                     }
                  },
                  "aggs" : {
                    "remote_addr" : {
                        "terms" : {
                            "field" : "remote_addr"}
                          },
                    "request_time" : {
                            "stats" : {
                              "field" : "request_time"}
                        },
                    "request_uri" : {
                        "terms" : {
                            "field" : "request_uri"}
                          },
                    "request_method" : {
                        "terms" : {
                            "field" : "request_method"}
                          },
                    "status" : {
                        "terms" : {
                            "field" : "status"}
                          },
                    "bytes_received" : {
                            "stats" : {
                              "field" : "bytes_received"}
                        },
                    "body_bytes_sent" : {
                            "stats" : {
                              "field" : "body_bytes_sent"}
                        },
                    "bytes_sent" : {
                            "stats" : {
                              "field" : "bytes_sent"}
                        },
                    "http_host" : {
                        "terms" : {
                            "field" : "http_host"}
                          },
                    "http_referer" : {
                        "terms" : {
                            "field" : "http_referer"}
                          },
                    "http_agent" : {
                        "terms" : {
                            "field" : "http_agent"}
                          },
                    "remote_addr_count" : {
                            "cardinality" : {
                                "field": "remote_addr"
                            }
                        },
                    "request_uri_count" : {
                            "cardinality" : {
                                "field": "request_uri"
                            }
                        },
                    "http_host_count" : {
                            "cardinality" : {
                                "field": "http_host"
                            }
                        },
                    "http_referer_count" : {
                            "cardinality" : {
                                "field": "http_referer"
                            }
                        },
                    "http_agent_count" : {
                            "cardinality" : {
                                "field": "http_agent"
                            }
                        }
                    }
                }
            )
    print(elasticsearchResult)
    num_request = {"size": elasticsearchResult["hits"]["total"]}
    bytes_received = {"size": elasticsearchResult["aggregations"]["bytes_received"]["sum"]}
    bytes_sent = {"size": elasticsearchResult["aggregations"]["bytes_sent"]["sum"]}

    # remote_addr, request_time, request_uri, request_method, status, bytes_received, body_bytes_sent, bytes_sent, http_host, http_referer, http_user_agent
    attr_list1 = ["remote_addr", "request_uri", "request_method", "status", "http_host", "http_referer", "http_agent"]
    # ^ terms query
    attr_list2 = ["request_time", "bytes_received", "body_bytes_sent", "bytes_sent"]
    #  ^ stats query
    attr_list3 = ["remote_addr", "request_uri", "http_host", "http_referer", "http_agent"]
    #  ^ for data in/out

    for attr in attr_list1:
        if attr in attr_list3:
            num_request[attr] = {"cardinality": elasticsearchResult["aggregations"][attr + "_count"]["value"], "list": {}}
        else:
            num_request[attr] = {"list": {}}
        i = 0
        for item in elasticsearchResult["aggregations"][attr]["buckets"]:
            if attr != "remote_addr":
                num_request[attr]["list"][i] = {"name": item["key"], "count": item["doc_count"]}
            else:
                num_request[attr]["list"][i] = {"name": item["key_as_string"], "count": item["doc_count"]}
            i += 1

    for attr in attr_list2:
        num_request[attr] = elasticsearchResult["aggregations"][attr]

    entry_size = 10

    # bytes_received
    elasticsearchResult = es.search(index="log_index",
        body =  { "query" : {
                  "filtered" : {
                     "filter" : {
                        "bool" : {
                          "must" : must,
                          "must_not" : mustNot,
                          "should" : should
                        }
                       }
                     }
                  },
                  "aggs" : {
                    "remote_addr" : {
                      "terms" : {
                        "field" : "remote_addr",
                        "size" : entry_size,
                          "order" : { "total_bytes_received" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_received" : { "sum" : { "field" : "bytes_received" } }
                      }
                    },
                    "request_uri" : {
                      "terms" : {
                        "field" : "request_uri",
                        "size" : entry_size,
                          "order" : { "total_bytes_received" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_received" : { "sum" : { "field" : "bytes_received" } }
                      }
                    },
                    "http_host" : {
                      "terms" : {
                        "field" : "http_host",
                        "size" : entry_size,
                          "order" : { "total_bytes_received" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_received" : { "sum" : { "field" : "bytes_received" } }
                      }
                    },
                    "http_referer" : {
                      "terms" : {
                        "field" : "http_referer",
                        "size" : entry_size,
                          "order" : { "total_bytes_received" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_received" : { "sum" : { "field" : "bytes_received" } }
                      }
                    },
                    "http_agent" : {
                      "terms" : {
                        "field" : "http_agent",
                        "size" : entry_size,
                          "order" : { "total_bytes_received" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_received" : { "sum" : { "field" : "bytes_received" } }
                      }
                    }
                  }
                }
            )

    for attr in attr_list3:
        bytes_received[attr] = {"list": {}}
        i = 0
        for item in elasticsearchResult["aggregations"][attr]["buckets"]:
            if attr != "remote_addr":
                bytes_received[attr]["list"][i] = {"name": item["key"], "count": item["total_bytes_received"]["value"]}
            else:
                bytes_received[attr]["list"][i] = {"name": item["key_as_string"], "count": item["total_bytes_received"]["value"]}
            i += 1

    # bytes_sent
    elasticsearchResult = es.search(index="log_index",
        body =  { "query" : {
                  "filtered" : {
                     "filter" : {
                        "bool" : {
                          "must" : must,
                          "must_not" : mustNot,
                          "should" : should
                        }
                       }
                     }
                  },
                  "aggs" : {
                    "remote_addr" : {
                      "terms" : {
                        "field" : "remote_addr",
                        "size" : entry_size,
                          "order" : { "total_bytes_sent" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_sent" : { "sum" : { "field" : "bytes_sent" } }
                      }
                    },
                    "request_uri" : {
                      "terms" : {
                        "field" : "request_uri",
                        "size" : entry_size,
                          "order" : { "total_bytes_sent" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_sent" : { "sum" : { "field" : "bytes_sent" } }
                      }
                    },
                    "http_host" : {
                      "terms" : {
                        "field" : "http_host",
                        "size" : entry_size,
                          "order" : { "total_bytes_sent" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_sent" : { "sum" : { "field" : "bytes_sent" } }
                      }
                    },
                    "http_referer" : {
                      "terms" : {
                        "field" : "http_referer",
                        "size" : entry_size,
                          "order" : { "total_bytes_sent" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_sent" : { "sum" : { "field" : "bytes_sent" } }
                      }
                    },
                    "http_agent" : {
                      "terms" : {
                        "field" : "http_agent",
                        "size" : entry_size,
                          "order" : { "total_bytes_sent" : "desc" }
                            },
                      "aggs" : {
                        "total_bytes_sent" : { "sum" : { "field" : "bytes_sent" } }
                      }
                    }
                  }
                }
            )

    for attr in attr_list3:
        bytes_sent[attr] = {"list": {}}
        i = 0
        for item in elasticsearchResult["aggregations"][attr]["buckets"]:
            if attr != "remote_addr":
                bytes_sent[attr]["list"][i] = {"name": item["key"], "count": item["total_bytes_sent"]["value"]}
            else:
                bytes_sent[attr]["list"][i] = {"name": item["key_as_string"], "count": item["total_bytes_sent"]["value"]}
            i += 1

    return jsonify(result  = {"num_request": num_request, "bytes_received": bytes_received, "bytes_sent": bytes_sent})





if __name__ == '__main__':
    app.debug = False
    app.run(
        host="127.0.0.1",
        port=int("5000")
        # ssl_context=context
    )
