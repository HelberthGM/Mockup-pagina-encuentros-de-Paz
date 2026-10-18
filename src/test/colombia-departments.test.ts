import { describe, it, expect } from "vitest";
import { colombiaDepartments } from "@/lib/colombia-departments-geo";

const COLOMBIA_BOUNDS = { minLat: -4.3, maxLat: 13.5, minLng: -82, maxLng: -66 };

describe("Fronteras de departamentos", () => {
  it("incluye las divisiones departamentales del país", () => {
    expect(colombiaDepartments.features.length).toBeGreaterThanOrEqual(30);
  });

  it("nombra cada departamento y define su geometría", () => {
    colombiaDepartments.features.forEach((feature) => {
      expect(feature.properties.name.length).toBeGreaterThan(1);
      expect(["Polygon", "MultiPolygon"]).toContain(feature.geometry.type);
    });
  });

  it("mantiene las coordenadas dentro del territorio colombiano", () => {
    const walk = (value: unknown): void => {
      if (Array.isArray(value) && typeof value[0] === "number") {
        const [lng, lat] = value as [number, number];
        expect(lng).toBeGreaterThanOrEqual(COLOMBIA_BOUNDS.minLng);
        expect(lng).toBeLessThanOrEqual(COLOMBIA_BOUNDS.maxLng);
        expect(lat).toBeGreaterThanOrEqual(COLOMBIA_BOUNDS.minLat);
        expect(lat).toBeLessThanOrEqual(COLOMBIA_BOUNDS.maxLat);
        return;
      }
      if (Array.isArray(value)) value.forEach(walk);
    };
    colombiaDepartments.features.forEach((feature) => {
      if ("coordinates" in feature.geometry) walk(feature.geometry.coordinates);
    });
  });
});
