import { Request, Response, NextFunction } from "express";
import { PokemonService } from "../services/pokemon.service.js";
import { pokemonQuerySchema } from "../schemas/pokemon.schema.js";
import { AppError } from "../errors/app-error.js";

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

  getPokemonById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(
          "INVALID_POKEMON_ID",
          400,
          "Pokemon id must be a positive integer.",
        );
      }

      const result =
        await this.pokemonService.findById(id);

      res.json({
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}