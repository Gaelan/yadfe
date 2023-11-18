<script lang="ts">
	import type { HuxleyAssociation, HuxleyServiceLocation } from '$lib/types';
	import reasons from '$lib/reasons.json';
	import { dev } from '$app/environment';
	import { getActualTime, getScheduledTime } from '$lib/utils.js';

	export let data;

	// const passengerStopActivities = ['D', 'R', 'T', 'TB', 'TF', 'U'];

	$: if (dev) {
		console.log(data.details);
	}

	const delayReasons: Record<string, string> = reasons.delay;
	const cancelReasons: Record<string, string> = reasons.cancel;

	let lastDeparted: number;
	$: lastDeparted = data.details.locations.findLastIndex((x) => x.atdSpecified);

	$: depLoc = data.details.locations[0].locationName;
	$: arrMerge = (
		data.details.locations[data.details.locations.length - 1].associations || []
	).filter((a) => a.category == 0);
	$: arrLoc =
		arrMerge.length > 0
			? arrMerge.map((x) => x.destination).join(' and ')
			: data.details.locations[data.details.locations.length - 1].locationName;
	$: description = `${getScheduledTime(data.details.locations[0])} ${depLoc} to ${arrLoc}`;
</script>

<svelte:head>
	<title>{description}</title>
</svelte:head>

<div class="details">
	<a class="back" href="/stations/{data.trains.crs}">
		← Departures from {data.trains.locationName}
	</a>
	<h1>{description}</h1>

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

	{#if data.details.operatorCode == 'TW'}
		<div class="info">
			This website uses National Rail data, which only shows Tyne & Wear Metro stations where the
			Metro shares National Rail track.
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
			{#if !loc.isPass && !loc.isOperational}
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
							<span class="stop-detail">
								{#if loc.associations}
									{#each loc.associations.filter((x) => x.category == 1) as split}
										• splits <a href="/stations/{data.trains.crs}/train/{split.rid}">
											towards {split.destination}
										</a>
									{/each}
								{/if}
								{#if loc.activities.split(' ').includes('U')}
									• does not set down
								{/if}
								{#if loc.activities.split(' ').includes('D')}
									• does not pick up
								{/if}
								{#if loc.activities.split(' ').includes('R')}
									• by request
								{/if}
							</span>
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
	{#each arrMerge as merge}
		<div class="arr-merge">
			Merges with <a href="/stations/{data.trains.crs}/train/{merge.rid}">
				the {merge.origin} to {merge.destination}</a
			>.
		</div>
	{/each}
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
		border: 1px solid var(--border);
		border-radius: 5px;
		width: 100%;
		margin-bottom: 5px;
		margin-top: 5px;
	}
	.stop {
		display: block;
		padding: 5px;
		display: flex;
		color: var(--text);
	}
	.stop:not(:last-child) {
		border-bottom: 1px solid var(--border-light);
	}
	.stop-main {
		flex: 1;
	}
	.platform {
		align-self: center;
	}
	.actual {
		color: var(--text-red);
	}
	.subtitle {
		color: var(--text-light);
	}
	.departed {
		color: var(--text-light);
	}

	.back {
		display: block;
		text-decoration: none;
		color: var(--text-link);
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
		border: 1px solid var(--border);
	}
	.delay {
		background-color: var(--background-yellow);
	}
	.cancellation {
		background-color: var(--background-red);
		padding: 5px;
		border-radius: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		border: 1px solid var(--border);
	}

	.info {
		background-color: var(--background-info);
		padding: 5px;
		border-radius: 5px;
		margin-top: 5px;
		margin-bottom: 5px;
		border: 1px solid var(--border);
	}

	@media (min-width: 40em) {
		.back {
			display: none;
		}
	}

	.stop-detail {
		color: var(--text-light);
	}
</style>
