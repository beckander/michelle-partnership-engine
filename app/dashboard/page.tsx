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
  { key: 'new', label: 'New', color: 'bg-[#F5F1EB] text-[#3D3225]' },
  { key: 'contacted', label: 'Contacted', color: 'bg-[#E8E0D4] text-[#3D3225]' },
  { key: 'replied', label: 'Replied', color: 'bg-[#D4C8B8] text-[#3D3225]' },
  { key: 'negotiating', label: 'Negotiating', color: 'bg-[#C9B99A] text-[#3D3225]' },
  { key: 'contract_sent', label: 'Contract', color: 'bg-[#B8A888] text-white' },
  { key: 'closed_won', label: 'Won', color: 'bg-[#3D3225] text-[#FDFBF7]' },
  { key: 'dead', label: 'Closed', color: 'bg-[#9A8B78] text-white' },
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
        <div className="text-[#9A8B78] text-sm tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <p className="text-[#9A8B78] tracking-[0.2em] uppercase text-xs mb-2">Overview</p>
          <h1 className="font-serif text-2xl text-[#3D3225] font-light">Partnership Pipeline</h1>
          <p className="text-[#9A8B78] text-sm mt-1">
            {leads.length} leads · {counts.closed_won || 0} won
          </p>
        </div>
        <Link
          href="/dashboard/find-leads"
          className="px-6 py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors"
        >
          Find New Leads
        </Link>
      </div>

      {/* Filters */}
      <div className="border border-[#E8E0D4] p-5 mb-6 bg-[#FDFBF7]">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] placeholder:text-[#B8A888] text-sm focus:outline-none focus:border-[#C9B99A] transition-colors"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all ${
                filterStatus === 'all'
                  ? 'bg-[#3D3225] text-[#FDFBF7]'
                  : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
              }`}
            >
              All ({counts.all})
            </button>
            {statusOptions.slice(0, -1).map((status) => (
              <button
                key={status.key}
                onClick={() => setFilterStatus(status.key)}
                className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all ${
                  filterStatus === status.key
                    ? 'bg-[#3D3225] text-[#FDFBF7]'
                    : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
                }`}
              >
                {status.label} ({counts[status.key] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="border border-[#E8E0D4] bg-[#FDFBF7]">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 text-[#9A8B78]">
            {leads.length === 0 ? (
              <>
                <p className="mb-4 text-sm">No leads yet</p>
                <Link href="/dashboard/find-leads" className="text-[#3D3225] text-xs tracking-[0.1em] uppercase border-b border-[#3D3225] pb-0.5 hover:border-[#C9B99A] hover:text-[#C9B99A] transition-colors">
                  Find your first leads
                </Link>
              </>
            ) : (
              <p className="text-sm">No leads match your filter</p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-[#E8E0D4]">
              <tr className="bg-[#F5F1EB]">
                <th className="text-left px-5 py-4 text-[#6B5D4D] text-xs font-normal tracking-[0.15em] uppercase">Company</th>
                <th className="text-left px-5 py-4 text-[#6B5D4D] text-xs font-normal tracking-[0.15em] uppercase hidden sm:table-cell">Contact</th>
                <th className="text-left px-5 py-4 text-[#6B5D4D] text-xs font-normal tracking-[0.15em] uppercase">Status</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-[#F5F1EB] hover:bg-[#F5F1EB]/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-5 py-4">
                    <p className="text-[#3D3225] text-sm">{lead.company_name}</p>
                    <p className="text-[#9A8B78] text-xs mt-0.5 truncate max-w-[250px]">{lead.ai_pitch}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-[#6B5D4D] text-sm">{lead.contact_email || '—'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateLeadStatus(lead.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs px-3 py-1.5 border-0 cursor-pointer tracking-wider uppercase ${
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
                  <td className="px-5 py-4 text-right">
                    <button 
                      className="text-[#C9B99A] hover:text-[#3D3225] text-xs tracking-wider uppercase transition-colors"
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
          className="fixed inset-0 bg-[#3D3225]/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLead(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FDFBF7] max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E8E0D4]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#E8E0D4]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase mb-1">{selectedLead.category}</p>
                  <h2 className="font-serif text-xl text-[#3D3225] font-light">{selectedLead.company_name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-[#9A8B78] hover:text-[#3D3225] text-xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                {selectedLead.contact_email && (
                  <div>
                    <label className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase">Email</label>
                    <a href={`mailto:${selectedLead.contact_email}`} className="text-[#3D3225] block hover:text-[#C9B99A] transition-colors text-sm mt-1">
                      {selectedLead.contact_email}
                    </a>
                  </div>
                )}
                {selectedLead.website && (
                  <div>
                    <label className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase">Website</label>
                    <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-[#3D3225] block hover:text-[#C9B99A] transition-colors truncate text-sm mt-1">
                      {selectedLead.website}
                    </a>
                  </div>
                )}
              </div>

              {/* AI Pitch */}
              {selectedLead.ai_pitch && (
                <div>
                  <label className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase mb-2 block">Why They're a Good Fit</label>
                  <p className="text-[#3D3225] text-sm bg-[#F5F1EB] p-4 border border-[#E8E0D4]">
                    {selectedLead.ai_pitch}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <label className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase mb-2 block">Collaboration Idea</label>
                  <p className="text-[#3D3225] text-sm bg-[#F5F1EB] p-4 border border-[#E8E0D4]">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <label className="text-[#9A8B78] text-xs tracking-[0.15em] uppercase mb-3 block">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.key}
                      onClick={() => updateLeadStatus(selectedLead.id, status.key)}
                      className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-all ${
                        selectedLead.status === status.key
                          ? 'bg-[#3D3225] text-[#FDFBF7]'
                          : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-[#E8E0D4]">
                <Link
                  href={`/dashboard/emails?lead=${selectedLead.id}`}
                  className="flex-1 text-center py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors"
                >
                  Write Email
                </Link>
                <button
                  onClick={() => deleteLead(selectedLead.id)}
                  className="px-6 py-3 text-[#9A8B78] hover:text-red-400 text-xs tracking-[0.1em] uppercase transition-colors"
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
