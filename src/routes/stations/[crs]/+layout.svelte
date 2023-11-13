<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import type { HuxleyServiceLocation, HuxleyStationService, HuxleyTimes } from '$lib/types.js';
	import {
		getActualArrivalTime,
		getActualTime,
		getScheduledArrivalTime,
		getScheduledTime,
		parseTime
	} from '$lib/utils.js';

	export let data;

	$: if (dev) {
		console.log(data.trains);
		console.log('from', data.from);
	}

	let interval: number | null = null;

	onMount(() => {
		interval = setInterval(() => {
			invalidateAll();
		}, 60 * 1000);
	});
	onDestroy(() => {
		if (interval !== null) {
			clearInterval(interval);
		}
	});

	function trainUrl(train: HuxleyStationService) {
		if (data.from) {
			return `/stations/${data.trains.crs}/train/${train.rid}?from=${data.from.rid}`;
		} else {
			return `/stations/${data.trains.crs}/train/${train.rid}`;
		}
	}

	function showAsDeparted(train: HuxleyStationService) {
		if (fromStop) {
			const arrival = fromStop.ataSpecified
				? fromStop.ata
				: fromStop?.etaSpecified
				? fromStop.eta
				: fromStop.sta;
			const departure = train.atdSpecified ? train.atd : train.etdSpecified ? train.etd : train.std;

			return departure < arrival;
		} else {
			return train.ataSpecified;
		}
	}

	function hideTrain(train: HuxleyStationService) {
		if (!fromStop) return false;

		const arrival = parseTime(fromStop.sta);
		const departure = parseTime(train.std);

		if (arrival.until(departure).total('minute') < -5) {
			return true;
		}
		return false;
	}

	let services: (HuxleyStationService & { type: string })[] = [];
	$: services = (data.trains.trainServices || [])
		.map((x) => ({ ...x, type: 'train' }))
		.concat((data.trains.busServices || []).map((x) => ({ ...x, type: 'bus' })))
		.concat((data.trains.ferryServices || []).map((x) => ({ ...x, type: 'ferry' })))
		.sort((a, b) => {
			let aTime = a.stdSpecified ? a.std : a.sta;
			let bTime = b.stdSpecified ? b.std : b.sta;
			if (aTime < bTime) {
				return -1;
			} else if (aTime > bTime) {
				return 1;
			} else {
				return 0;
			}
		});

	let fromStop: HuxleyServiceLocation | undefined;
	$: if (data.from) {
		fromStop = data.from.locations.find((loc) => loc.crs == data.trains.crs);
	} else {
		fromStop = undefined;
	}
</script>

