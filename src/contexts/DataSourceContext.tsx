import React, { createContext, useContext, useState, ReactNode } from "react";

export type DataSource = "live" | "simulation";

interface DataSourceContextValue {
  source: DataSource;
  setSource: (src: DataSource) => void;
}

const DataSourceContext = createContext<DataSourceContextValue | undefined>(
  undefined
);

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<DataSource>("live");
  return (
    <DataSourceContext.Provider value={{ source, setSource }}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const ctx = useContext(DataSourceContext);
  if (!ctx) {
    throw new Error("useDataSource must be used within a DataSourceProvider");
  }
  return ctx;
}
