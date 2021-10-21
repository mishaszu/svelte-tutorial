<script>
    import Header from "./UI/Header.svelte";
    import Button from "./UI/Button.svelte";
    import MeetupGrid from "./Meetup/MeetupGrid.svelte";
    import EditMeetup from "./Meetup/EditMeetup.svelte";
    import meetups from "./Meetup/meetup-store";
    import MeetupDetail from "./Meetup/MeetupDetail.svelte";
    import Loader from "./UI/Loader.svelte";
    import Error from "./UI/Error.svelte";
    import { onMount } from "svelte";

    let editMode = null;
    let editedId = null;
    let page = "overview";
    let pageData = {};
    let isLoading = false;
    let error = null;

    onMount(() => {
        isLoading = true;
        fetch(
            "https://svelte-mishaszu-course-default-rtdb.europe-west1.firebasedatabase.app/meetup.json"
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Can't get meetups");
                }
                return res.json();
            })
            .then((data) => {
                const meets = Object.keys(data).map((key) => ({
                    ...data[key],
                    id: key,
                }));
                setTimeout(() => {
                    isLoading = false;
                    meetups.setMeetups(meets.reverse());
                }, 1000);
            })
            .catch((err) => {
                isLoading = false;
                error = err;
                console.error(err);
            });
    });

    function saveMeetup() {
        editMode = null;
        editedId = null;
    }
    function closeModal() {
        editMode = null;
        editedId = null;
    }
    function showDetails({ detail }) {
        page = "details";
        pageData.id = detail;
    }
    function showOverview() {
        page = "overview";
        pageData = {};
    }
    function enterEdit({ detail }) {
        editMode = "edit";
        editedId = detail;
    }
</script>

{#if error}
    <Error
        message={error}
        on:close={() => (error = null)}
        on:cancel={() => (error = null)}
    />
{/if}

<Header />
<main>
    {#if page === "overview"}
        {#if editMode === "edit"}
            <EditMeetup
                id={editedId}
                on:save={saveMeetup}
                on:cancel={closeModal}
                on:close={closeModal}
            />
        {/if}
        {#if isLoading}
            <Loader />
        {:else}
            <MeetupGrid
                meetups={$meetups}
                on:showdetail={showDetails}
                on:edit={enterEdit}
                on:add={() => {
                    editMode = "edit";
                }}
            />
        {/if}
    {:else}
        <MeetupDetail id={pageData.id} on:close={showOverview} />
    {/if}
</main>

<style>
    main {
        margin-top: 4rem;
    }
</style>
