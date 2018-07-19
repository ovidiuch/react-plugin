import React from 'react';
import { create } from 'react-test-renderer';
import { register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('overrides plugin previously applied on same slot', () => {
  // The first plugins opens up the possibility for a future plugin to override
  // it or to compose with it. The former is happening in this case.
  register('root', <Slot name="root">I was here first</Slot>);
  register('root', 'I was here second');

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I was here second"`);
});

function Root() {
  return <Slot name="root" />;
}
