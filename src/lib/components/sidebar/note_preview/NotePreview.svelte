<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { getTitle, highlightMarkdown, timeAgo } from "$lib/utils";
	import { Appearance, Card, Size, Text } from "june-uikit";
	import { activeNote } from "$lib/stores/activeNote";
	import type { Note } from "$lib/types";

	export let note: Note = {
		id: "0",
		content: "",
		createdAt: Date.now(),
		updatedAt: Date.now()
	};

	$: lines = note.content.split("\n");

	let updatedText = timeAgo(note.updatedAt);
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			updatedText = timeAgo(note.updatedAt);
		}, 60000); // update every 60s
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	function setActive() {
		activeNote.set(note);
	}
</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<div class="note-preview" on:click={setActive} data-key={note.id}>
	<Text singleLine>{getTitle(note.content)}</Text>
	<Text size={Size.Small} appearance={Appearance.Muted}>
		Updated {updatedText}.
	</Text>

	{#if lines.length === 0}
		<div class="preview-line">No content available</div>
	{/if}

	<div class="preview">
		{#each lines.slice(0, 7) as line}
			<div class="preview-line">
				{@html highlightMarkdown(line) || "<br>"}
			</div>
		{/each}
	</div>
</div>


<style lang="scss">
    .note-preview {
        display: flex;
        flex-direction: column;
        gap: var(--gap-less);
        padding: var(--padding);
        flex: 1;
        color: var(--text-color-light);
        font-family: monospace;
        font-size: var(--font-size-small);
        line-clamp: 5;
        background: var(--color-secondary);
        border-radius: var(--border-radius);
        cursor: pointer;
        user-select: none;
        outline: none !important;

        .preview {
            background-color: var(--color-background);
            padding: var(--padding);
            border-radius: var(--border-radius);
        }

        .preview-line {
            overflow: hidden;
            color: inherit;
            white-space: nowrap;
            display: block;
            max-width: 100%;

            :global(.bold) {
                font-weight: bold;
                color: var(--text-color-light);
            }

            :global(.italic) {
                font-style: italic;
                color: var(--text-color-light);
            }

            :global(.code) {
                font-family: monospace;
                background: rgba(255, 255, 255, 0.1);
                padding: 0 4px;
                border-radius: 3px;
            }

            :global(.heading) {
                font-weight: bold;
                color: var(--color-primary);
            }

            :global(.quote) {
                font-style: italic;
                color: var(--text-color-muted);
            }

            :global(.list-item) {
                padding-left: 0.5rem;
                display: inline-block;
                &::before {
                    content: "• ";
                    color: var(--color-primary);
                }
            }

            :global(.ordered-list-item) {
                padding-left: 0.5rem;
                display: inline-block;
                color: var(--text-color-light);
            }

            :global(.checkbox) {
                font-family: monospace;
                color: var(--text-color-light);
                &::before {
                    content: "";
                }
            }

            :global(.horizontal-rule) {
                display: block;
                width: 100%;
                border-bottom: 1px solid var(--text-color-muted);
                margin: 0.5rem 0;
                height: 0;
                line-height: 0;
                color: transparent;
            }

            :global(.strike) {
                text-decoration: line-through;
                opacity: 0.8;
            }
        }

    }

</style>