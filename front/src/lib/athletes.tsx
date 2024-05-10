import { Athlete } from '@/model/athlete';

let athletes: Athlete[] = null!;

// let athletesPromise: Promise<void>;

const ensureAthletes = async () => {
  try {
    const athletesPromise = fetch('https://jsonplaceholder.typicode.com/users');
    athletes = await athletesPromise.then((res) => res.json());
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
