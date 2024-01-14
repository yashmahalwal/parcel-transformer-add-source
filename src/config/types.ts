export type Config = {
  encode?(sourceCode: string): string;
  addSourceCode(fileSourceCode: string, encodedSourceCode: string): string;
}
