import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

const config: webpack.Configuration = {
  target: "node",
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      // resolve TS paths
      "#db": path.resolve(__dirname, "../../packages/db/src"),
      "#processing": path.resolve(__dirname, "../../packages/processing/src"),
      "#exchanges": path.resolve(__dirname, "../../packages/exchanges/src"),
    },
  },
  // in order to ignore all modules in node_modules folder
  externals: [
    nodeExternals({
      allowlist: [
        /^@opentrader/, // bundle only `@opentrader/*` packages
      ],
    }),
  ],
  externalsPresets: {
    node: true, // in order to ignore built-in modules like path, fs, etc.
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};

export default config;
