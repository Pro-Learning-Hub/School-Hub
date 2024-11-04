import { fromJS } from 'immutable';
import * as actions from '../actions/discussionsActionTypes';

export const initialState = fromJS({
  lecturesDiscussions: {},
  isLoading: false,
  discussionsError: null,
});

export default function discussionsReducer (state = initialState, action = {}) {
  console.log(action);
  switch (action.type) {
    case actions.SET_DISCUSSIONS_ERROR: {
      return state.set('discussionsError, action.payload.errorMessage');
    }
    case actions.CLEAR_DISCUSSIONS_ERROR: {
      return state.set('discussionsError', null);
    }

    case actions.TOGGLE_DISCUSSIONS_LOADING: {
      return state.set('isLoading', !state.get('isLoading'));
    }

    case actions.LECTURE_DISCUSSION_REQUEST: {
      return state.set('isLoading', true);
    }

    case actions.LECTURE_DISCUSSION_FAILURE: {
      return state.withMutations( state => {
        state
          .set('isLoading', false)
          .set('discussionsError', action.payload.errorMessage);
      })
    }

    case actions.LECTURE_DISCUSSION_SUCCESS: {
      const {entries, lectureId} = action.payload;

      return state.withMutations( state => {
        state
          .set('discussionsError', null)
          .set('isLoading', false)
          .setIn(['lecturesDiscussions', lectureId] , fromJS(entries) );
      });
    }

    case actions.ADD_DISCUSSION_ENTRY_REQUEST: {
      return state.set('isEntryBeingSent', true);
    }

    case actions.ADD_DISCUSSION_ENTRY_FAILURE: {
      return state.withMutations( state => {
        state
          .set('isEntryBeingSent', false)
          .set('discussionsError', action.payload.errorMessage);
      })
    }

    case actions.ADD_DISCUSSION_ENTRY_SUCCESS: {
      const {lectureId, entry} = action.payload;
      return state.withMutations( state => {
        state
          .set('isEntryBeingSent', false)
          .set('discussionsError', null)
          .updateIn(['lecturesDiscussions', lectureId], entries => entries.unshift(fromJS(entry)));
      });
    }

    default: {
      return state;
    }
  }
};
