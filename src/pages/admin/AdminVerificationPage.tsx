import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import { ShieldCheck, FileText, CheckCircle2, XCircle } from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const { verifications, updateVerificationStatus } = useAppData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supplier Trade License Verification Desk</h1>
        <p className="text-xs text-slate-500 mt-0.5">Review commercial trade licenses and approve UAE suppliers for quoting access.</p>
      </div>

      <div className="space-y-4">
        {verifications.map((v) => (
          <Card key={v.id} className="hover:border-slate-300 transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900">{v.companyName}</h3>
                    <StatusBadge status={v.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Trade License #: <strong className="font-mono text-slate-800">{v.tradeLicenseNumber}</strong> • Location: <strong>{v.industrialZone}, {v.emirate}</strong>
                  </p>
                </div>

                <div className="text-xs text-slate-400">
                  Submitted: {formatDate(v.submittedAt)}
                </div>
              </div>

              {v.notes && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 my-3 border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Verification Notes:</strong>
                  {v.notes}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3">
                <div className="flex items-center gap-2 text-xs text-brand-700 font-semibold">
                  <FileText className="w-4 h-4" />
                  <span>Commercial_Trade_License_Document.pdf</span>
                </div>

                <div className="flex items-center gap-2">
                  {v.status === 'pending' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateVerificationStatus(v.companyId, 'rejected', 'Trade license expired or invalid activity.')}
                        leftIcon={<XCircle className="w-4 h-4 text-rose-600" />}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateVerificationStatus(v.companyId, 'verified', 'Trade license verified with UAE DET.')}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Approve & Verify Supplier
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700">
                      ✓ Verification Processed
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};