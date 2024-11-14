import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { uploadFile } from '../../utils/utilFunctions';
import { createLecture } from '../../redux/actions/lecturesThunks';
import {useNavigate} from 'react-router-dom';


const CreateNewLecture = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState('');
  const [newSection, setNewSection] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [notesOption, setNotesOption] = useState('link');
  const [notesLink, setNotesLink] = useState('');
  const [notesFile, setNotesFile] = useState(null);
  const [slidesLink, setSlidesLink] = useState('');
  const [slidesFile, setSlidesFile] = useState(null);
  const [demos, setDemos] = useState([{ name: '', link: '' }]);
  const [extras, setExtras] = useState([{ name: '', link: '' }]);
  const [slidesOption, setSlidesOption] = useState('link');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    setSections([
      'Section 1',
      'Section 2',
      'Section 3',
    ]);
  }, []);

  const createNewSection = () => {
    if (newSection) {
      const existingNewSection = sections.find(sec => sec === newSection);
      if (!existingNewSection) {
        setSections([...sections, newSection]);
      }

      setNewSection('');
    }
  }

  const handleRemoveDemo = (index) => {
    if (demos.length <= 1) {
      setDemos([{ name: '', link: '' }]);
    } else {
      const updatedDemos = demos.filter((_, i) => i !== index);
      setDemos(updatedDemos);
    }
  }

  const handleAddDemo = () => setDemos([...demos, { name: '', link: '' }]);
  
  const handleDemoChange = (index, field, value) => {
    const updatedDemos = demos.map((demo, i) =>
      i === index ? { ...demo, [field]: value } : demo
  );
  setDemos(updatedDemos);
};

const handleRemoveExtra = (index) => {
  if (extras.length <= 1) {
    setExtras([{ name: '', link: '' }]);
  } else {
    const filteredExtras = extras.filter((_, i) => i !== index);
    setExtras(filteredExtras);
  }
}

