export type HuxleyService = {
	destination: {
		locationName: string;
		via: string | null;
	}[];
	ata: string;
	ataSpecified: string;
	eta: string;
	etaSpecified: string;
	sta: string;
	staSpecified: string;

	atd: string;
	atdSpecified: string;
	etd: string;
	etdSpecified: string;
	std: string;
	stdSpecified: string;

	platform: string;
	operator: string;
	trainid: string;
	isCancelled: boolean;
	platformIsHidden: boolean;

	rid: string;
	uid: string;
};
export type HuxleyDepartures = {
	trainServices: HuxleyService[];
	locationName: string;
	nrccMessages: { category: number; severity: number; xhtmlMessage: string }[];
	crs: string;
};

export async function load({ fetch, params }) {
	const data: HuxleyDepartures = await (
		await fetch(`https://huxley2.azurewebsites.net/staffdepartures/${params.crs}/50`)
	).json();
	return { trains: data };
}
