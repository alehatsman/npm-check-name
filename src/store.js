export default class Store {
  constructor(initialState = {}) {
    this.listeners = [];
    this.state = initialState;
  }

  subscribe(cb) {
    this.listeners.push(cb);
    cb();
  }

  unsubscribe(cb) {
    this.listeners = this.listeners.filter(listener => listener !== cb);
  }

  changeState(cb) {
    this.state = cb(this.state);
    console.log('state: ', this.state); // eslint-disable-line
    this.emitChange();
  }

  getState() {
    return this.state;
  }

  emitChange() {
    this.listeners.forEach(cb => cb(this.state));
  }
}
