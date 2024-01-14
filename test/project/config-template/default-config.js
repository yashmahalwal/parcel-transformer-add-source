module.exports = {
  addSourceCode(source, encodedSource) {
    return `${source}\nmodule.exports="${encodedSource}"`;
  },
};
