<script>
    import meetups from "./meetup-store";
    import TextInput from "../UI/TextInput.svelte";
    import Button from "../UI/Button.svelte";
    import Modal from "../UI/Modal.svelte";
    import { createEventDispatcher } from "svelte";
    import { isEmpty, isValidEmail } from "../helpers/validation";

    export let id = null;

    const dispatch = createEventDispatcher();
    let title = "";
    let subtitle = "";
    let description = "";
    let contactEmail = "";
    let address = "";
    let imageUrl = "";

    if (id) {
        const unsubscribe = meetups.subscribe((items) => {
            const meet = items.find((i) => i.id === id);
            if (meet) {
                title = meet.title;
                subtitle = meet.subtitle;
                description = meet.description;
                contactEmail = meet.contactEmail;
                address = meet.address;
                imageUrl = meet.imageUrl;
            }
        });
        unsubscribe();
    }

    $: titleValid = !isEmpty(title);
    $: subtitleValid = !isEmpty(subtitle);
    $: descriptionValid = !isEmpty(description);
    $: contactEmailValid = !isEmpty(contactEmail) && isValidEmail(contactEmail);
    $: addressValid = !isEmpty(address);
    $: imageUrlValid = !isEmpty(imageUrl);

    $: allValid =
        titleValid &&
        subtitleValid &&
        descriptionValid &&
        contactEmailValid &&
        addressValid &&
        imageUrlValid;

    function submitForm() {
        dispatch("save");
        const meetupData = {
            title,
            subtitle,
            description,
            contactEmail,
            address,
            imageUrl,
            isFavorite: false,
        };
        if (id) {
            fetch(
                `https://svelte-mishaszu-course-default-rtdb.europe-west1.firebasedatabase.app/meetup/${id}.json`,
                {
                    method: "PATCH",
                    body: JSON.stringify(meetupData),
                    headers: { "Content-Type": "application/json" },
                }
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(
                            "An error occurred while trying to get the meetup data."
                        );
                    }
                    meetups.updateMeetup(id, meetupData);
                })
                .catch(console.error);
        } else {
            fetch(
                "https://svelte-mishaszu-course-default-rtdb.europe-west1.firebasedatabase.app/meetup.json",
                {
                    method: "POST",
                    body: JSON.stringify({ ...meetupData, isFavorite: false }),
                    headers: { "Content-Type": "application/json" },
                }
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(
                            "An error occurred while trying to get the meetup data."
                        );
                    }
                    return res.json();
                })
                .then(({ name }) => {
                    meetups.addMeetup({
                        ...meetupData,
                        isFavorite: false,
                        id: name,
                    });
                })
                .catch(console.error);
            cleanInputs();
        }
    }
    function cleanInputs() {
        title = "";
        subtitle = "";
        description = "";
        imageUrl = "";
        address = "";
        contactEmail = "";
    }
    function cancel() {
        dispatch("cancel");
    }
    function deleteMeetup() {
        fetch(
            `https://svelte-mishaszu-course-default-rtdb.europe-west1.firebasedatabase.app/meetup/${id}.json`,
            {
                method: 'DELETE',
            }
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        "An error occurred while trying to get the meetup data."
                    );
                }
                meetups.deleteMeetup(id);
            })
            .catch(console.error);
        dispatch("save");
    }
    const ev = (callback) => (event) => callback(event.target.value);
</script>

<Modal title="Edit Meetup data" on:cancel on:close>
    <form id="meetupform" on:submit|preventDefault={submitForm}>
        <TextInput
            id="title"
            label="Title"
            value={title}
            valid={titleValid}
            validityMessage={"Please enter a valid title"}
            on:input={ev((e) => (title = e))}
        />
        <TextInput
            id="subtitle"
            label="Subtitle"
            value={subtitle}
            valid={subtitleValid}
            validityMessage={"Please enter a valid subtitle"}
            on:input={ev((e) => (subtitle = e))}
        />
        <TextInput
            id="address"
            label="Address"
            value={address}
            valid={addressValid}
            validityMessage={"Please enter a valid adderess"}
            on:input={ev((e) => (address = e))}
        />
        <TextInput
            id="imageUrl"
            label="ImageUrl"
            value={imageUrl}
            valid={imageUrlValid}
            validityMessage={"Please enter a valid image url"}
            on:input={ev((e) => (imageUrl = e))}
        />
        <TextInput
            id="contactEmail"
            label="Contact Email"
            type="email"
            value={contactEmail}
            valid={contactEmailValid}
            validityMessage={"Please enter a valid email"}
            on:input={ev((e) => (contactEmail = e))}
        />
        <TextInput
            id="description"
            label="Description"
            rows={3}
            controlType="textarea"
            bind:value={description}
            valid={descriptionValid}
            validityMessage={"Please enter a valid description"}
        />
    </form>
    <div slot="footer">
        <Button color="outline" on:click={cancel}>Cancel</Button>
        <Button on:click={submitForm} disabled={!allValid}>Save</Button>
        {#if !!id}
            <Button on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>

<style>
    form {
        width: 100%;
    }
</style>
