import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('throws if plugin is already loaded', async () => {
  const { plug } = registerPlugin({ name: 'test' });
  loadPlugins();

  expect(() => {
    plug({
      slotName: 'root',
      render: 'Lorem ipsum',
    });
  }).toThrow(`Registered plug after plugin loaded`);
});
