"use client";

import { Key, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HistoryBlocks = ({ history }: any) => {
  return (
    <div className="flex">
      {history.map((status: string, index: Key | null | undefined) => (
        <div
          key={index}
          className={`size-3.5 mx-px ${
            status === "Up" ? "bg-green-500" : "bg-red-500"
          }`}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [statuses, setStatuses] = useState([]);
  const [history, setHistory] = useState<any>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      const res = await fetch("/api/check");
      const data = await res.json();
      setStatuses(data);

      // Update history
      setHistory((prevHistory: any) => {
        const newHistory = { ...prevHistory };
        data.forEach(({ name, status }: any) => {
          if (!newHistory[name]) {
            newHistory[name] = [];
          }
          newHistory[name].unshift(status);
          if (newHistory[name].length > 90) {
            newHistory[name] = newHistory[name].slice(0, 90);
          }
        });
        return newHistory;
      });
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statuses.map(({ name, status, url }, index) => (
          <Card
            key={index}
            className="w-80"
          >
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-xl font-semibold ${
                  status === "Up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {status}
              </p>
              <a
                href={url}
                target="_blank"
                className="text-blue-500 underline text-xs"
              >
                Visit {name}
              </a>
              <div className="mt-4">
                <p className="text-sm mb-1">Last 90 minutes:</p>
                <HistoryBlocks history={history[name] || []} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-gray-500 text-sm">
        <p>Auto-updates every minute</p>
      </div>
    </div>
  );
}
