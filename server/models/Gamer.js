const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let GamerModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const GamerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  recommend: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    trim: true,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

GamerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  recommend: doc.recommend,
  review: doc.review,
});

GamerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return GamerModel.find(search).select('name recommend review').exec(callback);
};

GamerSchema.statics.findRecent = (callback) => {
  const search = {
    recommend: 'yes',
  };

  return GamerModel.find(search).select('name recommend review').exec(callback);
};

GamerSchema.statics.findByName = (title, callback) => {
  const search = {
    name: title,
  };

  return GamerModel.find(search).select('name recommend review').exec(callback);
};

GamerModel = mongoose.model('Gamer', GamerSchema);

module.exports.GamerModel = GamerModel;
module.exports.GamerSchema = GamerSchema;
