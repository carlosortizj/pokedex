import { prisma } from "../config/database.js";
import { redis } from "../config/redis.js";
import { PokemonSyncService } from "../services/pokemon-sync.service.js";
import { logger } from "../utils/logger.js";

const syncService = new PokemonSyncService();

const pokemonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 25];

async function main() {
  try {
    await redis.connect();

    for (const id of pokemonIds) {
      logger.info(
        {
          pokemonId: id,
        },
        "Syncing Pokemon",
      );

      await syncService.syncPokemon(id);
    }

    logger.info("Pokemon synchronization completed.");
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Synchronization failed",
    );

    process.exitCode = 1;
  } finally {
    if (redis.isOpen) {
      await redis.quit();
    }

    await prisma.$disconnect();
  }
}

main();