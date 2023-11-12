<script lang="ts">
	import type { HuxleyServiceLocation } from './+page.js';

	export let data;

	const passengerStopActivities = ['D', 'R', 'T', 'TB', 'TF', 'U'];

	// $: console.log(data.details);

	function getScheduledTime(train: HuxleyServiceLocation) {
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

	function getActualTime(train: HuxleyServiceLocation) {
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
</script>

<div class="details">
	<a class="back" href="/stations/{data.trains.crs}">← Trains from {data.trains.locationName}</a>
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
				.uid}/{data.details.sdd.split('T')[0]}/detailed">RTT</a
		>
	</div>

	<div class="stops">
		{#each data.details.locations as loc}
			{#if loc.activities.split(' ').some((a) => passengerStopActivities.includes(a))}
				<div class="stop" class:departed={loc.atdSpecified}>
					<div class="stop-main">
						<div class="name">{loc.locationName}</div>
						<div class="times">
							<span class="scheduled">{getScheduledTime(loc)}</span>
							{#if loc.isCancelled}
								<span class="actual">Cancelled</span>
							{/if}
							{#if getScheduledTime(loc) != getActualTime(loc)}
								<span class="actual">{getActualTime(loc)}</span>
							{/if}
						</div>
					</div>
					<div class="platform">{loc.platform}</div>
				</div>
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
		padding: 5px;
		display: flex;
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
</style>
