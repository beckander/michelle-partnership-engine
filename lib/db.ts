import fs from 'fs';
import path from 'path';
import { Database, Lead, Email, ContactFormSubmission } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

function ensureDbExists(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initialDb: Database = {
      leads: [],
      emails: [],
      brand_assets: [],
      contact_submissions: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
  }
}

function readDb(): Database {
  ensureDbExists();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDb(db: Database): void {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Lead operations
export function getAllLeads(): Lead[] {
  const db = readDb();
  return db.leads;
}

export function getLeadById(id: string): Lead | undefined {
  const db = readDb();
  return db.leads.find(lead => lead.id === id);
}

export function getLeadsByStatus(status: Lead['status']): Lead[] {
  const db = readDb();
  return db.leads.filter(lead => lead.status === status);
}

export function createLead(lead: Lead): Lead {
  const db = readDb();
  db.leads.push(lead);
  writeDb(db);
  return lead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const db = readDb();
  const index = db.leads.findIndex(lead => lead.id === id);
  if (index === -1) return null;
  
  db.leads[index] = {
    ...db.leads[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  writeDb(db);
  return db.leads[index];
}

export function deleteLead(id: string): boolean {
  const db = readDb();
  const index = db.leads.findIndex(lead => lead.id === id);
  if (index === -1) return false;
  
  db.leads.splice(index, 1);
  // Also delete associated emails
  db.emails = db.emails.filter(email => email.lead_id !== id);
  writeDb(db);
  return true;
}

// Email operations
export function getEmailsByLeadId(leadId: string): Email[] {
  const db = readDb();
  return db.emails.filter(email => email.lead_id === leadId);
}

export function createEmail(email: Email): Email {
  const db = readDb();
  db.emails.push(email);
  writeDb(db);
  return email;
}

export function updateEmail(id: string, updates: Partial<Email>): Email | null {
  const db = readDb();
  const index = db.emails.findIndex(email => email.id === id);
  if (index === -1) return null;
  
  db.emails[index] = { ...db.emails[index], ...updates };
  writeDb(db);
  return db.emails[index];
}

// Contact form operations
export function createContactSubmission(submission: ContactFormSubmission): ContactFormSubmission {
  const db = readDb();
  db.contact_submissions.push(submission);
  writeDb(db);
  return submission;
}

export function getAllContactSubmissions(): ContactFormSubmission[] {
  const db = readDb();
  return db.contact_submissions;
}

// Bulk operations for AI import
export function bulkCreateLeads(leads: Lead[]): Lead[] {
  const db = readDb();
  db.leads.push(...leads);
  writeDb(db);
  return leads;
}

// Get pipeline stats
export function getPipelineStats() {
  const db = readDb();
  const stats = {
    new: 0,
    contacted: 0,
    replied: 0,
    negotiating: 0,
    contract_sent: 0,
    closed_won: 0,
    dead: 0,
    total: db.leads.length,
  };
  
  db.leads.forEach(lead => {
    stats[lead.status]++;
  });
  
  return stats;
}
