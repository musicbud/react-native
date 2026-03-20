const config = {
    schemaFile: './openapi.json',
    apiFile: './src/store/apibase.ts',
    apiImport: 'api',
    outputFile: './src/store/api.ts',
    exportName: 'musicbudApi',
    hooks: true,
}

module.exports = config
