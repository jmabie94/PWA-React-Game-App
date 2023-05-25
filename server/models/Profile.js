const { model, Schema } = require('mongoose');

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameStats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'GameStats',
    },
  ],
});

const Profile = model('Profile', profileSchema);

module.exports = Profile;
