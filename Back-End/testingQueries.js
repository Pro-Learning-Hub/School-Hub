const db = require('./connect');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const {
  lectures,
  lectureResources,
  users,
  questions,
  generalQuestions,
	mockSections,
  mockReplies,
  comments,
  announcements
} = require('./mockData');



async function insertAdmin() {
  const passwordHash = await bcrypt.hash('admin', 10);

  const params = [
    'admin',
    // I'm testing here OK? Don't do that ever
    'admin',
    passwordHash,
    'David',
    'Malan',
    'admin',
    'admin',
    '',
    'https://newmedia.ufm.edu/wp-content/uploads/2019/11/djm-2.jpg',
    'https://newmedia.ufm.edu/wp-content/uploads/2019/11/djm-2.jpg'
    ];
  await db.execute(
    `INSERT INTO users (
			id, email, passwordHash, firstName, lastName, username, role, pictureId,
			pictureUrl, pictureThumbnail)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params
  );
}
// insertAdmin();

async function insertTestCourse() {
  await db.execute(
    `INSERT INTO courses (id, title, description) VALUES (?, ?, ?)`,
    [
      'test-course',
      'Test CS50',
      'This is a test data mocking CS50 with manipulation of course'
    ]);
}
// insertTestCourse();

async function insertTestCourseAdmin() {
  await db.execute(
    `INSERT INTO courseAdmins (courseId, userId) VALUES (?, ?)`,
    ['test-course', 'admin']
  );
}
// insertTestCourseAdmin();

async function insertTestUser() {
  for (const user of users) {
    const passwordHash = await bcrypt.hash('test', 10);
    const params = [
      user.id,
      user.email,
      passwordHash,
      user.firstName,
      user.lastName,
      user.username,
      'student',
      '',
      'https://picsum.photos/100',
      'https://picsum.photos/100'
    ];
    await db.execute(
      `INSERT INTO users (
        id, email, passwordHash, firstName, lastName, username, role, pictureId,
        pictureUrl, pictureThumbnail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    );

    await db.execute(
      `INSERT INTO courseEnrollments (userId, courseId) VALUES (?, ?)`,
      [user.id, 'test-course']
    );
  }
}
// insertTestUser();

async function insertTestSections() {
  const insertSectionQuery = 
    'INSERT INTO sections (id, title, description, courseId) VALUES (?, ?, ?, ?);';

  for (const section of mockSections) {
    await db.execute(
      insertSectionQuery,
      [
        section.id,
        section.title,
        section.description ?? '',
        'test-course'
      ]
    );
  }
}
// insertTestSections();


async function addLectureQuestions() {
  for (const [lectureId, lectureQuestions] of Object.entries(questions)) {
    for (const question of lectureQuestions) {
      await db.execute(
        'INSERT INTO questions (id, title, body, userId, upvotes, lectureId) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), question.title, question.body, question.userId, question.upvotes, lectureId]
      );
    }
  }
}
// addLectureQuestions();


async function insertLecturesWithDelay() {
  console.log(`Starting to insert ${lectures.length} lectures...`);
  
  const insertLectureQuery = `
    INSERT INTO lectures (
      id, title, description, tags, videoLink, notes, audioLink, 
      slides, subtitles, transcript, userId, courseId, sectionId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  for (let i = 0; i < lectures.length; i++) {
    const lecture = lectures[i];
    const lectureId = `lecture-${i + 1}`;
    
    try {
      await db.execute(
        insertLectureQuery,
        [
          lectureId,
          lecture.title,
          lecture.description,
          lecture.tags || '',
          lecture.videoLink,
          lecture.notes,
          lecture.audioLink,
          lecture.slides,
          lecture.subtitles,
          lecture.transcript,
          'admin', // Using admin as the user who added the lectures
          'test-course',
          lecture.sectionId
        ]
      );
      
      console.log(`Inserted lecture: ${lecture.title}`);
      
      // Add delay between insertions (except after the last one)
      if (i < lectures.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error inserting lecture "${lecture.title}":`, error);
    }
  }
  
  console.log('Finished inserting all lectures');
}

// Uncomment to run:
// insertLecturesWithDelay();

async function insertLectureResourcesWithDelay() {
  console.log(`Starting to insert resources for ${Object.keys(lectureResources).length} lectures...`);
  
  const insertResourceQuery = `
    INSERT INTO lectureResources (
      id, title, url, type, lectureId
    ) VALUES (?, ?, ?, ?, ?);
  `;

  // Process each lecture
  for (const [lectureId, resources] of Object.entries(lectureResources)) {
    console.log(`\nProcessing resources for ${lectureId}...`);
    
    // Process each resource type (shorts, psets, demos)
    for (const [resourceType, resourceItems] of Object.entries(resources)) {
      // Skip if there are no resources of this type
      if (!resourceItems || Object.keys(resourceItems).length === 0) continue;
      
      console.log(`  Adding ${Object.keys(resourceItems).length} ${resourceType}...`);
      
      // Normalize resource type (convert to singular form for database)
      const dbResourceType = resourceType === 'psets' ? 'quiz' : 
                             resourceType === 'shorts' ? 'short' : 
                             resourceType === 'demos' ? 'demo' : resourceType;
      
      // Process each individual resource
      for (const [title, link] of Object.entries(resourceItems)) {
          const resourceId = uuidv4();
          
          await db.execute(
            insertResourceQuery,
            [
              resourceId,
              title,
              link,
              dbResourceType,
              lectureId
            ]
          );
          
          // console.log(`    ✓ Added ${dbResourceType}: "${title}"`);
          
          // Add 1 second delay between individual resource insertions
          await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Add additional delay between lectures
    if (Object.keys(lectureResources).indexOf(lectureId) < Object.keys(lectureResources).length - 1) {
      console.log(`  Waiting before processing next lecture's resources...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\nFinished inserting all lecture resources');
}

// Uncomment to run:
// insertLectureResourcesWithDelay();


async function insertRepliesForQuestions() {


  const insertReplyQuery = `
    INSERT INTO replies (id, body, userId, upvotes, questionId)
    VALUES (?, ?, ?, ?, ?);
  `;

  const questions = await db.execute('SELECT id FROM questions');

  for (const question of questions) {
    for (const reply of mockReplies) {
      await db.execute(
        insertReplyQuery,
        [uuidv4(), reply.body, reply.userId, reply.upvotes, question.id]
      );
    }
  }
}

// Uncomment to run:
// insertRepliesForQuestions();


async function insertAnnouncements() {
  const insertAnnouncementQuery = `
    INSERT INTO announcements (id,userId,  title, body, commentsCount, courseId)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  for (const announcement of announcements) {
    await db.execute(
      insertAnnouncementQuery,
      [uuidv4(), 'admin', announcement.title, announcement.body, announcement.commentsCount, 'test-course']
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Uncomment to run:
// insertAnnouncements();


async function insertAnnouncementComments() {
  const insertCommentQuery = `
    INSERT INTO comments (id, userId, body, announcementId)
    VALUES (?, ?, ?, ?);
  `;

  const announcements = await db.execute('SELECT id FROM announcements');

  for (const announcement of announcements) {
    for (const comment of comments) {
      await db.execute(
        insertCommentQuery,
        [uuidv4(), comment.userId, comment.body, announcement.id]
      );
      await new Promise(resolve =>  setTimeout(resolve, 1000));
    }
  }
}

// Uncomment to run:
// insertAnnouncementComments();
