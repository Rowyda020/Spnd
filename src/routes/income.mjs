import { Router } from "express";
import { authenticateJWT } from "../middleware/jwtAuth.mjs";
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
router.post(
    '/create-income',
    checkSchema(createIncomeValidationSchema),
    authenticateJWT,
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const data = matchedData(req);
        console.log('Validated data:', data);
        console.log('Authenticated user:', req.user);

        try {
            const incomeData = {
                ...data,
                user: req.user._id,
                // date already handled by Mongoose if not sent (defaults to now)
            };

            const newIncome = new Income(incomeData);
            const savedIncome = await newIncome.save();

            // Atomic update – safer and one DB round-trip
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { $inc: { totalIncome: savedIncome.amount } },  // increment by exact amount
                { new: true, select: 'totalIncome' }           // return updated doc
            );

            // Optional: return both income + updated user total
            return res.status(201).json({
                income: savedIncome.toObject(),
                totalIncome: updatedUser.totalIncome
            });
        } catch (error) {
            console.error('Error creating income:', error);
            return res.status(400).json({ error: error.message || 'Failed to create income' });
        }
    }
);

router.get('/all-incomes', authenticateJWT, async (req, res) => {

    try {
        const incomes = await Income.find({ user: req.user._id });

        res.send(incomes).status(200);
    } catch (error) {
        return res.status(401).send("are you even logged in??")
    }
})
export default router 