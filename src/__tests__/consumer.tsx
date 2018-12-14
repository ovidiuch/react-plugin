import * as React from 'react';
import { create } from 'react-test-renderer';
import {
  enablePlugin,
  loadPlugins,
  PluginsConsumer,
  registerPlugin,
  resetPlugins,
} from '..';

afterEach(resetPlugins);

it('calls the consumer render fn with plugin list', () => {
  registerPlugin({ name: 'Graham Chapman' });
  registerPlugin({ name: 'John Cleese' });
  registerPlugin({ name: 'Terry Gilliam' });
  registerPlugin({ name: 'Eric Idle' });
  registerPlugin({ name: 'Terry Jones' });
  registerPlugin({ name: 'Michael Palin' });
  loadPlugins();

  const renderer = create(<EnabledPluginNames />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle, Terry Jones, Michael Palin"`,
  );
});

it('calls the consumer render fn with enabled plugin list', () => {
  registerPlugin({ name: 'Graham Chapman' });
  registerPlugin({ name: 'John Cleese' });
  registerPlugin({ name: 'Terry Gilliam' });
  registerPlugin({ name: 'Eric Idle' });
  registerPlugin({ name: 'Terry Jones', enabled: false });
  registerPlugin({ name: 'Michael Palin', enabled: false });
  loadPlugins();

  const renderer = create(<EnabledPluginNames />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle"`,
  );
});

it('calls the consumer render fn with enabled plugin list', () => {
  registerPlugin({ name: 'Graham Chapman' });
  registerPlugin({ name: 'John Cleese' });
  registerPlugin({ name: 'Terry Gilliam' });
  registerPlugin({ name: 'Eric Idle' });
  const terry = registerPlugin({ name: 'Terry Jones' });
  const michael = registerPlugin({ name: 'Michael Palin' });

  const renderer = create(<EnabledPluginNames />);
  loadPlugins();

  enablePlugin(terry.pluginId, false);
  enablePlugin(michael.pluginId, false);

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
