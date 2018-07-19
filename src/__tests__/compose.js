import React from 'react';
import { create } from 'react-test-renderer';
import { register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('composes with plugins previously applied on same slot', () => {
  // The first plugins opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  register(
    'root',
    <Slot name="root">
      <span>I was here first</span>
    </Slot>
  );

  // The second plugins continues to allow next plugins to override or compose.
  register('root', ({ children }) => (
    <Slot name="root">
      <>
        {children}
        <span>I was here second</span>
      </>
    </Slot>
  ));

  register('root', ({ children }) => (
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
