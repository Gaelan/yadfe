export type HuxleyServiceDetails = {
	trainid: string;
	uid: string;
	sdd: string;

	operator: string;
	operatorCode: string;

	delayReason: { tiploc: string; near: boolean; value: number };
	cancelReason: { tiploc: string; near: boolean; value: number };

	locations: HuxleyServiceLocation[];
};

export type HuxleyServiceLocation = {
	activities: string;
	locationName: string;
	platform: string;
	platformIsHidden: boolean;

	isPass: boolean;

	isCancelled: boolean;

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
};

export async function load({ fetch, params }) {
	const data: HuxleyServiceDetails = await (
		await fetch(`https://huxley2.azurewebsites.net/service/${params.rid}`)
	).json();
	return { details: data };
}
