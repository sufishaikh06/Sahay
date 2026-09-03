import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  facilityId: mongoose.Types.ObjectId | null;
  requestedRole: string | null;
  approvedRole: string | null;
  status: 'pending' | 'active' | 'rejected';
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    facilityId: { type: Schema.Types.ObjectId, ref: 'Facility', default: null },
    requestedRole: {
      type: String,
      enum: ['doctor', 'nurse', 'receptionist', 'pharmacist', 'labStaff', null],
      default: null,
    },
    approvedRole: {
      type: String,
      enum: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'labStaff', null],
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected'],
      default: 'pending',
    },
    approvedBy: { type: String, default: null },
    approvedAt: { type: Date, default: null },
    rejectedBy: { type: String, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
