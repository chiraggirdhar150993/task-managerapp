const express = require('express');
require('./db/mongoose');
const ObjectID = require('mongodb');
const app = express();
const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/user');
const port = process.env.PORT;

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

app.listen(port, () => {
    console.log('app running at port' + port);
});


const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('5c2e505a3253e18a43e612e6')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    // const user = await User.findById('5cb37ea9ee41c42850236718');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);
}

// main()
// app.use((req, res, next) => {
//     res.status(503).send('site is under maintainence mode');
// });
/* const jwt = require('jsonwebtoken');
        const myfuncion = async () => {
            const token = jwt.sign({ _id: 12},'asdasd' , { expiresIn : '0 seconds'});
            console.log(token);
            
         const data =   jwt.verify(token, 'asdasd'); // secret needs to be same
            console.log(data);
            
        }
        myfuncion(); */

// COMMENTED CODE 
/*     Task.findById({ _id}).then((task) => {
        if(!task) {
          return  res.status(404).send();
        }
        res.status(200).send(task);
    }).catch((e) => {
        res.status(404).send(e);
    }); */

/*     Task.find({}).then((tasks) => {
    res.status(200).send(tasks);
}).catch((e) => {
    res.status(500).send(e);
}); */


/*     task.save().then(()=> {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error);
    }); */


/*     User.findById({ _id }).then((user) => {
        if(!user) {
       return res.status(404).send();
        }
        res.status(200).send(user);
    }).catch((error) => {
        res.status(500).send(error);
    }); */

/* User.find({}).then((users)=> {
        res.status(200).send(users);
    }).catch((error) => {
        res.status(400).send(error);
    }); */


/*  user.save().then(() => {
     res.status(201).send(user);
 }).catch((error) => {
     console.log('error occured' + error);
     res.status(400).send(error);
 }); */