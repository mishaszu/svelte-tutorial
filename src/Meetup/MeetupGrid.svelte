<script>
    import MeetupItem from "./MeetupItem.svelte";
    import MeetupFilter from "./MeetupFilter.svelte";
    import { createEventDispatcher } from "svelte";
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";
    import Button from "../UI/Button.svelte";
    const dispatch = createEventDispatcher();

    export let meetups;
    let favsOlny = false;
    function setFilter({ detail }) {
        favsOlny = detail === 1;
    }
    $: filteredMeetups = favsOlny
        ? meetups.filter((m) => m.isFavorite)
        : meetups;
</script>

<section class="meetup-controls">
    <MeetupFilter on:select={setFilter} />
    <Button on:click={() => dispatch("add")}>New Meetup</Button>
</section>
{#if filteredMeetups.length === 0}
    <p id="no-meetups">No meetups found, you can start add new</p>
{/if}
<section class="meetups">
    {#each filteredMeetups as meetup (meetup.id)}
        <div
            transition:scale
            animate:flip={{
                duration: 200,
            }}
        >
            <MeetupItem {...meetup} on:showdetail on:edit />
        </div>
    {/each}
</section>

<style>
    #no-meetups {
        margin: 1rem;
    }
    .meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    .meetup-controls {
        margin: 1rem;
        justify-content: space-between;
        display: flex;
    }

    @media (min-width: 768px) {
        .meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
