import React from 'react';
import { create } from 'react-test-renderer';
import { Slot, registerPlugin, disablePlugin, enablePlugin } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('only renders enabled plugin', () => {
  const { id: pluginId } = registerPlugin({
    plugs: [{ slot: 'root', render: 'I am root' }]
  });

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I am root"`);

  disablePlugin(pluginId);
  wrapper.update(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`null`);

  enablePlugin(pluginId);
  wrapper.update(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I am root"`);
});

function Root() {
  return <Slot name="root" />;
}
