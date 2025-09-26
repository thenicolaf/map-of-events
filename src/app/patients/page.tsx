"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { useState, useEffect } from "react";
import { usersApi, ApiError } from "@/shared/api";
import type { User } from "@/entities";
import { UserPlus } from "lucide-react";
import { submitPatientAction } from "@/app/actions/form-actions";

interface Patient extends User {
  age: number;
  condition: string;
  lastVisit: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const users = await usersApi.getUsers();

        // Transform users into patients with additional medical fields
        const transformedPatients: Patient[] = users.map((user, index) => ({
          ...user,
          age: 25 + Math.floor(Math.random() * 50),
          condition: [
            "Hypertension",
            "Diabetes",
            "Asthma",
            "Healthy",
            "Arthritis",
          ][index % 5],
          lastVisit: new Date(
            Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        }));

        setPatients(transformedPatients);
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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientSubmission = async (
    state: unknown,
    formData: FormData
  ) => {
    const result = await submitPatientAction(null, formData);

    if (result.success && result.data) {
      // Add to local patients list for UI update
      const newPatient: Patient = {
        id: Math.max(...patients.map((p) => p.id), 0) + 1,
        name: result.data.patientName as string,
        username: (result.data.patientName as string)
          .toLowerCase()
          .replace(/\s+/g, ""),
        email: `${(result.data.patientName as string)
          .toLowerCase()
          .replace(/\s+/g, ".")}@example.com`,
        phone: "(555) 123-4567",
        website: "example.com",
        address: {
          street: "123 Main St",
          suite: "Apt. 1",
          city: "Anytown",
          zipcode: "12345",
          geo: {
            lat: "40.7128",
            lng: "-74.0060",
          },
        },
        company: {
          name: "Health Insurance Co.",
          catchPhrase: "Your health, our priority",
          bs: "innovative healthcare solutions",
        },
        age: 25 + Math.floor(Math.random() * 50),
        condition: "Healthy",
        lastVisit: new Date().toISOString().split("T")[0],
      };

      setPatients((prev) => [newPatient, ...prev]);
    }

    return result;
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "healthy":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "hypertension":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
      case "diabetes":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    }
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

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
          <Button variant="outline">Filter</Button>
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
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Age: {patient.age} • ID: {patient.id}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                      patient.condition
                    )}`}
                  >
                    {patient.condition}
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
                      <span className="font-medium">Last Visit:</span>{" "}
                      {patient.lastVisit}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {patient.address.street}, {patient.address.city}
                    </p>
                    <p>
                      <span className="font-medium">Insurance:</span>{" "}
                      {patient.company.name}
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
            ))}
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💻 This page uses Client Side Rendering (CSR) - Data is fetched in
            the browser using React hooks
          </p>
        </div>
      </main>
    </div>
  );
}
