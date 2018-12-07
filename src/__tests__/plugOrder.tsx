import * as React from 'react';
import { create } from 'react-test-renderer';
import { registerPlugin, resetPlugins, Slot } from '..';

afterEach(resetPlugins);

it('composes plugs registered inside-out', () => {
  registerPreviewIframe();

  // Assert checkpoint
  const renderer = create(<Slot name="root" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
<iframe
  src="_loader.html"
/>
`);

  registerNav();

  // Assert final composition
  renderer.update(<Slot name="root" />);
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
  const renderer = create(<Slot name="root" />);

  // Assert checkpoint
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
<div>
  <div
    className="nav"
  />
</div>
`);

  registerPreviewIframe();

  // Assert final composition
  renderer.update(<Slot name="root" />);
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
  const { plug } = registerPlugin({ name: 'preview' });

  plug({
    slotName: 'root',
    render: (
      <Slot name="root">
        <Preview />
      </Slot>
    ),
  });
}

function registerNav() {
  const { plug } = registerPlugin({ name: 'nav' });

  plug({
    slotName: 'root',
    render: ({ children }: { children?: React.ReactNode }) => (
      <div>
        <Nav />
        <Slot name="root">{children}</Slot>
      </div>
    ),
  });
}

function Nav() {
  return <div className="nav" />;
}

function Preview() {
  return <iframe src="_loader.html" />;
}
