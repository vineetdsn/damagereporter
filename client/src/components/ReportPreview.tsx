import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, AlertTriangle, Camera, User, Shield } from "lucide-react";
import type { Report } from "@shared/schema";

interface ReportPreviewProps {
  report: Report;
}

export default function ReportPreview({ report }: ReportPreviewProps) {
  const incidentDateTime = report.incidentTime 
    ? `${report.incidentDate} at ${report.incidentTime}`
    : report.incidentDate;

  return (
    <Card className="shadow-lg">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-8 rounded-t-lg">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Vehicle Damage Report</h2>
            <p className="text-blue-100">Professional Insurance Documentation</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-right">
            <div className="text-sm text-blue-100 mb-1">Reference Number</div>
            <div className="text-2xl font-mono font-bold" data-testid="text-reference-number">
              {report.referenceNumber}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        {/* Report Metadata */}
        <div className="grid sm:grid-cols-2 gap-6 pb-6 border-b border-border">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Report Generated</div>
            <div className="font-semibold" data-testid="text-generated-date">
              {format(new Date(report.createdAt!), 'MMMM dd, yyyy \'at\' h:mm a')}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100" data-testid="badge-status">
              <i className="fas fa-check-circle mr-2"></i>
              {report.status}
            </Badge>
          </div>
        </div>

        {/* Vehicle Information Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Car className="text-primary mr-3" />
            Vehicle Information
          </h3>
          <div className="bg-muted rounded-lg p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">License Plate</div>
                <div className="font-semibold text-lg" data-testid="text-license-plate">
                  {report.licensePlate}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Make & Model</div>
                <div className="font-semibold text-lg" data-testid="text-make-model">
                  {report.make} {report.model}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Year</div>
                <div className="font-semibold text-lg" data-testid="text-year">
                  {report.year}
                </div>
              </div>
              {report.color && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Color</div>
                  <div className="font-semibold" data-testid="text-color">
                    {report.color}
                  </div>
                </div>
              )}
              {report.vin && (
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">VIN</div>
                  <div className="font-mono text-sm" data-testid="text-vin">
                    {report.vin}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Incident Details Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <AlertTriangle className="text-accent mr-3" />
            Incident Details
          </h3>
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                <div className="font-semibold" data-testid="text-incident-datetime">
                  {incidentDateTime}
                </div>
              </div>
              {report.location && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  <div className="font-semibold" data-testid="text-location">
                    {report.location}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Description</div>
              <div className="text-foreground leading-relaxed" data-testid="text-description">
                {report.description}
              </div>
            </div>
          </div>
        </div>

        {/* Damage Documentation */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Camera className="text-primary mr-3" />
            Damage Documentation
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {report.photoUrls.map((url, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-muted rounded-lg p-4">
                  <img 
                    src={url} 
                    alt={`Damage documentation photo ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg mb-3"
                    data-testid={`img-damage-photo-${index}`}
                  />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Photo {index + 1} - Damage Evidence</div>
                    <div className="text-muted-foreground">
                      Submitted as part of damage claim documentation
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reporter Information Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <User className="text-primary mr-3" />
            Reported By
          </h3>
          <div className="bg-muted rounded-lg p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Name</div>
                <div className="font-semibold" data-testid="text-reporter-name">
                  {report.reporterName}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Contact Number</div>
                <div className="font-semibold" data-testid="text-reporter-phone">
                  {report.reporterPhone}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-semibold" data-testid="text-reporter-email">
                  {report.reporterEmail}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="pt-6 border-t border-border">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              This report is digitally verified and timestamped
            </div>
            <div>
              Generated by VehicleClaim Pro v1.0
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
