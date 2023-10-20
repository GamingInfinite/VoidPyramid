<script lang="ts">
  import type { PageData } from "./$types";

  import type { Game } from "$lib/interfaces";

  import { loadedDeck } from "../../stores";

  import { goto } from "$app/navigation";

  import { readBinaryFile, BaseDirectory, readDir } from "@tauri-apps/api/fs";
  import { resolveResource } from "@tauri-apps/api/path";
  import { onMount } from "svelte";

  export let data: PageData;

  const fullDeck: Game[] = $loadedDeck.selectedGames;

  interface MappedData {
    challenges: string[];
    modifiers: string[];
  }

  interface drawnData {
    game: string;
    challenge: number;
    modifier: number;
  }

  let draws: drawnData[] = [];
  let dataMap: Map<string, MappedData> = new Map();

  console.log(data.draws);
  if (!fullDeck[0]) {
    goto("/");
  }

  onMount(async () => {
    for (let i = 0; i < fullDeck.length; i++) {
      const element = fullDeck[i];
      let challenges = [];
      let modifiers = [];
      let chFilePath = await resolveResource(
        "resources/" + element.name + "/main"
      );
      let chFiles = await readDir(chFilePath, { recursive: true });
      for (let j = 0; j < chFiles.length; j++) {
        const element = chFiles[j].path;
        challenges.push(
          URL.createObjectURL(
            new Blob([await readBinaryFile(element)], { type: "image/png" })
          )
        );
      }
      let modFilePath = await resolveResource(
        "resources/" + element.name + "/modifier"
      );
      let modFiles = await readDir(modFilePath, { recursive: true });
      for (let j = 0; j < modFiles.length; j++) {
        const element = modFiles[j].path;
        modifiers.push(
          URL.createObjectURL(
            new Blob([await readBinaryFile(element)], { type: "image/png" })
          )
        );
      }
      let data: MappedData = { challenges, modifiers };
      dataMap.set(element.name, data);
    }
    redraw();
  });

  async function redraw() {
    draws = [];
    let deck = [...fullDeck];
    for (let i = 0; i < parseInt(data.draws); i++) {
      let num = Math.floor(Math.random() * deck.length);
      let challenges = [];
      let modifiers = [];
      challenges = dataMap.get(deck[num].name).challenges;
      modifiers = dataMap.get(deck[num].name).modifiers;
      draws.push({
        game: deck[num].name,
        challenge: Math.floor(Math.random() * challenges.length),
        modifier: Math.floor(Math.random() * modifiers.length),
      });
      deck.splice(num, 1);
    }
    draws = draws;
  }
</script>

<div class="relative flex flex-col gap-4">
  <div class="flex flex-row m-4">
    <a class="btn btn-error" href="/"> X </a>
  </div>
  <div class="flex flex-row gap-4 justify-center">
    <div class="grid grid-cols-3 w-full gap-4 mx-4">
      {#each draws as challenge}
        <div class="flex flex-row">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <img
            src={dataMap.get(challenge.game).challenges[challenge.challenge]}
            alt={challenge.challenge.toString()}
            class="w-1/2"
            on:click={() => {
              challenge.challenge = Math.floor(
                Math.random() * dataMap.get(challenge.game).challenges.length
              );
            }}
          />
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <img
            src={dataMap.get(challenge.game).modifiers[challenge.modifier]}
            alt={challenge.modifier.toString()}
            class="w-1/2"
            on:click={() => {
              challenge.modifier = Math.floor(
                Math.random() * dataMap.get(challenge.game).modifiers.length
              );
            }}
          />
        </div>
      {/each}
    </div>
  </div>
  <div class="fixed flex flex-row m-4 bottom-0">
    <button class="btn btn-accent" on:click={redraw}> Re-Draw </button>
  </div>
</div>
