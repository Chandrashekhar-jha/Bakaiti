import { northPaths } from "./mapPaths/north";
import { southPaths } from "./mapPaths/south";
import { eastPaths } from "./mapPaths/east";
import { centralWestPaths } from "./mapPaths/centralWest";
import { northEastPaths } from "./mapPaths/northEast";
import { islandsPaths } from "./mapPaths/islands";

export interface StatePath {
  id: string;
  name: string;
  d: string;
}

export const INDIA_MAP_VIEWBOX = "0 0 612 696";

export const statesData: StatePath[] = [
  ...northPaths,
  ...southPaths,
  ...eastPaths,
  ...centralWestPaths,
  ...northEastPaths,
  ...islandsPaths
];
