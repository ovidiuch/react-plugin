declare module '@skidding/linked-list' {
  type LinkedItem<Item> = {
    value: null | Item;
    next: () => LinkedItem<Item>;
  };

  export default function createLinkedList<Item>(
    items: Item[],
  ): LinkedItem<Item>;
}
