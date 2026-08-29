import { AuditClient } from "./AuditClient";

export const metadata = {
  title: "FRONTEND PROOF · Autoauditoría local",
  description:
    "Autoauditoría local de jerarquía, movimiento, accesibilidad y rendimiento con informe copiable y descargable.",
};

export default function AuditPage() {
  return <AuditClient />;
}
