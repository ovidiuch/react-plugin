- [ ] Test new plug API in react-cosmos with yarn link
- [ ] Test for context memoization in plugs (or use memo?)
- [ ] Create useArraySlot
- [ ] Rename Slot props to `slotProps`
- [ ] Maybe: createPluginStore

---

- [x] Use TypeScript
- [x] Use ui-plugin
  - [x] Map plugs per plugin
- [x] Add support for slot props
- [x] s/wrapper/renderer
- [x] Only render plugs of enabled plugins
- [x] Support children in plugs
- [x] Publish Flow types
- [ ] ~~Export types for PluginsConsumer~~
- [ ] ~~Handle "dispatch" props in getProps (avoid re-rendering because anonymous function gets created on every getProps call)~~
