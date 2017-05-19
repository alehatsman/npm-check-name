import ajax from './lib/ajax';

export default function checkName(name) {
  if (!name) {
    throw new Error('name must be provided');
  }
  return ajax({
    method: 'GET',
    url: `/api/check-name/${name}`,
  });
}
