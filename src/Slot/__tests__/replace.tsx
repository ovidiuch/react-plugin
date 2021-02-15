import React from 'react';
import { create } from 'react-test-renderer';
import { createPlugin, loadPlugins, resetPlugins, Slot } from '../..';

afterEach(resetPlugins);

it('takes slot away from other (subsequently registered) plugins', () => {
  // The first plugins removes up the possibility for a future plugin to
  // override it or to compose with it.
  const p1 = createPlugin({ name: 'test1' });
  p1.plug('root', () => <>I was here first</>);
  p1.register();

  // When this plugin is applied `root` slot doesn't exist anymore
  const p2 = createPlugin({ name: 'test2' });
  p2.plug('root', () => <>I was here second</>);
  p2.register();

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I was here first"`);
});
