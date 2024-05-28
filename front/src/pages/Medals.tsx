import { useLoaderData } from '@tanstack/react-router';
import { ChevronsLeft, ChevronsRight, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
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

interface Medal {
  medal: string;
  count: string;
}

export default function MedalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const medals = useLoaderData({ from: '/_mainapp/countries' });
  const medalsResp: {
    [nocCodes: string]: Medal[];
  } = medals.medals.medals;

  useEffect(() => {
    if (medalsResp) {
      setIsLoading(false);
    }
  }, [medalsResp]);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: 'country',
    direction: 'ascending',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const nocCodes = Object.keys(medalsResp);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredNocCodes = nocCodes.filter((nocCode) =>
    nocCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedNocCodes = [...filteredNocCodes].sort((a, b) => {
    if (sortConfig !== null) {
      if (sortConfig.key === 'country') {
        return sortConfig.direction === 'ascending'
          ? a.localeCompare(b)
          : b.localeCompare(a);
      } else if (sortConfig.key === 'total') {
        const totalA = medalsResp[a].reduce((acc, medal) => acc + Number(medal.count), 0);
        const totalB = medalsResp[b].reduce((acc, medal) => acc + Number(medal.count), 0);
        return sortConfig.direction === 'ascending' ? totalA - totalB : totalB - totalA;
      }
    }
    return 0;
  });

  const paginatedNocCodes = sortedNocCodes.slice(
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
        <div className="container py-8  ">
          <div className="flex justify-between py-4 flex-col md:flex-row">
            <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold">
              Medailles par pays
            </h1>
            <div className=" flex">
              <Input
                className="w-11/12  md:ml-auto mt-4"
                placeholder="Rechercher un pays"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <Table>
            <TableCaption>Liste des medailles par pays</TableCaption>
            <TableHeader>
              <TableRow className="select-none">
                <TableHead
                  className="w-[300px] cursor-pointer nose select-none"
                  onClick={() => handleSort('country')}
                >
                  <span className="flex items-center ">
                    Pays
                    <ChevronsUpDown size={16} className="ml-2" />
                  </span>
                </TableHead>
                <TableHead className="w-[100px] text-2xl text-center">🥇</TableHead>
                <TableHead className="w-[100px] text-2xl text-center">🥈</TableHead>
                <TableHead className="w-[100px] text-2xl text-center">🥉</TableHead>
                <TableHead
                  className="text-right cursor-pointer select-none"
                  onClick={() => handleSort('total')}
                >
                  <span className="flex items-center justify-end ">
                    Totale
                    <ChevronsUpDown size={16} className="ml-2" />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNocCodes.map((nocCode, i) => {
                const medalCounts = medalsResp[nocCode].reduce(
                  (acc, medal) => {
                    acc[medal.medal] = Number(medal.count);
                    acc.total += acc[medal.medal];
                    return acc;
                  },
                  { total: 0, Gold: 0, Silver: 0, Bronze: 0 } as {
                    [key: string]: number;
                  },
                );

                return (
                  <TableRow key={i}>
                    <TableCell>{nocCode}</TableCell>
                    <TableCell className="text-center">
                      {medalCounts['Gold'] || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {medalCounts['Silver'] || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {medalCounts['Bronze'] || 0}
                    </TableCell>
                    <TableCell className="text-center sm:text-right">
                      {medalCounts.total}
                    </TableCell>
                  </TableRow>
                );
              })}
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
              {currentPage === 1
                ? [...Array(3)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        className={currentPage === i + 1 ? 'bg-gray-200' : ''}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                : currentPage === Math.ceil(nocCodes.length / itemsPerPage)
                  ? [...Array(3)].map((_, i) => {
                      const page = Math.ceil(nocCodes.length / itemsPerPage) - 2 + i;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 'bg-gray-200' : ''}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })
                  : [...Array(3)].map((_, i) => {
                      const page = currentPage - 1 + i;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            className={currentPage === page ? 'bg-gray-200' : ''}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
              <PaginationNext
                onClick={() =>
                  handlePageChange(
                    currentPage < Math.ceil(nocCodes.length / itemsPerPage)
                      ? currentPage + 1
                      : currentPage,
                  )
                }
              />
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    handlePageChange(Math.ceil(nocCodes.length / itemsPerPage))
                  }
                >
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
