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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfThereIsAnyUncommittedRelease = exports.commitRelease = exports.createRelease = exports.createPackage = exports.findFiles = void 0;
const core = __importStar(require("@actions/core"));
const glob_1 = __importDefault(require("@actions/glob"));
const fs_1 = __importDefault(require("fs"));
const api_1 = require("./api");
const constants_1 = require("./constants");
const types_1 = require("./types");
const patterns = ["**/*.aab", "**/*.apk"];
const findFiles = (file_path) => __awaiter(void 0, void 0, void 0, function* () {
    const globber = yield glob_1.default.create(file_path || patterns.join("\n"));
    return globber.glob();
});
exports.findFiles = findFiles;
const createPackage = (file_path, architecture = types_1.Architecture.all) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, exports.findFiles)(file_path);
    if (files.length > 0) {
        const results = [];
        for (const file of files) {
            const headers = {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            };
            const data = new FormData();
            const f = fs_1.default.createReadStream(file);
            data.append("apk", f);
            data.append("architecture", architecture.toString());
            const result = yield api_1.api.post(constants_1.upload, data, {
                headers,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    core.info(`Package upload: ${percentCompleted}% uploaded`);
                },
            });
            if (result.data.type !== "success") {
                throw new Error(result.data.message);
            }
            results.push(result);
        }
        return results;
    }
    else {
        throw new Error("No files found");
    }
});
exports.createPackage = createPackage;
const createRelease = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield api_1.api.post(constants_1.releases, {});
    core.info("Create release: " + result.data.message);
    if (result.data.type !== "success") {
        throw new Error(result.data.message);
    }
    return result;
});
exports.createRelease = createRelease;
const commitRelease = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield api_1.api.post(constants_1.commit, Object.assign(Object.assign({}, data), { auto_publish: false }));
    if (result.data.type !== "success") {
        throw new Error(result.data.message);
    }
    return result;
});
exports.commitRelease = commitRelease;
const checkIfThereIsAnyUncommittedRelease = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield api_1.api.get(constants_1.lastUncommitted);
    core.info("Check if there is any uncommitted release: " + result.data.message);
    return result.data.type !== "not-exists";
});
exports.checkIfThereIsAnyUncommittedRelease = checkIfThereIsAnyUncommittedRelease;
