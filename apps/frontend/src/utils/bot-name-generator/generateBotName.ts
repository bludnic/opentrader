import { colors } from "./dictionaries/colors";
import { starWars } from "./dictionaries/star-wars";

function randomIndex<T extends unknown[]>(array: T) {
  const randomFloat = Math.random();

  return Math.floor(randomFloat * array.length);
}

export function generateBotName(): string {
  const color = colors[randomIndex(colors)] || "";
  const character = starWars[randomIndex(starWars)] || "";

  return `${color} ${character}`;
}
