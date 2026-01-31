import mongoose, { Schema, model, models } from 'mongoose';

// Participants
const ParticipantSchema = new Schema({
    name: { type: String, required: true },
    totalContributed: { type: Number, default: 0 },
}, { timestamps: true });

export const Participant = models.Participant || model('Participant', ParticipantSchema);

// Categories
const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export const Category = models.Category || model('Category', CategorySchema);

// Deposits
const DepositSchema = new Schema({
    amount: { type: Number, required: true },
    contributor: { type: Schema.Types.ObjectId, ref: 'Participant', required: true, index: true },
    date: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const Deposit = models.Deposit || model('Deposit', DepositSchema);

// Expenses
const GroupExpenseSchema = new Schema({
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    date: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const Expense = models.GroupExpense || model('GroupExpense', GroupExpenseSchema);
