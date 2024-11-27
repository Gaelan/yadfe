export async function handle({ event, resolve }) {
	const response = await resolve(event);
	console.log(
		`${response.status} ${event.request.method} ${
			event.request.url
		} ${event.getClientAddress()} ${event.request.headers.get('user-agent')} `
	);
	return response;
}
