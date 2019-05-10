import * as React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { createPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

it('decorates any future plugs applied on same slot', () => {
  // The first plug opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  const p1 = createPlugin({ name: 'test1' });
  p1.plug('root', () => (
    <>
      <span>I was here first</span>
      <Slot name="root" />
    </>
  ));
  p1.register();

  const p2 = createPlugin({ name: 'test2' });
  p2.plug('root', () => <span>I was here second</span>);
  p2.register();

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
Array [
  <span>
    I was here first
  </span>,
  <span>
    I was here second
  </span>,
]
`);
});
