<script lang="ts">
	import Editor from "$lib/components/editor/Editor.svelte";
	import NotePreview from "$lib/components/sidebar/note_preview/NotePreview.svelte";
	import { activeNote } from "$lib/stores/activeNote";
	import { notes } from "$lib/stores/notes";
	import { dndzone } from "svelte-dnd-action";
	import type { Note } from "$lib/types";

	import {
		Button,
		Shape,
		Sidebar,
		SVGShape,
		ThemeSwitcher,
		Toolbar,
		Text,
		Size,
		Appearance
	} from "june-uikit";

	import { onMount } from "svelte";

	let localNotes: Note[] = [...$notes];

	// Keep in sync if store updates externally
	$: if ($notes.length !== localNotes.length) {
		localNotes = [...$notes];
	}

	function handleDndConsider(event: CustomEvent) {
		localNotes = event.detail.items;
	}

	function handleDndFinalize(event: CustomEvent) {
		localNotes = event.detail.items;
	}

	function handleAddNote() {
		const timestamp = Date.now();
		const newNote: Note = {
			id: timestamp.toString(), // TODO: Use UUID lib
			content: "# New Note\n\nThis is a new note.",
			createdAt: timestamp,
			updatedAt: timestamp
		};

		notes.add(newNote);
		activeNote.set(newNote);
	}

	onMount(() => {
		if (!$activeNote && $notes.length > 0) {
			activeNote.set($notes[0]);
		}
	});
</script>

<Sidebar>
	<!-- Title -->
	<div slot="title" class="title">
		<Text size={Size.Large} appearance={Appearance.Muted}>Note</Text>
	</div>

	<!-- Header Controls -->
	<div slot="header" class="header">
		<Text size={Size.Medium} appearance={Appearance.Muted}>Controls</Text>
		<Toolbar shape={Shape.Pill}>
			<div slot="left">
				<Button shape={Shape.Pill} icon={SVGShape.Plus} on:pressed={handleAddNote} />
			</div>
		</Toolbar>
	</div>

	<!-- Body -->
	<div slot="body" class="sidebar">
		<div class="notes">
			<Text size={Size.Medium} appearance={Appearance.Muted}>Notes</Text>
			<div
				use:dndzone={{
					items: localNotes,
					flipDurationMs: 150,
					dragDisabled: false,
					dropFromOthersDisabled: true
				}}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
                
				class="notes"
			>
				{#each localNotes as note (note.id)}
					<NotePreview {note} />
				{/each}
			</div>
		</div>
	</div>

	<!-- Fixed Controls -->
	<div class="controls">
		<Toolbar shape={Shape.Pill}>
			<div slot="right">
				<ThemeSwitcher />
				<Button shape={Shape.Pill} icon={SVGShape.Cog} />
			</div>
		</Toolbar>
	</div>

	<Editor />
</Sidebar>

<style lang="scss">
	.controls {
		position: fixed;
		bottom: var(--padding);
		right: var(--padding);
		z-index: 1000;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		padding: var(--padding);

        .notes {
            display: inline-flex;
            flex-direction: column;
            gap: var(--gap-less);
            outline: none !important;
        }
	}

    :global(.body) {
        flex-direction: column;
    }

	.title,
	.header {
		padding: 0 var(--padding);
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--color-primary) transparent;
	}
</style>
