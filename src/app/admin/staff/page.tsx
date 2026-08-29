"use client";

import { useEffect, useState } from "react";
import {
  UserCheck,
  Plus,
  Phone,
  Mail,
  Search,
  Loader2,
  RefreshCw,
  X,
  Users,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formTitle, setFormTitle] = useState("Lead Decorator");

  const fetchStaffAndTeams = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/staff");
      const json = await res.json();
      if (json.success) {
        setStaff(json.data.staff);
        setTeams(json.data.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndTeams();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          jobTitle: formTitle,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchStaffAndTeams();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-warm-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-600 uppercase tracking-wider font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Operations & Teams</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy-950 font-bold mt-1">
            Staff & Decoration Crews
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy-600 mt-1">
            Assign event coordinators, setup decorators, and on-site crews for Islamabad & Rawalpindi bookings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStaffAndTeams}
            className="p-2.5 rounded-xl border border-brand-warm-300 bg-white text-brand-navy-700 hover:bg-brand-warm-100 transition-colors text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gold flex items-center space-x-2 text-xs py-2.5 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* CREWS SECTION */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-brand-navy-950">Active Field Crews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-2xl border border-brand-warm-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-brand-navy-950">{t.name}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.status}
                </span>
              </div>
              <p className="text-xs text-brand-navy-600">{t.notes}</p>
              <div className="flex items-center justify-between text-xs text-brand-navy-700 pt-2 border-t border-brand-warm-100">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold-600" />
                  <span>{t.zone}</span>
                </span>
                <span className="font-semibold">{t.memberCount} Decorators Assigned</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STAFF LIST */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-brand-navy-950">Staff & Event Coordinators</h3>
        <div className="bg-white rounded-2xl border border-brand-warm-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold-600" />
              <p className="text-xs text-brand-navy-600">Loading staff records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-warm-50 text-brand-navy-700 font-bold uppercase tracking-wider text-[10px] border-b border-brand-warm-200">
                  <tr>
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Role & Department</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4 text-center">Assigned Bookings</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-warm-100">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-warm-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-brand-navy-950">{s.user?.name}</p>
                        <p className="text-[11px] text-brand-navy-500">{s.user?.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-brand-navy-900">{s.jobTitle}</p>
                        <p className="text-[10px] text-brand-navy-500">{s.department}</p>
                      </td>
                      <td className="py-3.5 px-4 text-brand-navy-700">
                        {s.user?.phone || "+92 300 1234567"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-brand-gold-700">
                        {s._count?.assignedBookings || 0}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-brand-warm-200">
            <div className="flex items-center justify-between border-b border-brand-warm-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-brand-navy-950">Add Staff Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-brand-warm-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Ali"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hamza@areventsco.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy-900 mb-1">Role / Job Title</label>
                <select
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-warm-50 border border-brand-warm-200 rounded-xl"
                >
                  <option value="Lead Decorator">Lead Decorator</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="Balloon Specialist">Balloon Specialist</option>
                  <option value="Setup Crew">Setup Crew</option>
                  <option value="Photographer">Photographer</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-warm-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-brand-warm-300 text-brand-navy-700 hover:bg-brand-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-gold px-5 py-2 text-xs font-semibold flex items-center space-x-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
