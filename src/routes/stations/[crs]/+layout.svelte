<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { HuxleyService } from './+layout.js';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	export let data;

	$: if (dev) {
		console.log(data.trains);
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

	function getScheduledTime(train: HuxleyService) {
		let time;
		if (train.stdSpecified) {
			time = train.std;
		} else {
			time = train.sta;
		}
		return new Date(time).toLocaleTimeString('en-GB', {
			hourCycle: 'h24',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getActualTime(train: HuxleyService) {
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
			hourCycle: 'h24',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	let services: (HuxleyService & { type: string })[] = [];
	$: services = (data.trains.trainServices || [])
		.map((x) => ({ ...x, type: 'train' }))
		.concat((data.trains.busServices || []).map((x) => ({ ...x, type: 'bus' })))
		.concat((data.trains.ferryServices || []).map((x) => ({ ...x, type: 'ferry' })))
		.sort((a, b) => {
			let aTime = a.staSpecified ? a.sta : a.std;
			let bTime = b.staSpecified ? b.sta : b.std;
			if (aTime < bTime) {
				return -1;
			} else if (aTime > bTime) {
				return 1;
			} else {
				return 0;
			}
		});
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
					<div class="message">
						{@html msg.xhtmlMessage}
					</div>
				{/each}
			{/if}

			{#each services as train}
				<a href="/stations/{data.trains.crs}/train/{train.rid}" class="train-link">
					<div
						class="train"
						class:departed={train.atdSpecified}
						class:selected={train.rid == $page.params.rid}
					>
						<div class="time">
							<div class="scheduled">{getScheduledTime(train)}</div>
							{#if train.isCancelled}
								<div class="actual">Cancelled</div>
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
			{/each}
		</div>
		<div class="footer">
			<a href="https://github.com/Gaelan/yadfe">Source</a>
			• Powered by
			<a href="http://huxley2.azurewebsites.net">Huxley</a>
		</div>
		<img class="nre" src="/nre.png" alt="Powered by National Rail Enquiries" />
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
	.message.info {
		background-color: lightblue;
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
	.footer {
		margin: 10px;
		text-align: center;
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
	}
</style>
