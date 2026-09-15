export type DrivingSide = "left" | "right";

export interface Jurisdiction {
  code: string;
  name: string;
  drivingSide: DrivingSide;
}

// Source of truth for jurisdiction -> driving side. A Scene's driving_side is
// always derived from this table, never authored independently (CONTEXT.md).
export const JURISDICTIONS: Jurisdiction[] = [
  { code: "SE", name: "Sweden", drivingSide: "right" },
  { code: "GB", name: "United Kingdom", drivingSide: "left" },
  { code: "US", name: "United States", drivingSide: "right" },
  { code: "AU", name: "Australia", drivingSide: "left" },
];

export function findJurisdiction(code: string): Jurisdiction | undefined {
  return JURISDICTIONS.find((j) => j.code === code);
}

// Driving side is always looked up from the Jurisdiction, never read back from
// a Scene — a manifest edited by hand can therefore not carry a jurisdiction /
// driving-side mismatch, because it doesn't carry a driving side at all.
// Returns null for a jurisdiction this build doesn't know.
export function drivingSideFor(code: string): DrivingSide | null {
  return findJurisdiction(code)?.drivingSide ?? null;
}
