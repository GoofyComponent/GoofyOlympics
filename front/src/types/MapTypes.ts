export interface Location {
  adress: string | null;
  category_id: string;
  code_site: string;
  end_date: string;
  latitude: string;
  longitude: string;
  nom_site: string;
  point_geo: {
    lon: number;
    lat: number;
  };
  sports: string;
  start_date: string;
}

export type Shop = {
  title: string;
  address: string;
  localisation_geographique: {
    lon: number;
    lat: number;
    newLon?: number;
    newLat?: number;
  };
  longitude: string;
  latitude: string;
  external_link: string;
  instagram_link: string;
  facebook_link: string;
  twitter_link: string;
  ville: string;
};

export type Paris2024LoaderData = {
  events_location: Location[];
  shops: Shop[];
};
