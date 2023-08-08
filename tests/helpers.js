const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

let randomDate = new Date(new Date() - Math.random()*(1e+12)).toISOString().replace('T', ' ').substr(0,10)

const initialPlayers = [
	{        
		name: 'Test1',
		position: 'PositionTest1',
		birthday: randomDate
	},
	{        
		name: 'Test2',
		position: 'PositionTest2',
		birthday: randomDate
	},
	{        
		name: 'Test3',
		position: 'PositionTest3',
		birthday: randomDate
	}
]

const getAllNamesFromPlayers = async () => {
	const res = await api.get('/api/players')
	return {
		names: res.body.map(player => player.name),
		res
	}
}

const getAllUsers = async () => {
	const usersDB = await User.find({})
	return {
		users: usersDB.map(user => user.toJSON()),
		id: usersDB.map(user => user.id)
	}
}

module.exports = {
	api,
	randomDate,
	initialPlayers,
	getAllNamesFromPlayers,
	getAllUsers
}