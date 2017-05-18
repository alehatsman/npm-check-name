import ajax from './xhr';

/*
export default function checkNake(name) {
  if (!name) {
    throw new Error('name must be provided');
  }
  return ajax({
    method: 'GET',
    url: `/api/check-name/${name}`,
  });
}
*/

export default function checkNameUsingProxy(name) {
  if (!name) {
    throw new Error('name must be provided');
  }
  return ajax({
    method: 'GET',
    url: `https://crossorigin.me/https://registry.npmjs.org/${name}`,
  }).then(res => ({ result: !res._id })); // eslint-disable-line
}
