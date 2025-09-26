import { Button } from "@/components/ui/button";
import { Navigation } from "@/shared/ui/navigation";
import { commentsApi } from "@/shared/api";
import type { Comment } from "@/entities";
import { LabResultActions } from "./LabResultActions";

interface LabResult extends Comment {
  testType: string;
  result: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
  patientId: number;
  reference: string;
}

async function getLabResults(): Promise<LabResult[]> {
  try {
    const comments = await commentsApi.getComments();

    const testTypes = ['Blood Glucose', 'Cholesterol', 'Blood Pressure', 'Hemoglobin', 'Creatinine', 'Liver Function'];
    const references = ['70-100 mg/dL', '<200 mg/dL', '120/80 mmHg', '12-16 g/dL', '0.6-1.2 mg/dL', 'Normal'];

    // Transform comments into lab results with additional medical fields
    return comments.slice(0, 15).map((comment, index) => ({
      ...comment,
      testType: testTypes[index % testTypes.length],
      result: generateResult(index),
      status: (['normal', 'abnormal', 'critical'] as const)[index % 3],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0],
      patientId: comment.postId,
      reference: references[index % references.length]
    }));
  } catch (error) {
    console.error('Failed to fetch lab results:', error);
    return []; // Return empty array on error for ISR fallback
  }
}

function generateResult(index: number): string {
  const results = ['85 mg/dL', '180 mg/dL', '140/90 mmHg', '14.2 g/dL', '1.1 mg/dL', 'Elevated'];
  return results[index % results.length];
}

export default async function LabResultsPage() {
  const labResults = await getLabResults();
  const currentTime = new Date().toLocaleString();

  const getStatusColor = (status: LabResult['status']) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'abnormal': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    }
  };

  const getStatusIcon = (status: LabResult['status']) => {
    switch (status) {
      case 'normal': return '✅';
      case 'abnormal': return '⚠️';
      case 'critical': return '🚨';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        title="Lab Results"
        actionButton={<LabResultActions />}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Laboratory Test Results</h2>
            <p className="text-sm text-muted-foreground">
              Incremental Static Regeneration (ISR) - Revalidates every 60 seconds
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {currentTime}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-green-600">Normal Results</h3>
            <p className="text-2xl font-bold">{labResults.filter(r => r.status === 'normal').length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-yellow-600">Abnormal Results</h3>
            <p className="text-2xl font-bold">{labResults.filter(r => r.status === 'abnormal').length}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-red-600">Critical Results</h3>
            <p className="text-2xl font-bold">{labResults.filter(r => r.status === 'critical').length}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {labResults.map((result) => (
            <div key={result.id} className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{result.testType}</h3>
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Patient ID: {result.patientId} • Test ID: {result.id}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                  {result.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Result Value</p>
                  <p className="font-semibold">{result.result}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reference Range</p>
                  <p className="font-semibold">{result.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Test Date</p>
                  <p className="font-semibold">{result.date}</p>
                </div>
              </div>

              {result.body && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Doctor&apos;s Notes</p>
                  <p className="text-sm bg-muted/50 p-3 rounded">{result.body}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button size="sm">View Details</Button>
                <Button size="sm" variant="outline">Download Report</Button>
                <Button size="sm" variant="outline">Share</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔄 This page uses Incremental Static Regeneration (ISR) - Statically generated but revalidated every 60 seconds
          </p>
        </div>
      </main>
    </div>
  );
}

// ISR: This page will be regenerated every 60 seconds
export const revalidate = 60;