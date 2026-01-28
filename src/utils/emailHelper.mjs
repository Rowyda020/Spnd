import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API)

export const sendExpenseEmail = (email) => {
    return resend.emails.send({
        from: 'Spnd <no-reply@resend.dev>',
        to: email,
        subject: '💸 New Expense Added!',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hey 👋</h2>
        <p>You’ve added a <strong>new expense</strong>.</p>
        <p>Nice work staying on top of your spending 💪</p>
        <p><strong>— Spnd Team</strong></p>
      </div>
    `
    });
};

export const sendWarningEmail = (email) => {
    return resend.emails.send({
        from: 'Spnd <no-reply@resend.dev>',
        to: email,
        subject: '⚠️ Expense Exceeds Your Income',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Heads up ⚠️</h2>
        <p>You tried to add an expense that <strong>exceeds your total income</strong>.</p>
        <p>This operation was not completed to help you stay financially safe 💛</p>
        <p>Consider reviewing your expenses or adding new income.</p>
        <p style="margin-top: 16px;"><strong>— Spnd Team</strong></p>
      </div>
    `
    });
};
