import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

interface ServiceUrl {
  name: string;
  url: string;
}

interface ServiceStatus {
  name: string;
  url: string;
  status: "Up" | "Down";
  error?: string;
}

const urls: ServiceUrl[] = [
  { name: "Frontend", url: "https://permi.tech" },
  { name: "App Frontend", url: "https://app.permi.tech" },
  { name: "Test Frontend", url: "https://test.permi.tech" },
  { name: "API", url: "https://api.permi.tech/api-docs" },
  { name: "Design System", url: "https://design-system.permi.tech" },
];

export async function GET(): Promise<NextResponse<ServiceStatus[]>> {
  const results: ServiceStatus[] = await Promise.all(
    urls.map(async ({ name, url }) => {
      try {
        const response = await axios.get(url, {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        });
        return { name, url, status: response.status === 200 ? "Up" : "Down" };
      } catch (error) {
        return { name, url, status: "Down", error: (error as Error).message };
      }
    })
  );
  return NextResponse.json(results);
}
