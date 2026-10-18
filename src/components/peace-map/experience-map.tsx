import { useState } from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import bear from "@/assets/peace-bear.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DEMO_MAP_NOTICE, mapCategoryColor, mapExperiences, regionOf } from "@/lib/map-data";
import { ColombiaMap } from "./colombia-map";
import "./peace-map.css";

export function ExperienceMap() {
  const [selectedId, setSelectedId] = useState<string | null>(mapExperiences[0]?.id ?? null);
  const [openId, setOpenId] = useState<string | null>(null);

  const selected = mapExperiences.find((experience) => experience.id === selectedId) ?? null;
  const open = mapExperiences.find((experience) => experience.id === openId) ?? null;
  const regions = new Set(mapExperiences.map((experience) => regionOf(experience))).size;

  return (
    <section className="pmap" aria-label="Mapa de experiencias del encuentro">
      <div className="pmap-inner">
        <div className="pmap-side">
          <div className="pmap-step">
            <span className="num">01</span> Colombia · Vista esquemática
          </div>
          <div className="pmap-encuentro">II Encuentro 2026</div>
          <h2>
            Explora las historias
            <br />
            que construyen <em>paz</em>.
          </h2>
          <p className="pmap-lead">Haz clic en un punto para descubrir una experiencia.</p>
          <div className="pmap-stats">
            <span>
              <strong>{mapExperiences.length}</strong> experiencias demo
            </span>
            <span>
              <strong>{regions}</strong> regiones naturales
            </span>
          </div>
          <div className="pmap-bear">
            <img src={bear} alt="" width="46" height="50" />
            <p>Arrastra, acércate y descubre una historia.</p>
          </div>
          <p className="pmap-notice">{DEMO_MAP_NOTICE}</p>
        </div>

        <div className="pmap-stage-wrap">
          <div className="pmap-mobile-head">
            <span className="num">01</span>
            <div>
              <strong>Explora las historias que construyen paz</strong>
              <small>Colombia · II Encuentro 2026</small>
            </div>
          </div>
          <ColombiaMap selectedId={selectedId} onSelect={setSelectedId} />
          {selected && (
            <div className="pmap-summary">
              <button
                type="button"
                className="close"
                aria-label="Cerrar resumen"
                onClick={() => setSelectedId(null)}
              >
                <X size={15} />
              </button>
              <span className={`cat pmap-c${mapCategoryColor(selected.category)}`}>
                <i /> {selected.category}
              </span>
              <h3>{selected.name}</h3>
              <p className="meta">
                <MapPin size={12} /> {selected.city}, {selected.department} · {regionOf(selected)}
              </p>
              <p>{selected.summary}</p>
              <Button size="sm" onClick={() => setOpenId(selected.id)}>
                Ver ficha completa <ArrowUpRight />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(open)}
        onOpenChange={(value) => {
          if (!value) setOpenId(null);
        }}
      >
        <DialogContent className="dialog-content">
          <DialogTitle>{open?.name}</DialogTitle>
          <DialogDescription>
            Ficha de demostración · Los datos de este mapa son ficticios y están pendientes de
            sustituir por la información real.
          </DialogDescription>
          {open &&
            [
              {
                title: "01 · Institución o colegio",
                value: "Registro ficticio de demostración. No corresponde a una institución real.",
              },
              { title: "02 · Categoría y metodología", value: open.category },
              {
                title: "03 · Ubicación de referencia",
                value: `${open.city}, ${open.department} (punto de prueba, no verificado)`,
              },
              { title: "04 · Resumen de la experiencia", value: open.summary },
              { title: "05 · Descripción ampliada", value: open.detail },
              {
                title: "06 · Actores y alcance",
                value: "Sin información real: este punto solo existe para probar la interacción.",
              },
              {
                title: "07 · Impacto e indicadores",
                value:
                  "Sin indicadores verificados. Los datos reales están pendientes de incorporar.",
              },
            ].map((field) => (
              <div className="field" key={field.title}>
                <h4>{field.title}</h4>
                <p>{field.value}</p>
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </section>
  );
}
