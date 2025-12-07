'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  website: string;
  category: string;
  source: string;
  status: string;
  ai_pitch: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const statusColumns = [
  { key: 'new', label: 'New Leads', color: 'bg-sage-200' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-100' },
  { key: 'replied', label: 'Replied', color: 'bg-blush-200' },
  { key: 'negotiating', label: 'Negotiating', color: 'bg-yellow-100' },
  { key: 'contract_sent', label: 'Contract Sent', color: 'bg-purple-100' },
  { key: 'closed_won', label: 'Closed Won 🎉', color: 'bg-green-100' },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-taupe-500">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl text-taupe-700 mb-2">Partnership Pipeline</h1>
          <p className="text-taupe-500">
            {leads.length} total leads · {leads.filter(l => l.status === 'closed_won').length} won
          </p>
        </div>
        <Link
          href="/dashboard/find-leads"
          className="btn btn-primary flex items-center gap-2"
        >
          <span>🔍</span>
          Find New Leads
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusColumns.map((column) => {
          const columnLeads = getLeadsByStatus(column.key);
          return (
            <div 
              key={column.key} 
              className="flex-shrink-0 w-72"
            >
              {/* Column Header */}
              <div className={`${column.color} rounded-t-xl px-4 py-3 flex justify-between items-center`}>
                <h3 className="font-medium text-taupe-700 text-sm">{column.label}</h3>
                <span className="bg-cream-50 text-taupe-600 text-xs px-2 py-1 rounded-full">
                  {columnLeads.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="bg-cream-100 rounded-b-xl p-3 min-h-[500px] space-y-3">
                {columnLeads.length === 0 ? (
                  <div className="text-center py-8 text-taupe-400 text-sm">
                    No leads yet
                  </div>
                ) : (
                  columnLeads.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-cream-50 rounded-xl p-4 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-taupe-700 text-sm group-hover:text-taupe-600">
                          {lead.company_name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-taupe-500">
                          {lead.category}
                        </span>
                      </div>
                      {lead.contact_name && (
                        <p className="text-taupe-500 text-xs mb-2">
                          {lead.contact_name}
                        </p>
                      )}
                      {lead.ai_pitch && (
                        <p className="text-taupe-400 text-xs line-clamp-2">
                          {lead.ai_pitch.slice(0, 80)}...
                        </p>
                      )}
                      
                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-cream-200 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {column.key !== 'contacted' && column.key !== 'closed_won' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLeadStatus(lead.id, 'contacted');
                            }}
                            className="text-xs text-taupe-500 hover:text-taupe-700"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {column.key === 'contacted' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLeadStatus(lead.id, 'replied');
                            }}
                            className="text-xs text-taupe-500 hover:text-taupe-700"
                          >
                            Got Reply
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div 
          className="fixed inset-0 bg-taupe-700/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLead(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cream-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-soft-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-cream-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-serif text-2xl text-taupe-700">{selectedLead.company_name}</h2>
                  {selectedLead.contact_name && (
                    <p className="text-taupe-500">{selectedLead.contact_name}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-taupe-400 hover:text-taupe-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-taupe-500 text-xs uppercase tracking-wide">Email</label>
                  <p className="text-taupe-700">{selectedLead.contact_email || 'Not found'}</p>
                </div>
                <div>
                  <label className="text-taupe-500 text-xs uppercase tracking-wide">Website</label>
                  <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-taupe-700 hover:underline block truncate">
                    {selectedLead.website}
                  </a>
                </div>
                <div>
                  <label className="text-taupe-500 text-xs uppercase tracking-wide">Category</label>
                  <p className="text-taupe-700 capitalize">{selectedLead.category}</p>
                </div>
                <div>
                  <label className="text-taupe-500 text-xs uppercase tracking-wide">Source</label>
                  <p className="text-taupe-700 capitalize">{selectedLead.source.replace('-', ' ')}</p>
                </div>
              </div>

              {/* AI Pitch */}
              {selectedLead.ai_pitch && (
                <div>
                  <label className="text-taupe-500 text-xs uppercase tracking-wide mb-2 block">AI Generated Pitch</label>
                  <div className="bg-cream-100 rounded-xl p-4 text-taupe-600 text-sm">
                    {selectedLead.ai_pitch}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <label className="text-taupe-500 text-xs uppercase tracking-wide mb-2 block">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusColumns.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => {
                        updateLeadStatus(selectedLead.id, col.key);
                        setSelectedLead({ ...selectedLead, status: col.key });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedLead.status === col.key
                          ? 'bg-taupe-600 text-cream-50'
                          : 'bg-cream-200 text-taupe-600 hover:bg-cream-300'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-taupe-500 text-xs uppercase tracking-wide mb-2 block">Notes</label>
                <p className="text-taupe-600 text-sm">
                  {selectedLead.notes || 'No notes yet'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-cream-200">
                <Link
                  href={`/dashboard/emails?lead=${selectedLead.id}`}
                  className="btn btn-primary flex-1 text-center"
                >
                  Generate Email
                </Link>
                <button
                  onClick={() => {
                    updateLeadStatus(selectedLead.id, 'dead');
                    setSelectedLead(null);
                  }}
                  className="btn btn-secondary"
                >
                  Mark Dead
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
