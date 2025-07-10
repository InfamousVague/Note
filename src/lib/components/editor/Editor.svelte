<script lang="ts">
	import { activeNote } from "$lib/stores/activeNote";
	import { notes } from "$lib/stores/notes";
	import { highlightMarkdown } from "$lib/utils";

	export let value: string = "";

	$: lines = value.split("\n");

	let textareaEl: HTMLTextAreaElement;
	let previewEl: HTMLDivElement;
	let gutterEl: HTMLDivElement;

	$: if ($activeNote) {
		value = $activeNote.content ?? "";
	}

    let previousNoteId: string | null = null;
    $: if ($activeNote?.id && $activeNote.id !== previousNoteId) {
        previousNoteId = $activeNote.id;
        if (textareaEl) textareaEl.focus();
    }

	function handleScroll() {
		if (gutterEl && textareaEl && previewEl) {
			const { scrollTop, scrollLeft } = textareaEl;
			gutterEl.scrollTop = scrollTop;
			previewEl.scrollTop = scrollTop;
			previewEl.scrollLeft = scrollLeft;
		}
	}

    function updateContent(newContent: string) {
        if (!$activeNote) return;

        const updatedNote = {
            ...$activeNote,
            content: newContent,
            updatedAt: Date.now()
        };

        activeNote.set(updatedNote);
        notes.updateNote(updatedNote);
    }

</script>


<div class="editor">
    <div class="scroll-area">
        <div class="gutter" bind:this={gutterEl}>
            {#each lines as _, i}
                <div class="line-number">{i + 1}</div>
            {/each}
        </div>

        <div class="preview" bind:this={previewEl} aria-hidden="true">
            {#each lines as line}
                <div class="preview-line">
                    {@html highlightMarkdown(line) || "<br>"}
                </div>
            {/each}
        </div>

        <textarea
            class="content"
            bind:this={textareaEl}
            value={value}
            on:input={(e) => updateContent(e.target && (e.target as HTMLTextAreaElement).value || "")}
            on:scroll={handleScroll}
            rows={lines.length || 1}
            spellcheck="false"
            autocomplete="off"
        ></textarea>
    </div>
</div>

<style lang="scss">
.editor {
    font-family: monospace;
    font-size: 1rem;
    line-height: 1.5;
    background: var(--color-background, #1e1e1e);
    color: var(--text-color, #e6e6e6);
    border-radius: 8px;
    width: 100%;
    height: 100%;
    min-height: 300px;
    overflow: hidden;
    position: relative;
   
    .scroll-area {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;

        .gutter {
            pointer-events: none;
            width: 3rem;
            background: var(--color-background);
            color: var(--text-color-muted);
            text-align: right;
            padding: 0.75rem 0.5rem 0.75rem 0;
            user-select: none;

            overflow: auto; // ✅ FIX: allow scrolling
            scrollbar-width: none; // ✅ Optional: hide scrollbar
            z-index: 3;

            .line-number {
                height: 1.5rem;
                line-height: 1.5rem;
            }
        }


        .preview {
            position: absolute;
            left: 3rem;
            right: 0;
            top: 0;
            bottom: 0;
            padding: 0.75rem 1rem;
            pointer-events: none;
            white-space: pre;
            overflow-y: hidden;
            overflow-x: auto;
            z-index: 1;
        }

        .preview-line {
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

        .content {
            position: relative;
            flex: 1;
            padding: 0.75rem 0.5rem;
            border: none;
            outline: none;
            background: transparent;
            color: transparent;
            font: inherit;
            line-height: inherit;
            resize: none;
            white-space: pre;
            overflow-y: scroll;
            overflow-x: auto;
            caret-color: var(--color-primary);
            font-family: "Fira Code", monospace;
            box-sizing: border-box;
            z-index: 2;

            &::selection {
                background: var(--color-primary);
                color: var(--text-color-light);
            }
            
        }
        
        :global(.preview) {
            scrollbar-color: transparent transparent;
        }
    }
    
}
</style>
