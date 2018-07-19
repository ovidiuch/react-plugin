import React from 'react';
import { create } from 'react-test-renderer';
import { register, Slot } from '../';
import { __reset } from '../store';

afterEach(__reset);

it('takes up slot from plugins applied next', () => {
  // The first plugins removes up the possibility for a future plugin to
  // override it or to compose with it.
  register('root', 'I was here first');

  // When this plugin is applied `root` slot doesn't exist anymore
  register('root', 'I was here second');

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I was here first"`);
});

function Root() {
  return <Slot name="root" />;
}
