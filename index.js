require('dotenv').config()
const Sentry = require('@sentry/node')
require('./mongo')
const express = require('express')
const cors = require('cors')
const app = express()

const logger = require('./middleware/loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const getTokenExtractUser = require('./middleware/getTokenExtractUser')

const playersRouter = require('./controllers/players')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

Sentry.init({
	dsn: 'https://235106043e24d9de853e02efe07b6ee0@o4505668371611648.ingest.sentry.io/4505668373250048',
	integrations: [
	// enable HTTP calls tracing
		new Sentry.Integrations.Http({
			tracing: true
		}),
		// enable Express.js middleware tracing
		new Sentry.Integrations.Express({
			app
		}),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!,
})

// Trace incoming requests
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/static', express.static('images'))

app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>')
})

app.use('/api/players', getTokenExtractUser, playersRouter)
app.use('/api/users', getTokenExtractUser, usersRouter)
app.use('/api/login', getTokenExtractUser, loginRouter)

app.use(notFound)
// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
	console.log('Server running on port ' + PORT)
})

module.exports = { app, server }