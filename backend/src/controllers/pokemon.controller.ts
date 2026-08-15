import { Request, Response, NextFunction } from "express";
import { PokemonService } from "../services/pokemon.service.js";
import { pokemonQuerySchema } from "../schemas/pokemon.schema.js";

export class PokemonController {
  constructor(
    private readonly pokemonService = new PokemonService(),
  ) {}

  getPokemon = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query = pokemonQuerySchema.parse(req.query);

      const result =
        await this.pokemonService.findMany(query);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}