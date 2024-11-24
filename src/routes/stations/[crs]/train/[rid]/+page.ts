import type { HuxleyServiceDetails } from '$lib/types';

export async function load({ fetch, params }) {
	const data: HuxleyServiceDetails = await (
		await fetch(`https://huxley2.fly.dev/service/${params.rid}`)
	).json();
	return { details: data };
}
