import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectcourseSectionsJS,
  selectLecturesIsLoading,
} from '../../redux/selectors/lecturesSelectors';
import './Lectures.css';
import { getCourseLectures } from '../../redux/actions/lecturesThunks';
import { Link } from 'react-router-dom';
import { selectCourseId } from '../../redux/selectors/uiSelectors';
import { useJoinRoom } from '../../hooks/socketConnectionHooks';
import useSyncSections from '../../hooks/syncSectionsHook';
import SearchInput from '../sharedComponents/SearchInput';
import SectionsList from './SectionsList';
import useSearchState from '../../hooks/useSearchState';
import LecturesSearchList from './LecturesSearchList';

export default function Lectures() {
  const isLoading = useSelector(selectLecturesIsLoading);
  const sections = useSelector(selectcourseSectionsJS);
  const userRole = useSelector((state) => state.ui.getIn(['user', 'role']));
  const courseId = useSelector(selectCourseId);
  const dispatch = useDispatch();

  const searchState = useSearchState();

  useEffect(() => {
    dispatch(getCourseLectures());
  }, [dispatch]);

  useJoinRoom(`sections-${courseId}`);
  useSyncSections();

  return (
    <>
      <div className="py-8 bg-light">
        <div className="container my-5">
          <div className="row mb-8 justify-content-center">
            <h1 className="text-center mb-4 fs-1 fw-bold mt-5">Lectures</h1>
            <p className="text-center mb-5 fs-4">
              Find everything you need to enhance your learning
              experience.
            </p>

            {/* Search Component */}
            <SearchInput 
              placeholder="Search lectures, descriptions, and tags..."
              searchQuery={searchState.searchQuery} 
              setSearchQuery={searchState.setSearchQuery} 
            />

          </div>
          {searchState.showSearchList ? (
            <LecturesSearchList
              results={searchState.searchResults}
              loading={searchState.searchLoading}
              error={searchState.searchError}
              query={searchState.debouncedQuery}
            />
          ) : (
            <SectionsList sections={sections} isLoading={isLoading} />
          )}
        </div>
      </div>

      {userRole && userRole !== 'student' && (
        <button
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'black',
            color: 'white',
            fontSize: '1.2rem',
            borderRadius: '0.5rem',
            padding: '0.5rem',
          }}
          type="button"
        >
          <Link to="/lectures/new" className="text-white text-decoration-none">
            Add a lecture
          </Link>
        </button>
      )}
    </>
  );
}
