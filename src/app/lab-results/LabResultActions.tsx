'use client';

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { TestTube } from "lucide-react";
import { submitLabTestAction } from "@/app/actions/form-actions";

export function LabResultActions() {
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
      action={submitLabTestAction}
      fieldLabel={{
        patientName: 'Patient Name',
        appointmentNotes: 'Test Requirements'
      }}
    />
  );
}