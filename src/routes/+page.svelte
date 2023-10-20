<script lang="ts">
  import logo from "$lib/logo.png";

  import { open } from "@tauri-apps/api/dialog";
  import { readTextFile } from "@tauri-apps/api/fs";

  import { goto } from "$app/navigation";
  import { appDataDir } from "@tauri-apps/api/path";

  import { loadedDeck } from "../stores";

  async function loadDeck() {
    const filePath = (await open({
      defaultPath: await appDataDir(),
      filters: [{ extensions: ["json"], name: "Deck JSON" }],
    })) as string;
    let deck = await readTextFile(filePath).then((res) => JSON.parse(res));
    loadedDeck.set(deck);
    goto("/setup");
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-row justify-center">
    <img src={logo} alt="Pyramid" />
  </div>
  <div class="flex flex-row justify-center gap-4 items-center">
    <a class="btn btn-primary" href="/createDeck">Create Deck</a>
    <button class="btn btn-secondary" on:click={loadDeck}>Load Deck</button>
  </div>
</div>
