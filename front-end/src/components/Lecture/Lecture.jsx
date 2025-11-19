import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { extractVideoId } from '../../utils/utilFunctions';
import { getLectureById } from '../../redux/actions/lecturesThunks';
import Loading from '../utilityComponents/Loading';
import LectureDiscussion from '../LectureDiscussion/LectureDiscussion';
import { useParams } from 'react-router-dom';
import { useJoinRoom } from '../../hooks/socketConnectionHooks';
import useSyncLectureEntry from '../../hooks/syncLectureEntryHook';
import DownloadLectureLink from './DownloadLectureLink';
import './Lecture.css';

export default function Lecture() {
  const { lectureId } = useParams();
  const lectureData = useSelector((state) =>
    state.lectures.getIn(['lectures', lectureId])
  );
  const isLoading = useSelector((state) => state.lectures.get('isLoading'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLectureById(lectureId));
  }, [dispatch, lectureId]);

  useJoinRoom(`lecture-${lectureId}`);
  useSyncLectureEntry();

  const getVideoId = () => extractVideoId(lectureData.get('videoLink'));
  const getDemos = () =>  lectureData
  .get('demos')
  .map((demo, index) => (
    <li key={index}>
      <a href={demo.get('url')}>{demo.get('title')}</a>
    </li>
  ))
  .toJS();
  const getShorts = () => lectureData
  .get('shorts')
  .map((short, index) => (
    <li key={index}>
      <a href={short.get('url')}>{short.get('title')}</a>
    </li>
  ))
  .toJS();
  const getQuizzes = () => lectureData
    .get('quizzez')
    .map((quizzez, index) => (
      <li key={index}>
        <a href={quizzez.get('url')}>{quizzez.get('title')}</a>
      </li>
    ))
    .toJS();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : !lectureData ? (
        <div className="lecture-error">
          <h1>Lecture Not Found</h1>
          <p>The requested lecture could not be found or has been removed.</p>
        </div>
      ) : (
        <div className="container lecture-container">
          <div className="row justify-content-end">
            <div className="col-lg-9 col-md-8 lecture-content lecture-fade-in">
              <div className="lecture-header">
                <h1 className="lecture-title">{lectureData.get('title')}</h1>
                <p className="lecture-description">
                  {lectureData.get('description')}
                </p>
              </div>

              {/* YouTube Video */}
              <div className="lecture-video-container">
                <iframe
                  className="lecture-video-iframe"
                  title={lectureData.get('title')}
                  src={`https://www.youtube.com/embed/${getVideoId()}`}
                  allowFullScreen
                />
              </div>

              {/* Resources Section */}
              <details className="lecture-section">
                <summary>Lecture Resources</summary>
                <ul className="lecture-resources-list">
                  <li className="lecture-resource-item">
                    <DownloadLectureLink 
                      videoUrl={lectureData.get('videoLink')} 
                      type="audio"
                      className="lecture-resource-link"
                    >
                      Audio
                    </DownloadLectureLink>
                  </li>
                  <li className="lecture-resource-item">
                    <a 
                      href={lectureData.get('notes')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="lecture-resource-link"
                    >
                      Notes
                    </a>
                  </li>
                  <li className="lecture-resource-item">
                    <a 
                      href={lectureData.get('slides')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="lecture-resource-link"
                    >
                      Slides
                    </a>
                  </li>
                  <li className="lecture-resource-item">
                    <details className="lecture-nested-section">
                      <summary>Demos</summary>
                      {getDemos().length ? (
                        <ul className="lecture-nested-list">{getDemos()}</ul>
                      ) : (
                        <div className="lecture-empty-state">No Demos available</div>
                      )}
                    </details>
                  </li>
                  <li className="lecture-resource-item">
                    <DownloadLectureLink 
                      videoUrl={lectureData.get('videoLink')} 
                      type="transcript"
                      className="lecture-resource-link"
                    >
                      Transcript
                    </DownloadLectureLink>
                  </li>
                  <li className="lecture-resource-item">
                    <DownloadLectureLink 
                      videoUrl={lectureData.get('videoLink')} 
                      type="subtitles"
                      className="lecture-resource-link"
                    >
                      Subtitles
                    </DownloadLectureLink>
                  </li>
                  <li className="lecture-resource-item">
                    <details className="lecture-nested-section">
                      <summary>Video</summary>
                      <ul className="lecture-nested-list">
                        <li>
                          <DownloadLectureLink videoUrl={lectureData.get('videoLink')} type="video">
                            Video [MP4]
                          </DownloadLectureLink>
                        </li>
                        <li>
                          <a href={lectureData.get('videoLink')}>Youtube</a>
                        </li>
                      </ul>
                    </details>
                  </li>
                </ul>
              </details>

              {/* Extras Section */}
              <details className="lecture-section">
                <summary>Shorts & Extras</summary>
                {getShorts().length ? (
                  <ul className="lecture-nested-list">{getShorts()}</ul>
                ) : (
                  <div className="lecture-empty-state">No Shorts available</div>
                )}
              </details>

              {/* Quizzes Section */}
              <details className="lecture-section">
                <summary>Quizzes & Problem Sets</summary>
                {getQuizzes().length ? (
                  <ul className="lecture-nested-list">{getQuizzes()}</ul>
                ) : (
                  <div className="lecture-empty-state">No Quizzes available</div>
                )}
              </details>

              {/* Discussion Section */}
              <div className="lecture-discussion">
                <LectureDiscussion lectureId={lectureId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
