declare module '@skidding/async-retry' {
  type Options = {
    timeout?: number;
    loopDelay?: number;
  };

  export default function retry(cb: () => unknown, opts?: Options): Promise<void>;
}
