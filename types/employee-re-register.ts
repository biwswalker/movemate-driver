export interface DriverFormValueType {
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
  // Service
  serviceVehicleTypes: string[];
  licensePlateProvince: string;
  licensePlateNumber: string;
}

export interface RegisterUploadsFormValueType {
  frontOfVehicle: FileInput | string;
  backOfVehicle: FileInput | string;
  leftOfVehicle: FileInput | string;
  rigthOfVehicle: FileInput | string;
  copyVehicleRegistration: FileInput | string;
  copyIDCard: FileInput | string;
  copyDrivingLicense: FileInput | string;
  copyBookBank: FileInput | string;
  copyHouseRegistration: FileInput | string;
  insurancePolicy: FileInput | string;
  criminalRecordCheckCert: FileInput | string;
}

export class DriverFormValue implements DriverFormValueType {
  constructor(data: DriverFormValueType) {
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
    this.serviceVehicleTypes = data.serviceVehicleTypes;
    this.licensePlateProvince = data.licensePlateProvince;
    this.licensePlateNumber = data.licensePlateNumber;
  }

  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  taxNumber: string;
  phoneNumber: string;
  lineId: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postcode: string;
  serviceVehicleTypes: string[];
  licensePlateProvince: string;
  licensePlateNumber: string;
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

  frontOfVehicle: FileInput | string;
  backOfVehicle: FileInput | string;
  leftOfVehicle: FileInput | string;
  rigthOfVehicle: FileInput | string;
  copyVehicleRegistration: FileInput | string;
  copyIDCard: FileInput | string;
  copyDrivingLicense: FileInput | string;
  copyBookBank: FileInput | string;
  copyHouseRegistration: FileInput | string;
  insurancePolicy: FileInput | string;
  criminalRecordCheckCert: FileInput | string;
}

export interface EmployeeRegisterParam {
  id: string;
  detail?: DriverFormValue;
  documents?: RegisterUploadsFormValue;
}
