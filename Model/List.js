const mongoose = require('mongoose');
const ListsSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require:true,
    },
    job: {
      type: String,
      require:true,
    },
    status: {
      type: String,
      enum: ['DONE','UNDONE'],
      default:'UNDONE'
    },
  },
  { collection: 'List',  // cài đặt tên cho conversations kết nối đến 
    versionKey: false   // loai bo version key  
  }  
);
const List = mongoose.model("List", ListsSchema);
module.exports = List;