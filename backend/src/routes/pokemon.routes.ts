import { Router } from "express";
import { PokemonController } from "../controllers/pokemon.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

const pokemonController = new PokemonController();

router.use(authMiddleware);

router.get("/", pokemonController.getPokemon);
router.get("/:id", pokemonController.getPokemonById);

export default router;