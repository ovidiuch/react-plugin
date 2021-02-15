import React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { Slot } from '..';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../store';

afterEach(resetPlugins);

it('composes with plugs previously applied on same slot', () => {
  // The first plug opens up the possibility for a future plug to override
  // it or to compose with it. The latter is happening in this case.
  const p1 = createPlugin({ name: 'test1' });
  p1.plug('root', () => (
    <Slot name="root">
      <span>I was here first</span>
    </Slot>
  ));
  p1.register();

  // The second and third plugs continue to allow next plugs to override or
  // compose them, as well as continue to render previous plugs via children
  const p2 = createPlugin({ name: 'test2' });
  p2.plug('root', ({ children }) => (
    <Slot name="root">
      <>
        {children}
        <span>I was here second</span>
      </>
    </Slot>
  ));
  p2.register();

  const p3 = createPlugin({ name: 'test3' });
  p3.plug('root', ({ children }) => (
    <Slot name="root">
      <>
        {children}
        <span>I was here third</span>
      </>
    </Slot>
  ));
  p3.register();

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
  <span>
    I was here third
  </span>,
]
`);
});
