import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Car, AlertTriangle, User } from "lucide-react";
import { InsertReport } from "@shared/schema";

interface VehicleFormProps {
  data: Partial<InsertReport>;
  onChange: (data: Partial<InsertReport>) => void;
}

export default function VehicleForm({ data, onChange }: VehicleFormProps) {
  const handleChange = (field: keyof InsertReport, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <>
      {/* Vehicle Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="text-primary mr-3" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="licensePlate" className="block text-sm font-medium mb-2">License Plate *</Label>
              <Input
                id="licensePlate"
                placeholder="ABC-1234"
                value={data.licensePlate || ''}
                onChange={(e) => handleChange('licensePlate', e.target.value)}
                data-testid="input-license-plate"
              />
            </div>
            <div>
              <Label htmlFor="vin" className="block text-sm font-medium mb-2">VIN (Optional)</Label>
              <Input
                id="vin"
                placeholder="1HGBH41JXMN109186"
                value={data.vin || ''}
                onChange={(e) => handleChange('vin', e.target.value)}
                data-testid="input-vin"
              />
            </div>
            <div>
              <Label htmlFor="make" className="block text-sm font-medium mb-2">Make *</Label>
              <Select value={data.make || ''} onValueChange={(value) => handleChange('make', value)}>
                <SelectTrigger data-testid="select-make">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="model" className="block text-sm font-medium mb-2">Model *</Label>
              <Input
                id="model"
                placeholder="Camry, Civic, F-150..."
                value={data.model || ''}
                onChange={(e) => handleChange('model', e.target.value)}
                data-testid="input-model"
              />
            </div>
            <div>
              <Label htmlFor="year" className="block text-sm font-medium mb-2">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                min="1900"
                max="2025"
                value={data.year || ''}
                onChange={(e) => handleChange('year', e.target.value)}
                data-testid="input-year"
              />
            </div>
            <div>
              <Label htmlFor="color" className="block text-sm font-medium mb-2">Color</Label>
              <Input
                id="color"
                placeholder="Blue, Silver, Red..."
                value={data.color || ''}
                onChange={(e) => handleChange('color', e.target.value)}
                data-testid="input-color"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="text-accent mr-3" />
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="incidentDate" className="block text-sm font-medium mb-2">Incident Date *</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={data.incidentDate || ''}
                  onChange={(e) => handleChange('incidentDate', e.target.value)}
                  data-testid="input-incident-date"
                />
              </div>
              <div>
                <Label htmlFor="incidentTime" className="block text-sm font-medium mb-2">Time (Optional)</Label>
                <Input
                  id="incidentTime"
                  type="time"
                  value={data.incidentTime || ''}
                  onChange={(e) => handleChange('incidentTime', e.target.value)}
                  data-testid="input-incident-time"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location" className="block text-sm font-medium mb-2">Location</Label>
              <Input
                id="location"
                placeholder="Street address or landmark"
                value={data.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                data-testid="input-location"
              />
            </div>
            <div>
              <Label htmlFor="description" className="block text-sm font-medium mb-2">Incident Description *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe what happened, damage observed, and any other relevant details..."
                value={data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={500}
                className="resize-none"
                data-testid="textarea-description"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">Be as detailed as possible</span>
                <span className="text-xs text-muted-foreground" data-testid="text-description-count">
                  {(data.description || '').length}/500
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reporter Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="text-primary mr-3" />
            Reporter Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="reporterName" className="block text-sm font-medium mb-2">Full Name *</Label>
              <Input
                id="reporterName"
                placeholder="John Doe"
                value={data.reporterName || ''}
                onChange={(e) => handleChange('reporterName', e.target.value)}
                data-testid="input-reporter-name"
              />
            </div>
            <div>
              <Label htmlFor="reporterPhone" className="block text-sm font-medium mb-2">Contact Number *</Label>
              <Input
                id="reporterPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={data.reporterPhone || ''}
                onChange={(e) => handleChange('reporterPhone', e.target.value)}
                data-testid="input-reporter-phone"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="reporterEmail" className="block text-sm font-medium mb-2">Email Address *</Label>
              <Input
                id="reporterEmail"
                type="email"
                placeholder="john.doe@example.com"
                value={data.reporterEmail || ''}
                onChange={(e) => handleChange('reporterEmail', e.target.value)}
                data-testid="input-reporter-email"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
