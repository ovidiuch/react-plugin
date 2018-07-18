import React, { cloneElement } from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, Zone } from '../';
import { __reset } from '../store';

afterEach(__reset);

function registerButton(label) {
  // This is an example of a high-level plugin register function
  registerPlugin('buttons', ({ children }) => {
    const nextButton = <button>{label}</button>;
    const buttons = children ? [...children, nextButton] : [nextButton];

    return (
      <Zone name="buttons">
        {buttons.map((button, index) => cloneElement(button, { key: index }))}
      </Zone>
    );
  });
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
      <Zone name="buttons" />
    </div>
  );
}
