import ajax from '../xhr';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org/';

export default function checkNake(name) {
  if (!name) {
    throw new Error('name must be provided');
  }
  return ajax({
    method: 'GET',
    url: `/check-name/${name}`,
  });
}
