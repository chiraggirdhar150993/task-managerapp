
const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendDeleteMail } = require('../emails/account');

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image'));
        }

        cb(undefined, true);
        // cb(new Error('please upload an image'));

        // cb(undefined, true );
        // cb(undefined, false );


    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send(e);
    }
});


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['age', 'name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'invalid updates'
        });
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        const email = req.user.email;
        const name = req.user.name;
        await req.user.remove();
        sendDeleteMail(email, name);
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

const errorMiddleware = (req, res, next) => {
    throw new Error('From my middleware');
}
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize( { width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error , req , res, next ) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
});

router.get('/users/:id/avatar',async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
           throw new Error('user or avatar not found')
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch(e){
        res.status(404).send();
    }
});

module.exports = router;



/* router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById({
            _id
        });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});
 */

 // delete a user by id 
/*         // const user = await User.findByIdAndDelete(req.user._id);
       // if(!user) {
       //     res.status(400).send('user not found')
       // }
*/
/*
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['age', 'name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'invalid updates'
        });
    }

   // const _id = req.params.id;
    try {
        // const user = await User.findByIdAndUpdate(_id, req.body, {
        //     new: true,
        //     runValidators: true
        // });
      //  const user = await User.findById(_id);
        //const user = req.user;

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        // if (!user) res.status(404).send();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});
 */