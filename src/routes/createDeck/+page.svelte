<script lang="ts">
  import { resolveResource, appDataDir } from "@tauri-apps/api/path";
  import {
    readDir,
    readBinaryFile,
    BaseDirectory,
    writeTextFile,
    exists,
    createDir,
  } from "@tauri-apps/api/fs";
  import { save } from "@tauri-apps/api/dialog";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import { loadedDeck } from "../../stores";
  import type { Game } from "$lib/interfaces";

  let games: Game[] = [];
  let selectedGames: Game[] = [];

  onMount(async () => {
    const entries = await readDir("resources", {
      dir: BaseDirectory.Resource,
      recursive: true,
    });
    for (let i = 0; i < entries.length; i++) {
      const element = entries[i];
      if (!(element.name == "icon.ico")) {
        let cardBackPath = await resolveResource(
          "resources/" + element.name + "/back.png"
        );
        let cardBack = await readBinaryFile(cardBackPath).then((res) => {
          return URL.createObjectURL(new Blob([res], { type: "image/png" }));
        });
        let game: Game = { name: element.name, cardBack: cardBack };
        games.push(game);
      }
    }
    games = games;
  });

  async function saveDeck() {
    if (!(await exists(await appDataDir()))) {
      await createDir(await appDataDir());
    }
    try {
      const filePath = await save({
        defaultPath: await appDataDir(),
        filters: [{ name: "Deck JSON", extensions: ["json"] }],
      });
      await writeTextFile(
        filePath,
        JSON.stringify({ selectedGames: selectedGames })
      );
    } catch (error) {
      console.log("Save Cancelled");
    }
  }

  async function play() {
    loadedDeck.set({ selectedGames: selectedGames });
    goto("/setup");
  }
</script>

<svelte:head>
  <title>TableTalk</title>
</svelte:head>

<div class="flex flex-row m-4">
  <div
    class="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4 w-full"
  >
    {#each games as game}
      <div class="justify-center text-center">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img
          src={game.cardBack}
          alt={game.name}
          on:click={() => {
            selectedGames.push(game);
            selectedGames = selectedGames;
          }}
        />
      </div>
    {/each}
  </div>
</div>

<div class="fixed flex flex-row bottom-4 mx-4 items-center gap-4">
  <a class="btn btn-error" href="/"> Cancel </a>
  <div class="flex flex-col">
    <div class="flex flex-row">
      {#each selectedGames as game}
        <img src={game.cardBack} alt={game.name} class="h-16" />
      {/each}
    </div>
  </div>
  <button
    on:click={saveDeck}
    class="btn btn-accent"
    class:full-disable={!(selectedGames.length > 0)}>Save Deck</button
  >
  <button
    on:click={play}
    class="btn btn-success"
    class:full-disable={!(selectedGames.length > 0)}>Play!</button
  >
</div>
