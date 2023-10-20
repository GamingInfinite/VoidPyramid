<script lang="ts">
  import { loadedDeck } from "../../stores";

  let draws = 1;
  let cursed = false;
  let cursePerc = 20;
</script>

<div class="flex flex-col gap-4 m-4">
  <div class="flex flex-row justify-center gap-2">
    <p>Number of Draws</p>
    <input
      class="range max-w-sm"
      type="range"
      min="1"
      max={$loadedDeck.selectedGames.length}
      bind:value={draws}
    />
    {draws}
  </div>
  <div class="flex flex-row justify-center gap-2">
    <p>Curses</p>
    <input type="checkbox" bind:checked={cursed} class="checkbox" />
    {#if cursed}
      <input
        class="range max-w-sm"
        type="range"
        min="1"
        max="100"
        bind:value={cursePerc}
      />
      <p>{cursePerc}%</p>
    {/if}
  </div>
  <div class="flex flex-row justify-center">
    <a class="btn btn-primary" href="/challenge?draws={draws}">
      Start Challenge
    </a>
  </div>
</div>
