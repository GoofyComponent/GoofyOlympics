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
  height: number | null;
  weight: number | null;
  sex: string;
  team: string;
}

export default function AthletesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAthletes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api-olympics.stroyco.eu/api/athletes?page=${currentPage}&limit=${itemsPerPage}`,
        );
        const data = await response.json();

        console.log('API Response:', data);

        setAthletes(data.athletes || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      } catch (error) {
        console.error('Erreur lors du chargement des athlètes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletes();
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
                <TableHead>Taille</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>Sexe</TableHead>
                <TableHead>Équipe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell>{athlete.name}</TableCell>
                  <TableCell>{athlete.noc}</TableCell>
                  <TableCell>{athlete.age}</TableCell>
                  <TableCell>{athlete.height || 'N/A'}</TableCell>
                  <TableCell>{athlete.weight || 'N/A'}</TableCell>
                  <TableCell>{athlete.sex}</TableCell>
                  <TableCell>{athlete.team}</TableCell>
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
