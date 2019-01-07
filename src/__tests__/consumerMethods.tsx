import * as React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins, PluginsConsumer, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('updates plugins from consumer methods', () => {
  registerPlugin({ name: 'Snoop Dogg' });
  registerPlugin({ name: 'Wiz Khalifa' });
  loadPlugins();

  const renderer = create(<PluginList />);
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
  snoop.props.onClick();
  wiz.props.onClick();

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
  wiz.props.onClick();

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
