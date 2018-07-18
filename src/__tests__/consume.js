import React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, Zone } from '../';
import { __reset } from '../store';

beforeEach(__reset);

it('takes up zone from plugins applied next', () => {
  // The first plugins removes up the possibility for a future plugin to
  // override it or to compose with it.
  registerPlugin('root', 'I was here first');
  // When this plugin is applied `root` zone doesn't exist anymore
  registerPlugin('root', 'I was here second');

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I was here first"`);
});

function Root() {
  return <Zone name="root" />;
}
