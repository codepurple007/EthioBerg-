"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { useEthioApi } from "@/providers/ApiProvider";
import type { IssuerDocument } from "@/lib/types";

export default function DocumentReviewPanel() {
  const { api } = useEthioApi();
  const [documents, setDocuments] = useState<IssuerDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .listDocuments()
      .then((rows) => {
        if (active) setDocuments(rows);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);

  return (
    <>
      <PageHeader
        title="Document Review"
        breadcrumbs={[
          { label: "EthioBerg", href: "/dashboard" },
          { label: "Document Review" },
        ]}
      />

      <div className="mb-4 rounded border border-[#e9ebec] bg-white px-4 py-3 text-[13px] text-[#495057]">
        Upload and evaluate issuer documents from{" "}
        <Link href="/readiness" className="font-medium text-[#405189] hover:underline">
          Listing Readiness
        </Link>
        . Disclosure gap analysis and attention signals arrive in Phase 6.
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Uploaded issuer documents</h5>
        </div>
        {loading ? (
          <div className="card-body text-[13px] text-[#878a99]">Loading documents…</div>
        ) : documents.length === 0 ? (
          <div className="card-body text-[13px] text-[#878a99]">
            No documents uploaded yet. Start a readiness review to upload a prospectus or financial
            statement.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#e9ebec] bg-[#f8f9fa]">
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Document</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Segment</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Status</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Facts</th>
                  <th className="px-4 py-3 font-semibold text-[#878a99]">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-[#e9ebec] last:border-0">
                    <td className="px-4 py-3">
                      <p className="m-0 font-medium text-[#495057]">{doc.filename}</p>
                      <p className="m-0 font-mono text-[11px] text-[#878a99]">{doc.id}</p>
                    </td>
                    <td className="px-4 py-3">{doc.segment}</td>
                    <td className="px-4 py-3 capitalize">{doc.extractionStatus}</td>
                    <td className="px-4 py-3">
                      {doc.facts.length} extracted
                      {doc.factsConfirmed ? " · confirmed" : ""}
                    </td>
                    <td className="px-4 py-3 text-[#878a99]">
                      {new Date(doc.uploadTimestamp).toLocaleString("en-ET", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
