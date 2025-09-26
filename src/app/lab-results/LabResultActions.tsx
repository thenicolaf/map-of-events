'use client';

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { TestTube } from "lucide-react";

export function LabResultActions() {
  const handleRequestTest = async (formData: { patientName: string; appointmentNotes: string; documentFile: File | null }) => {
    // Simulate requesting a new lab test
    console.log('Lab test requested:', formData);
    if (formData.documentFile) {
      console.log('File uploaded:', formData.documentFile.name);
    }
  };

  return (
    <Modal
      trigger={
        <Button>
          <TestTube className="h-4 w-4" />
          Request Test
        </Button>
      }
      title="Request Lab Test"
      description="Enter patient information and test requirements. Upload any relevant medical history."
      onSubmit={handleRequestTest}
    />
  );
}