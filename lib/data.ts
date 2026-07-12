import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Issue } from "./types";

const DATA_DIR = path.join(process.cwd(), "content", "data");

export const loadAllIssues = cache(async (): Promise<Issue[]> => {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort().reverse();

  const issues = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(path.join(DATA_DIR, file), "utf-8");
      return JSON.parse(raw) as Issue;
    })
  );

  return issues.sort((a, b) => b.date.localeCompare(a.date));
});

export async function loadIssue(date: string): Promise<Issue | undefined> {
  const issues = await loadAllIssues();
  return issues.find((issue) => issue.date === date);
}

export async function loadIssueDates(): Promise<string[]> {
  const issues = await loadAllIssues();
  return issues.map((issue) => issue.date);
}
