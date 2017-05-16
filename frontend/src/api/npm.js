import ajax from '../xhr';

export default function checkNake(name) {
  if (!name) {
    throw new Error('name must be provided');
  }
  return ajax({
    method: 'GET',
    url: `/api/check-name/${name}`,
  });
}
