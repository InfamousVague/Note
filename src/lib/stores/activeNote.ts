import { writable } from "svelte/store";
import type { Note } from "$lib/types";

export const activeNote = writable<Note | null>(null);
