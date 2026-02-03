/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}

declare global {
  interface Window {
    FlutterwaveCheckout?: any;
  }
}

export {};
