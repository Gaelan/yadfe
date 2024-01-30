import { Temporal } from '@js-temporal/polyfill';
import type { HuxleyTimes } from './types';

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

export function getBoardTitle(board: string, station: string) {
	if (['stations', 'departures'].includes(board)) return 'Departures from ' + station;
	if (board == 'arrivals') return 'Arrivals to ' + station;
}
