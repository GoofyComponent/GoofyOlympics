import 'maplibre-gl/dist/maplibre-gl.css';

import { useLoaderData } from '@tanstack/react-router';
import clsx from 'clsx';
import { format } from 'date-fns';
import { MapPin, MapPinned } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { MapRef, Marker } from 'react-map-gl/maplibre';

import { MainTitle /* , SubTitle */ } from '@/components/title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Tabs, TabsContent /* , TabsList, TabsTrigger */ } from '@/components/ui/tabs';

type Location = {
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
};

export const Paris2024Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 2.333333,
    latitude: 48.866667,
    zoom: 11.5,
  });
  const [selectedFilter, setSelectedFilter] = useState<Record<string, boolean>>({
    olympic: true,
    paralympic: true,
  });

  const mapRef = useRef<MapRef | null>(null);

  const onSelectCity = useCallback(({ lat, lon }: { lat: number; lon: number }) => {
    mapRef.current?.flyTo({ center: [lon, lat], zoom: 17, duration: 3000 });
  }, []);

  const handlePinClick = (location: Location) => {
    setSelectedLocation(location);
    setViewState({
      ...viewState,
      longitude: location.point_geo.lon,
      latitude: location.point_geo.lat,
    });
  };

  const handleCardClick = (location: Location) => {
    setSelectedLocation(location);
    setViewState({
      ...viewState,
      longitude: location.point_geo.lon,
      latitude: location.point_geo.lat,
    });
  };

  useEffect(() => {
    if (selectedLocation) {
      onSelectCity(selectedLocation.point_geo);
    }
  }, [selectedLocation, onSelectCity]);

  return (
    <>
      <MainTitle>Olympic Games Paris 2024</MainTitle>
      <p className="font-light text-xl">26 July - 11 August, 2024</p>
      <div className="mt-4">
        <Tabs defaultValue="map">
          {/* <TabsList>
            <TabsTrigger value="map">Interactive map</TabsTrigger>
            <TabsTrigger value="calendar">Events calendar</TabsTrigger>
          </TabsList> */}
          <TabsContent value="map" className="w-full ">
            {/* <SubTitle className="py-2">Competition sites</SubTitle> */}
            <div className="flex py-2">
              <p className="font-light mr-2">Filters :</p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="olympic"
                    checked={selectedFilter.olympic}
                    onCheckedChange={(checked: boolean) =>
                      setSelectedFilter({ ...selectedFilter, olympic: checked })
                    }
                  />
                  <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Olympics venues
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paralympic"
                    checked={selectedFilter.paralympic}
                    onCheckedChange={(checked: boolean) =>
                      setSelectedFilter({ ...selectedFilter, paralympic: checked })
                    }
                  />
                  <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Paralympics venues
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <MapComponent
                onPinClick={handlePinClick}
                mapRef={mapRef}
                selectedFilter={selectedFilter}
              />
              <LocationSection
                selectedLocation={selectedLocation}
                onCardClick={handleCardClick}
                selectedFilter={selectedFilter}
              />
            </div>
          </TabsContent>
          <TabsContent value="calendar">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const MapComponent = ({
  onPinClick,
  mapRef,
  selectedFilter,
}: {
  onPinClick: (location: Location) => void;
  mapRef: React.RefObject<MapRef>;
  selectedFilter: Record<string, boolean>;
}) => {
  const {
    events_location,
  }: {
    events_location: Location[];
  } = useLoaderData({ from: '/_mainapp/2024' });

  const filteredEvents = useMemo(
    () =>
      events_location.filter(
        (location) =>
          (selectedFilter.olympic && location.category_id === 'venue-olympic') ||
          (selectedFilter.paralympic && location.category_id === 'venue-paralympic'),
      ),
    [events_location, selectedFilter],
  );

  const pins = useMemo(
    () =>
      filteredEvents.map((location, index) => (
        <Marker
          longitude={location.point_geo.lon}
          latitude={location.point_geo.lat}
          key={`${index}_${location.code_site}`}
          onClick={() => onPinClick(location)}
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <MapPin
                size="32"
                className={clsx(
                  location.category_id === 'venue-olympic' && 'text-blue-600',
                  location.category_id === 'venue-paralympic' && 'text-purple-600',
                )}
              />
            </HoverCardTrigger>
            <HoverCardContent>
              <div>
                <p className="font-bold">{location.nom_site}</p>
                <p className="font-light">
                  Open from {format(new Date(location.start_date), 'MM-dd-yyyy')} to{' '}
                  {format(new Date(location.end_date), 'MM-dd-yyyy')}
                </p>
                <div>
                  <h4 className="underline italic">Sports :</h4>
                  <ul>
                    {location.sports.split(',').map((sport, index) => (
                      <li key={index}>{sport.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Marker>
      )),
    [filteredEvents, onPinClick],
  );

  return (
    <div className="w-full lg:w-1/2 h-[35rem]">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 2.333333,
          latitude: 48.866667,
          zoom: 11.5,
        }}
        maxZoom={17}
        style={{
          width: '100%',
          borderRadius: '1rem',
          marginRight: '0.5rem',
          border: '1px solid #e2e8f0',
          outline: 'none',
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_PUBLIC}`}
      >
        {pins}
      </Map>
    </div>
  );
};

const LocationSection = ({
  selectedLocation,
  onCardClick,
  selectedFilter,
}: {
  selectedLocation: Location | null;
  onCardClick: (location: Location) => void;
  selectedFilter: Record<string, boolean>;
}) => {
  const {
    events_location,
  }: {
    events_location: Location[];
  } = useLoaderData({ from: '/_mainapp/2024' });

  const filteredEvents = useMemo(
    () =>
      events_location.filter(
        (location) =>
          (selectedFilter.olympic && location.category_id === 'venue-olympic') ||
          (selectedFilter.paralympic && location.category_id === 'venue-paralympic'),
      ),
    [events_location, selectedFilter],
  );

  return (
    <section className="w-full lg:w-1/2 ml-2 grid grid-cols-2 gap-2 overflow-auto h-[35rem] mt-4 lg:mt-auto">
      {filteredEvents.map((location, index) => (
        <LocationCard
          key={`${index}_${location.code_site}`}
          location={location}
          isSelected={location === selectedLocation}
          onCardClick={() => onCardClick(location)}
        />
      ))}
      {filteredEvents.length === 0 && (
        <p className="text-center text-lg font-light">
          No venues found for the selected filters.
        </p>
      )}
    </section>
  );
};

const LocationCard = ({
  location,
  isSelected,
  onCardClick,
}: {
  location: Location;
  isSelected: boolean;
  onCardClick: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  return (
    <Card
      className={clsx(
        'cursor-pointer',
        isSelected ? 'bg-gray-200' : 'bg-white',
        'border border-gray-200',
        'flex flex-col justify-between h-full',
        'hover:shadow-md transition-shadow duration-300 ease-in-out',
      )}
      ref={cardRef}
      onClick={onCardClick}
    >
      <CardContent className="p-2">
        <div className="flex">
          <MapPin
            size="24"
            strokeWidth={1.5}
            className={clsx(
              location.category_id === 'venue-olympic' && 'text-blue-600',
              location.category_id === 'venue-paralympic' && 'text-purple-600',
            )}
          />

          <p className="italic font-light">
            {location.category_id === 'venue-olympic' ? 'Olympic' : 'Paralympic'}
          </p>
        </div>
        <div className="px-2 mb-2">
          <p className="font-bold">{location.nom_site}</p>
          <div>
            <h4 className="underline italic">Sports :</h4>
            <p>{location.sports}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-end px-1 py-1">
        <Button variant={'outline'} asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.latitude.replace(',', '.')},${location.longitude.replace(',', '.')}`}
            target="_blank"
            className="flex items-center justify-end"
          >
            <p className="mr-2">View on Google Maps</p>
            <MapPinned />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};