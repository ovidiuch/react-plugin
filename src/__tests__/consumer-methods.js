import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { register, Plugin, PluginsConsumer } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('updates plugins from consumer methods', () => {
  register(<Plugin name="Snoop Dogg" />);
  register(<Plugin name="Wiz Khalifa" />);

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
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
  const [snoop, wiz] = wrapper.root.findAllByType('p');
  snoop.props.onClick();
  wiz.props.onClick();

  wrapper.update(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
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

  wrapper.update(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
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

export class Root extends Component {
  render() {
    return (
      <PluginsConsumer>
        {({ plugins }) =>
          plugins.map(({ id, name, enabled, disable, enable }) => (
            <p key={id} onClick={() => (enabled ? disable() : enable())}>
              {`${enabled ? '[x]' : '[ ]'} ${name}`}
            </p>
          ))
        }
      </PluginsConsumer>
    );
  }
}
