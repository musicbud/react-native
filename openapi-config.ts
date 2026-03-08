const config = {
    schemaFile: 'http://localhost:8000/openapi.json',
    apiFile: './src/store/apibase.ts',
    apiImport: 'api',
    outputFile: './src/store/api.ts',
    exportName: 'musicbudApi',
    hooks: true,
}

module.exports = config
