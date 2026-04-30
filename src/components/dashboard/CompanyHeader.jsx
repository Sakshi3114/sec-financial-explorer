import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatFYE } from "../../utils/formatters";
import Badge from "../ui/Badge";

export default function CompanyHeader() {
  const { company, companyInfo: info, clearCompany } = useApp();
  if (!company) return null;

  const exchanges = info?.exchanges?.filter(Boolean) ?? [];
  const filingCount = info?.filingCount ?? 0;
  const fiscalYearEnd = info?.fiscalYearEnd;

  const meta = [
    { label: "CIK", value: company.cik },
    {
      label: "SIC",
      value: info?.sic ? `${info.sic} · ${info.sicDescription ?? ""}` : "—",
    },
    {
      label: "Fiscal Year End",
      value: fiscalYearEnd ? formatFYE(fiscalYearEnd) : "—",
    },
    {
      label: "Total Filings",
      value: filingCount > 0 ? `${filingCount.toLocaleString()}+` : "—",
    },
  ];

  return (
    <div className="card p-5 sm:p-6 animate-fade-up">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <span className="font-display font-black text-brand text-xl">
              {(info?.name ?? company.name).charAt(0)}
            </span>
          </div>

          {/* Name + badges */}
          <div className="min-w-0">
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl truncate">
              {info?.name ?? company.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {company.ticker && (
                <Badge variant="brand">{company.ticker}</Badge>
              )}
              {exchanges[0] && <Badge variant="muted">{exchanges[0]}</Badge>}
              {info?.stateOfIncorporation && (
                <Badge variant="muted">{info.stateOfIncorporation}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={clearCompany}
          className="btn-icon shrink-0"
          title="Clear company"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Meta row */}
      <div className="divider mt-5 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {meta.map(({ label, value }) => (
          <div key={label}>
            <p className="label mb-1">{label}</p>
            <p
              className="font-mono text-xs text-ink truncate"
              title={String(value)}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
