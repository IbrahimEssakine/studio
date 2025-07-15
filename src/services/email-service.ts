
"use server"

import type { Order, Appointment } from "@/lib/types";
import { format } from "date-fns";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ===================================================================================
// REAL EMAIL SERVICE
// This service uses Nodemailer to send emails via a Gmail account.
// It reads credentials securely from environment variables.
// ===================================================================================

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to: string, subject: string, html: string) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email credentials are not set in environment variables.");
        console.log("===================================");
        console.log("📧 SIMULATING EMAIL SEND (Credentials Missing) 📧");
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log("-----------------------------------");
        console.log(html);
        console.log("===================================");
        return;
    }
    
    try {
        await transporter.sendMail({
            from: `"Agharas Vision" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};

export const sendNewOrderEmail = async (order: Order) => {
    const to = order.shippingAddress?.email;
    if (!to) return;

    const subject = `✅ Your Agharas Vision Order #${order.id} is Confirmed!`;
    const body = `
        <p>Hi ${order.customerName},</p>
        <p>Thank you for your purchase! We've received your order and are getting it ready.</p>
        <br>
        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>Total:</b> ${order.total.toFixed(2)} DH</p>
        <p><b>Items:</b> ${order.items}</p>
        <br>
        <p>We'll notify you again once your order has shipped.</p>
        <br>
        <p>Thanks,</p>
        <p>The Agharas Vision Team</p>
    `;
    await sendEmail(to, subject, body);
};

export const sendOrderStatusUpdateEmail = async (order: Order) => {
    const to = order.shippingAddress?.email;
    if (!to) return;

    const subject = `📦 Your Agharas Vision Order #${order.id} has been ${order.status}`;
    const body = `
        <p>Hi ${order.customerName},</p>
        <p>Good news! The status of your order #${order.id} has been updated to: <b>${order.status}</b>.</p>
        <p>You can view your order details in your profile.</p>
        <br>
        <p>Thanks,</p>
        <p>The Agharas Vision Team</p>
    `;
    await sendEmail(to, subject, body);
};

export const sendNewAppointmentEmail = async (appointment: Appointment) => {
    const to = appointment.email;
    if (!to) return;

    const subject = `🗓️ Your Appointment is Pending with Agharas Vision`;
    const body = `
        <p>Hi ${appointment.name},</p>
        <p>We have received your request for an appointment on <b>${format(appointment.date, "PPP")} at ${appointment.time}</b>.</p>
        <p>We will review it shortly and send another email to confirm.</p>
        <br>
        <p>Thanks,</p>
        <p>The Agharas Vision Team</p>
    `;
    await sendEmail(to, subject, body);
};

export const sendAppointmentStatusUpdateEmail = async (appointment: Appointment) => {
    const to = appointment.email;
    if (!to) return;
    
    const subject = `🗓️ Your Agharas Vision Appointment has been ${appointment.status}`;
    const body = `
        <p>Hi ${appointment.name},</p>
        <p>This is a notification that your appointment for ${format(appointment.date, "PPP")} at ${appointment.time} has been <b>${appointment.status}</b>.</p>
        <p>If you have any questions, please contact us.</p>
        <br>
        <p>Thanks,</p>
        <p>The Agharas Vision Team</p>
    `;
    await sendEmail(to, subject, body);
}

export const sendPasswordResetEmail = async (email: string) => {
    const subject = "🔑 Reset Your Agharas Vision Password";
    const body = `
        <p>Hi there,</p>
        <p>We received a request to reset the password for your account.</p>
        <p>Click this link to reset your password:</p>
        <p><a href="https://your-app-url.com/reset-password?token=SIMULATED_RESET_TOKEN">Reset Password</a></p>
        <br>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <br>
        <p>Thanks,</p>
        <p>The Agharas Vision Team</p>
    `;
    await sendEmail(email, subject, body);
};
