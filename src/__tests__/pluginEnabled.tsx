import * as React from 'react';
import { create } from 'react-test-renderer';
import {
  enablePlugin,
  loadPlugins,
  registerPlugin,
  resetPlugins,
  Slot,
} from '..';

afterEach(resetPlugins);

function HelloWorld() {
  // TS isn't happy with function components returning strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
  return <>Hello world!</>;
}

it('ignores plug of disabled plugin', () => {
  const { plug } = registerPlugin({ name: 'test', enabled: false });
  plug({
    slotName: 'root',
    render: HelloWorld,
  });

  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(() => {
    renderer.root.findByType(HelloWorld);
  }).toThrow();
});

it('renders plug after enabling plugin', () => {
  const { plug } = registerPlugin({ name: 'test', enabled: false });
  plug({
    slotName: 'root',
    render: HelloWorld,
  });

  loadPlugins();
  enablePlugin('test', true);

  const renderer = create(<Slot name="root" />);
  expect(renderer.root.findByType(HelloWorld)).toBeTruthy();
});
