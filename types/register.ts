import { EDriverType, OtpRequst } from "@/graphql/generated/graphql";
import { get } from "lodash";

export interface DriverFormValueType {
  policyVersion: number;
  driverType: EDriverType;
  // Detail
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  businessName: string;
  businessBranch: string;
  taxNumber: string;
  phoneNumber: string;
  lineId: string;
  password: string;
  confirmPassword: string;
  // Address
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postcode: string;
  // Bank
  bank: string;
  bankBranch: string;
  bankName: string;
  bankNumber: string;
  // Service
  serviceVehicleTypes: string[];
}

export interface RegisterUploadsFormValueType {
  frontOfVehicle: FileInput;
  backOfVehicle: FileInput;
  leftOfVehicle: FileInput;
  rigthOfVehicle: FileInput;
  copyVehicleRegistration: FileInput;
  copyIDCard: FileInput;
  copyDrivingLicense: FileInput;
  copyBookBank: FileInput;
  copyHouseRegistration: FileInput;
  insurancePolicy: FileInput;
  criminalRecordCheckCert: FileInput;
  // Only Business
  businessRegistrationCertificate: FileInput;
  certificateValueAddedTaxRegistration: FileInput;
}

export class DriverFormValue implements DriverFormValueType {
  constructor(data: DriverFormValueType) {
    this.policyVersion = data.policyVersion;
    this.driverType = data.driverType;
    this.title = data.title;
    this.otherTitle = data.otherTitle || "";
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.businessName = data.businessName;
    this.businessBranch = data.businessBranch;
    this.taxNumber = data.taxNumber;
    this.phoneNumber = data.phoneNumber;
    this.lineId = data.lineId;
    this.password = data.password;
    this.confirmPassword = get(data, "confirmPassword", "");
    this.address = data.address;
    this.province = data.province;
    this.district = data.district;
    this.subDistrict = data.subDistrict;
    this.postcode = data.postcode;
    this.bank = data.bank;
    this.bankBranch = data.bankBranch;
    this.bankName = data.bankName;
    this.bankNumber = data.bankNumber;
    this.serviceVehicleTypes = data.serviceVehicleTypes;
  }

  policyVersion: number;
  driverType: EDriverType;
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  businessName: string;
  businessBranch: string;
  taxNumber: string;
  phoneNumber: string;
  lineId: string;
  password: string;
  confirmPassword: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postcode: string;
  bank: string;
  bankBranch: string;
  bankName: string;
  bankNumber: string;
  serviceVehicleTypes: string[];
}

export interface IndividualParam {
  driverType: EDriverType;
  version: number;
}

export class RegisterUploadsFormValue implements RegisterUploadsFormValueType {
  constructor(data: RegisterUploadsFormValueType) {
    this.frontOfVehicle = data.frontOfVehicle;
    this.backOfVehicle = data.backOfVehicle;
    this.leftOfVehicle = data.leftOfVehicle;
    this.rigthOfVehicle = data.rigthOfVehicle;
    this.copyVehicleRegistration = data.copyVehicleRegistration;
    this.copyIDCard = data.copyIDCard;
    this.copyDrivingLicense = data.copyDrivingLicense;
    this.copyBookBank = data.copyBookBank;
    this.copyHouseRegistration = data.copyHouseRegistration;
    this.insurancePolicy = data.insurancePolicy;
    this.criminalRecordCheckCert = data.criminalRecordCheckCert;
    this.businessRegistrationCertificate = data.businessRegistrationCertificate;
    this.certificateValueAddedTaxRegistration =
      data.certificateValueAddedTaxRegistration;
  }

  frontOfVehicle: FileInput;
  backOfVehicle: FileInput;
  leftOfVehicle: FileInput;
  rigthOfVehicle: FileInput;
  copyVehicleRegistration: FileInput;
  copyIDCard: FileInput;
  copyDrivingLicense: FileInput;
  copyBookBank: FileInput;
  copyHouseRegistration: FileInput;
  insurancePolicy: FileInput;
  criminalRecordCheckCert: FileInput;
  businessRegistrationCertificate: FileInput;
  certificateValueAddedTaxRegistration: FileInput;
}

export interface IndividualRegisterParam {
  type?: IndividualParam;
  detail?: DriverFormValue;
  documents?: RegisterUploadsFormValue;
  otp?: OtpRequst;
}