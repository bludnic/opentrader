import { parseISO } from 'date-fns';

// DO NOT IMPORT!
// This is a mock function for tests.
function utcDateNowMockFn() {
  return parseISO('2022-04-01T10:00:00.000Z'); // always April 1st 😀
}

module.exports = {
  utcDateNow: utcDateNowMockFn,
};
