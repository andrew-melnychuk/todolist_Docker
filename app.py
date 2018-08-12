import os, sys, uuid
from flask import Flask, Response, redirect, url_for, request, render_template, json
from pymongo import MongoClient, errors

app = Flask(__name__)

client = MongoClient(
    "mongodb://todouser:pass1word@ds219051.mlab.com:19051/totlist"
)

db = client['totlist']


@app.route('/')
def todo():
    _items = db.todos.find()
    items = [item for item in _items]

    return render_template('index.html', items=items)


@app.route('/new', methods=['POST'])
def new():

    item_doc = {
        'name': request.form['name'],
        'description': request.form['description']
    }
    db.todos.insert_one(item_doc)

    return redirect(url_for('todo'))


@app.route('/api/tasks', methods=['GET'])
def tasks_list():
    _items = db.todos.find()
    items = list()
    for item in _items:
        del item["_id"]
        items.append(item)
    return _send_list_JSON(items)


@app.route('/api/tasks', methods=['POST'])
def add_task():
    jsonbody = request.get_json()
    jsonbody["task_id"] = str(uuid.uuid4())[:8]
    try:
        db.todos.insert(jsonbody)
        del jsonbody["_id"]
        return Response(json.dumps(jsonbody),
                        mimetype="application/json",
                        status=200)
    except Exception as e:
        return Response(json.dumps({"error": e}),
                        mimetype="application/json",
                        status=400)


@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task_by_id(task_id):
    jsonbody = db.todos.find_one({"task_id": task_id})
    del jsonbody["_id"]
    return Response(json.dumps(jsonbody),
                    mimetype="application/json",
                    status=200)


@app.route('/api/tasks/<task_id>', methods=['PUT'])
def put_task_by_id(task_id):
    try:
        jsonbody = request.get_json()
        db.todos.update(
            {"task_id": task_id},
            {"$set": jsonbody}
        )
        updateresult = db.todos.find_one({"task_id": task_id})
        del updateresult["_id"]
        return Response(json.dumps(updateresult),
                        mimetype="application/json",
                        status=200)
    except Exception, e:
        return Response(json.dumps({"error": e}),
                        mimetype="application/json",
                        status=400)




def _send_list_JSON(instance=None):
    return Response(json.dumps(instance),
                    mimetype="application/json",
                    status=200)


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
