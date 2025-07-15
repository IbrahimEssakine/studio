
import type { Order, Appointment } from "@/lib/types";
import { format } from "date-fns";

// ===================================================================================
// EMAIL SIMULATION SERVICE
// In a real application, these functions would use a service like Resend,
// SendGrid, or Nodemailer to send actual emails. For this project, we are
// simulating email sending by logging the details to the console.
// ===================================================================================

const logEmail = (to: string, subject: string, body: string) => {
    console.log("===================================");
    console.log("📧 SIMULATING EMAIL SEND 📧");
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("-----------------------------------");
    console.log(body);
    console.log("===================================");
};

export const sendNewOrderEmail = (order: Order) => {
    const to = order.shippingAddress?.email;
    if (!to) return;

    const subject = `✅ Your Agharas Vision Order #${order.id} is Confirmed!`;
    const body = `
Hi ${order.customerName},

Thank you for your purchase! We've received your order and are getting it ready.

Order ID: ${order.id}
Total: ${order.total.toFixed(2)} DH
Items: ${order.items}

We'll notify you again once your order has shipped.

Thanks,
The Agharas Vision Team
    `;
    logEmail(to, subject, body);
};

export const sendOrderStatusUpdateEmail = (order: Order) => {
    const to = order.shippingAddress?.email;
    if (!to) return;

    const subject = `📦 Your Agharas Vision Order #${order.id} has been ${order.status}`;
    const body = `
Hi ${order.customerName},

Good news! The status of your order #${order.id} has been updated to: ${order.status}.

You can view your order details in your profile.

Thanks,
The Agharas Vision Team
    `;
    logEmail(to, subject, body);
};

export const sendNewAppointmentEmail = (appointment: Appointment) => {
    const to = appointment.email;
    if (!to) return;

    const subject = `🗓️ Your Appointment is Pending with Agharas Vision`;
    const body = `
Hi ${appointment.name},

We have received your request for an appointment on ${format(appointment.date, "PPP")} at ${appointment.time}.

We will review it shortly and send another email to confirm.

Thanks,
The Agharas Vision Team
    `;
    logEmail(to, subject, body);
};

export const sendAppointmentStatusUpdateEmail = (appointment: Appointment) => {
    const to = appointment.email;
    if (!to) return;
    
    const subject = `🗓️ Your Agharas Vision Appointment has been ${appointment.status}`;
    const body = `
Hi ${appointment.name},

This is a notification that your appointment for ${format(appointment.date, "PPP")} at ${appointment.time} has been ${appointment.status}.

If you have any questions, please contact us.

Thanks,
The Agharas Vision Team
    `;
    logEmail(to, subject, body);
}

export const sendPasswordResetEmail = (email: string) => {
    const subject = "🔑 Reset Your Agharas Vision Password";
    const body = `
Hi there,

We received a request to reset the password for your account.

Click this link to reset your password:
https://your-app-url.com/reset-password?token=SIMULATED_RESET_TOKEN

If you did not request a password reset, you can safely ignore this email.

Thanks,
The Agharas Vision Team
    `;
    logEmail(email, subject, body);
};
