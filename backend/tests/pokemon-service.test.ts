import { describe, expect, it, vi } from "vitest";
import { PokemonService } from "../src/services/pokemon.service.js";

describe("PokemonService.findById", () => {
  it("returns a pokemon when it exists", async () => {
    const pokemonRepository = {
        findByExternalId: vi.fn().mockResolvedValue({
        externalId: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        baseExperience: 112,
        imageUrl: "https://example.com/pikachu.png",
        types: [
            {
            type: {
                name: "electric",
            },
            },
        ],
        abilities: [
            {
            ability: {
                name: "static",
            },
            isHidden: false,
            },
            {
            ability: {
                name: "lightning-rod",
            },
            isHidden: true,
            },
        ],
        }),

        findPrevious: vi.fn().mockResolvedValue({
        externalId: 24,
        name: "charizard",
        imageUrl: "https://example.com/charizard.png",
        }),

        findNext: vi.fn().mockResolvedValue({
        externalId: 26,
        name: "raichu",
        imageUrl: "https://example.com/raichu.png",
        }),
    };

    const cacheService = {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue(undefined),
    };

    const service = new PokemonService(
        pokemonRepository as any,
        cacheService as any,
    );

    const result = await service.findById(25);

    expect(result).toEqual({
        id: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        baseExperience: 112,
        imageUrl: "https://example.com/pikachu.png",
        types: ["electric"],
        abilities: [
        {
            name: "static",
            isHidden: false,
        },
        {
            name: "lightning-rod",
            isHidden: true,
        },
        ],
        navigation: {
        previous: {
            id: 24,
            name: "charizard",
            imageUrl: "https://example.com/charizard.png",
        },
        next: {
            id: 26,
            name: "raichu",
            imageUrl: "https://example.com/raichu.png",
        },
        },
    });

    expect(
        pokemonRepository.findByExternalId,
    ).toHaveBeenCalledWith(25);

    expect(
        pokemonRepository.findPrevious,
    ).toHaveBeenCalledWith(25);

    expect(
        pokemonRepository.findNext,
    ).toHaveBeenCalledWith(25);

    expect(cacheService.set).toHaveBeenCalled();
    });
});