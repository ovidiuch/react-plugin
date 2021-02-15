import React from 'react';
import { act } from 'react-test-renderer';
import { enablePlugin, loadPlugins } from 'ui-plugin';
import { PluginsConsumer } from '../PluginsConsumer';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../pluginStore';
import { createRenderer } from '../../testHelpers/createRenderer';

afterEach(resetPlugins);

it('calls the consumer render fn with plugin list', () => {
  createPlugin({ name: 'Graham Chapman' }).register();
  createPlugin({ name: 'John Cleese' }).register();
  createPlugin({ name: 'Terry Gilliam' }).register();
  createPlugin({ name: 'Eric Idle' }).register();
  createPlugin({ name: 'Terry Jones' }).register();
  createPlugin({ name: 'Michael Palin' }).register();
  loadPlugins();

  const renderer = createRenderer(<EnabledPluginNames />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle, Terry Jones, Michael Palin"`,
  );
});

it('calls the consumer render fn with enabled plugin list', () => {
  createPlugin({ name: 'Graham Chapman' }).register();
  createPlugin({ name: 'John Cleese' }).register();
  createPlugin({ name: 'Terry Gilliam' }).register();
  createPlugin({ name: 'Eric Idle' }).register();
  createPlugin({ name: 'Terry Jones' }).register();
  createPlugin({ name: 'Michael Palin' }).register();
  enablePlugin('Terry Jones', false);
  enablePlugin('Michael Palin', false);
  loadPlugins();

  const renderer = createRenderer(<EnabledPluginNames />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle"`,
  );
});

it('calls the consumer render fn with enabled plugin list', () => {
  createPlugin({ name: 'Graham Chapman' }).register();
  createPlugin({ name: 'John Cleese' }).register();
  createPlugin({ name: 'Terry Gilliam' }).register();
  createPlugin({ name: 'Eric Idle' }).register();
  createPlugin({ name: 'Terry Jones' }).register();
  createPlugin({ name: 'Michael Palin' }).register();

  const renderer = createRenderer(<EnabledPluginNames />);
  loadPlugins();

  act(() => {
    enablePlugin('Terry Jones', false);
    enablePlugin('Michael Palin', false);
  });

  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle"`,
  );
});

function EnabledPluginNames() {
  return (
    <PluginsConsumer>
      {({ plugins }) =>
        plugins
          .filter(({ enabled }) => enabled)
          .map(({ name }) => name)
          .join(', ')
      }
    </PluginsConsumer>
  );
}
