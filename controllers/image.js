const axios = require('axios');

const PAT = process.env.API_CLARIFAI;
const USER_ID = process.env.API_CLARIFAI_USER;
const APP_ID = 'face-recognition-app';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const handleApiCall = (req, res) => {
  const IMAGE_URL = req.body.input;

  const requestBody = {
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  };

  axios
    .post(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      requestBody,
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Key ' + PAT, // Pass the PAT here
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      res.json(response.data); // Send the API response back to the front end
    })
    .catch((err) => {
      console.error('Error from Clarifai API:', err); // Log the error for debugging
      res.status(400).json('Unable to work with API');
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleApiCall: handleApiCall,
  handleImage: handleImage,
};
