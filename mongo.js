const mongoose = require('mongoose')

const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env

const connectionString = NODE_ENV === 'test'
	?	MONGO_DB_URI_TEST
	:	MONGO_DB_URI
	
// let randomDate = new Date(new Date() - Math.random()*(1e+12)).toISOString().replace('T', ' ').substr(0,10)

mongoose.connect(connectionString)
	.then(() => {
		console.log('Database connected')
	})
	.catch(err => {
		console.log(err)
	})

process.on('uncaughtException', () => {
	mongoose.connection.close()
})


// Player.find() // BUSCA DATOS
// 	.then( result => {
// 		console.log(result)
// 	})
// 	.catch( err => {
// 		console.log(err)
// 	})
// 	.finally(() => {
// 		mongoose.connection.close()
// 	})


// const player = new Player({ // CREAMOS INSTANCIA DE JUGADOR CON DATOS FAKE
// 	name: 'New Player',
// 	position: 'Striker',
// 	birthday: randomDate
// })

// player.save() // GUARDA DATOS
// 	.then(result => {
// 		console.log(result)
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})
// 	.finally(() => {
// 		mongoose.connection.close()
// 	})