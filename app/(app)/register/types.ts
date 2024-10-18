import { OtpRequst } from "@/graphql/generated/graphql";

export class IndividualDriverFormValue
  implements IndividualDriverFormValueType
{
  constructor(data: IndividualDriverFormValueType) {
    this.policyVersion = data.policyVersion;
    this.driverType = data.driverType;
    this.title = data.title;
    this.otherTitle = data.otherTitle;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.taxId = data.taxId;
    this.phoneNumber = data.phoneNumber;
    this.lineId = data.lineId;
    this.password = data.password;
    this.confirmPassword = data.confirmPassword;
    this.address = data.address;
    this.province = data.province;
    this.district = data.district;
    this.subDistrict = data.subDistrict;
    this.postcode = data.postcode;
    this.bank = data.bank;
    this.bankBranch = data.bankBranch;
    this.bankName = data.bankName;
    this.bankNumber = data.bankNumber;
    this.serviceVehicleType = data.serviceVehicleType;
  }

  policyVersion: number;
  driverType: string;
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  taxId: string;
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
  serviceVehicleType: string;
}

export interface IndividualParam {
  driverType: string;
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
}

export interface IndividualRegisterParam {
  type?: IndividualParam;
  detail?: IndividualDriverFormValue;
  documents?: RegisterUploadsFormValue;
  otp?: OtpRequst;
}
