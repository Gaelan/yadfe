import type { HuxleyDepartures, HuxleyServiceDetails } from '$lib/types.js';
import { Temporal } from '@js-temporal/polyfill';

export async function load({ fetch, params, url }) {
	let from: HuxleyServiceDetails | null = null;
	let offset = 0;
	if (url.searchParams.get('from')) {
		const fromRid = url.searchParams.get('from');
		from = await (await fetch(`https://huxley2.azurewebsites.net/service/${fromRid}`)).json();

		if (from) {
			const fromStop = from.locations.find((loc) => loc.crs == params.crs.toUpperCase());
			if (fromStop) {
				const time = Temporal.ZonedDateTime.from(fromStop.sta + '[Europe/London]');
				const now = Temporal.Now.zonedDateTimeISO('Europe/London');
				offset = Math.round(now.until(time).total('minute')) - 5;
			}
		}
	}

	let trimmedPast = false;
	let trimmedFuture = false;

	if (offset < -120) {
		offset = -120;
		trimmedPast = true;
	} else if (offset > 119) {
		offset = 119;
		trimmedFuture = true;
	}

	const data: HuxleyDepartures = await (
		await fetch(
			`https://huxley2.azurewebsites.net/staffdepartures/${params.crs}/50?timeOffset=${offset}`
		)
	).json();

	return { trains: data, from, trimmedPast, trimmedFuture };
}
