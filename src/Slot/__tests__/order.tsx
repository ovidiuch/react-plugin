import React, { ReactNode } from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { Slot } from '..';
import { createPlugin } from '../../createPlugin';
import { resetPlugins } from '../../store';

afterEach(resetPlugins);

it('composes plugs registered inside-out', () => {
  registerPreviewIframe();
  registerNav();
  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
  <iframe
    src="_loader.html"
  />
</div>
`);
});

it('composes plugs registered outside-in', () => {
  registerNav();
  registerPreviewIframe();
  loadPlugins();

  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
  <iframe
    src="_loader.html"
  />
</div>
`);
});

function registerPreviewIframe() {
  const { plug, register } = createPlugin({ name: 'preview' });
  plug('root', () => (
    <Slot name="root">
      <Preview />
    </Slot>
  ));
  register();
}

function registerNav() {
  const { plug, register } = createPlugin({ name: 'nav' });
  plug('root', ({ children }: { children?: ReactNode }) => (
    <div>
      <Nav />
      <Slot name="root">{children}</Slot>
    </div>
  ));
  register();
}

function Nav() {
  return <div className="nav" />;
}

function Preview() {
  return <iframe src="_loader.html" />;
}
