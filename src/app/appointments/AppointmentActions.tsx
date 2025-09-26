'use client';

import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/ui/modal";
import { Calendar } from "lucide-react";

export function AppointmentActions() {
  const handleNewAppointment = async (formData: { patientName: string; appointmentNotes: string; documentFile: File | null }) => {
    // Simulate adding a new appointment
    console.log('New appointment created:', formData);
    if (formData.documentFile) {
      console.log('File uploaded:', formData.documentFile.name);
    }
  };

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
      onSubmit={handleNewAppointment}
    />
  );
}