import { type Report, type InsertReport } from "@shared/schema";
import { randomUUID } from "crypto";
// Need change intypescript

export interface IStorage {
  getReport(id: string): Promise<Report | undefined>;
  getReportByReference(referenceNumber: string): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  searchReports(query: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: string, status: string): Promise<Report | undefined>;
}
//storage
export class MemStorage implements IStorage {
  private reports: Map<string, Report>;

  constructor() {
    this.reports = new Map();
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportByReference(referenceNumber: string): Promise<Report | undefined> {
    return Array.from(this.reports.values()).find(
      (report) => report.referenceNumber === referenceNumber,
    );
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async searchReports(query: string): Promise<Report[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.reports.values()).filter(
      (report) =>
        report.referenceNumber.toLowerCase().includes(lowerQuery) ||
        report.licensePlate.toLowerCase().includes(lowerQuery) ||
        report.reporterName.toLowerCase().includes(lowerQuery) ||
        report.reporterEmail.toLowerCase().includes(lowerQuery) ||
        report.make.toLowerCase().includes(lowerQuery) ||
        report.model.toLowerCase().includes(lowerQuery)
    ).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const referenceNumber = this.generateReferenceNumber();
    const createdAt = new Date();
    
    const report: Report = {
      ...insertReport,
      id,
      referenceNumber,
      status: "submitted",
      createdAt,
      color: insertReport.color ?? null,
      vin: insertReport.vin ?? null,
      incidentTime: insertReport.incidentTime ?? null,
      location: insertReport.location ?? null,
    };
    
    this.reports.set(id, report);
    return report;
  }

  async updateReportStatus(id: string, status: string): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, status };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  private generateReferenceNumber(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `VCR-${year}-${randomNum}`;
  }
}

export const storage = new MemStorage();
