import { getPartnerships } from "@/lib/partnership-db";

export const dynamic = 'force-dynamic';

export default async function PartnershipAdminPage() {
  const inquiries = await getPartnerships();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Partnership Inquiries</h1>
      </div>

      <div className="bg-[#0f111a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-[#1a1d2d] text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No partnership inquiries yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20">
                        {inquiry.selectedType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {inquiry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={`tel:${inquiry.contact}`} className="text-blue-400 hover:underline">
                        {inquiry.contact}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-400">Address:</span> {inquiry.address}
                      </div>
                      <div className="text-sm mt-2 p-3 bg-black/30 rounded-lg border border-white/5">
                        {inquiry.description}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
