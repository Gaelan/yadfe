export type HuxleyStations = { crsCode: string; stationName: string }[];

export async function load({ fetch }) {
	const data: HuxleyStations = await (await fetch(`https://huxley2.azurewebsites.net/crs`)).json();
	return { stations: data };
}
