"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ServiceStatus {
  name: string;
  url: string;
  status: "Up" | "Down";
  error?: string;
}

interface StatusHistory {
  [key: string]: {
    up: boolean;
    timestamp: string;
  }[];
}

const HistoryBlocks: React.FC<{ history: StatusHistory[string] }> = ({
  history,
}) => {
  return (
    <div className="flex mt-2">
      {history.map((status, index) => (
        <div
          key={index}
          className={`w-4 h-4 mx-px ${
            status.up ? "bg-green-500" : "bg-red-500"
          }`}
          title={`${status.up ? "Up" : "Down"} at ${new Date(
            status.timestamp
          ).toLocaleString()}`}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<StatusHistory>({});

  const fetchStatuses = async () => {
    try {
      const res = await fetch("/api/check");
      const data: ServiceStatus[] = await res.json();

      const newStatuses: Record<string, boolean> = {};
      data.forEach((service) => {
        newStatuses[service.name] = service.status === "Up";
      });

      setStatuses(newStatuses);
      setHistory((prevHistory) => {
        const newHistory: StatusHistory = { ...prevHistory };
        Object.entries(newStatuses).forEach(([name, status]) => {
          if (!newHistory[name]) {
            newHistory[name] = [];
          }
          newHistory[name].unshift({
            up: status,
            timestamp: new Date().toISOString(),
          });
          if (newHistory[name].length > 10) {
            newHistory[name] = newHistory[name].slice(0, 10);
          }
        });
        return newHistory;
      });
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Service Status</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statuses).map(([name, status]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{name}</span>
                  <span className={status ? "text-green-500" : "text-red-500"}>
                    {status ? "Up" : "Down"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HistoryBlocks history={history[name] || []} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
