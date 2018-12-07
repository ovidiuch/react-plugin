import * as React from 'react';
import { create } from 'react-test-renderer';
import { disablePlugin, enablePlugin, Plug, Plugin, register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('only renders enabled plugin', () => {
  const { id: pluginId } = register(
    <Plugin name="test">
      <Plug slot="root" render="I am root" />
    </Plugin>,
  );

  const renderer = create(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I am root"`);

  disablePlugin(pluginId);
  renderer.update(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`null`);

  enablePlugin(pluginId);
  renderer.update(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`"I am root"`);
});

function Root() {
  return <Slot name="root" />;
}
