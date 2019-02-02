import * as React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { createPlugin, resetPlugins, Slot } from '../';

afterEach(resetPlugins);

// This is an example of a high-level register function
function registerButton({ name, label }: { name: string; label: string }) {
  const { plug, register } = createPlugin({ name });
  plug({
    slotName: 'buttons',
    render: ({
      children = [],
    }: {
      children: Array<React.ReactElement<'button'>>;
    }) => (
      <Slot name="buttons">
        {[...children, <button key={children.length}>{label}</button>]}
      </Slot>
    ),
  });
  register();
}

it('accumulates children from separate plugs', () => {
  registerButton({ name: 'home', label: 'Home' });
  registerButton({ name: 'about', label: 'About' });
  registerButton({ name: 'contact', label: 'Contact' });

  loadPlugins();

  const renderer = create(<Slot name="buttons" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
Array [
  <button>
    Home
  </button>,
  <button>
    About
  </button>,
  <button>
    Contact
  </button>,
]
`);
});
