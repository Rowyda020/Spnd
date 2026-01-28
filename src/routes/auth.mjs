import { Router } from "express";
import passport from "passport";
import '../strategies/local-strategy.mjs'
import '../strategies/google-strategy.mjs'
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import {
    query,
    validationResult,
    checkSchema,
    matchedData,
} from "express-validator";
import User from "../models/user.mjs";
import { hashPass } from "../utils/helper.mjs";
const router = Router();

router.get('/', (req, res) => {
    res.send("Logged in successfully")
    console.log("Logged in successfully")
})
router.post('/register', checkSchema(createUserValidationSchema), async (req, res) => {
    const result = validationResult(req);
    console.log(req.body)
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const data = matchedData(req);
    data.password = hashPass(data.password)
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        return res.status(201).send(userResponse);
    } catch (error) {
        console.error("Save error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).send({
                error: `${field} already exists`
            });
        }

        return res.status(400).send({ error: error.message });
    }
})

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/homepage', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
}))

router.get('/auth/failure', (req, res) => {
    res.send("something went wrong")
})
export default router