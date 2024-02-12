import { Temporal } from '@js-temporal/polyfill';
import type { HuxleyTimes } from './types';

export function getScheduledTime(train: HuxleyTimes) {
	let time;
	if (train.stdSpecified) {
		time = train.std;
	} else {
		time = train.sta;
	}
	return parseTime(time);
}

export function getScheduledArrivalTime(train: HuxleyTimes) {
	return parseTime(train.sta);
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
	return parseTime(time);
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
	return parseTime(time);
}

export function showTime(time: Temporal.ZonedDateTime) {
	return time.toLocaleString('en-GB', {
		hourCycle: 'h23',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function showArrivalTime(train: HuxleyTimes) {
	if (!train.staSpecified || !train.stdSpecified) {
		return false;
	}

	if (parseTime(train.sta).until(parseTime(train.std)).total('minute') >= 3) {
		return true;
	}

	const actualArrival = parseTime(
		train.ataSpecified ? train.ata : train.etaSpecified ? train.eta : train.sta
	);
	const actualDeparture = parseTime(
		train.atdSpecified ? train.atd : train.etdSpecified ? train.etd : train.std
	);

	if (actualArrival.until(actualDeparture).total('minute') >= 3) {
		return true;
	}
}

export function parseTime(time: string) {
	return Temporal.ZonedDateTime.from(time + '[Europe/London]');
}
