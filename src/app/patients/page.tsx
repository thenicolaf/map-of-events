"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { useState, useEffect } from "react";
import { patientsApi, ApiError } from "@/shared/api";
import type { Patient } from "@/shared/types/medical";
import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { submitPatientAction } from "@/app/actions/form-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilter } from '@/shared/ui/search-filter';
import { useUnifiedSearch } from '@/shared/hooks';
import type { SearchFilterOption } from '@/shared/types/search';
import { MEDICAL_FILTERS } from '@/shared/types/search';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Define search fields and filters for patients
  const searchFields = [
    'fullName',
    'firstName',
    'lastName',
    'email',
    'phone',
    'medicalHistory.condition',
    'allergies',
    'medications',
    'address.city',
    'address.state',
    'insuranceInfo.provider'
  ];

  const filters: SearchFilterOption[] = [
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      options: [...MEDICAL_FILTERS.GENDER]
    },
    {
      key: 'medicalHistory.condition',
      label: 'Medical Condition',
      type: 'checkbox',
      options: [
        { value: 'healthy', label: 'Healthy' },
        { value: 'hypertension', label: 'Hypertension' },
        { value: 'diabetes', label: 'Diabetes' },
        { value: 'asthma', label: 'Asthma' },
        { value: 'coronary artery disease', label: 'Coronary Artery Disease' },
        { value: 'arthritis', label: 'Arthritis' },
        { value: 'depression', label: 'Depression' }
      ]
    },
    {
      key: 'address.state',
      label: 'State',
      type: 'select',
      options: [
        { value: 'ma', label: 'Massachusetts' },
        { value: 'ny', label: 'New York' },
        { value: 'ca', label: 'California' },
        { value: 'tx', label: 'Texas' },
        { value: 'fl', label: 'Florida' }
      ]
    },
    {
      key: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date'
    }
  ];

  // Use unified search hook
  const {
    searchQuery,
    filters: activeFilters,
    filteredData: filteredPatients,
    setSearchQuery,
    setFilters,
    clearAll
  } = useUnifiedSearch({
    data: patients,
    searchFields,
    caseSensitive: false
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientsData = await patientsApi.getPatients();
        setPatients(patientsData);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? `API Error (${err.status}): ${err.message}`
            : "Failed to fetch patients data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);


  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePatientSubmission = async (
    _state: unknown,
    formData: FormData
  ) => {
    const result = await submitPatientAction(null, formData);

    if (result.success && result.data) {
      // Create a proper patient object that matches the medical schema
      const patientName = result.data.patientName as string;
      const [firstName, ...lastNameParts] = patientName.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      const newPatient: Patient = {
        id: `P-${Date.now()}`,
        firstName,
        lastName,
        fullName: patientName,
        email: `${patientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: "(555) 123-4567",
        dateOfBirth: "1990-01-01",
        gender: "other" as const,
        address: {
          street: "123 Main St",
          city: "Boston",
          state: "MA",
          zipCode: "02101",
          country: "USA"
        },
        emergencyContact: {
          name: "Emergency Contact",
          relationship: "family",
          phone: "(555) 987-6543"
        },
        medicalHistory: [],
        allergies: [],
        medications: [],
        insuranceInfo: {
          provider: "Health Insurance Co.",
          policyNumber: `POL-${Date.now()}`,
          expirationDate: "2024-12-31"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPatients((prev) => [newPatient, ...prev]);
    }

    return result;
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "healthy":
      case "normal":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "hypertension":
      case "high blood pressure":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
      case "diabetes":
      case "type 2 diabetes":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "asthma":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      case "coronary artery disease":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  // Helper function to get primary condition from medical history
  const getPrimaryCondition = (patient: Patient): string => {
    if (patient.medicalHistory.length === 0) return "Healthy";
    return patient.medicalHistory[0].condition;
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-sm text-muted-foreground">
              Client Side Rendering (CSR) - Data fetched on client
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${filteredPatients.length} patients`}
            </div>
            <Modal
              trigger={
                <Button>
                  <UserPlus className="h-4 w-4" />
                  Add Patient
                </Button>
              }
              title="Add New Patient"
              description="Enter patient information and upload any relevant documents."
              action={handlePatientSubmission}
            />
          </div>
        </div>

        {/* Enhanced Search and Filter Controls */}
        <div className="mb-6">
          <SearchFilter
            searchFields={searchFields}
            searchPlaceholder="Search patients by name, email, phone, medical conditions, address, or insurance..."
            filters={filters}
            onSearch={setSearchQuery}
            onFilter={setFilters}
            onClear={clearAll}
            defaultSearchValue=""
            loading={loading}
          />
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-lg p-6 border border-border animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedPatients.map((patient) => {
              const primaryCondition = getPrimaryCondition(patient);
              const age = calculateAge(patient.dateOfBirth);

              return (
                <div
                  key={patient.id}
                  className="bg-card rounded-lg p-6 border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{patient.fullName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Age: {age} • ID: {patient.id} • {patient.gender}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                        primaryCondition
                      )}`}
                    >
                      {primaryCondition}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {patient.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {patient.phone}
                      </p>
                      <p>
                        <span className="font-medium">DOB:</span>{" "}
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {patient.address.street}, {patient.address.city}
                      </p>
                      <p>
                        <span className="font-medium">Insurance:</span>{" "}
                        {patient.insuranceInfo.provider}
                      </p>
                      <p>
                        <span className="font-medium">Emergency:</span>{" "}
                        {patient.emergencyContact.name} ({patient.emergencyContact.phone})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm">View Records</Button>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filteredPatients.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>of {filteredPatients.length} patients</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-1 text-sm text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💻 This page uses Client Side Rendering (CSR) - Data is fetched in the browser with pagination
          </p>
        </div>
      </main>
    </div>
  );
}
