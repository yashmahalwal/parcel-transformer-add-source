import { Transformer } from "@parcel/plugin";
import ThrowableDiagnostic from "@parcel/diagnostic";
import { Config } from "./config/types";
import { base64Encode } from "./base64-encode";

const configFileName = `transform-add-source.config.js`;

export default new Transformer<Config>({
  async loadConfig({ config, logger }) {
    logger.verbose({ message: `Reading config file ${configFileName}` });
    const result = await config.getConfig([configFileName]);

    logger.verbose({ message: `Validating config existence` });
    if (!result) {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: "Could not find a config file",
          hints: [`Create a ${configFileName} file in the project root.`],
        },
      });
    }
    const { contents } = result;

    logger.verbose({ message: `Validating config to be of object type` });
    if (!contents || typeof contents !== "object") {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: "Invalid config file",
          hints: [
            `Please ensure that ${configFileName} exports a valid Javascript object.`,
          ],
        },
      });
    }

    logger.verbose({ message: `Validating config.encode` });
    if ("encode" in contents && typeof contents.encode !== "function") {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: "Invalid encoding function",
          hints: [
            `Please ensure that ${configFileName} exports a valid \`encode\` function.`,
          ],
        },
      });
    }

    logger.verbose({ message: `Validating config.addSourceCode` });
    if (!("addSourceCode" in contents)) {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: "Missing transformation function",
          hints: [
            `Please ensure that ${configFileName} exports an \`addSourceCode\` function.`,
          ],
        },
      });
    }

    if (typeof contents.addSourceCode !== "function") {
      throw new ThrowableDiagnostic({
        diagnostic: {
          message: "Invalid transformation function",
          hints: [
            `Please ensure that ${configFileName} exports a valid \`addSourceCode\` function.`,
          ],
        },
      });
    }

    logger.verbose({ message: `Config is valid` });
    return contents as Config;
  },
  async transform({ asset, config, logger }) {
    // Retrieve the asset's source code and source map.
    logger.verbose({ message: `Reading source code` });
    const source = await asset.getCode();

    logger.verbose({ message: `Encoding source code` });
    const encodedSource = config.encode?.(source) ?? base64Encode(source);
    logger.verbose({ message: `Generating new code` });
    const updatedCode = config.addSourceCode(source, encodedSource);

    logger.verbose({ message: `Updating code of the asset` });
    asset.setCode(updatedCode);

    logger.verbose({ message: `Returning asset` });
    // Return the asset
    return [asset];
  },
});
