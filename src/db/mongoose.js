const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGODB_PATH, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/* const task = new Task({
    desciption: 'to do description'
});

task.save().then(() => {
    console.log(task);
}).catch((error) => {
    console.log('error' + error);
});
 */


/* const user = new User( );
 */
/* user.save().then(()=> {
    console.log(user);
}).catch((error) => {
    console.log('error occured', error);
}); */