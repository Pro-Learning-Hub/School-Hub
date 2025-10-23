import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectcourseSectionsJS,
  selectLecturesIsLoading,
} from '../../redux/selectors/lecturesSelectors';
import { getCourseLectures } from '../../redux/actions/lecturesThunks';
import { Link } from 'react-router-dom';
import { selectCourseId } from '../../redux/selectors/uiSelectors';
import { useJoinRoom } from '../../hooks/socketConnectionHooks';
import useSyncSections from '../../hooks/syncSectionsHook';
import SearchInput from './SearchInput';
import SectionsList from './SectionsList';


export default function Lectures() {
  const isLoading = useSelector(selectLecturesIsLoading);
  const sections = useSelector(selectcourseSectionsJS);
  const userRole = useSelector((state) => state.ui.getIn(['user', 'role']));
  const courseId = useSelector(selectCourseId);
  const dispatch = useDispatch();

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
            <SearchInput />
          </div>

          {/* Sections List Component */}
          <SectionsList sections={sections} isLoading={isLoading} />
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