<div class="root">
	<div class="board" class:board-only={$page.route.id == '/stations/[crs]'}>
		<div class="board-main">
			<a class="back" href="/">← Change station</a>
			<h1>{data.trains.locationName}</h1>

			{#if data.trains.stationManagerCode == 'SJ'}
				<div class="message info">
					This website uses National Rail data, which includes only the Tram Train. Trams on other
					lines are not shown.
				</div>
			{/if}
			{#if data.trains.stationManagerCode == 'ES' && data.trains.crs != 'LIU'}
				<div class="message info">
					This website uses UK National Rail data, which includes only Eurostar services to and from
					London. Domestic services, and non-UK international services, are not shown.

					{#if data.trains.crs == 'PBN'}
						For other trains, see <a
							href="https://www.sncf.com/en/stations/paris-nord/OCE87271007/departures-arrivals/gl/departures"
						>
							SNCF</a
						>.
					{/if}
					{#if data.trains.crs == 'BXS'}
						For other trains, see <a
							href="https://www.belgiantrain.be/en/travel-info/current/search-by-station"
						>
							SNCB</a
						>.
					{/if}
					{#if data.trains.crs == 'AMS'}
						For other trains, see <a
							href="https://en.treinposities.nl/vertrektijden/amsterdam-centraal"
						>
							treinposities</a
						>.
					{/if}
				</div>
			{/if}
			{#if data.trains.crs == 'LIU'}
				<div class="message info">
					This website uses UK National Rail data, which does not include any data on stops in
					Lille.
				</div>
			{/if}

			{#if data.trains.nrccMessages}
				{#each data.trains.nrccMessages as msg}
					<div class="message" data-severity={msg.severity}>
						{@html msg.xhtmlMessage}
					</div>
				{/each}
			{/if}

			{#if fromStop}
				<div class="train">
					<div class="time">
						<div class="scheduled">{getScheduledArrivalTime(fromStop)}</div>
						{#if fromStop.isCancelled}
							<div class="actual">Cancelled</div>
						{/if}
						{#if getActualArrivalTime(fromStop) != getScheduledArrivalTime(fromStop)}
							<div class="actual">{getActualArrivalTime(fromStop)}</div>
						{/if}
					</div>
					<div class="main">
						<div class="dest">
							from {data.from?.locations[0].locationName}
						</div>
						<div class="details">{data.from?.trainid} • {data.from?.operator}</div>
					</div>
					<div class="platform">
						{fromStop.platform}
					</div>
				</div>
				<div class="fromArrow">↓</div>
			{/if}

			{#if data.trimmedPast}
				<div class="message info">This site cannot display trains that left over 2 hours ago.</div>
			{/if}

			{#each services as train}
				{#if !hideTrain(train)}
					<a href={trainUrl(train)} class="train-link">
						<div
							class="train"
							class:departed={showAsDeparted(train)}
							class:selected={train.rid == $page.params.rid}
						>
							<div class="time">
								<div class="scheduled">{getScheduledTime(train)}</div>
								{#if train.isCancelled}
									<div class="actual">Cancelled</div>
								{/if}
								{#if train.departureTypeSpecified && train.departureType == 3}
									<div class="actual">Delayed</div>
								{/if}
								{#if getActualTime(train) != getScheduledTime(train)}
									<div class="actual">{getActualTime(train)}</div>
								{/if}
							</div>
							<div class="main">
								{#each train.destination as d}
									<div class="dest">
										{d.locationName}
										<span class="via">{d.via || ''}</span>
									</div>
								{/each}
								<div class="details">{train.trainid} • {train.operator}</div>
							</div>
							<div class="platform">
								{#if train.type == 'bus'}
									🚌
								{:else if train.type == 'ferry'}
									⛴️
								{:else if train.platform && !train.platformIsHidden}
									{train.platform}
								{/if}
							</div>
						</div></a
					>
				{/if}
			{/each}

			{#if data.trimmedFuture}
				<div class="message info">
					This site cannot display trains that leave more than 4 hours from now.
				</div>
			{/if}
		</div>
		<div class="footer">
			<a href="https://github.com/Gaelan/yadfe">Source</a>
			• Powered by
			<a href="http://huxley2.azurewebsites.net">Huxley</a>
		</div>
		<a class="nre" href="https://nationalrail.co.uk">
			<img src="/nre.png" alt="Powered by National Rail Enquiries" />
		</a>
	</div>
	<slot />
</div>

<style>
	h1 {
		margin: 0;
	}
	a.train-link {
		color: inherit;
		text-decoration: inherit;
	}
	.root {
		display: flex;
		width: 100%;
	}
	.root > :global(*) {
		height: 100vh;
		overflow: scroll;
	}
	.board {
		padding-left: 10px;
		padding-right: 10px;
		background: #ddd;
		box-shadow: 0 0 10px 5px #ccc;
		max-width: calc(min(30em, 50vw));
		display: flex;
		flex-direction: column;
	}
	.board-main {
		flex: 1;
	}
	.message {
		background-color: yellow;
		padding: 5px;
		border-radius: 5px;
		margin-bottom: 5px;
		border: 1px solid black;
	}
	.message.info,
	.message[data-severity='0'] {
		background-color: lightblue;
	}
	.message[data-severity='2'],
	.message[data-severity='3'] {
		background-color: red;
	}
	.message :global(p) {
		margin: 0;
	}
	.message :global(p:not(:last-child)) {
		margin-bottom: 5px;
	}
	.train {
		border: 1px solid black;
		border-radius: 5px;
		margin-bottom: 5px;
		padding: 5px;
		display: flex;
		min-height: 6ex;
		background: white;
	}
	.time {
		text-align: center;
		align-self: center;
	}
	.departed {
		color: #555;
	}
	.scheduled {
		font-size: 175%;
		font-variant-numeric: tabular-nums;
	}
	.selected {
		background-color: #eee;
	}
	.actual {
		color: red;
	}
	.dest {
		font-weight: bold;
	}
	.details {
		font-size: 90%;
		color: #555;
	}
	.main {
		flex: 1;
		margin-left: 0.5em;
		align-self: center;
	}
	.platform {
		min-width: 2em;
		text-align: center;
		align-self: center;
	}
	.via {
		color: #666;
	}
	.back {
		display: block;
		text-decoration: none;
		color: blue;
		margin-top: 0.5ex;
	}
	.nre {
		display: block;
		max-width: 15em;
		margin: 10px auto;
		background-color: white;
		padding: 5px;
		border-radius: 5px;
	}
	.nre img {
		width: 100%;
	}
	.footer {
		margin: 10px;
		text-align: center;
	}

	.fromArrow {
		text-align: center;
		margin: 10px;
	}

	@media (max-width: 40em) {
		.board {
			max-width: none;
			box-shadow: none;
			background-color: inherit;
		}
		.board:not(.board-only) {
			display: none;
		}
		.root > :global(*) {
			overflow: visible;
		}
		.root {
			display: unset;
		}
	}
</style>
