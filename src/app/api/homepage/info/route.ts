import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";


const DATA_DIR = path.join(process.cwd(), ".data");
const SNAP     = path.join(DATA_DIR, "homepage.info.json");
const HISTORY  = path.join(DATA_DIR, "homepage.info.history.jsonl");

type InfoDoc = {
  html: string;
  status: "draft"|"published";
  ts: string;
};

async function readSnap(): Promise<InfoDoc|null> {
  try { return JSON.parse(await fs.readFile(SNAP, "utf8")); } catch { return null; }
}

export async function GET() {
  const doc = await readSnap();
  const body: InfoDoc = doc ?? {
    html: `<h2>Welcome to Exoverse</h2>
<p>Edit this section with launch notes, promos, or announcements. State is saved and can be published.</p>`,
    status: "draft",
    ts: new Date().toISOString(),
  };
  return NextResponse.json({ ok: true, doc: body }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<InfoDoc> & { publish?: boolean };
    const prev = await readSnap();
    const now = new Date().toISOString();
    const doc: InfoDoc = {
      html: String(body.html ?? prev?.html ?? ""),
      status: body.publish ? "published" : (body.status ?? prev?.status ?? "draft"),
      ts: now,
    };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SNAP, JSON.stringify(doc, null, 2));
    await fs.appendFile(HISTORY, JSON.stringify({ _kind:"homepage.info", action: body.publish ? "publish" : "save", ts: now, len: doc.html.length })+"\n");
    return NextResponse.json({ ok: true, doc }, { headers: { "cache-control": "no-store" } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "save failed" }, { status: 500 });
  }
}
