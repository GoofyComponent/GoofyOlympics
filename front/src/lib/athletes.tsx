import { Athlete } from '@/model/Athlete';

const athletes: Athlete[] = null!;

// let athletesPromise: Promise<void>;

const ensureAthletes = async () => {
  try {
    const athletesPromise = fetch('https://api-olympics.stroyco.eu/protected', {
      credentials: 'include',
    });

    await athletesPromise.then((res) => {
      console.log('res', res);
      return;
    });
  } catch (error) {
    console.error('An error occurred while fetching athletes:', error);
  }
  return athletes;
};

export async function fetchAthletes() {
  const athletes = await ensureAthletes();

  return athletes;
}

export async function fetchAthletesById(id: number) {
  const athletes = await ensureAthletes();

  return athletes.find((athlete) => athlete.id === id);
}
