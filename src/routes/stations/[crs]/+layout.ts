import type { HuxleyDepartures, HuxleyServiceDetails, HuxleyStations } from '$lib/types.js';
import { Temporal } from '@js-temporal/polyfill';

export async function load({ fetch, params, url }) {
	let from: HuxleyServiceDetails | null = null;
	let offset = 0;
	const paramOffset = url.searchParams.get('timeOffset');
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

	if (paramOffset !== null) {
		offset = parseInt(paramOffset);
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

	let trains: HuxleyDepartures = await (
		await fetch(
			`https://huxley2.azurewebsites.net/staffdepartures/${params.crs}/50?timeOffset=${offset}&expand=true`
		)
	).json();

	const stations: HuxleyStations = await (
		await fetch('https://huxley2.azurewebsites.net/crs')
	).json();

	let callsPreviously;
	if (url.searchParams.get('callsPreviously')) {
		const search = url.searchParams.get('callsPreviously').toLowerCase();
		callsPreviously = stations.filter((station) => {
			return station.crsCode.toLowerCase() === search;
		});

		if (trains.trainServices)
			trains.trainServices = trains.trainServices.filter((trainService) => {
				return (
					trainService.previousLocations &&
					trainService.previousLocations.find((loc) => loc.crs && loc.crs.toLowerCase() == search)
				);
			});
	}

	let callsSubsequently;
	if (url.searchParams.get('callsSubsequently')) {
		const search = url.searchParams.get('callsSubsequently').toLowerCase();
		callsSubsequently = stations.filter((station) => {
			return station.crsCode.toLowerCase() === search;
		});

		if (trains.trainServices)
			trains.trainServices = trains.trainServices.filter((trainService) => {
				return (
					trainService.subsequentLocations &&
					trainService.subsequentLocations.find((loc) => loc.crs && loc.crs.toLowerCase() == search)
				);
			});
	}

	return {
		trains,
		from,
		offset,
		trimmedPast,
		trimmedFuture,
		stations,
		callsPreviously,
		callsSubsequently
	};
}
