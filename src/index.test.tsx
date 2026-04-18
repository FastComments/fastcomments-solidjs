import { describe, expect, it } from 'vitest';
import {
  FastCommentsCommentWidget,
  FastCommentsCommentCountWidget,
  FastCommentsLiveChatWidget,
  FastCommentsCollabChatWidget,
  FastCommentsImageChatWidget,
  FastCommentsRecentCommentsWidget,
  FastCommentsRecentDiscussionsWidget,
  FastCommentsReviewsSummaryWidget,
  FastCommentsTopPagesWidget,
  FastCommentsUserActivityFeedWidget,
  ScriptLoader,
} from '.';

describe('fastcomments-solidjs exports', () => {
  it.each([
    ['FastCommentsCommentWidget', FastCommentsCommentWidget],
    ['FastCommentsCommentCountWidget', FastCommentsCommentCountWidget],
    ['FastCommentsLiveChatWidget', FastCommentsLiveChatWidget],
    ['FastCommentsCollabChatWidget', FastCommentsCollabChatWidget],
    ['FastCommentsImageChatWidget', FastCommentsImageChatWidget],
    ['FastCommentsRecentCommentsWidget', FastCommentsRecentCommentsWidget],
    ['FastCommentsRecentDiscussionsWidget', FastCommentsRecentDiscussionsWidget],
    ['FastCommentsReviewsSummaryWidget', FastCommentsReviewsSummaryWidget],
    ['FastCommentsTopPagesWidget', FastCommentsTopPagesWidget],
    ['FastCommentsUserActivityFeedWidget', FastCommentsUserActivityFeedWidget],
  ])('exports %s', (_name, value) => {
    expect(value).toBeTruthy();
    expect(typeof value).toBe('function');
  });

  it('exports ScriptLoader', () => {
    expect(ScriptLoader).toBeTruthy();
    const loader = new ScriptLoader();
    expect(loader.state).toBe('idle');
  });
});
