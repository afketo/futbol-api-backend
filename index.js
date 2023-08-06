const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

  
let players = [
	{
		'id': 1,
		'name': 'Roberto Carlos',
		'position': 'Defender',
		'birthday': '1988-04-01'
	},
	{ 
		'id': 2,
		'name': 'Cristiano Ronaldo', 
		'position': 'Striker',
		'birthday': '1999-01-05'
	}, 
	{
		'id': 3,
		'name': 'Unai Simon',
		'position': 'Goalkeeper',
		'birthday': '2002-12-25'
	},
	{
		'id': 4,
		'name': 'Toni Kross',
		'position': 'Midfield',
		'birthday': '1995-07-12'
	},
	{
		'id': 5,
		'name': 'Ivan Helguera',
		'position': 'Defender',
		'birthday': '1988-02-12'
	},
	{
		'id': 6,
		'name': 'Neymar Jr',
		'position': 'Striker',
		'birthday': '1992-04-22'
	}
]

app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>')
})

app.get('/api/players', (req, res) => {
	res.json(players)
})

app.get('/api/players/:id', (req, res) => {
	const id = Number(req.params.id)
	const player = players.find(player => player.id === id)

	player ? res.json(player) : res.status(404).end()
})


app.delete('/api/players/:id', (req, res) => {
	const id = Number(req.params.id)
	players = players.filter(player => player.id !== id)

	res.status(204).end()
})

app.post('/api/players', (req, res) => {
	const player = req.body

	if (!player || !player.name || !player.birthday || !player.position) {
		return res.status(400).json({
			error: 'player body missing'
		})
	}

	const ids = players.map(player => player.id)
	const maxId = Math.max(...ids)

	const newPlayer = {
		id: maxId+1,
		name: player.name,
		position: player.position,
		birthday: player.birthday
	}

	players = [...players, newPlayer] // Esto es como hacer un concat para añadir registro al array

	res.status(201).json(newPlayer)
})

app.use((req, res) => {
	res.status(404).json({
		error: 'Not found'
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log('Server running on port ' + PORT)
})
