import React from 'react';
import { create } from 'react-test-renderer';
import { register, Plugin, Plug, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('wraps any future plugs applied on same slot', () => {
  // The first plug opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  register(
    <Plugin name="test">
      <Plug
        slot="root"
        render={
          <>
            <span>I was here first</span>
            <Slot name="root" />
          </>
        }
      />
    </Plugin>
  );

  register(
    <Plugin name="test">
      <Plug slot="root" render={<span>I was here second</span>} />
    </Plugin>
  );

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
