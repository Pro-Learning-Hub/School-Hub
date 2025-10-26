import React, { useState, useCallback } from 'react';

// Study video configuration
const STUDY_VIDEOS = [
  {
    id: 'LLf3wPHrKus',
    title: 'ذاكر معي ساعتين بتقنية البومودورو - Study with me',
    description: '2 Hours 50/10 pomodoro with Birds sounds or rain...',
  },
  {
    id: 'sScDYHeXpvA',
    title: 'study with me with lofi music | Pomodoro (25 min study x 5 min rest)',
    description: '2 Hours 25/5 pomodoro with lofi music',
  },
  {
    id: '5vGT-sZlgpo',
    title: '2-HOUR STUDY WITH ME  Late Night / calm piano🎹 + Rain Sounds 🌧️ / Pomodoro 25-5',
    description: '2 Hours 25/5 pomodoro with calm piano and rain sounds',
  },
  {
    id: '497ntkZbUlQ',
    title: '🗃️2HR STUDY WITH MEㅣpomodoro 25/5ㅣrelaxing fire crackling soundsㅣwith bell + timer',
    description: '2 Hours 25/5 pomodoro with fire crackling sounds',
  },
];

const StudyVideo = ({ id, title, description }) => (
  <div className="mt-3">
    <p>{description}</p>
    <div className="ratio ratio-16x9 mt-1">
      <iframe
        className="w-100 h-100"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  </div>
);

export default function StudyWithMe({ iconStyles }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      {/* Trigger Button */}
      <div style={{ cursor: 'pointer' }}>
        <span onClick={openModal}>
          <img
            src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-technique-productivity-flaticons-lineal-color-flat-icons.png"
            alt="Study with me productivity icon"
            style={iconStyles}
          />
          Study with me
        </span>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${isModalOpen ? 'show' : ''}`}
        id="studyWithMeModal"
        tabIndex="-1"
        aria-labelledby="studyWithMeModalLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5
                className="modal-title"
                id="studyWithMeModalLabel"
                style={{ color: 'black' }}
              >
                Study with me
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Close modal"
              />
            </div>

            {/* Modal Body */}
            <div className="modal-body overflow-auto" style={{ maxHeight: '80vh' }}>
              <p>
                Study with me videos with Pomodoro Timer and white noise Rain,
                wind, calm music and more. Focus and get encouraged!
              </p>
              
              <div className="mb-3">
                {STUDY_VIDEOS.map((video) => (
                  <StudyVideo
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    description={video.description}
                  />
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
