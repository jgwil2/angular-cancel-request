import os
import time
from flask import Flask, request, jsonify

app = Flask(__name__, static_url_path='', static_folder='./')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/api/friends', methods=['POST'])
def friends_sender():
    friends_list = {
        'friends': ['Jason', 'Sally', 'Bob']
    }
    time.sleep(5)
    return jsonify(friends_list)

if __name__ == '__main__':
    app.run(debug=True)
