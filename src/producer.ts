export interface Reciever<T> {
  next(value: T): void;
}

export interface Producer<T> {
  start(listener: Reciever<T>): void;
  stop(): void;
}
