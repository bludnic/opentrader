declare module "talib" {
  const talib: {
    execute: (
      options: any,
      callback: (err: Error, result: any) => void,
    ) => void;
  };

  export default talib;
}
