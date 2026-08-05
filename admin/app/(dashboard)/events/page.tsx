"use client";

import { useState, useEffect, useCallback } from "react";

interface EventBooking {
  _id: string;
  name: string;
  contactNo: string;
  deliveryAddress: string;
  eventDescription: string;
  eventType: string;
  status: "Pending" | "Reviewed" | "Contacted";
  appliedAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      setEvents(json.data || []);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateStatus = async (id: string, newStatus: EventBooking["status"]) => {
    try {
      await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchEvents();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Reviewed":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "Contacted":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Event Inquiries</h2>
        <p className="text-gray-400 mt-1 text-sm">Manage corporate events, weddings, and party catering requests.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Client Name</th>
                <th className="px-6 py-4 font-semibold">Event Type</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Address & Details</th>
                <th className="px-6 py-4 font-semibold">Date Received</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                      Loading event inquiries…
                    </div>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    No event inquiries found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{event.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border bg-gray-800 border-gray-700 text-gray-300">
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 font-mono text-xs">{event.contactNo}</p>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="text-gray-300 text-xs truncate mb-1" title={event.deliveryAddress}>
                        📍 {event.deliveryAddress}
                      </p>
                      <p className="text-gray-500 text-xs truncate" title={event.eventDescription}>
                        {event.eventDescription || "No description provided"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(event.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={event.status}
                        onChange={(e) => updateStatus(event._id, e.target.value as EventBooking["status"])}
                        className={`text-xs font-medium px-2 py-1 rounded-md border outline-none cursor-pointer appearance-none ${getStatusColor(event.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Contacted">Contacted</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteConfirm(event._id)}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/30 transition-all duration-150"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (() => {
        const ev = events.find((x) => x._id === deleteConfirm);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h4 className="text-white font-semibold mb-2">Delete Inquiry</h4>
              <p className="text-gray-300 text-sm mb-5">
                Are you sure you want to delete the event inquiry from <span className="font-semibold text-white">"{ev?.name}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2 rounded-xl font-semibold text-sm bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-xl font-semibold text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
