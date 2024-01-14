module.exports = {
  encode(sourceCode) {
    // Hex encoding
    return Buffer.from(sourceCode.replace("\u0000", ""), "utf8").toString(
      "hex"
    );
  },
  addSourceCode(source, encodedSource) {
    return `${source}\nmodule.exports="${encodedSource}"`;
  },
};
