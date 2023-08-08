const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

// usersRouter.get('/', (req, res) => {
// 	User.find({})
// 		.then(user => {
// 			res.json(user)
// 		})
// })

usersRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('players', {
		// Propiedades que queremos mostrar
		name: 1,
		position: 1,
		birthday: 1
	})
	res.json(users)
})

usersRouter.post('/', async (req, res) => {
	const {body} = req
	const {username, name, password} = body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const newUser = new User({
		username,
		name,
		passwordHash
	})

	newUser.save()
		.then(savedUser => {
			res.status(201).json(savedUser)
		})
		.catch(err => {
			res.status(400).json({
				error: err.message
			})
		})
})

module.exports = usersRouter