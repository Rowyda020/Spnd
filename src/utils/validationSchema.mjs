export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 52
            },
            errorMessage: "Username must be at least 5 characters with a max of 52 characters"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
        isString: {
            errorMessage: "Username must be a string!",
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
    },
    email: {
        isString: {
            errorMessage: "email must be a string!",
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        },
        isEmail: {  // ✅ Add this
            errorMessage: "Must be a valid email address"
        },
        normalizeEmail: true  // ✅ Sanitizes email
    }
}

export const createIncomeValidationSchema = {
    amount: {
        notEmpty: {
            errorMessage: "Please provide the amount of your income"
        }
    },
    soruce: {
        notEmpty: {
            errorMessage: "Please provide the amount of your income"
        },
        isString: {
            errorMessage: "Please provide the source of income"
        }
    },
    category: {
        isString: {
            errorMessage: "category must be a string"
        },
        notEmpty: {
            errorMessage: "Please provide the category of your income"
        }
    },
}

export const createExpenseValidationSchema = {
    amount: {
        notEmpty: {
            errorMessage: "Please provide the amount of your income"
        }
    },
    description: {
        isString: {
            errorMessage: "Please provide the source of income"
        }
    },
    category: {
        isString: {
            errorMessage: "category must be a string"
        },
        notEmpty: {
            errorMessage: "Please provide the category of your income"
        }
    },
}