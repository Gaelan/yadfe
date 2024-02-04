/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return ['stations', 'departures', 'arrivals'].includes(param);
}
