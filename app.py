from flask import Flask, render_template, request, abort, jsonify
import blockchain # locally imported module
from base64 import b64decode
import json
from os import urandom
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.secret_key = urandom(24)
csrf = CSRFProtect(app)

blockchain_var = blockchain.Blockchain()

print(blockchain_var.is_chain_valid())

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/create_poll', methods=['POST'])
def create_poll():
    poll_title = request.form.get('title') # poll name
    poll_options = request.form.getlist('option[]') # ['poll option 1', 'poll option 2']

    poll_data = {
        'title': poll_title,
        'options': poll_options
    }
    
    # Serialize the poll data to JSON
    poll_data_json = json.dumps(poll_data)
    
    # Add the JSON data to the blockchain
    hash = blockchain_var.add_block(poll_data_json)

    return f'<meta http-equiv="refresh" content="0;url=/poll/{hash}">', 200


@app.route('/poll/<pollhash>')
def poll(pollhash):
    block = blockchain_var.find_block_by_hash(pollhash)
    if block:
        #print(f"Block found: Index {block.index}, Data {block.data}")
        return render_template('poll.html', poll_title=json.loads(block.data)["title"], options=json.loads(block.data)["options"]) # literal_eval is safe to use because it only evaluates literals and not arbitrary code

    abort(404)



@app.route('/vote/<pollhash>', methods=['POST'])
def vote(pollhash):
    try:
        blockchain_var.vote(pollhash+request.form.get('choice'))
        return 'OK', 200
    except:
        abort(500)

@app.route('/get_votes/<pollhash>', methods=['GET'])
def get_votes(pollhash):
    base64decoded = b64decode(request.args.get('option'))
    utf8_str = base64decoded.decode('utf-8')
    return jsonify({'count': blockchain_var.count_votes(pollhash+utf8_str)})


CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=False)