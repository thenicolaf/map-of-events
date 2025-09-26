'use client';

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { UserPlus } from "lucide-react";
import { submitPatientAction } from "@/app/actions/form-actions";

export function DashboardActions() {
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
      action={submitPatientAction}
      fieldLabel={{
        patientName: 'Patient Name',
        appointmentNotes: 'Medical Notes'
      }}
    />
  );
}