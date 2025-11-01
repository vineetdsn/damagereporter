import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReportPreview from "@/components/ReportPreview";
import { ArrowLeft, Download, Mail, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Report } from "@shared/schema";

export default function ReportView() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const reportId = params.id;

  const { data: report, isLoading } = useQuery<Report>({
    queryKey: ['/api/reports', reportId],
    enabled: !!reportId,
  });

  const downloadPDFMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", `/api/reports/${reportId}/pdf`);
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vehicle-damage-report-${report?.referenceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const emailReportMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", `/api/reports/${reportId}/email`, { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Report has been sent via email successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Email Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEmailReport = () => {
    const email = prompt("Enter email address to send report:");
    if (email) {
      emailReportMutation.mutate(email);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested report could not be found.</p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                <i className="fas fa-car-crash text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VehicleClaim Pro</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Report Viewer</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <Card className="p-4 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-sm print:hidden">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              data-testid="button-back-form"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
            <Badge variant="secondary" data-testid="badge-report-status">
              {report.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => window.print()}
              data-testid="button-print"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={() => downloadPDFMutation.mutate()}
              disabled={downloadPDFMutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-testid="button-download-pdf"
            >
              {downloadPDFMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={handleEmailReport}
              disabled={emailReportMutation.isPending}
              data-testid="button-email-report"
            >
              {emailReportMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Report
                </>
              )}
            </Button>
          </div>
        </Card>

        <ReportPreview report={report} />
      </main>
    </div>
  );
}
