import 'maplibre-gl/dist/maplibre-gl.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

import { LocationSection, MapComponent } from '@/components/map/Sections';
import { MainTitle /* , SubTitle */ } from '@/components/title';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent /* , TabsList, TabsTrigger */ } from '@/components/ui/tabs';
import { Location, Shop } from '@/types/MapTypes';

export const Paris2024Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | Shop | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<Record<string, boolean>>({
    olympic: true,
    paralympic: false,
    shops: true,
  });

  const mapRef = useRef<MapRef | null>(null);

  const onSelectCity = useCallback(({ lat, lon }: { lat: number; lon: number }) => {
    mapRef.current?.flyTo({ center: [lon, lat], zoom: 17, duration: 3000 });
  }, []);

  const handlePinClick = (location: Location | Shop) => {
    setSelectedLocation(location);
  };

  const handleCardClick = (location: Location | Shop) => {
    setSelectedLocation(location);
  };

  useEffect(() => {
    if (selectedLocation) {
      if ('point_geo' in selectedLocation) onSelectCity(selectedLocation.point_geo);
      if ('localisation_geographique' in selectedLocation)
        onSelectCity(selectedLocation.localisation_geographique);
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
                      setSelectedFilter({
                        ...selectedFilter,
                        olympic: checked,
                        paralympic: !checked,
                      })
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
                      setSelectedFilter({
                        ...selectedFilter,
                        paralympic: checked,
                        olympic: !checked,
                      })
                    }
                  />
                  <label
                    htmlFor="terms2"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Paralympics venues
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shops"
                    checked={selectedFilter.shops}
                    onCheckedChange={(checked: boolean) =>
                      setSelectedFilter({ ...selectedFilter, shops: checked })
                    }
                  />
                  <label
                    htmlFor="terms3"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Official shops
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
