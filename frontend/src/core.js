import Store from './lib/store';

export default {
  store: new Store({
    packageName: '',
    loading: false,
    isAvailable: null,
  }),
};
