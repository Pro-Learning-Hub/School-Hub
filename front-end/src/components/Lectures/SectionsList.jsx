import React, { useState } from 'react';
import Loading from '../utilityComponents/Loading';
import SectionModal from './SectionModal';

export default function SectionsList({ sections, isLoading }) {
  // State to handle the modal visibility and selected section data
  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleShowModal = (section) => {
    setSelectedSection(section);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Loading />
      </div>
    );
  }

  if (!sections.length) {
    return <p className="text-center">No sections found</p>;
  }

  return (
    <>
      <div className="row">
        {sections.map((section) => (
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
        ))}
      </div>
      
      {showModal && (
        <SectionModal 
          handleCloseModal={handleCloseModal} 
          selectedSection={selectedSection} 
        />
      )}
    </>
  );
}
