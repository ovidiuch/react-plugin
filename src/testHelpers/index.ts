import * as React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

export function createRenderer(element: React.ReactElement): ReactTestRenderer {
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = create(element);
  });
  return renderer!;
}
