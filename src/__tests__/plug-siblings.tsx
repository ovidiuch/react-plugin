import * as React from 'react';
import { create } from 'react-test-renderer';
import { Plug, Plugin, register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

function registerButton(label: string) {
  // This is an example of a high-level register function
  register(
    <Plugin name="test">
      <Plug
        slot="buttons"
        render={({ children = [] }) => (
          <Slot name="buttons">
            {[...children, <button key={children.length}>{label}</button>]}
          </Slot>
        )}
      />
    </Plugin>,
  );
}

it('accumulates children from separate plugs', () => {
  registerButton('Home');
  registerButton('About');
  registerButton('Contact');

  const renderer = create(<Buttons />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
<div
  className="buttons"
>
  <button>
    Home
  </button>
  <button>
    About
  </button>
  <button>
    Contact
  </button>
</div>
`);
});

function Buttons() {
  return (
    <div className="buttons">
      <Slot name="buttons" />
    </div>
  );
}
