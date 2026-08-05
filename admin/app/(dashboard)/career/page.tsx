import { getCareerApplications } from "@/lib/careers-db";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const applications = await getCareerApplications();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Career Applications</h2>
          <p className="text-gray-400 mt-1 text-sm">Review job applications and download resumes.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          <span className="text-sm font-medium text-gray-300">
            {applications.length} Total
          </span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Applicant</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Applied Date</th>
                <th className="px-6 py-4 font-semibold text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{app.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                        {app.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(app.appliedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.fileBase64 ? (
                        <a
                          href={app.fileBase64}
                          download={app.fileName || "resume"}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 hover:border-gray-600 text-xs font-medium"
                        >
                          <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-600 text-xs italic">No file</span>
                      )}
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
