import { labResultsApi } from "@/shared/api";
import type { LabResult } from "@/shared/types/medical";
import { LabResultActions } from "./LabResultActions";
import { ClientLabPagination } from "./ClientLabPagination";

async function getLabResults(): Promise<LabResult[]> {
  try {
    const labResults = await labResultsApi.getLabResults();
    return labResults;
  } catch (error) {
    console.error('Failed to fetch lab results:', error);
    return []; // Return empty array on error for ISR fallback
  }
}

export default async function LabResultsPage() {
  const labResults = await getLabResults();
  const currentTime = new Date().toLocaleString();

  // Helper function to get result status from test results
  const getResultStatus = (labResult: LabResult): 'normal' | 'abnormal' | 'critical' => {
    if (labResult.status === 'critical') return 'critical';
    const hasCritical = labResult.results.some(r => r.status === 'critical');
    if (hasCritical) return 'critical';
    const hasAbnormal = labResult.results.some(r => r.status === 'abnormal' || r.status === 'high' || r.status === 'low');
    if (hasAbnormal) return 'abnormal';
    return 'normal';
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lab Results</h1>
            <p className="text-sm text-muted-foreground">
              Incremental Static Regeneration (ISR) - Revalidates every 60 seconds
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {currentTime}
            </div>
            <LabResultActions />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-green-600">Normal Results</h3>
            <p className="text-2xl font-bold">{labResults.filter(r => getResultStatus(r) === 'normal').length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-yellow-600">Abnormal Results</h3>
            <p className="text-2xl font-bold">{labResults.filter(r => getResultStatus(r) === 'abnormal').length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-red-600">Critical Results</h3>
            <p className="text-2xl font-bold">{labResults.filter(r => getResultStatus(r) === 'critical').length}</p>
          </div>
        </div>

        <ClientLabPagination labResults={labResults} />

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔄 This page uses Incremental Static Regeneration (ISR) - Statically generated but revalidated every 60 seconds with client-side pagination
          </p>
        </div>
      </main>
    </div>
  );
}

// ISR: This page will be regenerated every 60 seconds
export const revalidate = 60;