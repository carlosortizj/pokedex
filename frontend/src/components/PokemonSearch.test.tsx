import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import { PokemonSearch } from "./PokemonSearch";

describe("PokemonSearch", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onChange with the searched value after the debounce", () => {
    vi.useFakeTimers();

    const onChange = vi.fn();

    render(
        <PokemonSearch
        value=""
        onChange={onChange}
        />,
    );

    const input = screen.getByLabelText(
        "Buscar Pokémon",
    );

    fireEvent.change(input, {
        target: {
        value: "pikachu",
        },
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
        vi.advanceTimersByTime(400);
    });

    expect(onChange).toHaveBeenCalledWith("pikachu");
    });
});