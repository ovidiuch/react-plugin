import * as React from 'react';
import { create } from 'react-test-renderer';
import { mountPlugins, registerPlugin, resetPlugins, Slot } from '../';

afterEach(resetPlugins);

// This is an example of a high-level register function
function registerButton({ name, label }: { name: string; label: string }) {
  const { plug } = registerPlugin({ name });

  plug({
    slotName: 'buttons',
    component: ({
      children = [],
    }: {
      children: Array<React.ReactElement<'button'>>;
    }) => (
      <Slot name="buttons">
        {[...children, <button key={children.length}>{label}</button>]}
      </Slot>
    ),
  });
}

it('accumulates children from separate plugs', () => {
  registerButton({ name: 'home', label: 'Home' });
  registerButton({ name: 'about', label: 'About' });
  registerButton({ name: 'contact', label: 'Contact' });

  const { rootElement } = mountPlugins({ rootSlotName: 'buttons' });

  const wrapper = create(rootElement);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
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
