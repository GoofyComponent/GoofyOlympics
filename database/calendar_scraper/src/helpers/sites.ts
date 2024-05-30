const locationMappings = {
  GRP: "Grand Palais",
  CDM: "Arena Champ-de-Mars",
  RGA: "Stade Roland-Garros",
  TAH: "Teahupo'o, Tahiti",
  NPA: "Arena Paris Nord",
  DEF: "Paris La Défense Arena",
  //VN1: "Stade nautique de Vaires-sur-Marne",
  CPL: "Arena La Chapelle",
  BCY: "Arena Bercy",
  PDP: "Parc des Princes",
  NAN: "Stade de la Beaujoire",
  LYO: "Stade de Lyon",
  ALX: "Pont Alexandre III",
  SP1: "Arena Paris Sud 1",
  VN1: "Stade nautique de Vaires-sur-Marne - bassin d'eau calme",
  STE: "Stade Geoffroy-Guichard",
  TRO: "Trocadéro",
  EIF: "Stade Tour Eiffel",
  BOR: "Stade de Bordeaux",
  CSB: "Parc Georges Valbon",
  VER: "Château de Versailles",
  VE1: "Vélodrome National de Saint-Quentin-en-Yvelines",
  INV: "Invalides",
  VE2: "Stade BMX de Saint-Quentin-en-Yvelines",
  CTX: "Ctr de Tir de Châteauroux",
  LC1: "La Concorde 1",
  LC2: "La Concorde 2",
  LC3: "La Concorde 3",
  LC4: "La Concorde 4",
  HDV: "Hôtel de Ville",
  AQC: "Centre Aquatique",
  VN2: "Stade nautique de Vaires-sur-Marne - stade d'eau vive",
  MRS: "Stade de Marseille",
  STA: "Stade de France",
  SP4: "Arena Paris Sud 4",
  ELA: "Colline d'Elancourt",
  LIL: "Stade Pierre Mauroy",
  NIC: "Stade de Nice",
  MAM: "Marina de Marseille",
  SP6: "Arena Paris Sud 6",
  YDM: "Stade Yves-du-Manoir",
  LBO: "Site d’escalade du Bourget",
  LGN: "Golf National",
  nul: "null",
};

export function getLocation(codeOrName: string) {
  if (
    codeOrName.includes("St. nautique - Eaux vives") ||
    codeOrName.includes("Stade naut. - Eaux vives")
  ) {
    return "VN2";
  }

  if (
    codeOrName.includes("St. nautique - Eaux calme") ||
    codeOrName.includes("Stade naut. - Eaux calmes")
  ) {
    return "VN1";
  }

  if (locationMappings[codeOrName]) {
    return locationMappings[codeOrName];
  }
  const entry = Object.entries(locationMappings).find(
    ([, name]) => name === codeOrName
  );
  return entry ? entry[0] : null;
}
