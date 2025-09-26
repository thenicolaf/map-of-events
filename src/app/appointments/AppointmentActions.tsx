'use client';

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { Calendar } from "lucide-react";
import { submitAppointmentAction } from "@/app/actions/form-actions";

export function AppointmentActions() {
  return (
    <Modal
      trigger={
        <Button>
          <Calendar className="h-4 w-4" />
          New Appointment
        </Button>
      }
      title="Schedule New Appointment"
      description="Enter patient information and appointment details."
      action={submitAppointmentAction}
      fieldLabel={{
        patientName: 'Patient Name',
        appointmentNotes: 'Appointment Details'
      }}
    />
  );
}