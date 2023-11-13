<script lang="ts">
	import type { HuxleyServiceLocation } from '$lib/types';
	import reasons from '$lib/reasons.json';
	import { dev } from '$app/environment';
	import { getActualTime, getScheduledTime } from '$lib/utils.js';

	export let data;

	const passengerStopActivities = ['D', 'R', 'T', 'TB', 'TF', 'U'];

	$: if (dev) {
		console.log(data.details);
	}

	const delayReasons: Record<string, string> = reasons.delay;
	const cancelReasons: Record<string, string> = reasons.cancel;

	let lastDeparted: number;
	$: lastDeparted = data.details.locations.findLastIndex((x) => x.atdSpecified);
</script>

<svelte:head>
	<title>
		{getScheduledTime(data.details.locations[0])}
		{data.details.locations[0].locationName} to {data.details.locations[
			data.details.locations.length - 1
		].locationName}
	</title>
</svelte:head>

<div class="details">
	<a class="back" href="/stations/{data.trains.crs}">
		← Departures from {data.trains.locationName}
	</a>
	<h1>
		{getScheduledTime(data.details.locations[0])}
		{data.details.locations[0].locationName} to {data.details.locations[
			data.details.locations.length - 1
		].locationName}
	</h1>

	<div class="subtitle">
		{data.details.trainid} • {data.details.operator} •
		<a
			href="https://www.realtimetrains.co.uk/service/gb-nr:{data.details
				.uid}/{data.details.sdd.split('T')[0]}/detailed"
		>
			RTT
		</a>
	</div>

	{#if data.details.operatorCode == 'LT'}
		<div class="info">
			This website uses National Rail data, which only includes Underground stations where the
			Underground shares National Rail track. For full information on Tube services, see
			<a href="https://intertube.eta.st">intertube</a>.
		</div>
	{/if}

	{#if data.details.cancelReason}
		<div class="cancellation">
			{cancelReasons[data.details.cancelReason.value]}.
		</div>
	{/if}

	{#if data.details.delayReason}
		<div class="delay">
			{delayReasons[data.details.delayReason.value]}.
		</div>
	{/if}

	<div class="stops">
		{#each data.details.locations as loc, idx}
			{#if loc.activities.split(' ').some((a) => passengerStopActivities.includes(a))}
				<a
					href={loc.staSpecified ? `/stations/${loc.crs}?from=${data.details.rid}` : null}
					class="stop"
					class:departed={idx <= lastDeparted}
				>
					<div class="stop-main">
						<div class="name">{loc.locationName}</div>
						<div class="times">
							<span class="scheduled">{getScheduledTime(loc)}</span>
							{#if loc.isCancelled}
								<span class="actual">Cancelled</span>
							{/if}
							{#if loc.departureTypeSpecified && loc.departureType == 3}
								<span class="actual">Delayed</span>
							{/if}
							{#if getScheduledTime(loc) != getActualTime(loc)}
								<span class="actual">{getActualTime(loc)}</span>
							{/if}
							{#if loc.associations}
								{#each loc.associations.filter((x) => x.category == 1) as split}
									• splits <a href="/stations/{data.trains.crs}/train/{split.rid}">
										towards {split.destination}
									</a>
								{/each}
							{/if}
						</div>
					</div>
					<div class="platform">
						{#if loc.platform && !loc.platformIsHidden}
							{loc.platform}
						{/if}
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>

<style>
	h1 {
		margin: 0;
	}
	.details {
		padding-left: 10px;
		flex: 1;
		padding-right: 10px;
	}
	.stops {
		border: 1px solid black;
		border-radius: 5px;
		width: 100%;
		margin-bottom: 5px;
	}
	.stop {
		display: block;
		padding: 5px;
		display: flex;
		color: black;
	}
	.stop:not(:last-child) {
		border-bottom: 1px solid #aaa;
	}
	.stop-main {
		flex: 1;
	}
	.platform {
		align-self: center;
	}
	.actual {
		color: red;
	}
	.subtitle {
		color: #555;
	}
	.departed {
		color: #555;
	}

	.back {
		display: block;
		text-decoration: none;
		color: blue;
		margin-top: 0.5ex;
	}
	.platform {
		min-width: 2em;
		text-align: center;
		align-self: center;
	}

	.delay,
	.cancellation,
	.info {
		padding: 5px;
		border-radius: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		border: 1px solid black;
	}
	.delay {
		background-color: yellow;
	}
	.cancellation {
		background-color: red;
		padding: 5px;
		border-radius: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		border: 1px solid black;
	}

	.info {
		background-color: lightblue;
		padding: 5px;
		border-radius: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		border: 1px solid black;
	}

	@media (min-width: 40em) {
		.back {
			display: none;
		}
	}
</style>