const handleAddExtra = () => setExtras([...extras, { name: '', link: '' }]);
  const handleExtraChange = (index, field, value) => {
    const updatedExtras = extras.map((extra, i) =>
      i === index ? { ...extra, [field]: value } : extra
    );
    setExtras(updatedExtras);
  };

  const handleMissingDemosNames = () => {
    return demos.map(demo => {
      if (!demo.name) {
        return {
          ...demo,
          name: demo.link
        };
      }
      return demo;
    })
  }

  const handleMissingExtrasNames= () => {
    return extras.map(extra => {
      return extra.name 
      ? extra
      : {...extra, name: extra.link}
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let notesFileUrl = '';
    let slidesFileUrl = '';

    if (notesOption === 'file' && notesFile) {
      notesFileUrl = await toast.promise(
        uploadFile(notesFile, dispatch, `${name}-notes`),
        {
          loading: 'Uploading notes...',
          success: 'Notes uploaded successfully!',
          error: 'Error uploading notes.',
        }
      );
    }

    if (slidesOption === 'file' && slidesFile) {
      slidesFileUrl = await toast.promise(
        uploadFile(slidesFile, dispatch, `${name}-slides`),
        {
          loading: 'Uploading slides...',
          success: 'Slides uploaded successfully!',
          error: 'Error uploading slides.',
        }
      );
    }

    const lectureData = {
      name,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
      section: section,
      youtubeLink,
      notesLink: notesOption === 'link' ? notesLink : notesFileUrl,
      slidesLink: slidesOption === 'link' ? slidesLink : slidesFileUrl,
      demos: handleMissingDemosNames(),
      extras: handleMissingExtrasNames(),
    };

    dispatch(createLecture(lectureData, navigate));
  };

  return (
    <div className='container mt-5 p-4 '>

    <h1>Create a lecture</h1>
    <p className='txt1 fs-5 pb-4'>Create a new Lecture.. Yet another change to make the world a better place</p>
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Lecture Name</label>
      <input
        className='form-control'
        id='name'
        name='name'
        type="text"
        value={name}
        placeholder='Lecture Name'
        onChange={(e) => setName(e.target.value)}
        required
      />
      <hr />

      <label htmlFor="description">Description</label>
      <textarea
        className='form-control'

        id='description'
        name='description'
        value={description}
        placeholder="Brief description of the lecture."
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <hr />

      <label htmlFor="tags">Tags (comma-separated)</label>
      <input
        className='form-control'

        type="text"
        value={tags}
        placeholder="Lecture related keywords"
        onChange={(e) => setTags(e.target.value)}
      />
      <hr />
      <div className='input-group'>
        <select id='section' name='section' value={section} onChange={(e) => setSection(e.target.value)} required className='form-select'>
          <option value="" disabled>
            Select a section
          </option>
          {sections.map((sec, index) => (
            <option key={index} value={sec}>
              {sec}
            </option>
          ))}
        </select>
        <input
          type="text"
          className='form-control'
          placeholder="Or add a new section"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
        />
        <button onClick={createNewSection} className='btn btn-outline-secondary' type="button">
          Add
        </button>
      </div>
      <hr />

      <label htmlFor="videoLink">YouTube Link</label>
      <input
        className='form-control'

        id='videoLink'
        name='videoLink'
        type="url"
        value={youtubeLink}
        placeholder="The youtube video/live link of the lecture"
        onChange={(e) => setYoutubeLink(e.target.value)}
      />
      <hr />

      <label>Notes</label>
      <div className="form-check d-flex mt-1">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            checked={notesOption === 'link'}
            onChange={() => setNotesOption('link')}
          />
          Link
        </label>
        <label className="form-check-label ms-5">
          <input
            className="form-check-input"
            type="radio"
            checked={notesOption === 'file'}
            onChange={() => setNotesOption('file')}
          />
          File
        </label>
      </div>
      
      {notesOption === 'link' ? (
        <input
        className='form-control'

          id='notesLink'
          name='notesFile'
          type="url"
          placeholder="Add a link"
          defaultValue={notesLink}
          onChange={(e) => setNotesLink(e.target.value)}
        />
      ) : (
        <input         className='form-control'
         id='notesFile' name='notesFile' type="file" onChange={(e) => setNotesFile(e.target.files[0])} />
      )}
      <hr />

      <label>Slides</label>
      <div className="form-check d-flex mt-1">
        <label className="form-check-label">
          <input

            type="radio"
            checked={slidesOption === 'link'}
            onChange={() => setSlidesOption('link')}
            className="form-check-input"
          />
          Link
        </label>
        <label className="form-check-label ms-5">
          <input

            type="radio"
            checked={slidesOption === 'file'}
            onChange={() => setSlidesOption('file')}
            className="form-check-input"
          />
          File
        </label>
      </div>
      {slidesOption === 'link' ? (
        <input
        className='form-control'

          id='slidesLink'
          name='slidesLink'
          type="url"
          placeholder="Add a link"
          defaultValue={slidesLink}
          onChange={(e) => setSlidesLink(e.target.value)}
        />
      ) : (
        <input          className='form-control'
        id='slidesFile' name='slidesFile'  type="file" onChange={(e) => setSlidesFile(e.target.files[0])} />
      )}
      <hr />

      <label>Demos</label>
      {demos.map((demo, index) => (
        <div key={index}>
          <div className='d-flex mb-3 justify-content-center' >

          <input
          className='form-control'
            type="text"
            placeholder="Demo name"
            value={demo.name}
            onChange={(e) => handleDemoChange(index, 'name', e.target.value)}
          />
          <input
          className='form-control'
            type="url"
            placeholder="Demo link"
            value={demo.link}
            onChange={(e) => handleDemoChange(index, 'link', e.target.value)}
          />
          <button className="btn btn-secondary btn-danger" type="button" onClick={() => handleRemoveDemo(index)}>&times;</button>
        </div>
        </div>
      ))}
      <button  className="btn btn-secondary" type="button" onClick={handleAddDemo}>
        Add Demo
      </button>
      <hr />

      <label>Shorts/Extras</label>
      {extras.map((extra, index) => (
        
        <div key={index}>
          <div className='d-flex mb-3 justify-content-center' >
          <input
          className='form-control'
            type="text"
            placeholder="Extra name"
            value={extra.name}
            onChange={(e) => handleExtraChange(index, 'name', e.target.value)}
          />
          <input
          className='form-control'
            type="url"
            placeholder="Extra link"
            value={extra.link}
            onChange={(e) => handleExtraChange(index, 'link', e.target.value)}
          />
          <button type="button"  className="btn btn-secondary btn-danger" onClick={() => handleRemoveExtra(index)}>&times;</button>
        </div>
        </div>

      ))}
      <button type="button" className="btn btn-secondary" onClick={handleAddExtra}>
        Add Extra
      </button>
      <hr />

      <button className="btn btn-success " type="submit">Create Lecture</button>
    </form>
    </div>

  );
};

export default CreateNewLecture;
