'use client';

import { Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LabResult {
  id: string;
  patient: string;
  patientId: string;
  testType: string;
  labId: string;
  category: string;
  status: 'Critical' | 'Completed' | 'Pending';
  priority: string;
}

const labResults: LabResult[] = [
  {
    id: "1",
    patient: "Maria Rodriguez",
    patientId: "P-2024-001",
    testType: "Complete Blood Count (CBC)",
    labId: "LAB-001",
    category: "Hematology",
    status: "Critical",
    priority: "ST"
  },
  {
    id: "2",
    patient: "John Smith",
    patientId: "P-2024-002",
    testType: "Lipid Panel",
    labId: "LAB-002",
    category: "Chemistry",
    status: "Completed",
    priority: "RC"
  },
  {
    id: "3",
    patient: "Emily Chen",
    patientId: "P-2024-003",
    testType: "Thyroid Function Tests",
    labId: "LAB-003",
    category: "Endocrinology",
    status: "Pending",
    priority: "RC"
  },
  {
    id: "4",
    patient: "Robert Johnson",
    patientId: "P-2024-004",
    testType: "Liver Function Tests",
    labId: "LAB-004",
    category: "Chemistry",
    status: "Completed",
    priority: "UR"
  }
];

const getStatusVariant = (status: string): "destructive" | "secondary" | "outline" => {
  switch (status) {
    case 'Critical':
      return 'destructive';
    case 'Completed':
      return 'secondary';
    case 'Pending':
      return 'outline';
    default:
      return 'outline';
  }
};

export function LabResultsTable() {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Lab Results</h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search results..."
              className="pl-10 w-48 sm:w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Filter className="h-4 w-4 mr-2" />
                All Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Status</DropdownMenuItem>
              <DropdownMenuItem>Critical</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
              <DropdownMenuItem>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="h-4 w-4 mr-2" />
                All Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Priority</DropdownMenuItem>
              <DropdownMenuItem>STAT</DropdownMenuItem>
              <DropdownMenuItem>Routine</DropdownMenuItem>
              <DropdownMenuItem>Urgent</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pri</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{result.patient}</p>
                  <p className="text-sm text-muted-foreground">{result.patientId}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{result.testType}</p>
                  <p className="text-sm text-muted-foreground">{result.labId}</p>
                </div>
              </TableCell>
              <TableCell>{result.category}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(result.status)}>
                  {result.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{result.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}