import { categories } from "@/lib/peace-data";

/**
 * Puntos de demostración para el mapa interactivo.
 *
 * IMPORTANTE: todos los registros de este archivo son FICTICIOS y se usan
 * únicamente para probar el mapa durante la construcción del mockup.
 * No corresponden a colegios, participantes, experiencias ni resultados
 * reales del II Encuentro 2026. Están listos para sustituirse por datos
 * reales de la plataforma o de una futura API conservando la interfaz
 * `MapExperience`.
 */
export interface MapExperience {
  id: string;
  name: string;
  category: (typeof categories)[number];
  city: string;
  department: string;
  lat: number;
  lng: number;
  summary: string;
  detail: string;
  isDemo: true;
}

export const DEMO_MAP_NOTICE =
  "Puntos de demostración: las ubicaciones, experiencias y textos de este mapa son ficticios y sirven para probar la interacción. No representan colegios ni participantes reales del encuentro.";

export const mapExperiences: MapExperience[] = [
  {
    id: "bogota-diálogo",
    name: "La palabra que nos une (demo)",
    category: "Círculos de la palabra",
    city: "Bogotá",
    department: "Cundinamarca",
    lat: 4.711,
    lng: -74.0721,
    summary: "Círculos de diálogo semanales para resolver conflictos del aula conversando.",
    detail:
      "Registro de demostración. Describe una experiencia ficticia de círculos de la palabra usada para probar el mapa: no corresponde a una institución real del encuentro.",
    isDemo: true,
  },
  {
    id: "medellin-jueces",
    name: "Voces que median (demo)",
    category: "Jueces de paz",
    city: "Medellín",
    department: "Antioquia",
    lat: 6.2442,
    lng: -75.5812,
    summary: "Estudiantes mediadores acompañan acuerdos de convivencia entre compañeros.",
    detail:
      "Registro de demostración. Experiencia ficticia de mediación escolar para probar el comportamiento del mapa y del panel de resumen.",
    isDemo: true,
  },
  {
    id: "cali-teatro",
    name: "En la piel del otro (demo)",
    category: "Teatro y sociodrama",
    city: "Cali",
    department: "Valle del Cauca",
    lat: 3.4516,
    lng: -76.532,
    summary: "El teatro como espejo para reconocer al otro y transformar los conflictos.",
    detail:
      "Registro de demostración. Montaje teatral ficticio con fines ilustrativos para el mapa, sin vínculo con participantes reales.",
    isDemo: true,
  },
  {
    id: "barranquilla-semillero",
    name: "Semillas de paz (demo)",
    category: "Semilleros de investigación",
    city: "Barranquilla",
    department: "Atlántico",
    lat: 10.9685,
    lng: -74.7813,
    summary: "Preguntas de investigación escolar sobre convivencia en el Caribe colombiano.",
    detail:
      "Registro de demostración. Semillero ficticio usado para probar la distribución de marcadores en la costa Caribe.",
    isDemo: true,
  },
  {
    id: "cartagena-clinicas",
    name: "Sentir para convivir (demo)",
    category: "Clínicas de las emociones",
    city: "Cartagena",
    department: "Bolívar",
    lat: 10.391,
    lng: -75.4794,
    summary: "Espacios de cuidado emocional para reconocer lo que sentimos en la escuela.",
    detail:
      "Registro de demostración. Clínica de emociones ficticia para probar la interacción del mapa en tabletas y móviles.",
    isDemo: true,
  },
  {
    id: "bucaramanga-museos",
    name: "Memorias que abrazan (demo)",
    category: "Museos de la memoria",
    city: "Bucaramanga",
    department: "Santander",
    lat: 7.1254,
    lng: -73.1198,
    summary: "Un museo escolar que guarda la memoria de la convivencia del colegio.",
    detail:
      "Registro de demostración. Museo de la memoria ficticio, creado solo para validar el diseño del mapa.",
    isDemo: true,
  },
  {
    id: "pasto-diálogo",
    name: "Dialogar en el sur (demo)",
    category: "Círculos de la palabra",
    city: "Pasto",
    department: "Nariño",
    lat: 1.2136,
    lng: -77.2811,
    summary: "Círculos de palabra que integran saberes de la comunidad andina.",
    detail:
      "Registro de demostración. Experiencia ficticia del sur del país para probar la distribución regional del mapa.",
    isDemo: true,
  },
  {
    id: "santamarta-jueces",
    name: "Mediar junto al mar (demo)",
    category: "Jueces de paz",
    city: "Santa Marta",
    department: "Magdalena",
    lat: 11.2408,
    lng: -74.199,
    summary: "Estudiantes que median y proponen acuerdos de convivencia en el colegio.",
    detail:
      "Registro de demostración. Experiencia ficticia usada como prueba del mapa; no corresponde a un colegio real.",
    isDemo: true,
  },
  {
    id: "villavicencio-teatro",
    name: "Escena de paz (demo)",
    category: "Teatro y sociodrama",
    city: "Villavicencio",
    department: "Meta",
    lat: 4.142,
    lng: -73.6266,
    summary: "Sociodramas que representan conflictos de la vida escolar para transformarlos.",
    detail:
      "Registro de demostración. Sociodrama ficticio usado para probar el mapa en la región de la Orinoquía.",
    isDemo: true,
  },
  {
    id: "neiva-semillero",
    name: "Investigar la convivencia (demo)",
    category: "Semilleros de investigación",
    city: "Neiva",
    department: "Huila",
    lat: 2.9345,
    lng: -75.2809,
    summary: "Semillero que investiga cómo se resuelven los conflictos en la escuela.",
    detail:
      "Registro de demostración. Semillero ficticio, sin relación con instituciones o participantes reales.",
    isDemo: true,
  },
  {
    id: "riohacha-clinicas",
    name: "Emociones del desierto (demo)",
    category: "Clínicas de las emociones",
    city: "Riohacha",
    department: "La Guajira",
    lat: 11.5444,
    lng: -72.907,
    summary: "Cuidado emocional y escucha intercultural desde el aula.",
    detail:
      "Registro de demostración. Experiencia ficticia del extremo norte para probar los límites del encuadre del mapa.",
    isDemo: true,
  },
  {
    id: "cucuta-museos",
    name: "Memoria de frontera (demo)",
    category: "Museos de la memoria",
    city: "Cúcuta",
    department: "Norte de Santander",
    lat: 7.8891,
    lng: -72.4967,
    summary: "Archivo escolar que recoge historias de convivencia en la frontera.",
    detail:
      "Registro de demostración. Museo de la memoria ficticio usado para validar el mapa en el oriente del país.",
    isDemo: true,
  },
  {
    id: "monteria-diálogo",
    name: "Ríos de palabra (demo)",
    category: "Círculos de la palabra",
    city: "Montería",
    department: "Córdoba",
    lat: 8.748,
    lng: -75.8814,
    summary: "Círculos de palabra inspirados en los ríos de la región caribeña.",
    detail:
      "Registro de demostración. Experiencia ficticia creada únicamente para probar el panel de resumen del mapa.",
    isDemo: true,
  },
  {
    id: "florencia-jueces",
    name: "Acuerdos de la selva (demo)",
    category: "Jueces de paz",
    city: "Florencia",
    department: "Caquetá",
    lat: 1.6144,
    lng: -75.6062,
    summary: "Estudiantes que actúan como jueces de paz escolar en situaciones cotidianas.",
    detail:
      "Registro de demostración. Experiencia ficticia del piedemonte amazónico para probar la interacción del mapa.",
    isDemo: true,
  },
  {
    id: "quibdo-teatro",
    name: "Teatro del Pacífico (demo)",
    category: "Teatro y sociodrama",
    city: "Quibdó",
    department: "Chocó",
    lat: 5.6919,
    lng: -76.6583,
    summary: "El teatro y la tradición oral del Pacífico para resolver conflictos.",
    detail:
      "Registro de demostración. Montaje ficticio usado para probar el mapa en la región del Pacífico colombiano.",
    isDemo: true,
  },
  {
    id: "leticia-semillero",
    name: "Preguntar en la Amazonía (demo)",
    category: "Semilleros de investigación",
    city: "Leticia",
    department: "Amazonas",
    lat: -4.2153,
    lng: -69.9406,
    summary: "Semillero escolar que investiga la convivencia en el extremo sur del país.",
    detail:
      "Registro de demostración. Semillero ficticio del sur del país, usado para probar el encuadre del mapa con el punto más austral.",
    isDemo: true,
  },
];

