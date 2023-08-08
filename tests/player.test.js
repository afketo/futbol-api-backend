const mongoose = require('mongoose')
const { server } = require('../index')
const Player = require('../models/Player')
const { api, initialPlayers, getAllNamesFromPlayers, randomDate, getAllUsers } = require('./helpers')


beforeEach(async () => {
	await Player.deleteMany({})

	for (const player of initialPlayers) {
		const playerObject = new Player(player)
		await playerObject.save()
	}
})

describe('GET /api/players', () => {
	test('players are returned as json', async () => {
		await api
			.get('/api/players')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})
    
	test('there are two players', async () => {
		const res = await api.get('/api/players')
		expect(res.body).toHaveLength(initialPlayers.length)
	})
    
	test('first note is Test1', async () => {
		const {names} = await getAllNamesFromPlayers()
		expect(names).toContain('Test1')
	})
})

describe('POST /api/players', () => {
	test('a valid player can be added', async () => {
		const {id}  = await getAllUsers()

		const newPlayer = {
			name: 'validPlayerAdded',
			position: 'validPositionAdded',
			birthday: randomDate,
			userId: id[0]
		}
    
		await api
			.post('/api/players')
			.send(newPlayer)
			.expect(201)
			.expect('Content-Type', /application\/json/)
    
		const {names} = await getAllNamesFromPlayers()
		expect(names).toContain('validPlayerAdded')
	})
    
	test('post player not contain body', async () => {
		const newPlayer = {}
    
		await api
			.post('/api/players')
			.send(newPlayer)
			.expect(400)
    
		const {res} = await getAllNamesFromPlayers()
		expect(res.body).toHaveLength(initialPlayers.length)
	})
})

describe('PUT /api/players/:id', () => {
	test('a valid player can be modified', async () => {
		const { res: firstRes } = await getAllNamesFromPlayers()
		const { body: players } = firstRes
		const playerToBeModified = players[0]
		const newPlayerObject = {
			name: 'Player modified'
		}

		await api
			.put(`/api/players/${playerToBeModified.id}`)
			.send(newPlayerObject)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const { names } = await getAllNamesFromPlayers()
		expect(names).toContain(newPlayerObject.name)
	})

	test('not existing id a player can not be modified', async () => {
		const newPlayerObject = {
			name: 'Player modified'
		}

		await api
			.put('/api/players/1234')
			.send(newPlayerObject)
			.expect(400)
	})

	test('without body a player can not be modified', async () => {
		const { res: firstRes } = await getAllNamesFromPlayers()
		const { body: players } = firstRes
		const playerToBeModified = players[0]
		const newPlayerObject = {}

		await api
			.put(`/api/players/${playerToBeModified.id}`)
			.send(newPlayerObject)
			.expect(400)
	})
})

describe('DELETE /api/players/:id', () => {
	test('a player can be deleted', async () => {
		const { res: firstRes } = await getAllNamesFromPlayers()
		const { body: players } = firstRes
		const playerToDelete = players[0]
    
		await api
			.delete(`/api/players/${playerToDelete.id}`)
			.expect(204)
    
		const { names, res: secondRes } = await getAllNamesFromPlayers()
		expect(secondRes.body).toHaveLength(initialPlayers.length-1)
		expect(names).not.toContain(playerToDelete.name)
	})
    
	test('a player that do no exist can not be deleted', async () => {
		await api
			.delete('/api/players/1234')
			.expect(400)
    
		const { res } = await getAllNamesFromPlayers()
		expect(res.body).toHaveLength(initialPlayers.length)
	})
})


afterAll(() => {
	mongoose.connection.close()
	server.close()
})