declare module "priorityQueue" {
  export class PriorityQueue<T> {
    constructor(comparator: (a: { element: T; priority: number }, b: { element: T; priority: number }) => boolean);
    enqueue(element: T, priority: number): void;
    dequeue(): T;
    isEmpty(): boolean;
  }
}
