import { useLoaderData } from '@tanstack/react-router';
import { ChevronsLeft, ChevronsRight, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/paginationCustom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Athlete {
  id: number;
  name: string;
  noc: string;
  age: number;
  city: string;
  event: string;
  games: string;
  height: number | null;
  medal: string;
  season: string;
  sex: string;
  sport: string;
  team: string;
  weight: number | null;
  year: number;
}

export default function AthletesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const athletesData = useLoaderData({ from: '/_mainapp/athletes' });

  console.log('Athletes data:', athletesData);

  const athletes: Athlete[] = athletesData.athletes.athletes;
  const itemsPerPage = parseInt(athletesData.athletes.currentLimit);
  const totalPages = Math.ceil(athletes.length / itemsPerPage);

  useEffect(() => {
    if (athletes.length > 0) {
      setIsLoading(false);
    }
  }, [athletes]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedAthletes = athletes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen ">
          <LoaderCircle strokeWidth={1.25} size={64} className="animate-spin" />
        </div>
      ) : (
        <div className="container py-8">
          <Table>
            <TableCaption>Liste des athlètes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>NOC</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Événement</TableHead>
                <TableHead>Jeux</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Médaille</TableHead>
                <TableHead>Saison</TableHead>
                <TableHead>Sexe</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Équipe</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>Année</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAthletes.map((athlete, index) => (
                <TableRow key={athlete.id || index}>
                  <TableCell>{athlete.name}</TableCell>
                  <TableCell>{athlete.noc}</TableCell>
                  <TableCell>{athlete.age}</TableCell>
                  <TableCell>{athlete.city}</TableCell>
                  <TableCell>{athlete.event}</TableCell>
                  <TableCell>{athlete.games}</TableCell>
                  <TableCell>{athlete.height || 'N/A'}</TableCell>
                  <TableCell>{athlete.medal}</TableCell>
                  <TableCell>{athlete.season}</TableCell>
                  <TableCell>{athlete.sex}</TableCell>
                  <TableCell>{athlete.sport}</TableCell>
                  <TableCell>{athlete.team}</TableCell>
                  <TableCell>{athlete.weight || 'N/A'}</TableCell>
                  <TableCell>{athlete.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  <ChevronsLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)
                }
              />
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'bg-gray-200' : ''}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    currentPage < totalPages ? currentPage + 1 : currentPage,
                  )
                }
              />
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
