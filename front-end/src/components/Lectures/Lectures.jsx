import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectcourseSectionsJS,
  selectLecturesIsLoading,
} from '../../redux/selectors/lecturesSelectors';
import Loading from '../utilityComponents/Loading';
import { getCourseLectures } from '../../redux/actions/lecturesThunks';
import { Link } from 'react-router-dom';
import { selectCourseId } from '../../redux/selectors/uiSelectors';
import { useJoinRoom } from '../../hooks/socketConnectionHooks';
import useSyncSections from '../../hooks/syncSectionsHook';
import SectionModal from './SectionModal';


export default function Lectures() {
  const isLoading = useSelector(selectLecturesIsLoading);
  const sections = useSelector(selectcourseSectionsJS);
  const userRole = useSelector((state) => state.ui.getIn(['user', 'role']));
  const courseId = useSelector(selectCourseId);
  const dispatch = useDispatch();

  // State to handle the modal visibility and selected section data
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    dispatch(getCourseLectures());
  }, [dispatch]);

  useJoinRoom(`sections-${courseId}`);
  useSyncSections();

  const handleShowModal = (section) => {
    setSelectedSection(section);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="py-8 bg-light">
        <div className="container my-5">
          <div className="row mb-8 justify-content-center">
            <h1 className="text-center mb-4 fs-1 fw-bold mt-5">Lectures</h1>
            <p className="text-center mb-5 fs-4">
              Browse through the course lectures organized by time, chapters, or
              topic. Find everything you need to enhance your learning
              experience.
            </p>

            {/* Search Field */}
            <form
              className="d-flex mt-4 mb-5"
              role="search"
              // Temporarily
              onSubmit={(e) => {
                e.preventDefault();
                e.target.elements[0].value = '';
              }}
            >
              <input
                className="form-control me-2 p-3"
                type="search"
                placeholder="Search the content of the course"
                aria-label="Search"
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="row">
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <Loading />
              </div>
            ) : !sections.length ? (
              <p className="text-center">No sections found</p>
            ) : (
              sections.map((section) => (
                <div className="col-lg-6 col-md-12 col-12" key={section.title}>
                  <div className="card mb-4">
                    <div className="card-body">
                      <div className="d-md-flex mb-4">
                        <div className="ms-md-3">
                          <h2 className="fs-5 mb-3">{section.title}</h2>
                          <p className="fs-6 fw-semibold mb-0 text-uppercase d-flex">
                            <span className="btn btn-primary me-1">
                              {section.lectures.length} Lessons
                            </span>
                            <span className="ms-3 btn btn-success me-1">
                              {section.lectures.length * 2 +
                                ' Hours ' +
                                Math.floor(Math.random() * 60) +
                                ' Minutes'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className=" ms-3 mb-3 fs-6 mt-3">
                        {section.description ||
                          'No description available for this chapter.'}
                      </p>
                      <button
                        className="btn-link p-3"
                        onClick={() => handleShowModal(section)}
                      >
                        View Chapter Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showModal && <SectionModal handleCloseModal={handleCloseModal} selectedSection={selectedSection}/>}

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
