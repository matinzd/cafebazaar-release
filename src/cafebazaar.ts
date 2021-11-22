import * as core from "@actions/core";
import { create } from "@actions/glob";
import { AxiosResponse } from "axios";
import FormData from "form-data";
import fs from "fs";
import { api } from "./api";
import { commit, lastUncommitted, releases, upload } from "./constants";
import {
  Architecture,
  BaseResponse,
  CommitReleaseBody,
  CommitReleaseResponse,
  CreateReleaseResponse,
  UploadReleaseResponse,
} from "./types";

const patterns = ["**/*.aab", "**/*.apk"];

export const findFiles = async (file_path?: string): Promise<string[]> => {
  const globber = await create(file_path || patterns.join("\n"));
  return globber.glob();
};

export const createPackage = async (
  file_path?: string,
  architecture: Architecture = Architecture.all
) => {
  const files = await findFiles(file_path);
  if (files.length > 0) {
    const results = [];
    for (const file of files) {
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };
      const data = new FormData();

      const f = fs.createReadStream(file);

      data.append("apk", f as unknown as Blob);
      data.append("architecture", architecture.toString());
      const result = await api.post<UploadReleaseResponse>(upload, data, {
        headers,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          core.info(`Package upload: ${percentCompleted}% uploaded`);
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      if (result.data.type !== "success") {
        throw new Error(result.data.message);
      }

      results.push(result);
    }

    return results;
  } else {
    throw new Error("No files found");
  }
};

export const createRelease = async () => {
  const result = await api.post<CreateReleaseResponse>(releases, {});

  core.info("Create release: " + result.data.message);

  if (result.data.type !== "success") {
    throw new Error(result.data.message);
  }

  return result;
};

export const commitRelease = async (data: CommitReleaseBody) => {
  const result = await api.post<
    CommitReleaseResponse,
    AxiosResponse<CommitReleaseResponse>,
    CommitReleaseBody
  >(commit, { ...data, auto_publish: false });

  if (result.data.type !== "success") {
    throw new Error(result.data.message);
  }

  return result;
};

export const checkIfThereIsAnyUncommittedRelease = async () => {
  const result = await api.get<BaseResponse>(lastUncommitted);
  core.info(
    "Check if there is any uncommitted release: " + result.data.message
  );
  return result.data.type !== "not-exists";
};
