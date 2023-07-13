import { daysAgoToTimestamp } from 'src/candlesticks/utils/daysAgoToTimestamp';

const todayDate = new Date('2022-08-31T00:00:00Z'); // 31 Aug 2022
const todayDateString = todayDate.toISOString().slice(0, 10);

const tenDaysAgoDate = new Date('2022-08-21T00:00:00Z'); // 21 Aug 2022
const tenDaysAgoDateString = tenDaysAgoDate.toISOString().slice(0, 10);

describe('daysAgoToTimestamp', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(todayDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it(`10 days ago of ${todayDateString} (current date) should be equal to ${tenDaysAgoDateString}`, () => {
    expect(daysAgoToTimestamp(10)).toBe(tenDaysAgoDate.getTime());
  });
});
