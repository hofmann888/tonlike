import nextEnv from "@next/env";

if (nextEnv && "loadEnvConfig" in nextEnv) {
  nextEnv.loadEnvConfig(process.cwd());
} else {
  require("@next/env").loadEnvConfig(process.cwd()); // eslint-disable-next-line
}