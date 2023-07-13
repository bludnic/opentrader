import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { TweetBriefEntity } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/types/tweet/tweet-brief.entity';
import { isSignalEventActive } from './isSignalEventActive';

// "Date now" is mocked as "2022-04-01T10:00:00.000Z"
jest.mock('src/marketplace/twitter-signals/utils/utcDateNow');

const tweet: TweetBriefEntity = {
  author_id: '44196397',
  text: '@JimPethokoukis Good point. SpaceX &amp; Tesla would probably have died, since both narrowly escaped bankruptcy in 2008.',
  id: '1509003338993610764',
  created_at: '2022-04-01T00:00:00.000Z',
};

const signalEventBase: TwitterSignalEventDto = {
  id: 'asK9flk822ls',
  parsedAt: '2022-04-01T00:00:00.000Z',
  signalId: 'elon-tweets-doge',
  tweet,
  coin: {
    baseCurrency: 'DOGE',
    quoteCurrency: 'USDT',
  },
};

describe('isSignalEventActive', () => {
  it('should be inactive when 30 min passed from tweeted date', () => {
    const signalEvent: TwitterSignalEventDto = {
      ...signalEventBase,
      tweet: {
        ...tweet,
        created_at: '2022-04-01T09:30:00.000Z',
      },
    };

    expect(isSignalEventActive(signalEvent)).toBe(false);
  });

  it('should be active when 1 min passed from tweeted date', () => {
    const signalEvent: TwitterSignalEventDto = {
      ...signalEventBase,
      tweet: {
        ...tweet,
        created_at: '2022-04-01T09:59:00.000Z',
      },
    };

    expect(isSignalEventActive(signalEvent)).toBe(true);
  });

  it('should be active when 15 min diff from tweeted date', () => {
    const signalEvent: TwitterSignalEventDto = {
      ...signalEventBase,
      tweet: {
        ...tweet,
        created_at: '2022-04-01T09:45:00.000Z',
      },
    };

    expect(isSignalEventActive(signalEvent)).toBe(true);
  });

  it('should be inactive when 16 min diff from tweeted date', () => {
    const signalEvent: TwitterSignalEventDto = {
      ...signalEventBase,
      tweet: {
        ...tweet,
        created_at: '2022-04-01T09:44:00.000Z',
      },
    };

    expect(isSignalEventActive(signalEvent)).toBe(false);
  });
});
