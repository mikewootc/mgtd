module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const TodoSchema = new Schema({
        userId:     {type: String},
        subject:    {type: String},
        content:    {type: String,  default: null},
        createDate: {type: Date,    default: Date.now},
        touchDate:  {type: Date,    default: Date.now},
        dueDate:    {type: Date,    default: null},
        note:       {type: String},
        children: [String],
        //deleted:    {type: Boolean, default: false},
        //deleteDate: {type: Date,    default: null},
    });

    return mongoose.model('Todo', TodoSchema);
}
