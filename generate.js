const { generateEndpoints } = require("@rtk-query/codegen-openapi");
const path = require("path");

async function run() {
  await generateEndpoints({
    schemaFile: "http://localhost:8000/openapi.json",
    apiFile: "./src/store/apibase.ts",
    apiImport: "api",
    outputFile: "./src/store/api.ts",
    exportName: "musicbudApi",
    hooks: true,
  });
}

run().catch(console.error);
