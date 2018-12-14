import * as React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

it('overrides plug previously applied on same slot', () => {
  // The first plugs opens up the possibility for a future plug to override
  // it or to compose with it. The former is happening in this case.
  const p1 = registerPlugin({ name: 'test1 ' });
  p1.plug({
    slotName: 'root',
    render: <Slot name="root">I was here first</Slot>,
  });

  const p2 = registerPlugin({ name: 'test2 ' });
  p2.plug({
    slotName: 'root',
    render: 'I was here second',
  });

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I was here second"`);
});
