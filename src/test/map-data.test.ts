import { describe, it, expect } from "vitest";
import { mapExperiences, mapRegions, regionOf, mapCategoryColor } from "@/lib/map-data";
import { categories } from "@/lib/peace-data";

const COLOMBIA_BOUNDS = { minLat: -4.3, maxLat: 13.5, minLng: -82, maxLng: -66 };

describe("Puntos de demostración del mapa", () => {
  it("incluye entre 12 y 18 puntos de prueba", () => {
    expect(mapExperiences.length).toBeGreaterThanOrEqual(12);
    expect(mapExperiences.length).toBeLessThanOrEqual(18);
  });

  it("marca todos los registros como demostración", () => {
    expect(mapExperiences.every((point) => point.isDemo === true)).toBe(true);
  });

  it("usa coordenadas dentro del territorio colombiano", () => {
    mapExperiences.forEach((point) => {
      expect(point.lat).toBeGreaterThanOrEqual(COLOMBIA_BOUNDS.minLat);
      expect(point.lat).toBeLessThanOrEqual(COLOMBIA_BOUNDS.maxLat);
      expect(point.lng).toBeGreaterThanOrEqual(COLOMBIA_BOUNDS.minLng);
      expect(point.lng).toBeLessThanOrEqual(COLOMBIA_BOUNDS.maxLng);
    });
  });

  it("identifica cada punto con un id único", () => {
    const ids = new Set(mapExperiences.map((point) => point.id));
    expect(ids.size).toBe(mapExperiences.length);
  });

  it("asigna categorías existentes y colores válidos", () => {
    mapExperiences.forEach((point) => {
      expect(categories).toContain(point.category);
      const color = mapCategoryColor(point.category);
      expect(color).toBeGreaterThanOrEqual(0);
      expect(color).toBeLessThan(categories.length);
    });
  });
});

describe("Regiones naturales del mapa", () => {
  it("define las cinco macro-regiones con claves únicas", () => {
    const keys = mapRegions.map((region) => region.key);
    expect(keys).toHaveLength(5);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("ubica los rótulos dentro del territorio colombiano", () => {
    mapRegions.forEach((region) => {
      expect(region.lat).toBeGreaterThanOrEqual(COLOMBIA_BOUNDS.minLat);
      expect(region.lat).toBeLessThanOrEqual(COLOMBIA_BOUNDS.maxLat);
      expect(region.lng).toBeGreaterThanOrEqual(COLOMBIA_BOUNDS.minLng);
      expect(region.lng).toBeLessThanOrEqual(COLOMBIA_BOUNDS.maxLng);
    });
  });

  it("asigna cada experiencia a una región existente", () => {
    const keys = new Set(mapRegions.map((region) => region.key));
    mapExperiences.forEach((point) => {
      expect(keys.has(regionOf(point))).toBe(true);
    });
  });
});
