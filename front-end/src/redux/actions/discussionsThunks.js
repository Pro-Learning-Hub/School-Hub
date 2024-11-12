import toast from 'react-hot-toast';
import * as discussionsActions from './discussionsActionCreators';
import { toggleLoading } from './uiActionCreators';

import { DOMAIN } from '../../utils/constants';

export const getLectureDiscussions = (lectureId) => async (dispatch) => {
  dispatch(discussionsActions.toggleDiscussionsLoading());

  try {
    const response = await fetch(`${DOMAIN}/lectures/${lectureId}/discussion`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    dispatch(
      discussionsActions.lectureDiscussionSuccess({
        entries: data,
        lectureId: lectureId,
      })
    );
  } catch (error) {
    console.error(error.message);
    dispatch(
      discussionsActions.lectureDiscussionFailure(
        `Error fetching entries: ${error.message}`
      )
    );
  }
};

export const addLectureDiscussionEntry =
  (lectureId, title, details) => async (dispatch, getState) => {
    dispatch(discussionsActions.addDiscussionEntryRequest());

    const userId = getState().ui.getIn(['user', 'id']) || 'testId';
    const promise = toast.promise(
      fetch(`${DOMAIN}/lectures/${lectureId}/discussion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          body: details,
        }),
      }).then((response) => {
        const data = response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        return data;
      }),
      {
        loading: 'Sending your Entry',
        success: 'Your Entry has been sent',
        error: 'Error sending your question',
      }
    );

    try {
      const data = await promise;

      dispatch(
        discussionsActions.addDiscussionEntrySuccess({
          lectureId,
          entry: data,
        })
      );
    } catch (error) {
      console.error(error.message);
      dispatch(
        discussionsActions.addDiscussionEntryFailure(
          `Error adding entry: ${error.message}`
        )
      );
    }
  };

export const getGeneralDiscussion = () => async (dispatch, getState) => {
  dispatch(discussionsActions.generalDiscussionRequest());

  const courseId = getState().ui.getIn(['course', 'id']) || 'testId';
  try {
    const response = await fetch(
      `${DOMAIN}/courses/${courseId}/general_discussion`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(discussionsActions.generalDiscussionSuccess(data));
  } catch (error) {
    console.error(error.message);
    dispatch(
      discussionsActions.generalDiscussionFailure(
        `Error fetching entries: ${error.message}`
      )
    );
  }
};

export const addGeneralDiscussionEntry =
  (title, details) => async (dispatch, getState) => {
    dispatch(discussionsActions.generalDiscussionEntryRequest());

    const userId = getState().ui.getIn(['user', 'id']) || 'testId';
    const courseId = getState().ui.getIn(['course', 'id']) || 'testId';
    const response = await toast.promise(
      fetch(`${DOMAIN}/courses/${courseId}/general_discussion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          body: details,
        }),
      }),
      {
        loading: 'Sending your Entry',
        success: 'Your Entry has been sent',
        error: 'Error sending your question',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    dispatch(discussionsActions.generalDiscussionEntrySuccess(data));
  };

export const fetchReplies = (questionId) => async (dispatch) => {
  dispatch(discussionsActions.fetchDiscussionRepliesRequest());
  dispatch(toggleLoading());
  try {
    const response = await fetch(`${DOMAIN}/questions/${questionId}/replies`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    dispatch(discussionsActions.fetchDiscussionRepliesSuccess(data));
  } catch (error) {
    console.error(error.message);
    dispatch(
      discussionsActions.fetchDiscussionRepliesFailure(
        `Error fetching entries: ${error.message}`
      )
    );
  } finally {
    dispatch(toggleLoading());
  }
};

export const addDiscussionReply =
  (questionId, body) => async (dispatch, getState) => {
    dispatch(discussionsActions.addDiscussionReplyRequest());

    const userId = getState().ui.getIn(['user', 'id']) || 'testId';
    try {
      const data = await toast.promise(
        fetch(`${DOMAIN}/questions/${questionId}/replies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            body,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(data.message);
          }
          return response.json();
        }),
        {
          loading: 'Sending reply',
          success: 'Reply sent',
          error: 'Error sending reply',
        }
      );

      dispatch(discussionsActions.addDiscussionReplySuccess(data));
    } catch (error) {
      console.error(error.message);
      dispatch(
        discussionsActions.addDiscussionReplyFailure(
          `Error adding reply: ${error.message}`
        )
      );
    }
  };

// I genuenly have no idea what to call this function
// May be "toggleVoteThunkHelper"
function whatever(entryId, isLecture, lectureId = '', getState) {
  const state = getState();
  const questions = isLecture
    ? state.discussions.getIn(['lecturesDiscussions', lectureId])
    : state.discussions.get('courseGeneralDiscussion');
  const isUpvoted = questions
    .find((question) => question.get('id') === entryId)
    .get('upvoted');

  const action = isUpvoted ? 'downvote' : 'upvote';

  const failureAction = isLecture
    ? discussionsActions.toggleLectureQuestionUpvoteFailure
    : discussionsActions.toggleGeneralQuestionUpvoteFailure;
  const successAction = isLecture
    ? discussionsActions.toggleLectureQuestionUpvoteSuccess
    : discussionsActions.toggleGeneralQuestionUpvoteSuccess;
  return {
    action,
    isUpvoted,
    failureAction,
    successAction,
  };
}

export const toggleDiscussionEntryVote =
  (entryId, isLecture, lectureId) => async (dispatch, getState) => {
    const {
      action,
      isUpvoted,
      failureAction,
      successAction,
      // I genuenly have no idea what to call this helper function 😅
    } = whatever(entryId, isLecture, lectureId, getState);

    try {
      const data = await toast.promise(
        fetch(`${DOMAIN}/questions/${entryId}/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action }),
        }).then((response) => {
          if (!response.ok) {
            const data = response.json();
            throw new Error(data.message);
          }
          return response.json();
        }),
        {
          loading: isUpvoted ? 'Downvoting' : 'Upvoting',
          success: isUpvoted ? 'Downvoted' : 'Upvoted',
          error: 'Error toggling vote',
        }
      );


      isLecture
      ? dispatch(successAction(entryId, lectureId, !isUpvoted))
      : dispatch(successAction(entryId, !isUpvoted)) 
    } catch (error) {
      console.error(error.message);
      dispatch(failureAction(`Error toggling the vote: ${error.message}`));
    }
  };
