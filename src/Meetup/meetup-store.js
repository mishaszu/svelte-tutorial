import { writable } from 'svelte/store';
let globalId = 2;

const meetups = writable([]);

const customMeetupStore = {
    subscribe: meetups.subscribe,
    addMeetup: meetup => meetups.update(mts => [
        meetup,
        ...mts
    ]),
    toogleFavorite: id => meetups.update(mts =>
        mts.map((m) => {
            if (m.id === id) return { ...m, isFavorite: !m.isFavorite };
            return m;
        })
    ),
    updateMeetup: (id, meetupData) => meetups.update(mts => mts.map((m) => {
        if (m.id === id) return { ...m, ...meetupData };
        return m;
    })),
    deleteMeetup: id => meetups.update(mts => mts.filter((m) => m.id !== id)),
    setMeetups: mts => meetups.set(mts)
};

export default customMeetupStore;