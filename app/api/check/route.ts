import { NextResponse } from "next/server";
import axios from "axios";

const urls = [
  //   { name: "Frogment", url: "https://www.frogment.com" },
  { name: "Permitech: Homepage", url: "https://permi.tech" },
  { name: "Permitech: App Frontend", url: "https://app.permi.tech" },
  { name: "Permitech: Test Frontend", url: "https://test.permi.tech" },
  { name: "Permitech: Backend", url: "https://api.permi.tech/api-docs" },
  { name: "Permitech: Design System", url: "https://design-system.permi.tech" },
];

export async function GET() {
  const results = await Promise.all(
    urls.map(async ({ name, url }) => {
      try {
        const response = await axios.get(url, {
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        });
        return { name, url, status: response.status === 200 ? "Up" : "Down" };
      } catch (error: any) {
        return { name, url, status: "Down", error: error.message };
      }
    })
  );
  return NextResponse.json(results);
}
