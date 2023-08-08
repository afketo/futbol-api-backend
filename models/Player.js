const { Schema, model } = require('mongoose')

const playerSchema = new Schema({
	name: String,
	position: String,
	birthday: Date,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
})

playerSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id

		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Player = model('Player', playerSchema)

module.exports = Player