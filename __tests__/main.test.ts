import { createRelease } from "../src/cafebazaar";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const createReleaseMockResponse = {
  type: "success",
  message: "New Release successfully created.",
  release: {
    creation_date: "2021-07-18T16:24:25.944528",
    packages: [
      {
        apk_size: 8801,
        sha1_hash: "CeFHTFKdmozjAcDUPGFIVlZqaBBcVDhpETDrErZV",
        version_code: 0,
        version_name:
          "XoTcPhBfKQFLDigPJSwVMfuNdDZtTnJhSAJCimJCFjzPcduiZxaPHPErZteLaXJ",
        api_level: 0,
        target_api_level: 718,
        upload_date: "2021-07-18",
        cpu_architectures: "",
        dpi: 1,
        locale: "en",
        additional_files: [],
      },
    ],
    auto_publish: false,
    staged_rollout_percentage: 100,
    changelog_fa: "",
    changelog_en: "",
  },
};

test.skip("should be defined", async () => {
  mockedAxios.post.mockResolvedValue(createReleaseMockResponse);
  await createRelease();
  expect(axios.post).toHaveBeenCalled();
  expect(axios.post).resolves.toBe(createReleaseMockResponse);
  mockedAxios.post.mockReset();
});
