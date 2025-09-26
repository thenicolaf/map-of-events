'use client';

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { UserPlus } from "lucide-react";

export function DashboardActions() {
  const handleAddRecord = async (formData: { patientName: string; appointmentNotes: string; documentFile: File | null }) => {
    // Simulate adding a new dashboard record
    console.log('Dashboard record added:', formData);
    if (formData.documentFile) {
      console.log('File uploaded:', formData.documentFile.name);
    }
  };

  return (
    <Modal
      trigger={
        <Button>
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      }
      title="Add New Patient Record"
      description="Enter patient information and upload any relevant medical documents."
      onSubmit={handleAddRecord}
    />
  );
}