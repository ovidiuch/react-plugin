import React from 'react';
import { act, create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { Slot } from '../Slot';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../pluginStore';

afterEach(resetPlugins);

it('loads plugs for changed slot name', async () => {
  const plugin = createPlugin({ name: 'test1' });
  plugin.plug('first', () => <>First plug</>);
  plugin.plug('second', () => <>Second plug</>);
  plugin.register();
  loadPlugins();

  const renderer = create(<Slot name="first" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"First plug"`);

  act(() => renderer.update(<Slot name="second" />));
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"Second plug"`);
});
