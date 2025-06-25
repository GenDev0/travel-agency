import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from 'vite-plugin-devtools-json';

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "genydev",
  project: "travel-agency",
  // An auth token is required for uploading source maps.
  authToken: "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"
  // ...
};

// export default defineConfig({
//   plugins: [tailwindcss(), tsconfigPaths(),reactRouter(), sentryReactRouter(sentryConfig, config)],
//   ssr: {
//     noExternal: [
//       /@syncfusion/,
//     ],
//   }
// });

export default defineConfig(config => {
  return {
  plugins: [tailwindcss(), tsconfigPaths(), reactRouter(),sentryReactRouter(sentryConfig, config), devtoolsJson()],
  sentryConfig,
  ssr: {
    noExternal: [
      /@syncfusion/,
    ],
  }
  };
});
