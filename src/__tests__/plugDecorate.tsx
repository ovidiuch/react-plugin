import * as React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

it('decorates any future plugs applied on same slot', () => {
  // The first plug opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  const p1 = registerPlugin({ name: 'test1' });
  p1.plug({
    slotName: 'root',
    render: (
      <>
        <span>I was here first</span>
        <Slot name="root" />
      </>
    ),
  });

  const p2 = registerPlugin({ name: 'test2' });
  p2.plug({
    slotName: 'root',
    render: <span>I was here second</span>,
  });

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
