declare module '@skidding/async-retry' {
  interface IOptions {
    timeout?: number;
    loopDelay?: number;
  }

  export default function retry(
    cb: () => unknown,
    opts?: IOptions,
  ): Promise<void>;
}
