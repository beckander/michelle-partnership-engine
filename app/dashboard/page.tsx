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

const statusOptions = [
  { key: 'new', label: 'New', color: 'bg-[#E8DFD0] text-[#5C4D3C]' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { key: 'replied', label: 'Replied', color: 'bg-orange-100 text-orange-700' },
  { key: 'negotiating', label: 'Negotiating', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'contract_sent', label: 'Contract Sent', color: 'bg-purple-100 text-purple-700' },
  { key: 'closed_won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { key: 'dead', label: 'Dead', color: 'bg-gray-100 text-gray-500' },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      setLeads(leads.filter(lead => lead.id !== leadId));
      setSelectedLead(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = lead.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.contact_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: leads.length };
    statusOptions.forEach(s => {
      counts[s.key] = leads.filter(l => l.status === s.key).length;
    });
    return counts;
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#9A8B78]">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-[#5C4D3C] mb-1">Partnership Pipeline</h1>
          <p className="text-[#9A8B78] text-sm">
            {leads.length} total leads · {counts.closed_won || 0} won
          </p>
        </div>
        <Link
          href="/dashboard/find-leads"
          className="px-5 py-2.5 bg-[#5C4D3C] text-[#FAF7F2] rounded-lg text-sm hover:bg-[#4A3D2F] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Find New Leads
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#F0E9DD] rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#FAF7F2] border border-[#E8DFD0] text-[#5C4D3C] placeholder:text-[#9A8B78] text-sm focus:outline-none focus:border-[#D4C4A8]"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-[#5C4D3C] text-[#FAF7F2]'
                  : 'bg-[#FAF7F2] text-[#7D6D5A] hover:bg-[#E8DFD0]'
              }`}
            >
              All ({counts.all})
            </button>
            {statusOptions.slice(0, -1).map((status) => (
              <button
                key={status.key}
                onClick={() => setFilterStatus(status.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === status.key
                    ? 'bg-[#5C4D3C] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#7D6D5A] hover:bg-[#E8DFD0]'
                }`}
              >
                {status.label} ({counts[status.key] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#E8DFD0] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-[#9A8B78]">
            {leads.length === 0 ? (
              <>
                <p className="mb-4">No leads yet</p>
                <Link href="/dashboard/find-leads" className="text-[#5C4D3C] underline">
                  Find your first leads →
                </Link>
              </>
            ) : (
              <p>No leads match your filter</p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F0E9DD] border-b border-[#E8DFD0]">
              <tr>
                <th className="text-left px-4 py-3 text-[#7D6D5A] text-xs font-medium uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 text-[#7D6D5A] text-xs font-medium uppercase tracking-wide hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-[#7D6D5A] text-xs font-medium uppercase tracking-wide">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-[#F0E9DD] hover:bg-[#F0E9DD]/50 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#5C4D3C] text-sm">{lead.company_name}</p>
                    <p className="text-[#9A8B78] text-xs truncate max-w-[200px]">{lead.ai_pitch}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-[#7D6D5A] text-sm">{lead.contact_email || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateLeadStatus(lead.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs px-2 py-1 rounded-lg border-0 cursor-pointer ${
                        statusOptions.find(s => s.key === lead.status)?.color || 'bg-gray-100'
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status.key} value={status.key}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      className="text-[#9A8B78] hover:text-[#5C4D3C] text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                    >
                      View →
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div 
          className="fixed inset-0 bg-[#5C4D3C]/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLead(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#E8DFD0]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-serif text-xl text-[#5C4D3C]">{selectedLead.company_name}</h2>
                  <p className="text-[#9A8B78] text-sm capitalize">{selectedLead.category}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-[#9A8B78] hover:text-[#5C4D3C] text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Contact Info */}
              <div className="grid grid-cols-1 gap-3">
                {selectedLead.contact_email && (
                  <div>
                    <label className="text-[#9A8B78] text-xs uppercase tracking-wide">Email</label>
                    <a href={`mailto:${selectedLead.contact_email}`} className="text-[#5C4D3C] block hover:underline">
                      {selectedLead.contact_email}
                    </a>
                  </div>
                )}
                {selectedLead.website && (
                  <div>
                    <label className="text-[#9A8B78] text-xs uppercase tracking-wide">Website</label>
                    <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-[#5C4D3C] block hover:underline truncate">
                      {selectedLead.website}
                    </a>
                  </div>
                )}
              </div>

              {/* AI Pitch */}
              {selectedLead.ai_pitch && (
                <div>
                  <label className="text-[#9A8B78] text-xs uppercase tracking-wide mb-1 block">Why They're a Good Fit</label>
                  <p className="text-[#5C4D3C] text-sm bg-[#F0E9DD] rounded-lg p-3">
                    {selectedLead.ai_pitch}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <label className="text-[#9A8B78] text-xs uppercase tracking-wide mb-1 block">Collaboration Idea</label>
                  <p className="text-[#5C4D3C] text-sm bg-[#F0E9DD] rounded-lg p-3">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <label className="text-[#9A8B78] text-xs uppercase tracking-wide mb-2 block">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.key}
                      onClick={() => updateLeadStatus(selectedLead.id, status.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedLead.status === status.key
                          ? 'bg-[#5C4D3C] text-[#FAF7F2]'
                          : 'bg-[#E8DFD0] text-[#5C4D3C] hover:bg-[#D4C4A8]'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#E8DFD0]">
                <Link
                  href={`/dashboard/emails?lead=${selectedLead.id}`}
                  className="flex-1 text-center py-2.5 bg-[#5C4D3C] text-[#FAF7F2] rounded-lg text-sm hover:bg-[#4A3D2F] transition-colors"
                >
                  Write Email
                </Link>
                <button
                  onClick={() => deleteLead(selectedLead.id)}
                  className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
