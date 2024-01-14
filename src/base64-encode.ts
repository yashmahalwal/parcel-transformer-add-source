export function base64Encode(input: string) {
  return Buffer.from(input).toString('base64')
}