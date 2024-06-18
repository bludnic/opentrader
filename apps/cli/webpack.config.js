const path = require("node:path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  entry: {
    main: "./src/index.ts",
    daemon: "./src/api/up/daemon.ts",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
    noParse: /\/dynamic-import.js$/,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
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
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
