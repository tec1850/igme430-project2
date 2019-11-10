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
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  level: {
    type: Number,
    min: 0,
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
  age: doc.age,
  level: doc.level,
});

GamerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return GamerModel.find(search).select('name age level').exec(callback);
};

GamerModel = mongoose.model('Gamer', GamerSchema);

module.exports.GamerModel = GamerModel;
module.exports.GamerSchema = GamerSchema;
