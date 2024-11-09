// components/ui/card.tsx
import React from "react";

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card border rounded shadow-md p-4">{children}</div>
);

export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="card-header">{children}</div>
);

export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="card-title font-semibold text-xl">{children}</h2>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="card-content">{children}</div>
);
