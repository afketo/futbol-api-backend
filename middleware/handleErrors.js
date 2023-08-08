const HANDLER_ERRORS = {
	CastError: res => { res.status(400).send({ error: 'id used is malformed' }) },
	ValidationError: (res, err) => { res.status(409).send({ error: err.message }) },
	JsonWebTokenError: res => { res.status(401).json({ error: 'invalid token or expired' }) },
	TokenExpiredError: res => { res.status(401).json({ error: 'token expired' }) },
	defaultError: res => { res.status(500).end() }
}

module.exports = (err, req, res, next) => {
	console.log(err)
	const handler = HANDLER_ERRORS[err.name] || HANDLER_ERRORS.defaultError
	handler(res, err)
}