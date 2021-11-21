# Upload android release to cafe bazaar store

You can upload your app to Cafebazaar using this github actions. It supports both `.apk` and `.aab`.

# Inputs

| Parameter                       | Description                                                                   | Required | Default                 |
| ------------------------------- | ----------------------------------------------------------------------------- | -------- | ----------------------- |
| cafebazaar-pishkhaan-api-secret | Cafe Bazaar API Secret                                                        | true     | N/A                     |
| app_file                        | Path to APK/AAB file, by default it will pick first apk or aab in directories | false    | `["\**/\*.apk","**/\*.aab"]` |
| staged_rollout_percentage       | Rollout percentage                                                            | false    | 100                     |
| auto_publish                    | Auto publish the package after approval                                       | false    | true                    |
| developer_note                  | Developer note for when publishing for administrators                         | false    | N/A                     |
| changelog_fa                    | Changelog in persian                                                          | false    | N/A                     |
| changelog_en                    | Changelog in english                                                          | false    | N/A                     |

Feel free to open issues and make pull requests.