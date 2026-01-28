import Expense from "../models/expense.mjs";
import User from "../models/user.mjs";
import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.mjs";
import { createExpenseValidationSchema } from "../utils/validationSchema.mjs";
import { sendExpenseEmail, sendWarningEmail } from "../utils/emailHelper.mjs";
import dotenv from 'dotenv'
dotenv.config();
import {
    query,
    validationResult,
    checkSchema,
    matchedData,
} from "express-validator";

const router = Router();
router.post('/create-expense', isLoggedIn, checkSchema(createExpenseValidationSchema), async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const data = matchedData(req);
    const expenseData = {
        ...data,
        user: req.user._id
    };

    const updatedIncome = Number((req.user.totalIncome - data.amount).toFixed(3))
    const newExpense = new Expense(expenseData);
    const updateUserTotalIncome = await User.findById(req.user._id)
    try {

        if (data.amount < req.user.totalIncome) {
            const savedExpense = await newExpense.save();
            await updateUserTotalIncome.updateOne({ totalIncome: updatedIncome })
            const userExpenseResponse = savedExpense.toObject();
            await sendExpenseEmail(req.user.email);
            return res.status(201).send(userExpenseResponse);

        }
        await sendWarningEmail(req.user.email);
        return res.status(400).send("This operation is not allowes")

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
})



router.get('/all-expenses', isLoggedIn, async (req, res) => {

    try {
        const expenses = await Expense.find({ user: req.user._id });
        res.send(expenses).status(200);
    } catch (error) {
        return res.status(401).send("are you even logged in?")
    }
})
export default router