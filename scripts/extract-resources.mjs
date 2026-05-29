import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse";

const pdfPath =
  process.env.PDF_PATH ?? "C:/Users/Adhit/Downloads/Resource List - Resource List (1).pdf";

async function main() {
  const buffer = await fs.readFile(pdfPath);
  const parsed = await pdf(buffer);
  const outputPath = path.join(process.cwd(), "tmp-resource-list.txt");
  await fs.writeFile(outputPath, parsed.text, "utf8");
  console.log(`Extracted PDF text to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
