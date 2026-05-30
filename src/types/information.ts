export type InformationSection = "HERO" | "MISSION_VISION";

export type InformationItem = {
  id: number;
  key: string;
  title: string;
  section: InformationSection;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export type InformationPayload = {
  key: string;
  title: string;
  section: InformationSection;
  value: string;
};

export const informationDefaults = {
  heroTitle: "Nucleo Pirineos",
  heroDescription:
    "Bienvenidos al Nucleo Pirineos del Sistema Nacional de Orquestas y Coros. Somos el hogar de cientos de ninos y jovenes que encuentran en la disciplina, el arte y la constancia un instrumento para el futuro.",
  heroButtonText: "Ver calendario",
  missionText:
    "El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela constituye una obra social del Estado Venezolano consagrada al rescate pedagogico, ocupacional y etico de la infancia y la juventud, mediante la instruccion y la practica colectiva de la musica, dedicada a la capacitacion, prevencion y recuperacion de los grupos mas vulnerables del pais, tanto por sus caracteristicas etarias como por su situacion socioeconomica.",
  visionText:
    "El Sistema Nacional de Orquestas y Coros Juveniles e Infantiles de Venezuela es una institucion abierta a toda la sociedad, con un alto concepto de excelencia musical, que contribuye al desarrollo integral del ser humano. Se vincula con la comunidad a traves del intercambio, la cooperacion y el cultivo de valores transcendentales que inciden en la transformacion del nino, el joven y el entorno familiar. Se cuenta con un recurso humano dirigido al logro de una meta comun, con mistica y gozo, formando equipos multidisciplinarios altamente motivados e identificados con la Institucion.\n\nSe reconoce al movimiento orquestal como una oportunidad para el desarrollo personal en lo intelectual, en lo espiritual, en lo social y en lo profesional, rescatando al nino y al joven de una juventud vacia, desorientada y desviada.",
} as const;
