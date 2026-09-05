import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { formatAED, formatDate } from '../../lib/utils';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

export const SupplierQuotationsPage: React.FC = () => {
  const { currentCompany } = useAuth();
  const { quotations } = useAppData();

  const myQuotes = quotations.filter(q => q.supplierCompanyId === currentCompany.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Submitted Quotations</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track your commercial bids, evaluation states, and won contracts.</p>
      </div>

      {myQuotes.length > 0 ? (
        <div className="space-y-4">
          {myQuotes.map((quote) => (
            <Card key={quote.id} className="hover:border-slate-300 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        {quote.quotationNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-500">RFQ: {quote.rfqNumber}</span>
                      {quote.status === 'awarded' ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          ✓ Won & Awarded
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          Under Buyer Evaluation
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{quote.rfqTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Submitted on: {formatDate(quote.submittedAt)}</p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Quoted Total (Incl. 5% VAT)</span>
                    <span className="text-xl font-extrabold text-slate-900">{formatAED(quote.grandTotalAED)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 my-3">
                  <div>
                    <span className="text-slate-400 block">Lead Time:</span>
                    <strong className="text-slate-800">{quote.leadTimeDisplay || quote.leadTimeDays + ' Days'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Payment Terms:</span>
                    <strong className="text-slate-800">{quote.paymentTerms}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Warranty Period:</span>
                    <strong className="text-slate-800">{quote.warrantyPeriod}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Delivery Method:</span>
                    <strong className={quote.deliveryMethod === 'supplysouq_managed' ? 'text-brand-700' : 'text-slate-800'}>
                      {quote.deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Logistics' : 'In-House Fleet'}
                    </strong>
                  </div>
                </div>

                {quote.deliveryMethod === 'supplysouq_managed' && quote.deliveryDetails && (
                  <div className="p-2.5 bg-brand-50/70 rounded-lg text-xs border border-brand-200 mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🚚</span>
                      <div>
                        <span className="font-bold text-brand-950 block">
                          SupplySouq Dispatch: {quote.deliveryDetails.pickupZone} ➔ {quote.deliveryDetails.deliveryAddress}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {quote.deliveryDetails.estimatedDistanceKm} km • {quote.deliveryDetails.vehicleType}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-brand-800 bg-white px-2 py-0.5 rounded border border-brand-200">
                      Fee: {formatAED(quote.deliveryChargeAED || quote.deliveryDetails.spotDeliveryFeeAED)}
                    </span>
                  </div>
                )}

                {quote.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">Commercial Notes:</strong>
                    {quote.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-200 bg-slate-50/50">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">No Quotations Submitted Yet</h3>
            <p className="text-xs text-slate-500">
              Your submitted price quotes will appear here and be stored permanently in the database.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};