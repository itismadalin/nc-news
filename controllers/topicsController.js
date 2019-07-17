const {fetchAlltopics} = require('../models/topicsModel');

exports.sendTopics = (req, res, send) => {
  fetchAlltopics().then(topics => {
    res.status(200).send({topics});
  });
};