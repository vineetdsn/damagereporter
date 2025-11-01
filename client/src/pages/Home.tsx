import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VehicleForm from "@/components/VehicleForm";
import PhotoUpload from "@/components/PhotoUpload";
import { InsertReport } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Smartphone, FileText } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<InsertReport>>({
    photoUrls: []
  });

  const createReportMutation = useMutation({
    mutationFn: async (data: InsertReport) => {
      const response = await apiRequest("POST", "/api/reports", data);
      return response.json();
    },
    onSuccess: (report) => {
      toast({
        title: "Report Created Successfully",
        description: `Reference number: ${report.referenceNumber}`,
      });
      setLocation(`/report/${report.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields and upload at least one photo.",
        variant: "destructive",
      });
      return;
    }

    createReportMutation.mutate(formData as InsertReport);
  };

  const isFormValid = () => {
    const required = ['licensePlate', 'make', 'model', 'year', 'incidentDate', 'description', 'reporterName', 'reporterPhone', 'reporterEmail'];
    return required.every(field => formData[field as keyof InsertReport]) && 
           formData.photoUrls && formData.photoUrls.length > 0;
  };

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
                <p className="text-xs text-muted-foreground hidden sm:block">Automated Damage Reports</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/")}
                data-testid="button-new-report"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Report</span>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/dashboard")}
                data-testid="button-dashboard"
              >
                <i className="fas fa-table mr-2"></i>
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 sm:p-12 mb-8 text-primary-foreground shadow-lg">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">File a Damage Claim</h2>
            <p className="text-blue-100 text-lg mb-6">Complete your vehicle damage report in under 2 minutes. Upload photos, fill in details, and generate a professional PDF instantly.</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <Clock className="w-4 h-4" />
                <span>2-min process</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile friendly</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <i className="fas fa-file-pdf"></i>
                <span>Auto PDF generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</div>
                <div>
                  <div className="font-semibold text-sm">Vehicle Details</div>
                  <div className="text-xs text-muted-foreground">Basic information</div>
                </div>
              </div>
              <div className="flex-1 h-1 bg-border mx-4 hidden sm:block"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">2</div>
                <div>
                  <div className="font-semibold text-sm">Upload Photos</div>
                  <div className="text-xs text-muted-foreground">Damage evidence</div>
                </div>
              </div>
              <div className="flex-1 h-1 bg-border mx-4 hidden sm:block"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">3</div>
                <div>
                  <div className="font-semibold text-sm">Generate Report</div>
                  <div className="text-xs text-muted-foreground">Review & download</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <VehicleForm 
              data={formData}
              onChange={setFormData}
            />
            
            <PhotoUpload 
              photoUrls={formData.photoUrls || []}
              onChange={(urls) => setFormData(prev => ({ ...prev, photoUrls: urls }))}
            />

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSubmit}
                disabled={createReportMutation.isPending || !isFormValid()}
                className="flex-1 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                data-testid="button-generate-report"
              >
                {createReportMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-pdf mr-2"></i>
                    Generate Report
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none border-2 border-border bg-card text-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-muted transition-all"
                data-testid="button-save-draft"
              >
                <i className="fas fa-save mr-2"></i>
                Save Draft
              </Button>
            </div>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            <Card className="bg-accent/10 border-accent/20 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-accent-foreground">
                  <i className="fas fa-lightbulb text-accent mr-2"></i>
                  Photo Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="text-accent mt-0.5 mr-2 w-4 h-4 flex-shrink-0" />
                    <span>Capture all angles of the damage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-accent mt-0.5 mr-2 w-4 h-4 flex-shrink-0" />
                    <span>Include vehicle identification (plate/VIN)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-accent mt-0.5 mr-2 w-4 h-4 flex-shrink-0" />
                    <span>Take photos in good lighting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-accent mt-0.5 mr-2 w-4 h-4 flex-shrink-0" />
                    <span>Show context (surroundings)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-accent mt-0.5 mr-2 w-4 h-4 flex-shrink-0" />
                    <span>Close-ups of specific damage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Process Time</span>
                    <span className="font-semibold text-lg text-green-600">&lt; 2 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Photos</span>
                    <span className="font-semibold text-lg">10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Size</span>
                    <span className="font-semibold text-lg">5MB each</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
