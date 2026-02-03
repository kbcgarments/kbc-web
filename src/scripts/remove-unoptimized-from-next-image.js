/**
 * Removes `unoptimized` prop from all <Image /> components
 * imported from `next/image`.
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

    // Remove `unoptimized` attribute
    opening.attributes = opening.attributes.filter(
      (attr) =>
        !(
          attr.type === "JSXAttribute" &&
          attr.name.type === "JSXIdentifier" &&
          attr.name.name === "unoptimized"
        ),
    );
  });

  return root.toSource({ quote: "double" });
};
