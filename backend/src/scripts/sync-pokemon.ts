import { prisma } from "../config/database.js";
import { PokemonSyncService } from "../services/pokemon-sync.service.js";

async function main() {
  const syncService = new PokemonSyncService();

  const pokemonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 25];

  try {
    for (const id of pokemonIds) {
      console.log(`Syncing Pokémon ${id}...`);

      await syncService.syncPokemon(id);
    }

    console.log("Pokémon synchronization completed.");
  } catch (error) {
    console.error("Synchronization failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();