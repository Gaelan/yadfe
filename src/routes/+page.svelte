<script lang="ts">
	import { goto } from '$app/navigation';
	import type { FormEventHandler } from 'svelte/elements';
	import type { HuxleyStations } from './+page.js';

	export let data;

	let results: HuxleyStations = data.stations;

	const handleInput: FormEventHandler<HTMLInputElement> = async (e) => {
		const search = e.currentTarget.value.toLowerCase();

		if (search == '') {
			results = data.stations;
		} else {
			results = data.stations
				.filter((station) => {
					return (
						station.stationName.toLowerCase().includes(search) ||
						station.crsCode.toLowerCase().includes(search)
					);
				})
				.sort((a, b) => {
					const aCrs = a.crsCode.toLowerCase();
					const bCrs = b.crsCode.toLowerCase();
					const aName = a.stationName.toLowerCase();
					const bName = b.stationName.toLowerCase();
					if (aCrs.startsWith(search) && !bCrs.startsWith(search)) {
						return -1;
					}
					if (bCrs.startsWith(search) && !aCrs.startsWith(search)) {
						return 1;
					}
					if (aName.startsWith(search) && !bName.startsWith(search)) {
						return -1;
					}
					if (bName.startsWith(search) && !aName.startsWith(search)) {
						return 1;
					}
					if (aName < bName) {
						return -1;
					}
					if (bName > aName) {
						return 1;
					}
					return 0;
				});
		}
	};

	const goToFirst: FormEventHandler<HTMLFormElement> = (e) => {
		if (results.length > 0) {
			goto(`/stations/${results[0].crsCode}`);
		}
		e.preventDefault();
	};
</script>

<svelte:head><title>Train departures</title></svelte:head>

<div class="station-search" class:has-results={results.length > 0}>
	<form on:submit={goToFirst}>
		<!-- svelte-ignore a11y-autofocus -->
		<input autofocus on:input={handleInput} placeholder="Search" autocorrect="off" />
	</form>
	<div class="results">
		{#each results as station (station.crsCode)}
			<a href="/stations/{station.crsCode}">
				<span class="name">{station.stationName}</span>
				<span class="crs">{station.crsCode}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	.station-search {
		border: 1px solid black;
		max-width: 30em;
		margin-top: 4ex;
		margin-bottom: 10px;
		margin-left: auto;
		margin-right: auto;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		background-color: white;
	}

	input {
		font-size: 125%;
		width: 100%;
		appearance: none;
		border: none;
		border-radius: 5px;
		padding: 5px;
	}
	.has-results input {
		border-bottom: 1px solid black;
		border-radius: 5px 5px 0px 0px;
	}
	.results {
		flex: 1;
	}
	.results a {
		display: flex;
		font-size: 125%;
		color: black;
		text-decoration: none;
		padding: 5px;
	}
	.results a:not(:last-child) {
		border-bottom: 1px #aaa solid;
	}
	.name {
		flex: 1;
	}
	.crs {
		color: #888;
	}
</style>
