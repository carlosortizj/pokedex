import { prisma } from "../config/database.js";

export class PokemonRepository {
  async upsertPokemon(data: {
    externalId: number;
    name: string;
    height: number;
    weight: number;
    baseExperience: number | null;
    imageUrl: string | null;
  }) {
    return prisma.pokemon.upsert({
      where: {
        externalId: data.externalId,
      },
      update: {
        name: data.name,
        height: data.height,
        weight: data.weight,
        baseExperience: data.baseExperience,
        imageUrl: data.imageUrl,
      },
      create: data,
    });
  }

  async upsertType(name: string) {
    return prisma.type.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async upsertAbility(name: string) {
    return prisma.ability.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async createPokemonType(pokemonId: number, typeId: number) {
    return prisma.pokemonType.upsert({
      where: {
        pokemonId_typeId: {
          pokemonId,
          typeId,
        },
      },
      update: {},
      create: {
        pokemonId,
        typeId,
      },
    });
  }

  async createPokemonAbility(
    pokemonId: number,
    abilityId: number,
    isHidden: boolean,
  ) {
    return prisma.pokemonAbility.upsert({
      where: {
        pokemonId_abilityId: {
          pokemonId,
          abilityId,
        },
      },
      update: {
        isHidden,
      },
      create: {
        pokemonId,
        abilityId,
        isHidden,
      },
    });
  }

  async findMany(params: {
    page: number;
    limit: number;
    search?: string;
    type?: string;
    sort: "name" | "externalId";
    order: "asc" | "desc";
  }) {
    const { page, limit, search, type, sort, order } = params;

    const where = {
      ...(search
        ? {
            name: {
              contains: search,
            },
          }
        : {}),

      ...(type
        ? {
            types: {
              some: {
                type: {
                  name: type,
                },
              },
            },
          }
        : {}),
    };

    const [pokemon, total] = await prisma.$transaction([
      prisma.pokemon.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          types: {
            include: {
              type: true,
            },
          },
          abilities: {
            include: {
              ability: true,
            },
          },
        },
      }),

      prisma.pokemon.count({
        where,
      }),
    ]);

    return {
      pokemon,
      total,
    };
  }
}