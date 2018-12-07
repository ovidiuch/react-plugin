import retry from '@skidding/async-retry';
import * as React from 'react';
import { create } from 'react-test-renderer';
import { reloadPlugins } from 'ui-plugin';
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

it('renders plug after enabling plugin at run time', async () => {
  const { plug } = registerPlugin({ name: 'test', enabled: false });
  plug({
    slotName: 'root',
    render: HelloWorld,
  });

  const renderer = create(<div />);
  loadPlugins({}, () => {
    renderer.update(<Slot name="root" />);
  });

  setTimeout(() => {
    enablePlugin('test', true);
    reloadPlugins();
  });

  await retry(() => expect(renderer.root.findByType(HelloWorld)).toBeTruthy());
});
