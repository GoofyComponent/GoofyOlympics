const sportsCodes = [
  {
    sports: ["Tennis de Table", "Tennis de table para"],
    code: ["TTE"],
  },
  {
    sports: [
      "Athlétisme",
      "Athlétisme marche",
      "Athlétisme - marche",
      "Para Athlétisme",
      "Athlétisme marathon",
      "Para-athlétisme (marathon paralympique)",
    ],
    code: ["ATH"],
  },
  {
    sports: ["Rugby à 7"],
    code: ["RU7"],
  },
  {
    sports: ["Cycling Mountain Bike"],
    code: ["MTB"],
  },
  {
    sports: ["Basketball"],
    code: ["BKB"],
  },
  {
    sports: ["Handball"],
    code: ["HBL"],
  },
  {
    sports: ["Football"],
    code: ["FBL"],
  },
  {
    sports: ["Voile"],
    code: ["SAL"],
  },
  {
    sports: ["Haltérophilie"],
    code: ["WLF"],
  },
  {
    sports: ["Volleyball de plage"],
    code: ["VBV"],
  },
  {
    sports: [
      "Cyclisme sur route",
      "Cyclisme sur route - course sur route",
      "Cyclisme sur route - Contre-la-montre-individuel",
    ],
    code: ["CRD"],
  },
  {
    sports: ["Hockey sur Gazon"],
    code: ["HOC"],
  },
  {
    sports: ["Badminton"],
    code: ["BDM"],
  },
  {
    sports: ["Para Haltérophilie"],
    code: ["PWL"],
  },
  {
    sports: ["Goalball"],
    code: ["GBL"],
  },
  {
    sports: ["Escalade Sportive"],
    code: ["CLB"],
  },
  {
    sports: ["Golf"],
    code: ["GLF"],
  },
  {
    sports: ["Para Cyclisme sur piste", "Cyclisme sur piste"],
    code: ["CTR"],
  },
  {
    sports: ["Escrime"],
    code: ["FEN"],
  },
  {
    sports: ["Taekwondo", "Para Taekwondo"],
    code: ["TKW"],
  },
  {
    sports: ["Judo", "Para Judo"],
    code: ["JUD"],
  },
  {
    sports: ["Lutte"],
    code: ["WRE"],
  },
  {
    sports: ["Tennis"],
    code: ["TEN"],
  },
  {
    sports: ["Boxe"],
    code: ["BOX"],
  },
  {
    sports: ["Surf"],
    code: ["SRF"],
  },
  {
    sports: ["Rugby fauteuil"],
    code: ["WRU"],
  },
  {
    sports: ["Volleyball assis"],
    code: ["VBS"],
  },
  {
    sports: ["Para Natation"],
    code: ["SWM"],
  },
  {
    sports: ["Para Aviron", "Aviron"],
    code: ["ROW"],
  },
  {
    sports: ["Para Canoë", "Canoë Sprint"],
    code: ["CSP"],
  },
  {
    sports: ["Gymnastique Rythmique"],
    code: ["GRY"],
  },
  {
    sports: ["Gymnastique Artistique"],
    code: ["GAR"],
  },
  {
    sports: ["Trampoline"],
    code: ["GTR"],
  },
  {
    sports: ["Para Triathlon", "Triathlon"],
    code: ["TRI"],
  },
  {
    sports: ["Volleyball"],
    code: ["VVO"],
  },
  {
    sports: ["Pentathlon Moderne"],
    code: ["MDN", "MPN"],
  },
  {
    sports: ["Cécifoot"],
    code: ["FBB"],
  },
  {
    sports: [
      "Sports Équestres",
      "Sports équestres - dressage",
      "Sports équestres - concours complet",
      "Sports équestres - saut d'obstacles",
    ],
    code: ["EDR", "EVE", "EJP"],
  },
  {
    sports: ["Tir à L'Arc", "Para Tir à l'arc"],
    code: ["ARC"],
  },
  {
    sports: ["Para Equitation"],
    code: ["EQU"],
  },
  {
    sports: ["Water-Polo"],
    code: ["WPO"],
  },
  {
    sports: ["Cyclisme BMX Freestyle", "Cyclisme BMX Racing", "Cyclisme VTT"],
    code: ["BMX"],
  },
  {
    sports: ["Tir", "Para Tir Sportif"],
    code: ["SHO"],
  },
  {
    sports: ["Basketball 3x3"],
    code: ["BK3"],
  },
  {
    sports: ["Breaking"],
    code: ["BKG"],
  },
  {
    sports: ["BMX freestyle"],
    code: ["BMF"],
  },
  {
    sports: ["Skateboard"],
    code: ["SKB"],
  },
  {
    sports: ["Natation", "Natation marathon", "Natation, marathon"],
    code: ["OWS"],
  },
  {
    sports: ["Natation Artistique"],
    code: ["SWA"],
  },
  {
    sports: ["Plongeon"],
    code: ["DIV"],
  },
  {
    sports: ["Canoë Slalom"],
    code: ["CSL"],
  },
  {
    sports: ["Escrime fauteuil"],
    code: ["WFE"],
  },
  {
    sports: ["Tennis fauteuil"],
    code: ["WTE"],
  },
  {
    sports: ["Boccia"],
    code: ["BOC"],
  },
  {
    sports: ["Basketball fauteuil"],
    code: ["WBK"],
  },
];

export const getFromCode = (code: string) => {
  const sport = sportsCodes.find((sport) => sport.code.includes(code));
  return sport ? sport.sports[0] : "";
};

export const getFromSport = (sport: string) => {
  const sportCode = sportsCodes.find((sportCode) =>
    sportCode.sports.includes(sport)
  );
  return sportCode ? sportCode.code[0] : "";
};

export const getSport = (title: string) => {
  const tryWithCode = getFromCode(title);
  if (tryWithCode !== "") {
    return tryWithCode;
  }

  return getFromSport(title);
};
