import React, { cloneElement } from 'react';
import { create } from 'react-test-renderer';
import { register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

function registerButton(label) {
  // This is an example of a high-level plugin register function
  register('buttons', ({ children = [] }) => (
    <Slot name="buttons">
      {[...children, <button key={children.length}>{label}</button>]}
    </Slot>
  ));
}

it('accumulates children from separate plugins', () => {
  registerButton('Home');
  registerButton('About');
  registerButton('Contact');

  const wrapper = create(<Buttons />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
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
