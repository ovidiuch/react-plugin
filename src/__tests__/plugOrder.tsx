import * as React from 'react';
import { create } from 'react-test-renderer';
import { loadPlugins } from 'ui-plugin';
import { createPlugin, resetPlugins, Slot } from '..';

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
  plug({
    slotName: 'root',
    render: (
      <Slot name="root">
        <Preview />
      </Slot>
    ),
  });
  register();
}

function registerNav() {
  const { plug, register } = createPlugin({ name: 'nav' });
  plug({
    slotName: 'root',
    render: ({ children }: { children?: React.ReactNode }) => (
      <div>
        <Nav />
        <Slot name="root">{children}</Slot>
      </div>
    ),
  });
  register();
}

function Nav() {
  return <div className="nav" />;
}

function Preview() {
  return <iframe src="_loader.html" />;
}
