import ts from "../_virtual/typescript.js";
let importMap;
async function applyImportMap(source, fileName) {
  if (!importMap) importMap = await fetch("/jit/import-map.json").then((i) => i.json());
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX);
  const transformer = (context) => {
    const visit = (node) => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const spec = node.moduleSpecifier.text;
        const mapped = importMap[spec];
        if (mapped) {
          return ts.factory.updateImportDeclaration(node, node.modifiers, node.importClause, ts.factory.createStringLiteral(mapped), node.assertClause);
        }
      }
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length === 1) {
        const arg = node.arguments[0];
        if (ts.isStringLiteral(arg)) {
          const mapped = importMap[arg.text];
          if (mapped) {
            return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, [ts.factory.createStringLiteral(mapped)]);
          }
        }
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node) => ts.visitNode(node, visit);
  };
  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter();
  const output = printer.printFile(result.transformed[0]);
  result.dispose();
  return output;
}
async function compile(source, fileName) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2015,
      target: ts.ScriptTarget.ES2020,
      allowJs: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      inlineSourceMap: true
    },
    fileName
  });
  return result.outputText;
}
export {
  compile
};
