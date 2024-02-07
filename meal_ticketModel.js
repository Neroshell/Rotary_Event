const mongoose = require('mongoose');



const mealTicketSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    firstname: String,
    lastname: String,
    uniqueCode: String,
    mealCount: {
      type: Number,
      default: 0, 
  },
    ateAt: {
        type: String,
        required: true,
      },
      ateOn: {
        type: String,
        required: true,
      },
});

const mealTicket = mongoose.model('mealTicket', mealTicketSchema);
module.exports = mealTicket;




