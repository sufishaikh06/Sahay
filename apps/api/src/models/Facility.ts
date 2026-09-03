import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  type: 'primary_health_center' | 'community_health_center' | 'district_hospital' | 'sub_center';
  code: string;
  district: string;
  state: string;
  address: string;
  contactNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const facilitySchema = new Schema<IFacility>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['primary_health_center', 'community_health_center', 'district_hospital', 'sub_center'],
      required: true,
    },
    code: { type: String, required: true, unique: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, default: '' },
    contactNumber: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const FacilityModel = mongoose.models.Facility || mongoose.model<IFacility>('Facility', facilitySchema);
