import React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, Zone } from '../';
import { __reset } from '../store';

beforeEach(__reset);

it('wraps any future plugins applied on same zone', () => {
  // The first plugins opens up the possibility for a future plugin to override
  // it or to compose with it. The latter is happening in this case.
  registerPlugin(
    'root',
    <>
      <span>I was here first</span>
      <Zone name="root" />
    </>
  );
  registerPlugin('root', <span>I was here second</span>);

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
  return <Zone name="root" />;
}
