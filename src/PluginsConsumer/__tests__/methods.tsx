import React from 'react';
import { act } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { PluginsConsumer } from '../PluginsConsumer';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../pluginStore';
import { createRenderer } from '../../testHelpers/createRenderer';

afterEach(resetPlugins);

it('updates plugins from consumer methods', () => {
  createPlugin({ name: 'Snoop Dogg' }).register();
  createPlugin({ name: 'Wiz Khalifa' }).register();
  loadPlugins();

  const renderer = createRenderer(<PluginList />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
Array [
  <p
    onClick={[Function]}
  >
    [x] Snoop Dogg
  </p>,
  <p
    onClick={[Function]}
  >
    [x] Wiz Khalifa
  </p>,
]
`);

  // Disable both
  const [snoop, wiz] = renderer.root.findAllByType('p');
  act(() => {
    snoop.props.onClick();
    wiz.props.onClick();
  });

  expect(renderer.toJSON()).toMatchInlineSnapshot(`
Array [
  <p
    onClick={[Function]}
  >
    [ ] Snoop Dogg
  </p>,
  <p
    onClick={[Function]}
  >
    [ ] Wiz Khalifa
  </p>,
]
`);

  // Bring back Wiz
  act(() => {
    wiz.props.onClick();
  });

  expect(renderer.toJSON()).toMatchInlineSnapshot(`
Array [
  <p
    onClick={[Function]}
  >
    [ ] Snoop Dogg
  </p>,
  <p
    onClick={[Function]}
  >
    [x] Wiz Khalifa
  </p>,
]
`);
});

function PluginList() {
  return (
    <PluginsConsumer>
      {({ plugins, enable }) =>
        plugins.map(({ name, enabled }) => (
          <p key={name} onClick={() => enable(name, !enabled)}>
            {`${enabled ? '[x]' : '[ ]'} ${name}`}
          </p>
        ))
      }
    </PluginsConsumer>
  );
}
