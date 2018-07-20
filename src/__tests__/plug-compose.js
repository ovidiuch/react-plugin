import React from 'react';
import { create } from 'react-test-renderer';
import { Slot } from '../';
import { __reset } from '../store';
import { registerPlug } from './_helpers';

afterEach(__reset);

it('composes with plugs previously applied on same slot', () => {
  // The first plug opens up the possibility for a future plug to override
  // it or to compose with it. The latter is happening in this case.
  registerPlug(
    'root',
    <Slot name="root">
      <span>I was here first</span>
    </Slot>
  );

  // The second plugs continues to allow next plugs to override or compose.
  registerPlug('root', ({ children }) => (
    <Slot name="root">
      <>
        {children}
        <span>I was here second</span>
      </>
    </Slot>
  ));

  registerPlug('root', ({ children }) => (
    <Slot name="root">
      <>
        {children}
        <span>I was here third</span>
      </>
    </Slot>
  ));

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
Array [
  <span>
    I was here first
  </span>,
  <span>
    I was here second
  </span>,
  <span>
    I was here third
  </span>,
]
`);
});

function Root() {
  return <Slot name="root" />;
}
