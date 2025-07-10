export const mockContent = `
# The Adventure of *Marla the Cat*

Once upon a time, in a land far beyond the ~mountains~ hills, lived a small but _fierce_ cat named *Marla*.

## Chapter 1: The Whispering Trees

> "Beware the woods," the old owl warned. "They remember everything."

Marla, undeterred, packed her bag with:

- [x] A ball of yarn
- [ ] A small loaf of bread
- [ ] Her favorite book: \`Claws and Consequences\`

She journeyed deep into the trees.

### Checklist

1. Stay on the path
2. Don’t talk to mushrooms
3. _Never_ remove the bell from her collar

---

## Chapter 2: The Lost Bell

It was a _dark_ and *stormy* night. Marla’s bell was missing. Without it, she couldn’t cast the protective spell:

\`purr("safety-charm")\`

So she built a makeshift bell using:

* Pebbles  
* Thread  
* A snail’s shell

---

> *“Every small thing has a sound,”* said the wind.

## The End

Marla returned with the bell, and the woods sang once again.

\`// The silence was finally broken.\`
`.trim();

export const mockNote = {
    id: "mock",
    content: mockContent,
    createdAt: Date.now(),
    updatedAt: Date.now()
};