import React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, Zone } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('composes with plugins previously applied on same zone', () => {
  // The first plugins opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  registerPlugin(
    'root',
    <Zone name="root">
      <span>I was here first</span>
    </Zone>
  );

  // The second plugins continues to allow next plugins to override or compose.
  registerPlugin('root', ({ children }) => (
    <Zone name="root">
      <>
        {children}
        <span>I was here second</span>
      </>
    </Zone>
  ));

  registerPlugin('root', ({ children }) => (
    <Zone name="root">
      <>
        {children}
        <span>I was here third</span>
      </>
    </Zone>
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
  return <Zone name="root" />;
}
