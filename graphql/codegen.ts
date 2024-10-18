import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:5500/graphql",
  documents: [
    "graphql/queries/**/*.graphql", 
    "graphql/mutations/**/*.graphql",
    'graphql/subscriptions/**/*.graphql',
  ],
  generates: {
    "graphql/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        skipTypename: false,
        withHook: true,
        withHOC: false,
        withComponent: false
      }
    },
  },
};

export default config;
