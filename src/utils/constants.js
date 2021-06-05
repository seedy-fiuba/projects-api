const errorCodes = {
	UNEXPECTED_ERROR: 'UnexpectedError',
	UNAUTHORIZED_ERROR: 'UnauthorizedError',
	CONFLICT_ERROR: 'ConflictError',
	BAD_REQUEST: 'BadRequestError',
	NOT_FOUND: 'NotFoundError',
	INTERNAL_SERVER_ERROR: 'InternalServerError'
};

const projectStatus = {
	created: 'created',
	inProgress: 'in-progress',
	done: 'done'
};

module.exports = {
	error: errorCodes,
	projectStatus: projectStatus
};