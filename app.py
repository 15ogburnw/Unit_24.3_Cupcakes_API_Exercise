"""Flask app for Cupcakes"""

from flask import Flask, request, render_template, jsonify
from models import db, connect_db, Cupcake


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

app.config['SECRET_KEY'] = "SECRET!"


@app.route('/')
def show_cupcakes_page():

    return render_template('index.html')


@app.route('/api/cupcakes')
def get_all_cupcakes():

    cupcakes = Cupcake.query.all()
    serialized = [c.serialize() for c in cupcakes]

    return jsonify(cupcakes=serialized)


@app.route('/api/cupcakes/<int:id>')
def get_one_cupcake(id):

    cupcake = Cupcake.query.get_or_404(id)

    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes', methods=["POST"])
def create_cupcake():

    data = request.json

    cupcake = Cupcake(
        flavor=data['flavor'],
        size=data['size'],
        rating=data['rating'],
        image=data['image'] or None
    )

    db.session.add(cupcake)
    db.session.commit()

    return (jsonify(cupcake=cupcake.serialize()), 201)


@app.route('/api/cupcakes/<int:id>', methods=["PATCH"])
def edit_cupcake(id):

    data = request.json
    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = data["flavor"]
    cupcake.size = data['size']
    cupcake.rating = data['rating']
    cupcake.image = data['image']

    db.session.commit()

    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes/<int:id>', methods=["DELETE"])
def delete_cupcake(id):

    cupcake = Cupcake.query.get_or_404(id)

    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message="Cupcake successfully deleted!")
