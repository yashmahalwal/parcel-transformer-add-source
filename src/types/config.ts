export type Config = {
  // Function to provide custom encoding for the source code
  encode?(sourceCode: string): string;
  // Function to inject encoded source code in raw source code and return the updated asset code
  addSourceCode(fileSourceCode: string, encodedSourceCode: string): string;
};
