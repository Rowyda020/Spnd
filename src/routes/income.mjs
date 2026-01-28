import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.mjs";
import { createIncomeValidationSchema } from "../utils/validationSchema.mjs";
import {
    query,
    validationResult,
    checkSchema,
    matchedData,
} from "express-validator";
import Income from "../models/income.mjs";
import User from "../models/user.mjs";
const router = Router()
router.post('/create-income', checkSchema(createIncomeValidationSchema), isLoggedIn, async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const data = matchedData(req);
    console.log(req.user)
    const incomeData = {
        ...data,
        user: req.user._id
    };

    const updatedIncome = Number((data.amount + req.user.totalIncome).toFixed(3))
    const newIncome = new Income(incomeData);
    const updateUserTotalIncome = await User.findById(req.user._id)
    try {
        const savedIncome = await newIncome.save();
        await updateUserTotalIncome.updateOne({ totalIncome: updatedIncome })
        const userIncomeResponse = savedIncome.toObject();
        return res.status(201).send(userIncomeResponse);
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }

})

router.get('/all-incomes', isLoggedIn, async (req, res) => {

    try {
        const incomes = await Income.find({ user: req.user._id });

        res.send(incomes).status(200);
    } catch (error) {
        return res.status(401).send("are you even logged in?")
    }
})
export default router 