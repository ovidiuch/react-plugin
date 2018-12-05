import * as React from 'react';

// Noop function, used to construct JSX object for plugin definition
export function Plug(props: {
  slot: string;
  render: React.ReactNode | React.Component;
}) {
  return null;
}
