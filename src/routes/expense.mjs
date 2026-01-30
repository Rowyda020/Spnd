import Expense from "../models/expense.mjs";
import User from "../models/user.mjs";
import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.mjs";
import { authenticateJWT } from "../middleware/jwtAuth.mjs";
import { createExpenseValidationSchema } from "../utils/validationSchema.mjs";
import { sendExpenseEmail, sendWarningEmail } from "../utils/emailHelper.mjs";
import mongoose from 'mongoose'; // Add this at the top to handle ID conversion
import dotenv from 'dotenv'
dotenv.config();
import {
    query,
    validationResult,
    checkSchema,
    matchedData,
} from "express-validator";

const router = Router();
router.post('/create-expense', authenticateJWT, checkSchema(createExpenseValidationSchema), async (req, res) => {
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



router.get('/all-expenses', authenticateJWT, async (req, res) => {

    try {
        const expenses = await Expense.find({ user: req.user._id });
        res.send(expenses).status(200);
    } catch (error) {
        return res.status(401).send("are you even logged in?")
    }
})


router.get('/monthly-expenses', authenticateJWT, async (req, res) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    try {
        const result = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user._id),
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const summary = result.length > 0 ? result[0] : { totalAmount: 0 };

        res.status(200).send({
            total: summary.totalAmount,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error calculating expenses");
    }
});
export default router