export type MapRegionKey = "Caribe" | "Pacífico" | "Andina" | "Orinoquía" | "Amazonía";

export interface MapRegion {
  key: MapRegionKey;
  lat: number;
  lng: number;
}

/**
 * Macro-regiones naturales de Colombia usadas como etiquetas de referencia
 * sobre el mapa. Las coordenadas son centroides aproximados solo para
 * posicionar el rótulo; no representan límites oficiales.
 */
export const mapRegions: MapRegion[] = [
  { key: "Caribe", lat: 10.1, lng: -74.4 },
  { key: "Pacífico", lat: 4.3, lng: -77.5 },
  { key: "Andina", lat: 5.9, lng: -74.9 },
  { key: "Orinoquía", lat: 4.4, lng: -71.2 },
  { key: "Amazonía", lat: -1.4, lng: -73.3 },
];

/** Asignación de cada departamento de demostración a su región natural. */
const DEPARTMENT_REGION: Record<string, MapRegionKey> = {
  Cundinamarca: "Andina",
  Antioquia: "Andina",
  Santander: "Andina",
  Huila: "Andina",
  "Norte de Santander": "Andina",
  "Valle del Cauca": "Pacífico",
  Nariño: "Pacífico",
  Chocó: "Pacífico",
  Atlántico: "Caribe",
  Bolívar: "Caribe",
  Magdalena: "Caribe",
  "La Guajira": "Caribe",
  Córdoba: "Caribe",
  Meta: "Orinoquía",
  Caquetá: "Amazonía",
  Amazonas: "Amazonía",
};

export const regionOf = (experience: MapExperience): MapRegionKey =>
  DEPARTMENT_REGION[experience.department] ?? "Andina";

export const mapCategoryColor = (category: (typeof categories)[number]) =>
  categories.indexOf(category);
