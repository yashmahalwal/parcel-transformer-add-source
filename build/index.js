"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("@parcel/plugin");
exports.default = new plugin_1.Transformer({
    transform({ asset }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Retrieve the asset's source code and source map.
            let source = yield asset.getCode();
            let sourceMap = yield asset.getMap();
            // Run it through some compiler, and set the results
            // on the asset.
            let { code, map } = compile(source, sourceMap);
            asset.setCode(code);
            asset.setMap(map);
            // Return the asset
            return [asset];
        });
    }
});
