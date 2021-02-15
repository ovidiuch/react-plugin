import React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { createPlugin, resetPlugins, Slot } from '../..';

afterEach(resetPlugins);

it('overrides plug previously applied on same slot', () => {
  // The first plugs opens up the possibility for a future plug to override
  // it or to compose with it. The former is happening in this case.
  const p1 = createPlugin({ name: 'test1 ' });
  p1.plug('root', () => <Slot name="root">I was here first</Slot>);
  p1.register();

  const p2 = createPlugin({ name: 'test2 ' });
  p2.plug('root', () => <>I was here second</>);
  p2.register();

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I was here second"`);
});
