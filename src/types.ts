export enum Architecture {
  "all",
  "armeabi-v7a",
  "arm64-v8a",
}

export interface BaseResponse {
  type: string;
  message: string;
}

interface Package {
  apk_size: number;
  sha1_hash: string;
  version_code: number;
  version_name: string;
  api_level: number;
  target_api_level: number;
  upload_date: string;
  cpu_architectures: string;
  dpi: number;
  locale: string;
  additional_files: string[];
}

interface Release {
  creation_date: Date;
  packages: Package[];
  auto_publish: boolean;
  staged_rollout_percentage: number;
  changelog_fa: string;
  changelog_en: string;
}

// Upload release types
export interface UploadReleaseBody {
  architecture: Architecture;
  apk: string;
}

export interface UploadReleaseResponse extends BaseResponse {
  package: Package;
}

// Create release types
export interface CreateReleaseResponse extends BaseResponse {
  release: Release;
}

// Commit release types
interface CommitRelease extends Release {
  id: number;
  release_state: string;
  committed: boolean;
}

export interface CommitReleaseBody {
  changelog_en?: string;
  changelog_fa?: string;
  developer_note?: string;
  staged_rollout_percentage?: number;
  auto_publish: boolean;
}

export interface CommitReleaseResponse extends BaseResponse {
  release: CommitRelease;
}
