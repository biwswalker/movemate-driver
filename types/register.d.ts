interface IndividualDriverFormValueType {
  policyVersion: number;
  driverType: string
  // Detail
  title: string;
  otherTitle?: string;
  firstname: string;
  lastname: string;
  taxId: string;
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
  serviceVehicleType: string;
}

interface RegisterUploadsFormValueType {
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
