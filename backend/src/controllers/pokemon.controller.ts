import { Request, Response, NextFunction } from "express";
import { PokemonService } from "../services/pokemon.service.js";
import { pokemonQuerySchema, pokemonIdSchema } from "../schemas/pokemon.schema.js";
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
      const { id } = pokemonIdSchema.parse(req.params);
      
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