import React from 'react';
import { create } from 'react-test-renderer';
import { Slot } from '../';
import { __reset } from '../store';
import { registerPlug } from './_helpers';

afterEach(__reset);

it('wraps any future plugins applied on same slot', () => {
  // The first plugins opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  registerPlug(
    'root',
    <>
      <span>I was here first</span>
      <Slot name="root" />
    </>
  );

  registerPlug('root', <span>I was here second</span>);

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`
Array [
  <span>
    I was here first
  </span>,
  <span>
    I was here second
  </span>,
]
`);
});

function Root() {
  return <Slot name="root" />;
}
