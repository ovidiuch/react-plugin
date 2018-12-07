import * as React from 'react';
import { create } from 'react-test-renderer';
import { disablePlugin, Plugin, PluginsConsumer, register } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('calls the consumer render fn with plugin list', () => {
  register(<Plugin name="Graham Chapman" />);
  register(<Plugin name="John Cleese" />);
  register(<Plugin name="Terry Gilliam" />);
  register(<Plugin name="Eric Idle" />);
  register(<Plugin name="Terry Jones" />);
  register(<Plugin name="Michael Palin" />);

  const renderer = create(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle, Terry Jones, Michael Palin"`,
  );
});

it('calls the consumer render fn with enabled plugin list', () => {
  register(<Plugin name="Graham Chapman" />);
  register(<Plugin name="John Cleese" />);
  register(<Plugin name="Terry Gilliam" />);
  register(<Plugin name="Eric Idle" />);
  disablePlugin(register(<Plugin name="Terry Jones" />).id);
  disablePlugin(register(<Plugin name="Michael Palin" />).id);

  const renderer = create(<Root />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle"`,
  );
});

export class Root extends React.Component<{}> {
  render() {
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
}
