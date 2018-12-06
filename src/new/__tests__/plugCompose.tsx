import * as React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

it('composes with plugs previously applied on same slot', () => {
  // The first plug opens up the possibility for a future plug to override
  // it or to compose with it. The latter is happening in this case.
  const p1 = registerPlugin({ name: 'test1' });
  p1.plug({
    slotName: 'root',
    render: () => (
      <Slot name="root">
        <span>I was here first</span>
      </Slot>
    ),
  });

  // The second and third plugs continue to allow next plugs to override or
  // compose them, as well as continue to render previous plugs via children
  const p2 = registerPlugin({ name: 'test2' });
  p2.plug({
    slotName: 'root',
    render: ({ children }) => (
      <Slot name="root">
        <>
          {children}
          <span>I was here second</span>
        </>
      </Slot>
    ),
  });

  const p3 = registerPlugin({ name: 'test3' });
  p3.plug({
    slotName: 'root',
    render: ({ children }) => (
      <Slot name="root">
        <>
          {children}
          <span>I was here third</span>
        </>
      </Slot>
    ),
  });

  const wrapper = create(<Slot name="root" />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
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
