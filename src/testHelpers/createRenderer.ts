import { ReactElement } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

export function createRenderer(element: ReactElement): ReactTestRenderer {
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = create(element);
  });
  return renderer!;
}
