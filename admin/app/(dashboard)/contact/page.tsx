import { getContactMessages } from "@/lib/contact-db";

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400 mt-1 text-sm">Review inquiries from the Contact Us page.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          <span className="text-sm font-medium text-gray-300">
            {messages.length} Total
          </span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Sender</th>
                <th className="px-6 py-4 font-semibold">Message</th>
                <th className="px-6 py-4 font-semibold text-right">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="font-medium text-white">{msg.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        <a href={`mailto:${msg.email}`} className="hover:text-blue-400 transition-colors">
                          {msg.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top w-full max-w-xl">
                      <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4 text-right align-top text-gray-400 whitespace-nowrap">
                      {new Date(msg.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
