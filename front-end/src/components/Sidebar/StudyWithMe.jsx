import React, { useState } from 'react';

export default function StudyWithMe({ iconStyles }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{cursor: 'pointer'}}>
      <span onClick={() => setIsOpen(true)}>
        <img
          src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-technique-productivity-flaticons-lineal-color-flat-icons.png"
          alt="external-technique-productivity-flaticons-lineal-color-flat-icons"
          style={iconStyles}
        />
        Study with me
      </span>
      <div
        className={`modal fade ${isOpen ? 'show' : ''}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="exampleModalLabel"
                style={{ color: 'black' }}
              >
                Study with me
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setIsOpen(false);
                }}
              ></button>
            </div>
            <div className="modal-body overflow-auto" style={{ maxHeight: '80vh' }}>
              <p>
                Study with me vieos.. with Pomodoro Timer and white noise Rain..
                wind, calm music and more.. Focus and get encouraged
              </p>
              <div className="mb-3">
                <div className="mt-3">
                  <p>2 Hours 50/10 pomodor with Birds sounds or rain...</p>
                  <div className="ratio ratio-16x9 mt-1">
                    <iframe
                      className="w-100 h-100"
                      src="https://www.youtube.com/embed/LLf3wPHrKus"
                      title="ذاكر معي ساعتين بتقنية البومودورو - Study with me"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>

                <div className="mt-3">
                  <p>2 Hours 25/5 pomodoro with lofi music</p>
                  <div className="ratio ratio-16x9 mt-1">
                    <iframe
                      className="w-100 h-100"
                      src="https://www.youtube.com/embed/sScDYHeXpvA"
                      title="study with me with lofi music | Pomodoro (25 min study x 5 min rest)"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>

                <div className="mt-3">
                  <p>2 Hours 25/5 pomodoro with calm piano and rain sounds</p>
                  <div className="ratio ratio-16x9 mt-1">
                    <iframe
                      className="w-100 h-100"
                      src="https://www.youtube.com/embed/5vGT-sZlgpo"
                      title="2-HOUR STUDY WITH ME  Late Night / calm piano🎹 + Rain Sounds 🌧️ / Pomodoro 25-5"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>

                <div className="mt-3">
                  <p>2 Hours 25/5 pomodoro with fire crackling sounds</p>
                  <div className="ratio ratio-16x9 mt-1">
                    <iframe
                      className="w-100 h-100"
                      src="https://www.youtube.com/embed/497ntkZbUlQ"
                      title="🗃️2HR STUDY WITH MEㅣpomodoro 25/5ㅣrelaxing fire crackling soundsㅣwith bell + timer"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
