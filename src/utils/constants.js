const errorCodes = {
	UNEXPECTED_ERROR: 'UnexpectedError',
	UNAUTHORIZED_ERROR: 'UnauthorizedError',
	CONFLICT_ERROR: 'ConflictError',
	BAD_REQUEST: 'BadRequestError',
	NOT_FOUND: 'NotFoundError',
	INTERNAL_SERVER_ERROR: 'InternalServerError'
};

const status = {
	created: 'created',
	pendingReviewer: 'pending-reviewer',
	funding: 'funding',
	inProgress: 'in-progress',
	completed: 'completed'
};
module.exports = {
	error: errorCodes,
	status: status
};