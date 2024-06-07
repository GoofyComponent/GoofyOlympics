import { EventSourceInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LoaderCircle, MapPin, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getFromSport, getSportsList } from '@/lib/sportsCode';
import { Event, EventForCalendar } from '@/types/CalendarTypes';

export const Calendar = () => {
  const availableSports = getSportsList();
  const [events, setEvents] = useState<EventSourceInput | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>(availableSports[0]);
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
    fetch(
      `https://api-olympics.stroyco.eu/api/events?page=1&limit=200&code_sport=${getFromSport(selectedSport)}`,
    )
      .then((res) => res.json())
      .then(({ events }: { events: Event[] }) => {
        const formattedEvents: EventForCalendar[] = [];

        events.forEach((event) => {
          const existingEventIndex = formattedEvents.findIndex(
            (e) =>
              e.title === event.sport &&
              e.start &&
              new Date(event.timestamp) >= e.start &&
              e.end &&
              new Date(event.timestamp) <= e.end,
          );

          if (existingEventIndex !== -1) {
            formattedEvents[existingEventIndex].end = new Date(
              new Date(event.timestamp).getTime() + 3 * 60 * 60 * 1000,
            );

            if (event.teams && event.teams.length > 0) {
              //@ts-expect-error formattedEvents[existingEventIndex].extendedProps.teams is any[]
              formattedEvents[existingEventIndex].extendedProps.teams.push(event.teams);
            }

            if (
              event.location &&
              //@ts-expect-error formattedEvents[existingEventIndex].extendedProps.teams is any[]
              !formattedEvents[existingEventIndex].extendedProps.location.includes(
                event.location,
              )
            ) {
              //@ts-expect-error formattedEvents[existingEventIndex].extendedProps.teams is any[]
              formattedEvents[existingEventIndex].extendedProps.location.push(
                event.location,
              );
            }
          } else {
            formattedEvents.push({
              id: event.id.toString(),
              title: event.sport,
              start: new Date(event.timestamp),
              end: new Date(new Date(event.timestamp).getTime() + 3 * 60 * 60 * 1000),
              editable: false,
              allDay: false,
              extendedProps: {
                location:
                  event.location && event.location.length > 0 ? [event.location] : null,
                code_site: event.code_site,
                code_sport: event.code_sport,
                for_medal: event.for_medal,
                medal_type: event.medal_type,
                teams: event.teams && event.teams?.length > 0 ? [event.teams] : null,
                type: event.type,
              },
            });
          }
        });

        setEvents(formattedEvents as EventSourceInput);
      });
  }, [selectedSport]);

  if (events === null /* || events.length === 0 */) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <LoaderCircle strokeWidth={1.25} size={64} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center space-x-4">
        <Select
          value={selectedSport}
          onValueChange={(value) => {
            setSelectedSport(value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Choose a sport</SelectLabel>
              {availableSports.map((sport) => {
                if (
                  sport.toLowerCase().includes('para') ||
                  sport.toLowerCase().includes('fauteuil') ||
                  sport.toLowerCase().includes('handisport') ||
                  sport.toLowerCase().includes('céci') ||
                  sport.toLowerCase().includes('assis')
                ) {
                  return null;
                }

                return (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        firstDay={1}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        validRange={{
          start: '2024-07-23',
          end: '2024-08-12',
        }}
        initialDate={'2024-07-24'}
        slotMinTime={'07:00:00'}
        slotMaxTime={'23:00:00'}
        slotDuration={'01:00:00'}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short',
          hour12: false,
        }}
        expandRows={true}
        height={!isMobile ? '70vh' : 'auto'}
        allDaySlot={false}
        /*         eventMouseEnter={(arg) => {
          console.log(arg.event);
        }}
        eventMouseLeave={(arg) => {
          console.log('sortie');
        }} */
        eventContent={renderEventContent}
      />
    </div>
  );
};

function renderEventContent(eventInfo: { timeText: string; event: EventForCalendar }) {
  const { extendedProps } = eventInfo.event || {};
  const { teams, location } = extendedProps || {};

  return (
    <>
      <div className="flex flex-col">
        <p className="font-bold">{eventInfo.event.title}</p>
        <p className="">{eventInfo.timeText}</p>
      </div>

      <div>
        {teams && teams.length !== 0 && (
          <>
            <p className="font-bold flex">Teams:</p>
            {teams.map((team: string[], index: number) => {
              if (index === 3) {
                return <p className="test-sm text-right">+ {teams.length - 3} more</p>;
              }
              if (index < 3 && team.length > 0) {
                return <p className="test-sm italic">&bull; {team.join(' vs ')}</p>;
              }
              if (index > 3) {
                return null;
              }
              return <p className="test-sm italic">No team provided yet</p>;
            })}
          </>
        )}
        {location && location?.length !== 0 ? (
          <>
            <p className="font-bold flex">
              <MapPin size={15} strokeWidth={2} /> Location:
            </p>
            {location.map((location: string, index: number) => {
              if (index === 1)
                return <p className="test-sm text-right">+ {location.length - 1} more</p>;
              if (index < 1 && location.length > 0) {
                return <p className="test-sm italic">&bull; {location}</p>;
              }
            })}
          </>
        ) : (
          <p className="test-sm italic">No location provided yet</p>
        )}

        {eventInfo.event.extendedProps && eventInfo.event.extendedProps.for_medal && (
          <p className="italic flex">
            <Medal size={15} strokeWidth={1.5} />
            {eventInfo.event.extendedProps &&
              eventInfo.event.extendedProps.medal_type &&
              ` ${eventInfo.event.extendedProps.medal_type}`}
          </p>
        )}
      </div>
    </>
  );
}
