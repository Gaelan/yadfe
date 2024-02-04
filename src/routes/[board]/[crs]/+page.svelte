<script lang="ts">
	import { page } from '$app/stores';
	import { getBoardTitle } from '$lib/utils.js';

	export let data;
</script>

<svelte:head
	><title>{getBoardTitle($page.params.board, data.trains.locationName)}</title></svelte:head
>
