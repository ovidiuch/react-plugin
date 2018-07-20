import React from 'react';
import { create } from 'react-test-renderer';
import { register, Plugin, Plug, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('composes with plugs previously applied on same slot', () => {
  // The first plug opens up the possibility for a future plug to override
  // it or to compose with it. The latter is happening in this case.
  register(
    <Plugin name="test">
      <Plug
        slot="root"
        render={
          <Slot name="root">
            <span>I was here first</span>
          </Slot>
        }
      />
    </Plugin>
  );

  // The second and third plugs continue to allow next plugs to override or
  // compose them, as well as continue to render previous plugs via children
  register(
    <Plugin name="test">
      <Plug
        slot="root"
        render={({ children }) => (
          <Slot name="root">
            <>
              {children}
              <span>I was here second</span>
            </>
          </Slot>
        )}
      />
    </Plugin>
  );

  register(
    <Plugin name="test">
      <Plug
        slot="root"
        render={({ children }) => (
          <Slot name="root">
            <>
              {children}
              <span>I was here third</span>
            </>
          </Slot>
        )}
      />
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
  <span>
    I was here third
  </span>,
]
`);
});

function Root() {
  return <Slot name="root" />;
}
