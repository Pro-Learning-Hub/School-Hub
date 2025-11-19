import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../utilityComponents/Loading';
import './css/discussion.css';
import '../Lectures/Lectures.css';
import DiscussionEntryEditor from '../DiscussionEntries/DiscussionEntryEditor';
import DiscussionEntries from '../DiscussionEntries/DiscussionEntries';
import QuestionsSearchResults from '../Questions/QuestionsSearchResults';
import SearchInput from '../sharedComponents/SearchInput';
import {
  getLectureDiscussions,
  addLectureDiscussionEntry,
} from '../../redux/actions/discussionsThunks';
import {
  selectDiscussionsIsLoading,
  makeLectureDiscussionsSelector,
} from '../../redux/selectors/DiscussionsSelectors';
import useSyncLectureDiscussions from '../../hooks/syncLecturesDiscussionsHook';
import useQuestionSearchState from '../../hooks/useQuestionSearchState';
import { useJoinRoom } from '../../hooks/socketConnectionHooks';


export default function LectureDiscussion({ lectureId = '' }) {
  const [askNewQuestion, setAskNewQuestion] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectDiscussionsIsLoading);
  const entries = useSelector(makeLectureDiscussionsSelector(lectureId));

  // Search state management
  const searchState = useQuestionSearchState('lecture', lectureId);

  useJoinRoom(`lectureDiscussion-${lectureId}`);
  useSyncLectureDiscussions(lectureId);

  useEffect(() => {
    // This is not completely right. as still the logic to force reload or by real time pinging
    // when data changes .. considering Offline or PWA use for example with saving the state.
    // if (!entries || !entries.size) dispatch(getLectureDiscussions(lectureId));
    dispatch(getLectureDiscussions(lectureId));
  }, [dispatch, lectureId]);

  if (!lectureId)
    return <p>Am I hijacked? Where Am I rendered... no lectureID givin</p>;

  const handlePublishQuestion = (title, details) => {
    dispatch(addLectureDiscussionEntry(lectureId, title, details));
    setAskNewQuestion(false);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center">Lecture Discussion</h2>

      {/* Search Component */}
      <SearchInput 
        searchQuery={searchState.searchQuery}
        setSearchQuery={searchState.setSearchQuery}
        placeholder="Search lecture questions and discussions..."
      />
      {/* Conditional rendering based on search state */}
      {searchState.showSearchResults ? (
        <QuestionsSearchResults
          results={searchState.searchResults}
          loading={searchState.searchLoading}
          error={searchState.searchError}
          query={searchState.debouncedQuery}
          isLecture={true}
        />
      ) : (
        isLoading ? (
          <Loading />
        ) : (
          <div className="discussion-entries">
            <DiscussionEntries entries={entries} chunkSize={10} isLecture />
          </div>
        )
      )}
      <div className="text-center mt-4">
        {askNewQuestion ? (
          <DiscussionEntryEditor onPublish={handlePublishQuestion} />
        ) : (
          <button
            className=" btn btn-outline-secondary text-white btn-style"
            onClick={() => setAskNewQuestion(true)}
          >
            Ask a new question
          </button>
        )}
      </div>
    </div>
  );
}
