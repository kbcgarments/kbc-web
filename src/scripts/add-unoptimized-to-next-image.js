/**
 * Adds `unoptimized` prop to all <Image /> components
 * that do not already have it.
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find Image imports from next/image
  const imageImports = root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "next/image");

  if (imageImports.size() === 0) {
    return file.source;
  }

  const imageLocalNames = new Set();

  imageImports.forEach((path) => {
    path.node.specifiers.forEach((spec) => {
      if (spec.type === "ImportDefaultSpecifier") {
        imageLocalNames.add(spec.local.name);
      }
    });
  });

  if (imageLocalNames.size === 0) {
    return file.source;
  }

  // Find JSX elements using <Image />
  root.find(j.JSXElement).forEach((path) => {
    const opening = path.node.openingElement;
    const name = opening.name;

    if (name.type !== "JSXIdentifier" || !imageLocalNames.has(name.name)) {
      return;
    }

    const hasUnoptimized = opening.attributes.some(
      (attr) =>
        attr.type === "JSXAttribute" && attr.name.name === "unoptimized",
    );

    if (!hasUnoptimized) {
      opening.attributes.push(j.jsxAttribute(j.jsxIdentifier("unoptimized")));
    }
  });

  return root.toSource({ quote: "double" });
};
