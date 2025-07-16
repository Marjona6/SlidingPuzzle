export class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  constructor(private comparator: (a: { element: T; priority: number }, b: { element: T; priority: number }) => boolean) {}

  enqueue(element: T, priority: number) {
    const newItem = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.comparator(newItem, this.items[i])) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(newItem);
    }
  }

  dequeue(): T {
    const item = this.items.shift();
    if (!item) throw new Error("Queue is empty");
    return item.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
