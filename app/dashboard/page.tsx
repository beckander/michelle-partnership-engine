'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
  id: string;
  company_name: string;
  website: string;
  contact_email: string;
  category: string;
  status: string;
  why_good_fit: string;
  suggested_collab: string;
  created_at: string;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_conversation', label: 'In Conversation' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const statusColors: Record<string, string> = {
  new: 'bg-[#F5F1EB] text-[#6B5D4D]',
  contacted: 'bg-[#E8E0D4] text-[#3D3225]',
  in_conversation: 'bg-[#C9B99A]/20 text-[#6B5D4D]',
  negotiating: 'bg-[#C9B99A]/40 text-[#3D3225]',
  closed_won: 'bg-[#3D3225] text-[#FDFBF7]',
  closed_lost: 'bg-[#9A8B78]/30 text-[#6B5D4D]',
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  const updateStatus = async (leadId: string, newStatus: string) => {
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
      console.error('Error updating status:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter;
    const matchesSearch = lead.company_name.toLowerCase().includes(search.toLowerCase()) ||
                         lead.contact_email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status: string) => {
    return leads.filter(l => l.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9A8B78] text-sm tracking-wider">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <p className="text-[#9A8B78] tracking-[0.2em] uppercase text-xs mb-2">Dashboard</p>
          <h1 className="font-serif text-2xl text-[#3D3225] font-light">Partnership Pipeline</h1>
        </div>
        <Link
          href="/dashboard/find-leads"
          className="px-5 py-2.5 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors"
        >
          Find New Leads
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(filter === status.value ? 'all' : status.value)}
            className={`p-4 border transition-all ${
              filter === status.value 
                ? 'border-[#C9B99A] bg-[#F5F1EB]' 
                : 'border-[#E8E0D4] hover:border-[#C9B99A]'
            }`}
          >
            <p className="font-serif text-2xl text-[#3D3225] font-light">{getStatusCount(status.value)}</p>
            <p className="text-[#9A8B78] text-xs tracking-wider uppercase mt-1">{status.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors text-sm"
        />
      </div>

      {/* Table */}
      {filteredLeads.length === 0 ? (
        <div className="border border-[#E8E0D4] p-12 text-center">
          <p className="text-[#9A8B78] mb-4">No leads found</p>
          <Link
            href="/dashboard/find-leads"
            className="text-[#3D3225] text-sm border-b border-[#C9B99A]"
          >
            Find your first leads →
          </Link>
        </div>
      ) : (
        <div className="border border-[#E8E0D4] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F1EB] border-b border-[#E8E0D4]">
                <th className="text-left px-4 py-3 text-[#6B5D4D] text-xs tracking-[0.1em] uppercase font-normal">Company</th>
                <th className="text-left px-4 py-3 text-[#6B5D4D] text-xs tracking-[0.1em] uppercase font-normal">Category</th>
                <th className="text-left px-4 py-3 text-[#6B5D4D] text-xs tracking-[0.1em] uppercase font-normal">Contact</th>
                <th className="text-left px-4 py-3 text-[#6B5D4D] text-xs tracking-[0.1em] uppercase font-normal">Status</th>
                <th className="text-left px-4 py-3 text-[#6B5D4D] text-xs tracking-[0.1em] uppercase font-normal">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-[#E8E0D4] hover:bg-[#F5F1EB]/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-[#3D3225] text-sm">{lead.company_name}</p>
                    {lead.website && (
                      <a 
                        href={lead.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#9A8B78] text-xs hover:text-[#3D3225] transition-colors"
                      >
                        {lead.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[#6B5D4D] text-xs tracking-wider uppercase">{lead.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    {lead.contact_email && (
                      <a 
                        href={`mailto:${lead.contact_email}`}
                        className="text-[#3D3225] text-sm hover:text-[#C9B99A] transition-colors"
                      >
                        {lead.contact_email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`px-3 py-1.5 text-xs tracking-wider uppercase border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C9B99A] ${statusColors[lead.status] || statusColors.new}`}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[#9A8B78] text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
