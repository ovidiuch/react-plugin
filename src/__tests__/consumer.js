import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, disablePlugin, PluginsConsumer } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('calls the consumer render fn with plugin list', () => {
  registerPlugin({ name: 'Graham Chapman' });
  registerPlugin({ name: 'John Cleese' });
  registerPlugin({ name: 'Terry Gilliam' });
  registerPlugin({ name: 'Eric Idle' });
  registerPlugin({ name: 'Terry Jones' });
  registerPlugin({ name: 'Michael Palin' });

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle, Terry Jones, Michael Palin"`
  );
});

it('calls the consumer render fn with enabled plugin list', () => {
  registerPlugin({ name: 'Graham Chapman' });
  registerPlugin({ name: 'John Cleese' });
  registerPlugin({ name: 'Terry Gilliam' });
  registerPlugin({ name: 'Eric Idle' });
  disablePlugin(registerPlugin({ name: 'Terry Jones' }).id);
  disablePlugin(registerPlugin({ name: 'Michael Palin' }).id);

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(
    `"Graham Chapman, John Cleese, Terry Gilliam, Eric Idle"`
  );
});

export class Root extends Component {
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
