"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ModelDef } from "@/lib/engine/schema";
import { LucideIcon, MoreHorizontal, Search, Download, Plus, Filter, Upload, RotateCw } from "lucide-react";
import Papa from "papaparse";
import { importCSV } from "@/lib/features/csv-import";

interface DynamicTableProps {
  appId: string;
  model: ModelDef;
  data: any[];
  onRowClick?: (record: any) => void;
  onAddClick?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function DynamicTable({ appId, model, data, onRowClick, onAddClick, onRefresh, loading }: DynamicTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        await importCSV(appId, model.name, results.data);
        onRefresh?.();
      },
    });
  };

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(record => 
      Object.values(record.data || {}).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const handleExportCSV = () => {
    if (data.length === 0) return;
    // Map data to a flat structure for CSV
    const csvData = data.map(record => record.data);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${model.name}-export.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{model.label}</h2>
          <p className="text-muted-foreground">
            Manage your {model.label.toLowerCase()} records here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">
            <Upload className="h-4 w-4" />
            Import CSV
            <input type="file" className="hidden" accept=".csv" onChange={handleCSVUpload} />
          </label>
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={onAddClick}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add {model.label}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button 
          onClick={onRefresh}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background text-sm font-medium transition-colors hover:bg-accent text-muted-foreground"
          title="Refresh data"
        >
          <RotateCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
        <button className="inline-flex h-10 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {model.fields.map((field) => (
                  <th
                    key={field.name}
                    className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                    {model.fields.map((field) => (
                      <td key={field.name} className="p-4 align-middle">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                      </td>
                    ))}
                    <td className="p-4 align-middle text-right">
                       <div className="h-8 w-8 ml-auto animate-pulse rounded bg-muted"></div>
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={model.fields.length + 1}
                    className="h-24 text-center align-middle text-muted-foreground"
                  >
                    {searchQuery ? "No matching records found." : "No records found."}
                  </td>
                </tr>
              ) : (
                filteredData.map((record, i) => (
                  <tr
                    key={record.id || i}
                    onClick={() => onRowClick?.(record)}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                  >
                    {model.fields.map((field) => (
                      <td key={field.name} className="p-4 align-middle">
                        {String(record.data?.[field.name] ?? "")}
                      </td>
                    ))}
                    <td className="p-4 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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
