import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { importResourcesFromRows } from "@/lib/resource-store";
import { getAuthContext } from "@/lib/supabase/auth";
import type { ResourceImportRow } from "@/lib/types";

export async function POST(request: Request) {
  const { isAdmin } = await getAuthContext();
  if (!isAdmin) {
    return NextResponse.json({ message: "Admin access required." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Spreadsheet file is required." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const workbook = XLSX.read(bytes, { type: "array" });
  const sheetName = workbook.SheetNames.includes("Resource List") ? "Resource List" : workbook.SheetNames[0];

  if (!sheetName) {
    return NextResponse.json({ message: "No worksheet found in spreadsheet." }, { status: 400 });
  }

  const rows = XLSX.utils.sheet_to_json<ResourceImportRow>(workbook.Sheets[sheetName], {
    defval: "",
  });
  const summary = await importResourcesFromRows(rows, file.name);

  return NextResponse.json(summary);
}
