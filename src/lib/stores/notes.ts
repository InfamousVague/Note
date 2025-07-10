import { writable } from "svelte/store";
import type { Note } from "$lib/types";
import { mockNote } from "$lib/mock";

const STORAGE_KEY = "notes";

function createNotesStore() {
	// Load from localStorage or use default
	const stored = typeof localStorage !== "undefined"
		? localStorage.getItem(STORAGE_KEY)
		: null;

	const initialNotes: Note[] = stored ? JSON.parse(stored) : [mockNote];

	const { subscribe, set, update } = writable<Note[]>(initialNotes);

	// Persist to localStorage on change
	subscribe(notes => {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
		}
	});

	return {
		subscribe,
		set,
		reset: () => set([]),
		add: (note: Note) => update(notes => [note, ...notes]),
		updateNote: (updatedNote: Note) =>
			update(notes =>
				notes.map(note => (note.id === updatedNote.id ? updatedNote : note))
			),
		remove: (id: string) => update(notes => notes.filter(note => note.id !== id))
	};
}

export const notes = createNotesStore();
