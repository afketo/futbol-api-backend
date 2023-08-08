const bcrypt = require('bcrypt')
const User = require('../models/User')
const mongoose = require('mongoose')
const { api, getAllUsers } = require('./helpers')
const { server } = require('../index')

beforeEach(async () => {	
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash('password', 10)
	const user = new User({
		username: 'test1',
		name: 'Test1',
		passwordHash
	})

	await user.save()
})

describe('POST /api/users', () => {
	test('creating a fresh username', async () => {
		const usersAtStart = await getAllUsers()

		const newUser = {
			username: 'test2',
			name: 'Test2',
			password: 't3st2'
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await getAllUsers()

		expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

		const usernames = usersAtEnd.map(user => user.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fail if username is already taken', async () => {
		const usersAtStart = await getAllUsers()

		const newUser = {
			username: 'test1',
			name: 'repeatedUsername',
			password: 'repeatedUsername'
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.errors.username.message).toContain('`username` to be unique')

		const usersAtEnd = await getAllUsers()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
})

afterAll(() => {
	mongoose.connection.close()
	server.close()
})