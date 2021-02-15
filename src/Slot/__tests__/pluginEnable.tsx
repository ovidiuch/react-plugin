import retry from '@skidding/async-retry';
import React from 'react';
import { act } from 'react-test-renderer';
import { enablePlugin, loadPlugins } from 'ui-plugin';
import { Slot } from '..';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../store';
import { createRenderer } from '../../testHelpers/createRenderer';

afterEach(resetPlugins);

function HelloWorld() {
  // TS isn't happy with function components returning strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>Hello world!</>;
}

it('ignores plug of disabled plugin', () => {
  const { plug, register } = createPlugin({ name: 'test' });
  plug('root', HelloWorld);
  register();
  enablePlugin('test', false);

  loadPlugins();

  const renderer = createRenderer(<Slot name="root" />);
  expect(() => {
    renderer.root.findByType(HelloWorld);
  }).toThrow();
});

it('renders plug after enabling plugin', () => {
  const { plug, register } = createPlugin({ name: 'test' });
  plug('root', HelloWorld);
  register();
  enablePlugin('test', false);

  loadPlugins();
  enablePlugin('test', true);

  const renderer = createRenderer(<Slot name="root" />);
  expect(renderer.root.findByType(HelloWorld)).toBeTruthy();
});

it('renders plug after enabling loaded plugin', async () => {
  const { plug, register } = createPlugin({ name: 'test' });
  plug('root', HelloWorld);
  register();
  enablePlugin('test', false);

  loadPlugins();
  const renderer = createRenderer(<Slot name="root" />);

  setTimeout(() => {
    act(() => {
      enablePlugin('test', true);
    });
  });

  await retry(() => expect(renderer.root.findByType(HelloWorld)).toBeTruthy());
});
