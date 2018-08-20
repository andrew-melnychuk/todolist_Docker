import bson, jwt

from flask import (
    Blueprint,
    url_for,
    request,
    session
)

from helper import _send_list_JSON, client

userRouter = Blueprint('userRouter', __name__)

db = client['totlist']

@userRouter.route('/api/auth', methods=['POST'])
def login():
    jsonbody = request.get_json()
    document = dict()
    try:
        document["id"] = str(db.users.find_one(jsonbody)["_id"])
        session["WebAPIToken"] = document["id"]
        encoded = jwt.encode(document, 'secret', algorithm='HS256')

        return _send_list_JSON({"WebAPIToken": encoded})
    except:
        return _send_list_JSON({"error": "Login into system please"}, 403)

@userRouter.route('/api/auth/out', methods=['GET'])
def get_token():
    session.pop("WebAPIToken", None)

    return _send_list_JSON({"message": "User logged out"})