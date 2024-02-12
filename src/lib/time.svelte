<script lang="ts">
	import type { Temporal } from "@js-temporal/polyfill";
	import { showTime } from "./utils";

    export let scheduled: Temporal.ZonedDateTime;
    export let actual: Temporal.ZonedDateTime;
    export let delayed: boolean;

    $: diff = scheduled.until(actual).total("minute");
</script>

<span class="scheduled">{showTime(scheduled)}</span>
{#if delayed}
    <span class="bad">delayed</span>
{:else if diff >= 5}
    <span class="bad">{showTime(actual)}</span>
{:else if diff >= 1 && diff < 5}
    <span class="semibad">{showTime(actual)}</span>
{:else if diff <= -2}
    <span class="good">{showTime(actual)}</span>
{/if}

<style>
    .bad {
		color: var(--text-red);
	}
    
    .semibad {
        color: var(--text-yellow);
    }

    .good {
        color: var(--text-green);
    }
</style>