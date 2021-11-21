import * as core from "@actions/core";
import { api } from "./api";
import {
  checkIfThereIsAnyUncommittedRelease,
  commitRelease,
  createPackage,
  createRelease,
} from "./cafebazaar";
import { HEADER_AUTHORIZATION_KEY } from "./constants";

async function run(): Promise<void> {
  try {
    const apiSecret: string = core.getInput("cafebazaar-pishkhaan-api-secret", {
      required: true,
    });
    const appFilePath: string = core.getInput("app_file");
    const staged_rollout_percentage: number = parseInt(
      core.getInput("staged_rollout_percentage")
    );
    const auto_publish = Boolean(core.getInput("auto_publish"));
    const developer_note: string = core.getInput("developer_note");
    const changelog_fa: string = core.getInput("changelog_fa");
    const changelog_en: string = core.getInput("changelog_en");

    api.defaults.headers.common[HEADER_AUTHORIZATION_KEY] = apiSecret;

    const commitData = {
      auto_publish,
      changelog_en,
      changelog_fa,
      developer_note,
      staged_rollout_percentage,
    };

    try {
      const uncommittedRelease = await checkIfThereIsAnyUncommittedRelease();

      core.debug(`uncommittedRelease: ${uncommittedRelease}`);

      if (uncommittedRelease) {
        await createPackage(appFilePath);
        await commitRelease(commitData);
      } else {
        await createRelease();
        await createPackage(appFilePath);
        await commitRelease(commitData);
      }
    } catch (error) {
      core.setFailed(error as Error);
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
