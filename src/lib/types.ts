export type HuxleyTimes = {
	ata: string;
	ataSpecified: boolean;
	eta: string;
	etaSpecified: boolean;
	sta: string;
	staSpecified: boolean;

	atd: string;
	atdSpecified: boolean;
	etd: string;
	etdSpecified: boolean;
	std: string;
	stdSpecified: boolean;
};

export type HuxleyServiceDetails = {
	rid: string;
	trainid: string;
	uid: string;
	sdd: string;

	operator: string;
	operatorCode: string;

	delayReason: { tiploc: string; near: boolean; value: number };
	cancelReason: { tiploc: string; near: boolean; value: number };

	locations: HuxleyServiceLocation[];
};

export type HuxleyAssociation = {
	//0=join 1=split 2="link"(???) 3=next/prev
	category: number;
	origin: string;
	destination: string;
	rid: string;
};

export type HuxleyServiceLocation = HuxleyTimes & {
	locationName: string;
	crs: string;

	activities: string;
	platform: string;
	platformIsHidden: boolean;

	isPass: boolean;
	isOperational: boolean;

	isCancelled: boolean;

	departureType: number;
	departureTypeSpecified: boolean;
	arrivalType: number;
	arrivalTypeSpecified: boolean;

	associations: HuxleyAssociation[] | null;
};

export type HuxleyStationService = HuxleyTimes & {
	destination: {
		locationName: string;
		via: string | null;
	}[];

	platform: string;
	operator: string;
	activities: string;

	length: number;

	isCancelled: boolean;
	platformIsHidden: boolean;

	departureType: number;
	departureTypeSpecified: number;

	trainid: string;
	rid: string;
	uid: string;
};
export type HuxleyDepartures = {
	trainServices: HuxleyStationService[] | null;
	busServices: HuxleyStationService[] | null;
	ferryServices: HuxleyStationService[] | null;
	locationName: string;
	nrccMessages: { category: number; severity: number; xhtmlMessage: string }[];
	crs: string;
	stationManagerCode: string;
};
