import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReportSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ReportGenerator } from "./services/reportGenerator";
import { EmailService } from "./services/emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();
  const reportGenerator = new ReportGenerator();
  const emailService = new EmailService();

  // Serve public objects (photos)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });
// everything in typescript
  // Get upload URL for photos
  app.post("/api/photos/upload", async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Process uploaded photo and set ACL
  app.post("/api/photos/process", async (req, res) => {
    if (!req.body.photoURL) {
      return res.status(400).json({ error: "photoURL is required" });
    }

    try {
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.photoURL);
      res.json({ objectPath });
    } catch (error) {
      console.error("Error processing photo:", error);
      res.status(500).json({ error: "Failed to process photo" });
    }
  });

  // Create new report
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      if (error instanceof Error && 'issues' in error) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.message 
        });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  // Get all reports
  app.get("/api/reports", async (req, res) => {
    try {
      const { search } = req.query;
      const reports = search 
        ? await storage.searchReports(search as string)
        : await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Get specific report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  // Get report by reference number
  app.get("/api/reports/reference/:refNumber", async (req, res) => {
    try {
      const report = await storage.getReportByReference(req.params.refNumber);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  // Generate PDF report
  app.get("/api/reports/:id/pdf", async (req, res) => {
    try {
      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      const pdfBuffer = await reportGenerator.generatePDF(report);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="vehicle-damage-report-${report.referenceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Email report
  app.post("/api/reports/:id/email", async (req, res) => {
    try {
      const { email, includeAttachment = true } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email address is required" });
      }

      const report = await storage.getReport(req.params.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      await emailService.sendReport(report, email, includeAttachment);
      res.json({ message: "Report sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send report via email" });
    }
  });

  // Update report status
  app.patch("/api/reports/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const report = await storage.updateReportStatus(req.params.id, status);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ error: "Failed to update report status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
