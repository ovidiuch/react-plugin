import React from 'react';
import { create } from 'react-test-renderer';
import { __reset } from '../store';
import { registerPlug, Root } from './_helpers';

afterEach(__reset);

it('uses up slot completely', () => {
  // The first plugins removes up the possibility for a future plugin to
  // override it or to compose with it.
  registerPlug('root', 'I was here first');

  // When this plugin is applied `root` slot doesn't exist anymore
  registerPlug('root', 'I was here second');

  const wrapper = create(<Root />);
  expect(wrapper.toJSON()).toMatchInlineSnapshot(`"I was here first"`);
});
