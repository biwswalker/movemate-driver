import { EDriverType } from "@/graphql/generated/graphql";

export interface EmployeeDriverFormValueType {
  // Detail
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  taxNumber: string;
  phoneNumber: string;
  lineId: string;
  // Address
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postcode: string;
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
}

export class EmployeeDriverFormValue implements EmployeeDriverFormValueType {
  constructor(data: EmployeeDriverFormValueType ) {
    this.title = data.title;
    this.otherTitle = data.otherTitle || "";
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.taxNumber = data.taxNumber;
    this.phoneNumber = data.phoneNumber;
    this.lineId = data.lineId;
    this.address = data.address;
    this.province = data.province;
    this.district = data.district;
    this.subDistrict = data.subDistrict;
    this.postcode = data.postcode;
    this.serviceVehicleTypes = data.serviceVehicleTypes
  }

  // Detail
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  taxNumber: string;
  phoneNumber: string;
  lineId: string;
  // Address
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postcode: string;
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

export interface EmployeeRegisterParam {
  detail?: EmployeeDriverFormValue;
  documents?: RegisterUploadsFormValue;
}
