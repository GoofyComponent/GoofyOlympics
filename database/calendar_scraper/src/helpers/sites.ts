const locationCodes = [
  { locations: ["Grand Palais"], code: ["GRP"] },
  { locations: ["Arena Champ-de-Mars"], code: ["CDM"] },
  { locations: ["Stade Roland-Garros"], code: ["RGA"] },
  { locations: ["Teahupo'o, Tahiti"], code: ["TAH"] },
  { locations: ["Arena Paris Nord"], code: ["NPA"] },
  { locations: ["Paris La Défense Arena"], code: ["DEF"] },
  { locations: ["Arena La Chapelle"], code: ["CPL"] },
  { locations: ["Arena Bercy"], code: ["BCY"] },
  { locations: ["Parc des Princes"], code: ["PDP"] },
  { locations: ["Stade de la Beaujoire"], code: ["NAN"] },
  { locations: ["Stade de Lyon"], code: ["LYO"] },
  { locations: ["Pont Alexandre III"], code: ["ALX"] },
  { locations: ["Arena Paris Sud 1"], code: ["SP1"] },
  {
    locations: [
      "Stade nautique de Vaires-sur-Marne",
      "Stade nautique de Vaires-sur-Marne - bassin d'eau calme",
      "St. nautique - Eaux calme",
      "Stade naut. - Eaux calmes",
    ],
    code: ["VN1"],
  },
  { locations: ["Stade Geoffroy-Guichard"], code: ["STE"] },
  { locations: ["Trocadéro"], code: ["TRO"] },
  { locations: ["Stade Tour Eiffel"], code: ["EIF"] },
  { locations: ["Stade de Bordeaux"], code: ["BOR"] },
  { locations: ["Parc Georges Valbon"], code: ["CSB"] },
  { locations: ["Château de Versailles"], code: ["VER"] },
  {
    locations: [
      "Vélodrome National de Saint-Quentin-en-Yvelines",
      "Vélodrome National",
    ],
    code: ["VE1"],
  },
  { locations: ["Invalides"], code: ["INV"] },
  {
    locations: ["Stade BMX de Saint-Quentin-en-Yvelines", "Stade BMX"],
    code: ["VE2"],
  },
  { locations: ["Ctr de Tir de Châteauroux"], code: ["CTX"] },
  { locations: ["La Concorde 1"], code: ["LC1"] },
  { locations: ["La Concorde 2"], code: ["LC2"] },
  { locations: ["La Concorde 3"], code: ["LC3"] },
  { locations: ["La Concorde 4"], code: ["LC4"] },
  { locations: ["Hôtel de Ville"], code: ["HDV"] },
  { locations: ["Centre Aquatique"], code: ["AQC"] },
  {
    locations: [
      "Stade nautique de Vaires-sur-Marne - stade d'eau vive",
      "St. nautique - Eaux vives",
      "Stade naut. - Eaux vives",
    ],
    code: ["VN2"],
  },
  { locations: ["Stade de Marseille"], code: ["MRS"] },
  { locations: ["Stade de France"], code: ["STA"] },
  { locations: ["Arena Paris Sud 4"], code: ["SP4"] },
  { locations: ["Colline d'Elancourt"], code: ["ELA"] },
  { locations: ["Stade Pierre Mauroy"], code: ["LIL"] },
  { locations: ["Stade de Nice"], code: ["NIC"] },
  { locations: ["Marina de Marseille"], code: ["MAM"] },
  { locations: ["Arena Paris Sud 6"], code: ["SP6"] },
  { locations: ["Stade Yves-du-Manoir"], code: ["YDM"] },
  {
    locations: ["Site d’escalade du Bourget", "Site d'escalade Bourget"],
    code: ["LBO"],
  },
  { locations: ["Golf National", "Le Golf National"], code: ["LGN"] },
  { locations: ["null"], code: ["NUL"] },
  { locations: ["Sites multiples"], code: ["MLT"] },
];

export const getFromCode = (code: string) => {
  const sport = locationCodes.find((sport) => sport.code.includes(code));
  return sport ? sport.locations[0] : "";
};

export const getFromLocations = (sport: string) => {
  const sportCode = locationCodes.find((sportCode) =>
    sportCode.locations.includes(sport)
  );
  return sportCode ? sportCode.code[0] : "";
};

export const getLocation = (title: string) => {
  const parsedTitle = title.trim();

  const tryWithCode = getFromCode(parsedTitle);
  if (tryWithCode !== "") {
    return tryWithCode;
  }

  return getFromLocations(parsedTitle);
};

export const getAllLocations = () => {
  return locationCodes;
};
