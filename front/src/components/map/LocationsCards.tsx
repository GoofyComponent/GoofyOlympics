import clsx from 'clsx';
import { MapPin, MapPinned, Store } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Location, Shop } from '@/types/MapTypes';

export const EventLocationCard = ({
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
            <p className="mr-2 hidden md:block">View on Google Maps</p>
            <MapPinned />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ShopCard = ({
  shop,
  isSelected,
  onCardClick,
}: {
  shop: Shop;
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
          <Store size="24" strokeWidth={1.5} className="text-[#800020]" />
          <p className="italic font-light">Shop</p>
        </div>
        <div className="px-2 mb-2">
          <p className="font-bold">{shop.title}</p>
          <div>
            <h4 className="underline italic">Address :</h4>
            <p>{shop.address}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-end px-1 py-1">
        <Button variant={'outline'} asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`}
            target="_blank"
            className="flex items-center justify-end"
          >
            <p className="mr-2 hidden md:block">View on Google Maps</p>
            <MapPinned />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
