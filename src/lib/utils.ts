import { Temporal } from '@js-temporal/polyfill';
import type { HuxleyStations, HuxleyTimes } from './types';

export function getScheduledTime(train: HuxleyTimes) {
	let time;
	if (train.stdSpecified) {
		time = train.std;
	} else {
		time = train.sta;
	}
	return new Date(time).toLocaleTimeString('en-GB', {
		hourCycle: 'h23',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function getScheduledArrivalTime(train: HuxleyTimes) {
	const time = train.sta;
	return new Date(time).toLocaleTimeString('en-GB', {
		hourCycle: 'h23',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function getActualTime(train: HuxleyTimes) {
	let time;
	if (train.atdSpecified) {
		time = train.atd;
	} else if (train.etdSpecified) {
		time = train.etd;
	} else if (train.stdSpecified) {
		time = train.std;
	} else if (train.ataSpecified) {
		time = train.ata;
	} else if (train.etaSpecified) {
		time = train.eta;
	} else {
		time = train.sta;
	}
	return new Date(time).toLocaleTimeString('en-GB', {
		hourCycle: 'h23',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function getActualArrivalTime(train: HuxleyTimes) {
	let time;
	if (train.ataSpecified) {
		time = train.ata;
	} else if (train.etaSpecified) {
		time = train.eta;
	} else {
		time = train.sta;
	}
	return new Date(time).toLocaleTimeString('en-GB', {
		hourCycle: 'h23',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function parseTime(time: string) {
	return Temporal.ZonedDateTime.from(time + '[Europe/London]');
}

export function filterStations(stations: HuxleyStations, search: string) {
	return stations
		.filter((station) => {
			return (
				station.stationName.toLowerCase().includes(search) ||
				station.crsCode.toLowerCase().includes(search)
			);
		})
		.sort((a, b) => {
			const aCrs = a.crsCode.toLowerCase();
			const bCrs = b.crsCode.toLowerCase();
			const aName = a.stationName.toLowerCase();
			const bName = b.stationName.toLowerCase();
			if (aCrs.startsWith(search) && !bCrs.startsWith(search)) {
				return -1;
			}
			if (bCrs.startsWith(search) && !aCrs.startsWith(search)) {
				return 1;
			}
			if (aName.startsWith(search) && !bName.startsWith(search)) {
				return -1;
			}
			if (bName.startsWith(search) && !aName.startsWith(search)) {
				return 1;
			}
			if (aName < bName) {
				return -1;
			}
			if (bName > aName) {
				return 1;
			}
			return 0;
		});
}

export function toggleVisibility(id: string) {
	const e = document.getElementById(id);
	if (e) e.style.display = e.style.display == 'none' ? 'block' : 'none';
}
