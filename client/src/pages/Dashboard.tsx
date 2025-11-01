import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Search,
  Eye,
  Download,
  MoreVertical,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import type { Report } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: reports, isLoading, refetch } = useQuery<Report[]>({
    queryKey: ['/api/reports', searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/reports?search=${encodeURIComponent(searchQuery)}`
        : '/api/reports';
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
  });

  const filteredReports = reports?.filter(report => {
    if (statusFilter && statusFilter !== "all" && report.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.referenceNumber.toLowerCase().includes(query) ||
        report.licensePlate.toLowerCase().includes(query) ||
        report.reporterName.toLowerCase().includes(query) ||
        report.reporterEmail.toLowerCase().includes(query) ||
        report.make.toLowerCase().includes(query) ||
        report.model.toLowerCase().includes(query)
      );
    }
    return true;
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Submitted
        </Badge>;
      case 'under review':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Clock className="w-3 h-3 mr-1" />
          Under Review
        </Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <i className="fas fa-check-double mr-1.5 text-xs"></i>
          Approved
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalReports = filteredReports.length;
  const submittedReports = filteredReports.filter(r => r.status === 'submitted').length;
  const underReviewReports = filteredReports.filter(r => r.status === 'under review').length;

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
                <p className="text-xs text-muted-foreground hidden sm:block">Admin Dashboard</p>
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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage and review all submitted damage reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" data-testid="text-total-reports">{totalReports}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Good</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" data-testid="text-submitted-reports">{submittedReports}</div>
              <div className="text-sm text-muted-foreground">Submitted</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">{underReviewReports} new</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1" data-testid="text-pending-reports">{underReviewReports}</div>
              <div className="text-sm text-muted-foreground">Under Review</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Fast</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">&lt; 2min</div>
              <div className="text-sm text-muted-foreground">Avg. Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by reference, plate, or reporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Reports Table */}
        <Card className="overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-border flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" title="Export" data-testid="button-export">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 text-sm text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Reference</th>
                  <th className="px-6 py-3 text-left font-medium">Vehicle</th>
                  <th className="px-6 py-3 text-left font-medium">Reporter</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Photos</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div 
                        className="font-mono text-sm font-semibold text-primary cursor-pointer hover:underline"
                        onClick={() => setLocation(`/report/${report.id}`)}
                        data-testid={`text-reference-${report.id}`}
                      >
                        {report.referenceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium" data-testid={`text-license-plate-${report.id}`}>
                        {report.licensePlate}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-vehicle-info-${report.id}`}>
                        {report.make} {report.model} {report.year}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium" data-testid={`text-reporter-name-${report.id}`}>
                        {report.reporterName}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-reporter-email-${report.id}`}>
                        {report.reporterEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" data-testid={`text-date-${report.id}`}>
                        {format(new Date(report.createdAt!), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground" data-testid={`text-time-${report.id}`}>
                        {format(new Date(report.createdAt!), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4" data-testid={`badge-status-${report.id}`}>
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {report.photoUrls.slice(0, 3).map((url, index) => (
                          <img 
                            key={index}
                            src={url} 
                            alt={`Photo ${index + 1}`}
                            className="w-8 h-8 rounded-full border-2 border-card object-cover"
                            data-testid={`img-thumbnail-${report.id}-${index}`}
                          />
                        ))}
                        {report.photoUrls.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium">
                            +{report.photoUrls.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setLocation(`/report/${report.id}`)}
                          title="View Report"
                          data-testid={`button-view-${report.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`/api/reports/${report.id}/pdf`)}
                          title="Download PDF"
                          data-testid={`button-download-${report.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="More Options"
                          data-testid={`button-more-${report.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No reports found</p>
              <p className="text-sm">Try adjusting your search criteria or create a new report.</p>
              <Button 
                className="mt-4" 
                onClick={() => setLocation("/")}
                data-testid="button-create-first-report"
              >
                Create Your First Report
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
