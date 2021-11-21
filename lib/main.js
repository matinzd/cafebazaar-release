"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const api_1 = require("./api");
const cafebazaar_1 = require("./cafebazaar");
const constants_1 = require("./constants");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const apiSecret = core.getInput("cafebazaar-pishkhaan-api-secret", {
                required: true,
            });
            const appFilePath = core.getInput("app_file");
            const staged_rollout_percentage = parseInt(core.getInput("staged_rollout_percentage"));
            const auto_publish = Boolean(core.getInput("auto_publish"));
            const developer_note = core.getInput("developer_note");
            const changelog_fa = core.getInput("changelog_fa");
            const changelog_en = core.getInput("changelog_en");
            api_1.api.defaults.headers.common[constants_1.HEADER_AUTHORIZATION_KEY] = apiSecret;
            const commitData = {
                auto_publish,
                changelog_en,
                changelog_fa,
                developer_note,
                staged_rollout_percentage,
            };
            try {
                core.debug(`before checking`);
                const uncommittedRelease = yield (0, cafebazaar_1.checkIfThereIsAnyUncommittedRelease)();
                core.debug(`uncommittedRelease: ${uncommittedRelease}`);
                if (uncommittedRelease) {
                    yield (0, cafebazaar_1.createPackage)(appFilePath);
                    yield (0, cafebazaar_1.commitRelease)(commitData);
                }
                else {
                    yield (0, cafebazaar_1.createRelease)();
                    yield (0, cafebazaar_1.createPackage)(appFilePath);
                    yield (0, cafebazaar_1.commitRelease)(commitData);
                }
            }
            catch (error) {
                core.setFailed(error);
            }
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
