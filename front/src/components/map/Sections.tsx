import 'maplibre-gl/dist/maplibre-gl.css';

import { useLoaderData } from '@tanstack/react-router';
import clsx from 'clsx';
import { format } from 'date-fns';
import { MapPin, MapPinned, Store } from 'lucide-react';
import { useMemo } from 'react';
import Map, { MapRef, Marker } from 'react-map-gl/maplibre';

import { EventLocationCard, ShopCard } from '@/components/map/LocationsCards';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Location, Paris2024LoaderData, Shop } from '@/types/MapTypes';

export const MapComponent = ({
  onPinClick,
  mapRef,
  selectedFilter,
}: {
  onPinClick: (location: Location | Shop) => void;
  mapRef: React.RefObject<MapRef>;
  selectedFilter: Record<string, boolean>;
}) => {
  const { events_location, shops }: Paris2024LoaderData = useLoaderData({
    from: '/_mainapp/2024',
  });

  const filteredEvents = useMemo(
    () =>
      events_location.filter(
        (location) =>
          (selectedFilter.olympic && location.category_id === 'venue-olympic') ||
          (selectedFilter.paralympic && location.category_id === 'venue-paralympic'),
      ),
    [events_location, selectedFilter],
  );

  const locationPins = useMemo(
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

  const filteredShops = useMemo(() => {
    const seenAddresses = new Set();
    const shopsClone = structuredClone(shops);
    const adjustedShops: Shop[] = shopsClone.map((shop) => {
      let { lon, lat } = shop.localisation_geographique;

      const hasMatchingLocation = filteredEvents.some((location) => {
        return (
          location.point_geo.lon.toFixed(4) === lon.toFixed(4) &&
          location.point_geo.lat.toFixed(4) === lat.toFixed(4)
        );
      });

      if (hasMatchingLocation) {
        lon += Math.random() * 0.0005;
        lat += Math.random() * 0.0005;
      }

      return {
        ...shop,
        localisation_geographique: {
          ...shop.localisation_geographique,
          newLon: lon,
          newLat: lat,
        },
      };
    });

    return adjustedShops.filter((shop) => {
      if (seenAddresses.has(shop.address)) {
        return false;
      } else {
        seenAddresses.add(shop.address);
        return true;
      }
    });
  }, [shops, filteredEvents]);

  const shopsPins = useMemo(
    () =>
      filteredShops.map((shop, index) => (
        <Marker
          longitude={
            shop.localisation_geographique.newLon || shop.localisation_geographique.lon
          }
          latitude={
            shop.localisation_geographique.newLat || shop.localisation_geographique.lat
          }
          key={`${index}_${shop.title}_${shop.ville}`}
          onClick={() => {
            const shopClone = structuredClone(shop);
            delete shopClone.localisation_geographique.newLon;
            delete shopClone.localisation_geographique.newLat;
            onPinClick(shopClone);
          }}
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <Store size="32" className="text-[#800020]" />
            </HoverCardTrigger>
            <HoverCardContent>
              <div>
                <p className="font-bold">{shop.title}</p>
                <p className="font-light italic">{shop.address}</p>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Button variant={'outline'} asChild className="p-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${shop.latitude.replace(',', '.')},${shop.longitude.replace(',', '.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPinned size={20} />
                    </a>
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Marker>
      )),
    [filteredShops, onPinClick],
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
        {locationPins}
        {selectedFilter.shops && shopsPins}
      </Map>
    </div>
  );
};

export const LocationSection = ({
  selectedLocation,
  onCardClick,
  selectedFilter,
}: {
  selectedLocation: Location | Shop | null;
  onCardClick: (location: Location | Shop) => void;
  selectedFilter: Record<string, boolean>;
}) => {
  const { events_location, shops }: Paris2024LoaderData = useLoaderData({
    from: '/_mainapp/2024',
  });

  const filteredEvents = useMemo(
    () =>
      events_location.filter(
        (location) =>
          (selectedFilter.olympic && location.category_id === 'venue-olympic') ||
          (selectedFilter.paralympic && location.category_id === 'venue-paralympic'),
      ),
    [events_location, selectedFilter],
  );

  const filteredShops = useMemo(
    () =>
      shops
        .reverse()
        .filter(
          (shop, index, self) =>
            index === self.findIndex((t) => t.address === shop.address),
        ),
    [shops],
  );

  return (
    <section className="w-full lg:w-1/2 ml-2 grid grid-cols-2 gap-2 overflow-auto h-[35rem] mt-4 lg:mt-auto">
      {filteredEvents.map((location, index) => (
        <EventLocationCard
          key={`${index}_${location.code_site}`}
          location={location}
          isSelected={location === selectedLocation}
          onCardClick={() => onCardClick(location)}
        />
      ))}
      {selectedFilter.shops &&
        filteredShops.map((shop, index) => (
          <ShopCard
            key={`${index}_${shop.title}_${shop.ville}`}
            shop={shop}
            isSelected={
              (selectedLocation &&
                'title' in selectedLocation &&
                shop.title === selectedLocation.title) ||
              false
            }
            onCardClick={() => onCardClick(shop)}
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
