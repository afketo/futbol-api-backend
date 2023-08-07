require('dotenv').config()
require('./mongo')

const Player = require('./models/Player')
const express = require('express')
const cors = require('cors')
const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const app = express()


app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/static', express.static('images'))

app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>')
})

app.get('/api/players', (req, res) => {
	Player.find()
		.then(players => {
			res.json(players)
		})
})

app.get('/api/players/:id', (req, res, next) => {
	const {id} = req.params
	// const player = players.find(player => player.id === id)

	Player.findById(id)
		.then(player => {
			player
				? res.json(player)
				: res.status(404).send({
					error: 'id not found'
				})
		})
		.catch(next)
})

app.put('/api/players/:id', (req, res, next) => {
	const {id} = req.params
	const player = req.body

	const newNoteUpdate = {
		name: player.name,
		position: player.position,
		birthday: player.birthday
	}
	
	Player.findByIdAndUpdate(id, newNoteUpdate, { new: true })
		.then( result => {
			res.status(200).json(result)
		})
		.catch( next)
})

app.delete('/api/players/:id', (req, res, next) => {
	const {id} = req.params
	// players = players.filter(player => player.id !== id)

	Player.findByIdAndDelete(id)
		.then(() => {
			res.status(204).end()
		})
		.catch(next)
})

app.post('/api/players', (req, res) => {
	const player = req.body

	if (!player || !player.name || !player.birthday || !player.position) {
		return res.status(400).json({
			error: 'player body missing'
		})
	}

	const newPlayer = new Player({
		name: player.name,
		position: player.position,
		birthday: player.birthday
	})

	newPlayer.save()
		.then(savedNote => {
			res.json(savedNote)
		})

	// players = [...players, newPlayer] // Esto es como hacer un concat para añadir registro al array

	// res.status(201).json(newPlayer)
})

app.use(handleErrors)

app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log('Server running on port ' + PORT)
})
