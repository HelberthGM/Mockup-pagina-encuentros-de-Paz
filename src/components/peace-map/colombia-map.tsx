import { geoCentroid, geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { colombia } from "@/lib/colombia-geo";
import { colombiaDepartments } from "@/lib/colombia-departments-geo";
import { mapCategoryColor, mapExperiences, mapRegions, regionOf } from "@/lib/map-data";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const PAD = 46;
const MIN_K = 1;
const MAX_K = 7;
const FOCUS_K = 2.5;
const LABEL_MIN_K = 1.3;
const REGION_FADE_K = 1.7;
const REGION_MAX_K = 2.8;
const DEPT_LINE_MIN_K = 1.45;
const DEPT_LINE_MAX_K = 1.95;
const DEPT_LABEL_MIN_K = 2.05;
const DEPT_LABEL_MAX_K = 2.6;

const fade = (k: number, min: number, max: number) =>
  Math.max(0, Math.min(1, (k - min) / (max - min)));

interface View {
  k: number;
  x: number;
  y: number;
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ColombiaMap({ selectedId, onSelect }: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const lastSelectionRef = useRef<string | null>(mapExperiences[0]?.id ?? null);
  const [size, setSize] = useState({ w: 960, h: 640 });
  const [view, setView] = useState<View>({ k: 1, x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clampView = useCallback(
    (next: View): View => {
      const k = Math.min(MAX_K, Math.max(MIN_K, next.k));
      const minX = size.w * (1 - k);
      const minY = size.h * (1 - k);
      return {
        k,
        x: Math.min(0, Math.max(minX, next.x)),
        y: Math.min(0, Math.max(minY, next.y)),
      };
    },
    [size.w, size.h],
  );

  const focusOn = useCallback(
    (bx: number, by: number, k: number): View =>
      clampView({ k, x: size.w / 2 - k * bx, y: size.h / 2 - k * by }),
    [clampView, size.w, size.h],
  );

  const zoomAt = useCallback(
    (factor: number, cx: number, cy: number) => {
      setView((current) => {
        const k = Math.min(MAX_K, Math.max(MIN_K, current.k * factor));
        const ratio = k / current.k;
        return clampView({
          k,
          x: cx - ratio * (cx - current.x),
          y: cy - ratio * (cy - current.y),
        });
      });
    },
    [clampView],
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(event.deltaY < 0 ? 1.3 : 0.77, event.clientX - rect.left, event.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const base = useMemo(() => {
    const collection = {
      type: "FeatureCollection",
      features: [
        colombia,
        ...mapExperiences.map((experience) => ({
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Point" as const,
            coordinates: [experience.lng, experience.lat] as [number, number],
          },
        })),
      ],
    } as FeatureCollection;
    const projection = geoMercator().fitExtent(
      [
        [PAD, PAD],
        [size.w - PAD, size.h - PAD],
      ],
      collection,
    );
    const path = geoPath(projection);
    return {
      land: path(colombia) ?? "",
      points: mapExperiences.map((experience) => {
        const projected = projection([experience.lng, experience.lat]) ?? [0, 0];
        return { id: experience.id, bx: projected[0], by: projected[1] };
      }),
      regions: mapRegions.map((region) => {
        const projected = projection([region.lng, region.lat]) ?? [0, 0];
        return { key: region.key, bx: projected[0], by: projected[1] };
      }),
      departments: colombiaDepartments.features.map((feature) => ({
        name: feature.properties.name,
        d: path(feature) ?? "",
      })),
      departmentLabels: colombiaDepartments.features
        .map((feature) => {
          const projected = projection(geoCentroid(feature));
          if (!projected || !Number.isFinite(projected[0]) || !Number.isFinite(projected[1])) {
            return null;
          }
          return { name: feature.properties.name, bx: projected[0], by: projected[1] };
        })
        .filter((item): item is { name: string; bx: number; by: number } => item !== null),
    };
  }, [size.w, size.h]);

  useIsomorphicLayoutEffect(() => {
    if (!selectedId || selectedId === lastSelectionRef.current) return;
    lastSelectionRef.current = selectedId;
    const point = base.points.find((item) => item.id === selectedId);
    if (!point) return;
    setView((current) => focusOn(point.bx, point.by, Math.max(current.k, FOCUS_K)));
  }, [selectedId, base.points, focusOn]);

  const project = (bx: number, by: number) => ({
    left: view.x + view.k * bx,
    top: view.y + view.k * by,
  });

  const reset = () => {
    const point = selectedId ? base.points.find((item) => item.id === selectedId) : undefined;
    if (point) {
      setView(focusOn(point.bx, point.by, FOCUS_K));
      return;
    }
    setView({ k: 1, x: 0, y: 0 });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { px: event.clientX, py: event.clientY, x: view.x, y: view.y };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragRef.current;
    if (!start) return;
    const dx = event.clientX - start.px;
    const dy = event.clientY - start.py;
    setView((current) => clampView({ k: current.k, x: start.x + dx, y: start.y + dy }));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const hoveredPoint = hovered ? base.points.find((point) => point.id === hovered) : undefined;
  const hoveredExperience = hovered
    ? mapExperiences.find((experience) => experience.id === hovered)
    : undefined;
  const selectedExperience = mapExperiences.find((experience) => experience.id === selectedId);
  const selectedRegion = selectedExperience ? regionOf(selectedExperience) : null;
  const showLabels = view.k >= LABEL_MIN_K;
  const regionOpacity =
    view.k <= REGION_FADE_K
      ? 1
      : Math.max(0, 1 - (view.k - REGION_FADE_K) / (REGION_MAX_K - REGION_FADE_K));
  const deptLineOpacity = fade(view.k, DEPT_LINE_MIN_K, DEPT_LINE_MAX_K);
  const deptLabelOpacity = fade(view.k, DEPT_LABEL_MIN_K, DEPT_LABEL_MAX_K);

  return (
    <div
      className={`pmap-stage ${dragging ? "is-dragging" : ""}`}
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => setHovered(null)}
    >
      <svg
        className="pmap-svg"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          <defs>
            <clipPath id="pmap-country-clip">
              <path d={base.land} />
            </clipPath>
          </defs>
          <path className="pmap-land" d={base.land} />
          {deptLineOpacity > 0.02 && (
            <g
              className="pmap-depts"
              clipPath="url(#pmap-country-clip)"
              style={{ opacity: deptLineOpacity }}
            >
              {base.departments.map((department) => (
                <path key={department.name} d={department.d} />
              ))}
            </g>
          )}
        </g>
      </svg>

      {regionOpacity > 0.04 &&
        base.regions.map((region) => {
          const position = project(region.bx, region.by);
          const activeRegion = region.key === selectedRegion;
          return (
            <span
              key={`region-${region.key}`}
              className={`pmap-region${activeRegion ? " is-active" : ""}`}
              style={{
                left: position.left,
                top: position.top,
                opacity: activeRegion ? 1 : regionOpacity,
              }}
            >
              {region.key}
            </span>
          );
        })}

      {deptLabelOpacity > 0.03 &&
        base.departmentLabels.map((department) => {
          const position = project(department.bx, department.by);
          return (
            <span
              key={`dept-${department.name}`}
              className="pmap-dept-label"
              style={{
                left: position.left,
                top: position.top,
                opacity: deptLabelOpacity,
              }}
            >
              {department.name}
            </span>
          );
        })}

      {mapExperiences.map((experience) => {
        const point = base.points.find((item) => item.id === experience.id);
        if (!point) return null;
        const position = project(point.bx, point.by);
        const active = experience.id === selectedId;
        const isHovered = experience.id === hovered;
        return (
          <button
            key={experience.id}
            type="button"
            className={`pmap-marker pmap-c${mapCategoryColor(experience.category)}${active ? " is-active" : ""}`}
            style={{ left: position.left, top: position.top }}
            aria-label={`${experience.name}, ${experience.city}`}
            aria-pressed={active}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onSelect(experience.id)}
            onMouseEnter={() => setHovered(experience.id)}
            onMouseLeave={() =>
              setHovered((current) => (current === experience.id ? null : current))
            }
            onFocus={() => setHovered(experience.id)}
            onBlur={() => setHovered((current) => (current === experience.id ? null : current))}
          />
        );
      })}

      {mapExperiences.map((experience) => {
        const point = base.points.find((item) => item.id === experience.id);
        if (!point) return null;
        const active = experience.id === selectedId;
        const isHovered = experience.id === hovered;
        if (!showLabels && !active && !isHovered) return null;
        const position = project(point.bx, point.by);
        return (
          <span
            key={`label-${experience.id}`}
            className={`pmap-label pmap-c${mapCategoryColor(experience.category)}${active || isHovered ? " is-active" : ""}`}
            style={{ left: position.left, top: position.top }}
          >
            {experience.city}
          </span>
        );
      })}

      {hoveredPoint && hoveredExperience && (
        <div className="pmap-tip" style={project(hoveredPoint.bx, hoveredPoint.by)}>
          <strong>{hoveredExperience.name}</strong>
          <span>
            {hoveredExperience.city} · {hoveredExperience.department} ·{" "}
            {regionOf(hoveredExperience)}
          </span>
        </div>
      )}

      <div className="pmap-controls">
        <button
          type="button"
          className="pmap-zoom"
          aria-label="Acercar"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => zoomAt(1.4, size.w / 2, size.h / 2)}
        >
          <Plus size={18} />
        </button>
        <button
          type="button"
          className="pmap-zoom"
          aria-label="Alejar"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => zoomAt(0.71, size.w / 2, size.h / 2)}
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          className="pmap-zoom"
          aria-label="Volver a la experiencia seleccionada"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={reset}
        >
          <Maximize2 size={17} />
        </button>
      </div>

      <p className="pmap-hint">
        Arrastra para explorar · Acerca con Ctrl + rueda para ver departamentos y ciudades
      </p>
    </div>
  );
}
