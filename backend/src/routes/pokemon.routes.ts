import { Router } from "express";
import { PokemonController } from "../controllers/pokemon.controller.js";

const router = Router();

const pokemonController = new PokemonController();

router.get("/", pokemonController.getPokemon);
router.get("/:id", pokemonController.getPokemonById);

export default router;