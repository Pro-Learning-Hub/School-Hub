const express = require('express');
const router = express.Router();
const ImageKit = require('imagekit');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../connect');
const { verifyToken } = require('../middlewares/authMiddlewares');

const imagekit = new ImageKit({
  publicKey: 'public_tTc9vCi5O7L8WVAQquK6vQWNx08=',
  privateKey: 'private_edl1a45K3hzSaAhroLRPpspVRqM=',
  urlEndpoint: 'https://ik.imagekit.io/loayalsaid1/proLearningHub',
});

router.get('/imagekit', (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const query = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = query.get(email);

  if (!user) {
    return res.status(401).send({ message: 'Email not found' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).send({ message: 'Wrong password' });
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY);

  res.send({
    message: 'Logged in successfully',
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      pictureThumbnail: user.pictureThumbnail,
      pictureUrl: user.pictureUrl,
    },
  });
});


router.post('/oauth/google', (req, res) => {
  const idToken = req.body.token;
  console.log(idToken);
  const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
  fetch(googleVerifyUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.email_verified) {
        res.send({
          message: 'Logged in successfully',
          user: {
            email: data.email,
            id: data.sub,
            role: 'student',
          },
        });
      } else {
        res.status(401).send({ message: 'Email not verified' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    });
});

router.post('/oauth/googleRegister', (req, res) => {
  const idToken = req.body.token;
  console.log(idToken);
  const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
  fetch(googleVerifyUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.email_verified) {
        res.send({
          message: 'Logged in successfully',
          user: {
            email: data.email,
            id: data.sub,
          },
        });
      } else {
        res.status(401).send({ message: 'Email not verified' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    });
});

router.post('/register', async (req, res) => {
  const { userData, courseId } = req.body;
  console.log(userData);
  const {
    email,
    password,
    firstName,
    lastName,
    username,
    pictureId,
    pictureURL,
    pictureThumbnail,
  } = userData;
  try {
    const existingUser = db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .get(email);
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    db.transaction(() => {
      const query = db.prepare(
        `INSERT INTO users (
          id, email, passwordHash, firstName, lastName, username, pictureId,
          pictureUrl, pictureThumbnail
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`
      );

      query.run(
        id,
        email,
        passwordHash,
        firstName,
        lastName,
        username,
        pictureId,
        pictureURL,
        pictureThumbnail
      );

      db.prepare(`INSERT INTO courseEnrollments (userId, courseId) VALUES (?, ?)`).run(id, courseId);

      const accessToken = jwt.sign({ userId: id }, process.env.TOKEN_SECRET_KEY);

      res.status(201).json({
        accessToken,
        user: {
          email,
          firstName,
          lastName,
          username,
          pictureThumbnail,
          pictureURL,
          id,
        },
        message: 'User created successfully',
      });            
    })();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const query = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?');
  const user = query.get(email, 'admin');
  if (!user) {
    res.status(401).send({ message: 'Invalid credentials' });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    res.status(401).send({ message: 'Wrong password' });
    return;
  }

  const accessToken = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY);

  res.send({
    message: 'Logged in successfully',
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      pictureThumbnail: user.pictureThumbnail,
      pictureUrl: user.pictureUrl,
    },
  });
});

router.post('/admin/OAuth/google', (req, res) => {
  const idToken = req.body.token;
  const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
  fetch(googleVerifyUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.email_verified) {
        res.send({
          message: 'Logged in successfully',
          user: {
            email: data.email,
            id: data.sub,
            role: 'admin',
          },
        });
      } else {
        res.status(401).send({ message: 'Email not verified' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    });
});

router.post('/api/logout', verifyToken, (req, res) => {
  // Temoraily do nothing..
  res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;
