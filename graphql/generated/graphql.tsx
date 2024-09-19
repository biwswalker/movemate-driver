import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTimeISO: { input: any; output: any };
  JSONObject: { input: any; output: any };
  Upload: { input: any; output: any };
};

export type AcceptedPolicyInput = {
  version: Scalars["Int"]["input"];
};

export type AddAdminInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  lastname: Scalars["String"]["input"];
  permission: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
  taxId?: InputMaybe<Scalars["String"]["input"]>;
};

export type AdditionalService = {
  __typename?: "AdditionalService";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  descriptions: Array<AdditionalServiceDescription>;
  name: Scalars["String"]["output"];
  permanent: Scalars["Boolean"]["output"];
  status: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type AdditionalServiceCostInput = {
  _id: Scalars["String"]["input"];
  additionalService: Scalars["String"]["input"];
  available: Scalars["Boolean"]["input"];
  cost: Scalars["Float"]["input"];
  price: Scalars["Float"]["input"];
  type: Scalars["String"]["input"];
};

export type AdditionalServiceCostPricing = {
  __typename?: "AdditionalServiceCostPricing";
  _id: Scalars["ID"]["output"];
  additionalService: AdditionalService;
  available: Scalars["Boolean"]["output"];
  cost: Scalars["Float"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  price: Scalars["Float"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type AdditionalServiceDescription = {
  __typename?: "AdditionalServiceDescription";
  _id: Scalars["ID"]["output"];
  detail: Scalars["String"]["output"];
  vehicleTypes: Array<VehicleType>;
};

export type AdditionalServiceInput = {
  descriptions: Array<ServiceDescriptionInput>;
  name: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type AdditionalServicePaginationPayload = {
  __typename?: "AdditionalServicePaginationPayload";
  docs: Array<AdditionalService>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  nextPage?: Maybe<Scalars["Int"]["output"]>;
  offset?: Maybe<Scalars["Int"]["output"]>;
  page?: Maybe<Scalars["Int"]["output"]>;
  pagingCounter: Scalars["Int"]["output"];
  prevPage?: Maybe<Scalars["Int"]["output"]>;
  totalDocs: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type AddressPayload = {
  __typename?: "AddressPayload";
  district: District;
  postcode: Scalars["Float"]["output"];
  province: Province;
  subDistrict: SubDistrict;
};

export type Admin = {
  __typename?: "Admin";
  _id: Scalars["ID"]["output"];
  address?: Maybe<Scalars["String"]["output"]>;
  district?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  firstname: Scalars["String"]["output"];
  fullname?: Maybe<Scalars["String"]["output"]>;
  lastname: Scalars["String"]["output"];
  permission: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
  postcode?: Maybe<Scalars["String"]["output"]>;
  province?: Maybe<Scalars["String"]["output"]>;
  subDistrict?: Maybe<Scalars["String"]["output"]>;
  taxId?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  userNumber: Scalars["String"]["output"];
};

export type AdminNotificationCountPayload = {
  __typename?: "AdminNotificationCountPayload";
  businessCustomer: Scalars["Int"]["output"];
  businessDriver: Scalars["Int"]["output"];
  customer: Scalars["Int"]["output"];
  driver: Scalars["Int"]["output"];
  financial: Scalars["Int"]["output"];
  individualCustomer: Scalars["Int"]["output"];
  individualDriver: Scalars["Int"]["output"];
  shipment: Scalars["Int"]["output"];
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  requireAcceptedPolicy: Scalars["Boolean"]["output"];
  requirePasswordChange: Scalars["Boolean"]["output"];
  token: Scalars["String"]["output"];
  user: User;
};

export type BilledMonth = {
  __typename?: "BilledMonth";
  apr: Scalars["Int"]["output"];
  aug: Scalars["Int"]["output"];
  dec: Scalars["Int"]["output"];
  feb: Scalars["Int"]["output"];
  jan: Scalars["Int"]["output"];
  jul: Scalars["Int"]["output"];
  jun: Scalars["Int"]["output"];
  mar: Scalars["Int"]["output"];
  may: Scalars["Int"]["output"];
  nov: Scalars["Int"]["output"];
  oct: Scalars["Int"]["output"];
  sep: Scalars["Int"]["output"];
};

export type BilledMonthInput = {
  apr: Scalars["Int"]["input"];
  aug: Scalars["Int"]["input"];
  dec: Scalars["Int"]["input"];
  feb: Scalars["Int"]["input"];
  jan: Scalars["Int"]["input"];
  jul: Scalars["Int"]["input"];
  jun: Scalars["Int"]["input"];
  mar: Scalars["Int"]["input"];
  may: Scalars["Int"]["input"];
  nov: Scalars["Int"]["input"];
  oct: Scalars["Int"]["input"];
  sep: Scalars["Int"]["input"];
};

export type BillingCycle = {
  __typename?: "BillingCycle";
  _id: Scalars["ID"]["output"];
  billingEndDate: Scalars["DateTimeISO"]["output"];
  billingNumber: Scalars["String"]["output"];
  billingPayment?: Maybe<BillingPayment>;
  billingReceipt?: Maybe<BillingReceipt>;
  billingStartDate: Scalars["DateTimeISO"]["output"];
  billingStatus: Scalars["String"]["output"];
  cancelledDetail?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTimeISO"]["output"];
  emailSendedReceiptTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  emailSendedTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  history?: Maybe<Array<UpdateHistory>>;
  issueDate: Scalars["DateTimeISO"]["output"];
  issueInvoiceFilename?: Maybe<Scalars["String"]["output"]>;
  issueReceiptFilename?: Maybe<Scalars["String"]["output"]>;
  paymentDueDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  paymentMethod: Scalars["String"]["output"];
  postalInvoice?: Maybe<PostalDetail>;
  postalReceipt?: Maybe<PostalDetail>;
  receivedWHTDocumentTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  refund?: Maybe<Refund>;
  rejectedDetail?: Maybe<Scalars["String"]["output"]>;
  rejectedReason?: Maybe<Scalars["String"]["output"]>;
  shipments: Array<Shipment>;
  subTotalAmount: Scalars["Float"]["output"];
  taxAmount: Scalars["Float"]["output"];
  totalAmount: Scalars["Float"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  user: User;
};

export type BillingCyclePaginationAggregatePayload = {
  __typename?: "BillingCyclePaginationAggregatePayload";
  docs: Array<BillingCycle>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  nextPage?: Maybe<Scalars["Int"]["output"]>;
  offset?: Maybe<Scalars["Int"]["output"]>;
  page?: Maybe<Scalars["Int"]["output"]>;
  pagingCounter: Scalars["Int"]["output"];
  prevPage?: Maybe<Scalars["Int"]["output"]>;
  totalDocs: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type BillingPayment = {
  __typename?: "BillingPayment";
  _id: Scalars["ID"]["output"];
  bank?: Maybe<Scalars["String"]["output"]>;
  bankName?: Maybe<Scalars["String"]["output"]>;
  bankNumber?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTimeISO"]["output"];
  imageEvidence?: Maybe<File>;
  paymentAmount: Scalars["Float"]["output"];
  paymentDate: Scalars["DateTimeISO"]["output"];
  paymentNumber: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  updatedBy?: Maybe<Scalars["String"]["output"]>;
};

export type BillingReceipt = {
  __typename?: "BillingReceipt";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  paidAmount: Scalars["Float"]["output"];
  receiptDate: Scalars["DateTimeISO"]["output"];
  receiptNumber: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  updatedBy?: Maybe<Scalars["String"]["output"]>;
};

export type BookingConfigPayload = {
  __typename?: "BookingConfigPayload";
  paymentMethods: Array<PaymentMethodPayload>;
  vehicleCosts: Array<VehicleCost>;
};

export type BusinessCustomer = {
  __typename?: "BusinessCustomer";
  _id: Scalars["ID"]["output"];
  acceptedEDocumentDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  acceptedPoliciesDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  acceptedPoliciesVersion?: Maybe<Scalars["Int"]["output"]>;
  acceptedTermConditionDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  acceptedTermConditionVersion?: Maybe<Scalars["Int"]["output"]>;
  address: Scalars["String"]["output"];
  businessBranch?: Maybe<Scalars["String"]["output"]>;
  businessEmail: Scalars["String"]["output"];
  businessName: Scalars["String"]["output"];
  businessTitle: Scalars["String"]["output"];
  businessType: Scalars["String"]["output"];
  businessTypeOther?: Maybe<Scalars["String"]["output"]>;
  cashPayment?: Maybe<BusinessCustomerCashPayment>;
  changePaymentMethodRequest?: Maybe<Scalars["Boolean"]["output"]>;
  contactNumber: Scalars["String"]["output"];
  creditPayment?: Maybe<BusinessCustomerCreditPayment>;
  district: Scalars["String"]["output"];
  paymentMethod: Scalars["String"]["output"];
  postcode: Scalars["String"]["output"];
  province: Scalars["String"]["output"];
  subDistrict: Scalars["String"]["output"];
  taxNumber: Scalars["String"]["output"];
  userNumber: Scalars["String"]["output"];
};

export type BusinessCustomerCashPayment = {
  __typename?: "BusinessCustomerCashPayment";
  _id: Scalars["ID"]["output"];
  acceptedEReceiptDate: Scalars["DateTimeISO"]["output"];
};

export type BusinessCustomerCreditPayment = {
  __typename?: "BusinessCustomerCreditPayment";
  _id: Scalars["ID"]["output"];
  acceptedFirstCreditTermDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  billedDate: BilledMonth;
  billedDateType: Scalars["String"]["output"];
  billedRound: BilledMonth;
  billedRoundType: Scalars["String"]["output"];
  businessRegistrationCertificateFile: File;
  certificateValueAddedTaxRegistrationFile?: Maybe<File>;
  copyIDAuthorizedSignatoryFile: File;
  creditLimit: Scalars["Float"]["output"];
  creditUsage: Scalars["Float"]["output"];
  financialAddress: Scalars["String"]["output"];
  financialContactEmails: Array<Scalars["String"]["output"]>;
  financialContactNumber: Scalars["String"]["output"];
  financialDistrict: Scalars["String"]["output"];
  financialFirstname: Scalars["String"]["output"];
  financialLastname: Scalars["String"]["output"];
  financialPostcode: Scalars["String"]["output"];
  financialProvince: Scalars["String"]["output"];
  financialSubDistrict: Scalars["String"]["output"];
  isSameAddress?: Maybe<Scalars["Boolean"]["output"]>;
};

export type CalculationResultPayload = {
  __typename?: "CalculationResultPayload";
  _id: Scalars["ID"]["output"];
  benefits: Scalars["Float"]["output"];
  cost: Scalars["Float"]["output"];
  costResult: Scalars["Float"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  from: Scalars["Float"]["output"];
  history: Array<UpdateHistory>;
  price: Scalars["Float"]["output"];
  priceResult: Scalars["Float"]["output"];
  to: Scalars["Float"]["output"];
  unit: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type CashDetail = {
  __typename?: "CashDetail";
  bank: Scalars["String"]["output"];
  bankName: Scalars["String"]["output"];
  bankNumber: Scalars["String"]["output"];
  imageEvidence: File;
  paymentDate: Scalars["DateTimeISO"]["output"];
  paymentTime: Scalars["DateTimeISO"]["output"];
};

export type CashPaymentDetailInput = {
  acceptedEReceipt: Scalars["Boolean"]["input"];
  acceptedEReceiptDate: Scalars["String"]["input"];
};

export type CashPaymentInput = {
  acceptedEReceiptDate: Scalars["DateTimeISO"]["input"];
};

export type ConfirmShipmentDateInput = {
  datetime: Scalars["DateTimeISO"]["input"];
  shipmentId: Scalars["String"]["input"];
};

export type CreditPaymentDetailInput = {
  acceptedFirstCreditTerm: Scalars["Boolean"]["input"];
  acceptedFirstCreditTermDate: Scalars["String"]["input"];
  billedDate: BilledMonthInput;
  billedDateType: Scalars["String"]["input"];
  billedRound: BilledMonthInput;
  billedRoundType: Scalars["String"]["input"];
  businessRegistrationCertificateFile?: InputMaybe<FileInput>;
  certificateValueAddedTaxRegistrationFile?: InputMaybe<FileInput>;
  copyIDAuthorizedSignatoryFile?: InputMaybe<FileInput>;
  creditLimit: Scalars["Float"]["input"];
  creditUsage?: InputMaybe<Scalars["Float"]["input"]>;
  financialAddress: Scalars["String"]["input"];
  financialContactEmails: Array<Scalars["String"]["input"]>;
  financialContactNumber: Scalars["String"]["input"];
  financialDistrict: Scalars["String"]["input"];
  financialFirstname: Scalars["String"]["input"];
  financialLastname: Scalars["String"]["input"];
  financialPostcode: Scalars["String"]["input"];
  financialProvince: Scalars["String"]["input"];
  financialSubDistrict: Scalars["String"]["input"];
  isSameAddress: Scalars["Boolean"]["input"];
};

export type CreditPaymentInput = {
  acceptedFirstCreditTermDate: Scalars["DateTimeISO"]["input"];
  businessRegistrationCertificateFile: FileInput;
  certificateValueAddedTaxRegistrationFile?: InputMaybe<FileInput>;
  copyIDAuthorizedSignatoryFile: FileInput;
  financialAddress: Scalars["String"]["input"];
  financialContactEmails: Array<Scalars["String"]["input"]>;
  financialContactNumber: Scalars["String"]["input"];
  financialDistrict: Scalars["String"]["input"];
  financialFirstname: Scalars["String"]["input"];
  financialLastname: Scalars["String"]["input"];
  financialPostcode: Scalars["String"]["input"];
  financialProvince: Scalars["String"]["input"];
  financialSubDistrict: Scalars["String"]["input"];
  isSameAddress: Scalars["Boolean"]["input"];
};

export type CutomerBusinessInput = {
  acceptedEDocumentDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  acceptedPoliciesDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  acceptedTermConditionDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  address: Scalars["String"]["input"];
  businessBranch: Scalars["String"]["input"];
  businessEmail: Scalars["String"]["input"];
  businessName: Scalars["String"]["input"];
  businessTitle: Scalars["String"]["input"];
  businessType: Scalars["String"]["input"];
  businessTypeOther: Scalars["String"]["input"];
  cashPayment?: InputMaybe<CashPaymentDetailInput>;
  contactNumber: Scalars["String"]["input"];
  creditPayment?: InputMaybe<CreditPaymentDetailInput>;
  district: Scalars["String"]["input"];
  isVerifiedEmail?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVerifiedPhoneNumber?: InputMaybe<Scalars["Boolean"]["input"]>;
  paymentMethod: Scalars["String"]["input"];
  postcode: Scalars["String"]["input"];
  profileImage?: InputMaybe<FileInput>;
  province: Scalars["String"]["input"];
  remark?: InputMaybe<Scalars["String"]["input"]>;
  status: Scalars["String"]["input"];
  subDistrict: Scalars["String"]["input"];
  taxNumber: Scalars["String"]["input"];
  userType: Scalars["String"]["input"];
};

export type CutomerIndividualInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  district?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  isVerifiedEmail?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVerifiedPhoneNumber?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastname: Scalars["String"]["input"];
  otherTitle?: InputMaybe<Scalars["String"]["input"]>;
  phoneNumber: Scalars["String"]["input"];
  postcode?: InputMaybe<Scalars["String"]["input"]>;
  profileImage?: InputMaybe<FileInput>;
  province?: InputMaybe<Scalars["String"]["input"]>;
  remark?: InputMaybe<Scalars["String"]["input"]>;
  status: Scalars["String"]["input"];
  subDistrict?: InputMaybe<Scalars["String"]["input"]>;
  taxId?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
  userType: Scalars["String"]["input"];
};

export type Destination = {
  __typename?: "Destination";
  contactName: Scalars["String"]["output"];
  contactNumber: Scalars["String"]["output"];
  customerRemark?: Maybe<Scalars["String"]["output"]>;
  detail: Scalars["String"]["output"];
  location: Location;
  name: Scalars["String"]["output"];
  placeId: Scalars["String"]["output"];
};

export type DestinationInput = {
  contactName: Scalars["String"]["input"];
  contactNumber: Scalars["String"]["input"];
  customerRemark?: InputMaybe<Scalars["String"]["input"]>;
  detail: Scalars["String"]["input"];
  location: LocationInput;
  name: Scalars["String"]["input"];
  placeId: Scalars["String"]["input"];
};

export type DirectionsResult = {
  __typename?: "DirectionsResult";
  _id: Scalars["ID"]["output"];
  rawData: Scalars["String"]["output"];
};

export type DirectionsResultPayload = {
  __typename?: "DirectionsResultPayload";
  available_travel_modes?: Maybe<Array<Scalars["String"]["output"]>>;
  geocoded_waypoints?: Maybe<Array<Scalars["JSONObject"]["output"]>>;
  request?: Maybe<Scalars["JSONObject"]["output"]>;
  routes?: Maybe<Array<Scalars["JSONObject"]["output"]>>;
  status?: Maybe<Scalars["String"]["output"]>;
};

export type DistanceCostPricing = {
  __typename?: "DistanceCostPricing";
  _id: Scalars["ID"]["output"];
  benefits: Scalars["Float"]["output"];
  cost: Scalars["Float"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  from: Scalars["Float"]["output"];
  history: Array<UpdateHistory>;
  price: Scalars["Float"]["output"];
  to: Scalars["Float"]["output"];
  unit: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type DistanceCostPricingInput = {
  _id: Scalars["String"]["input"];
  benefits: Scalars["Float"]["input"];
  cost: Scalars["Float"]["input"];
  from: Scalars["Float"]["input"];
  price: Scalars["Float"]["input"];
  to: Scalars["Float"]["input"];
  unit: Scalars["String"]["input"];
};

export type District = {
  __typename?: "District";
  id: Scalars["Float"]["output"];
  nameEn: Scalars["String"]["output"];
  nameTh: Scalars["String"]["output"];
  provinceId: Scalars["Float"]["output"];
};

export type DriverDocument = {
  __typename?: "DriverDocument";
  _id: Scalars["ID"]["output"];
  backOfVehicle?: Maybe<File>;
  copyBookBank?: Maybe<File>;
  copyDrivingLicense?: Maybe<File>;
  copyHouseRegistration?: Maybe<File>;
  copyIDCard?: Maybe<File>;
  copyVehicleRegistration?: Maybe<File>;
  criminalRecordCheckCert?: Maybe<File>;
  frontOfVehicle?: Maybe<File>;
  insurancePolicy?: Maybe<File>;
  leftOfVehicle?: Maybe<File>;
  rigthOfVehicle?: Maybe<File>;
};

export type DriverDocumentInput = {
  backOfVehicle: FileInput;
  copyBookBank?: InputMaybe<FileInput>;
  copyDrivingLicense: FileInput;
  copyHouseRegistration?: InputMaybe<FileInput>;
  copyIDCard: FileInput;
  copyVehicleRegistration: FileInput;
  criminalRecordCheckCert?: InputMaybe<FileInput>;
  frontOfVehicle: FileInput;
  insurancePolicy?: InputMaybe<FileInput>;
  leftOfVehicle: FileInput;
  rigthOfVehicle: FileInput;
};

export type File = {
  __typename?: "File";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  fileId: Scalars["String"]["output"];
  filename: Scalars["String"]["output"];
  mimetype: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type FileInput = {
  fileId: Scalars["String"]["input"];
  filename: Scalars["String"]["input"];
  mimetype: Scalars["String"]["input"];
};

export type FileUploadPayload = {
  __typename?: "FileUploadPayload";
  fileId: Scalars["String"]["output"];
  filename: Scalars["String"]["output"];
  mimetype: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type IndividualCustomer = {
  __typename?: "IndividualCustomer";
  _id: Scalars["ID"]["output"];
  address?: Maybe<Scalars["String"]["output"]>;
  district?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  firstname: Scalars["String"]["output"];
  fullname?: Maybe<Scalars["String"]["output"]>;
  lastname: Scalars["String"]["output"];
  otherTitle?: Maybe<Scalars["String"]["output"]>;
  phoneNumber: Scalars["String"]["output"];
  postcode?: Maybe<Scalars["String"]["output"]>;
  province?: Maybe<Scalars["String"]["output"]>;
  subDistrict?: Maybe<Scalars["String"]["output"]>;
  taxId?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  userNumber: Scalars["String"]["output"];
};

export type IndividualDriver = {
  __typename?: "IndividualDriver";
  _id: Scalars["ID"]["output"];
  address: Scalars["String"]["output"];
  balance: Scalars["Float"]["output"];
  bank: Scalars["String"]["output"];
  bankBranch: Scalars["String"]["output"];
  bankName: Scalars["String"]["output"];
  bankNumber: Scalars["String"]["output"];
  district: Scalars["String"]["output"];
  documents: DriverDocument;
  firstname: Scalars["String"]["output"];
  fullname?: Maybe<Scalars["String"]["output"]>;
  lastname: Scalars["String"]["output"];
  lineId: Scalars["String"]["output"];
  otherTitle: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
  postcode: Scalars["String"]["output"];
  province: Scalars["String"]["output"];
  serviceVehicleType: VehicleType;
  subDistrict: Scalars["String"]["output"];
  taxId: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type IndividualDriverDetailInput = {
  address: Scalars["String"]["input"];
  bank: Scalars["String"]["input"];
  bankBranch: Scalars["String"]["input"];
  bankName: Scalars["String"]["input"];
  bankNumber: Scalars["String"]["input"];
  district: Scalars["String"]["input"];
  driverType: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  lastname: Scalars["String"]["input"];
  lineId: Scalars["String"]["input"];
  otherTitle?: InputMaybe<Scalars["String"]["input"]>;
  password: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
  policyVersion: Scalars["Int"]["input"];
  postcode: Scalars["String"]["input"];
  province: Scalars["String"]["input"];
  serviceVehicleType: Scalars["String"]["input"];
  subDistrict: Scalars["String"]["input"];
  taxId: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type IndividualDriverDetailVerifyPayload = {
  __typename?: "IndividualDriverDetailVerifyPayload";
  address: Scalars["String"]["output"];
  bank: Scalars["String"]["output"];
  bankBranch: Scalars["String"]["output"];
  bankName: Scalars["String"]["output"];
  bankNumber: Scalars["String"]["output"];
  district: Scalars["String"]["output"];
  driverType: Scalars["String"]["output"];
  firstname: Scalars["String"]["output"];
  lastname: Scalars["String"]["output"];
  lineId: Scalars["String"]["output"];
  otherTitle?: Maybe<Scalars["String"]["output"]>;
  password: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
  policyVersion: Scalars["Int"]["output"];
  postcode: Scalars["String"]["output"];
  province: Scalars["String"]["output"];
  serviceVehicleType: Scalars["String"]["output"];
  subDistrict: Scalars["String"]["output"];
  taxId: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type IndividualDriverRegisterInput = {
  detail: IndividualDriverDetailInput;
  documents: DriverDocumentInput;
  otp: RegisterOtpInput;
};

export type InvoiceDetail = {
  __typename?: "InvoiceDetail";
  address: Scalars["String"]["output"];
  contactNumber: Scalars["String"]["output"];
  district: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  postcode: Scalars["String"]["output"];
  province: Scalars["String"]["output"];
  subDistrict: Scalars["String"]["output"];
};

export type Location = {
  __typename?: "Location";
  latitude: Scalars["Float"]["output"];
  longitude: Scalars["Float"]["output"];
};

export type LocationAutocomplete = {
  __typename?: "LocationAutocomplete";
  _id: Scalars["ID"]["output"];
  description: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  placeId: Scalars["String"]["output"];
};

export type LocationInput = {
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
};

export type LocationRequestLimitPayload = {
  __typename?: "LocationRequestLimitPayload";
  count: Scalars["Int"]["output"];
  limit: Scalars["Int"]["output"];
};

export type Marker = {
  __typename?: "Marker";
  displayName: Scalars["String"]["output"];
  formattedAddress: Scalars["String"]["output"];
  latitude: Scalars["Float"]["output"];
  longitude: Scalars["Float"]["output"];
  placeId: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  acceptShipment: Scalars["Boolean"]["output"];
  acceptedPolicy: Scalars["Boolean"]["output"];
  addAdditionalService: AdditionalService;
  addAdmin: User;
  addBusinessCustomer: User;
  addIndividualCustomer: User;
  addPODAddress: Scalars["String"]["output"];
  addPrivilege: Scalars["Boolean"]["output"];
  addVehicleType: VehicleType;
  approvalCashPayment: Scalars["Boolean"]["output"];
  approvalUser: User;
  approveCreditPayment: Scalars["Boolean"]["output"];
  changePassword: Scalars["Boolean"]["output"];
  confirmInvoiceSent: Scalars["Boolean"]["output"];
  confirmReceiptSent: Scalars["Boolean"]["output"];
  confirmReceiveWHT: Scalars["Boolean"]["output"];
  confirmShipmentDatetime: Scalars["Boolean"]["output"];
  createShipment: Shipment;
  driverCalcellation: Scalars["Boolean"]["output"];
  file_upload: FileUploadPayload;
  forgotPassword: VerifyPayload;
  individualDriverRegister: RegisterPayload;
  initialAdditionalService: Scalars["Boolean"]["output"];
  initialRequestLimitCountData: Scalars["Boolean"]["output"];
  initialVehicleCost: Scalars["String"]["output"];
  login: AuthPayload;
  logout: Scalars["Boolean"]["output"];
  makeCancellation: Scalars["Boolean"]["output"];
  markAsFinish: Scalars["Boolean"]["output"];
  markAsVerifiedEmail: Scalars["Boolean"]["output"];
  markAsVerifiedOTP: Scalars["Boolean"]["output"];
  markNotificationAsRead: Scalars["Boolean"]["output"];
  nextShipmentStep: Scalars["Boolean"]["output"];
  norefund: Scalars["Boolean"]["output"];
  otpRequest: OtpRequst;
  refund: Scalars["Boolean"]["output"];
  register: Scalars["Boolean"]["output"];
  removePODAddress: Scalars["Boolean"]["output"];
  resentEmail: VerifyPayload;
  resentInvoiceToEmail: Scalars["Boolean"]["output"];
  resentOTP: VerifyOtpPayload;
  resentReceiptToEmail: Scalars["Boolean"]["output"];
  sentPODDocument: Scalars["Boolean"]["output"];
  storeFCM: Scalars["Boolean"]["output"];
  subtotalCalculation: SubtotalCalculatedPayload;
  triggerAdminMenuNotificationCount: Scalars["Boolean"]["output"];
  updateAboutus: Scalars["Boolean"]["output"];
  updateAdditionalService: AdditionalService;
  updateAdditionalServiceCost: Scalars["Boolean"]["output"];
  updateBusinessCustomer: Scalars["Boolean"]["output"];
  updateBusinessType: Scalars["Boolean"]["output"];
  updateContactus: Scalars["Boolean"]["output"];
  updateCustomerPolicies: Scalars["Boolean"]["output"];
  updateDistanceCost: Scalars["Boolean"]["output"];
  updateDriverPolicies: Scalars["Boolean"]["output"];
  updateFAQ: Scalars["Boolean"]["output"];
  updateIndividualCustomer: Scalars["Boolean"]["output"];
  updateInstruction: Scalars["Boolean"]["output"];
  updatePrivilege: Scalars["Boolean"]["output"];
  updateVehicleType: VehicleType;
  upgradeAccount: Scalars["Boolean"]["output"];
  verifyIndiividualDriverData: IndividualDriverDetailVerifyPayload;
  verifyLimiterBeforeGetDirection: LocationRequestLimitPayload;
  verifyOTP: Scalars["Boolean"]["output"];
  verifyResetPassword: Scalars["Boolean"]["output"];
};

export type MutationAcceptShipmentArgs = {
  shipmentId: Scalars["String"]["input"];
};

export type MutationAcceptedPolicyArgs = {
  data: AcceptedPolicyInput;
};

export type MutationAddAdditionalServiceArgs = {
  data: AdditionalServiceInput;
};

export type MutationAddAdminArgs = {
  data: AddAdminInput;
};

export type MutationAddBusinessCustomerArgs = {
  data: CutomerBusinessInput;
};

export type MutationAddIndividualCustomerArgs = {
  data: CutomerIndividualInput;
};

export type MutationAddPodAddressArgs = {
  data: PodAddressInput;
};

export type MutationAddPrivilegeArgs = {
  data: PrivilegeInput;
};

export type MutationAddVehicleTypeArgs = {
  data: VehicleTypeInput;
};

export type MutationApprovalCashPaymentArgs = {
  billingCycleId: Scalars["String"]["input"];
  otherReason?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<Scalars["String"]["input"]>;
  result: Scalars["String"]["input"];
};

export type MutationApprovalUserArgs = {
  id: Scalars["String"]["input"];
  result: Scalars["String"]["input"];
};

export type MutationApproveCreditPaymentArgs = {
  billingCycleId: Scalars["String"]["input"];
  imageEvidence?: InputMaybe<FileInput>;
  paymentDate: Scalars["DateTimeISO"]["input"];
  paymentTime: Scalars["DateTimeISO"]["input"];
};

export type MutationChangePasswordArgs = {
  data: PasswordChangeInput;
};

export type MutationConfirmInvoiceSentArgs = {
  billingCycleId: Scalars["String"]["input"];
  postalProvider: Scalars["String"]["input"];
  trackingNumber: Scalars["String"]["input"];
};

export type MutationConfirmReceiptSentArgs = {
  billingCycleId: Scalars["String"]["input"];
  postalProvider: Scalars["String"]["input"];
  trackingNumber: Scalars["String"]["input"];
};

export type MutationConfirmReceiveWhtArgs = {
  billingCycleId: Scalars["String"]["input"];
};

export type MutationConfirmShipmentDatetimeArgs = {
  data: ConfirmShipmentDateInput;
};

export type MutationCreateShipmentArgs = {
  data: ShipmentInput;
};

export type MutationDriverCalcellationArgs = {
  reason: Scalars["String"]["input"];
  reasonDetail: Scalars["String"]["input"];
  shipmentId: Scalars["String"]["input"];
};

export type MutationFile_UploadArgs = {
  file: Scalars["Upload"]["input"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"]["input"];
};

export type MutationIndividualDriverRegisterArgs = {
  data: IndividualDriverRegisterInput;
};

export type MutationInitialAdditionalServiceArgs = {
  vehicleCostId: Scalars["String"]["input"];
};

export type MutationInitialVehicleCostArgs = {
  vehicleTypeId: Scalars["String"]["input"];
  withAdditionalService?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationLoginArgs = {
  username: Scalars["String"]["input"];
};

export type MutationMakeCancellationArgs = {
  reason: Scalars["String"]["input"];
  reasonDetail: Scalars["String"]["input"];
  shipmentId: Scalars["String"]["input"];
};

export type MutationMarkAsFinishArgs = {
  shipmentId: Scalars["String"]["input"];
};

export type MutationMarkAsVerifiedEmailArgs = {
  userId: Scalars["String"]["input"];
};

export type MutationMarkAsVerifiedOtpArgs = {
  userId: Scalars["String"]["input"];
};

export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars["String"]["input"];
};

export type MutationNextShipmentStepArgs = {
  data: NextShipmentStepInput;
};

export type MutationNorefundArgs = {
  billingCycleId: Scalars["String"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationOtpRequestArgs = {
  action: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
};

export type MutationRefundArgs = {
  billingCycleId: Scalars["String"]["input"];
  imageEvidence: FileInput;
  paymentDate: Scalars["DateTimeISO"]["input"];
  paymentTime: Scalars["DateTimeISO"]["input"];
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type MutationRemovePodAddressArgs = {
  id: Scalars["String"]["input"];
};

export type MutationResentEmailArgs = {
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationResentInvoiceToEmailArgs = {
  billingCycleId: Scalars["String"]["input"];
};

export type MutationResentOtpArgs = {
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationResentReceiptToEmailArgs = {
  billingCycleId: Scalars["String"]["input"];
};

export type MutationSentPodDocumentArgs = {
  data: SentPodDocumentShipmentStepInput;
};

export type MutationStoreFcmArgs = {
  fcmToken: Scalars["String"]["input"];
};

export type MutationSubtotalCalculationArgs = {
  discountId?: InputMaybe<Scalars["String"]["input"]>;
  distanceMeter: Scalars["Float"]["input"];
  distanceReturnMeter: Scalars["Float"]["input"];
  dropPoint: Scalars["Int"]["input"];
  isBusinessCashPayment: Scalars["Boolean"]["input"];
  isRounded: Scalars["Boolean"]["input"];
  serviceIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  vehicleTypeId: Scalars["String"]["input"];
};

export type MutationUpdateAboutusArgs = {
  data: Scalars["String"]["input"];
};

export type MutationUpdateAdditionalServiceArgs = {
  data: AdditionalServiceInput;
  id: Scalars["String"]["input"];
};

export type MutationUpdateAdditionalServiceCostArgs = {
  data: Array<AdditionalServiceCostInput>;
  id: Scalars["String"]["input"];
};

export type MutationUpdateBusinessCustomerArgs = {
  data: CutomerBusinessInput;
  id: Scalars["String"]["input"];
};

export type MutationUpdateBusinessTypeArgs = {
  data: Array<SettingBusinessTypeInput>;
};

export type MutationUpdateContactusArgs = {
  data: SettingContactUsInput;
};

export type MutationUpdateCustomerPoliciesArgs = {
  data: Scalars["String"]["input"];
};

export type MutationUpdateDistanceCostArgs = {
  data: Array<DistanceCostPricingInput>;
  id: Scalars["String"]["input"];
};

export type MutationUpdateDriverPoliciesArgs = {
  data: Scalars["String"]["input"];
};

export type MutationUpdateFaqArgs = {
  data: Array<SettingFaqInput>;
};

export type MutationUpdateIndividualCustomerArgs = {
  data: CutomerIndividualInput;
  id: Scalars["String"]["input"];
};

export type MutationUpdateInstructionArgs = {
  data: Array<SettingInstructionInput>;
};

export type MutationUpdatePrivilegeArgs = {
  data: PrivilegeInput;
  id: Scalars["String"]["input"];
};

export type MutationUpdateVehicleTypeArgs = {
  data: VehicleTypeInput;
  id: Scalars["String"]["input"];
};

export type MutationUpgradeAccountArgs = {
  data: CutomerBusinessInput;
  id: Scalars["String"]["input"];
};

export type MutationVerifyIndiividualDriverDataArgs = {
  data: IndividualDriverDetailInput;
};

export type MutationVerifyOtpArgs = {
  id: Scalars["String"]["input"];
  otp: Scalars["String"]["input"];
  ref: Scalars["String"]["input"];
};

export type MutationVerifyResetPasswordArgs = {
  code: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type NextShipmentStepInput = {
  images?: InputMaybe<Array<FileInput>>;
  shipmentId: Scalars["String"]["input"];
};

export type Notification = {
  __typename?: "Notification";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  errorLink?: Maybe<Scalars["String"]["output"]>;
  errorText?: Maybe<Scalars["String"]["output"]>;
  infoLink?: Maybe<Scalars["String"]["output"]>;
  infoText?: Maybe<Scalars["String"]["output"]>;
  masterLink?: Maybe<Scalars["String"]["output"]>;
  masterText?: Maybe<Scalars["String"]["output"]>;
  message: Array<Scalars["String"]["output"]>;
  read: Scalars["Boolean"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  userId: Scalars["ID"]["output"];
  varient: Scalars["String"]["output"];
};

export type OtpPaginationPayload = {
  __typename?: "OTPPaginationPayload";
  docs: Array<OtpRequst>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  nextPage?: Maybe<Scalars["Int"]["output"]>;
  offset?: Maybe<Scalars["Int"]["output"]>;
  page?: Maybe<Scalars["Int"]["output"]>;
  pagingCounter: Scalars["Int"]["output"];
  prevPage?: Maybe<Scalars["Int"]["output"]>;
  totalDocs: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type OtpRequst = {
  __typename?: "OTPRequst";
  _id: Scalars["ID"]["output"];
  action: Scalars["String"]["output"];
  countdown: Scalars["DateTimeISO"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  expireDateTime: Scalars["DateTimeISO"]["output"];
  otp: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
  ref: Scalars["String"]["output"];
  sentDateTime: Scalars["DateTimeISO"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type PodAddress = {
  __typename?: "PODAddress";
  _id: Scalars["ID"]["output"];
  address: Scalars["String"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  district: Scalars["String"]["output"];
  fullname: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
  postcode: Scalars["String"]["output"];
  province: Scalars["String"]["output"];
  remark?: Maybe<Scalars["String"]["output"]>;
  subDistrict: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  user: User;
};

export type PodAddressInput = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  address: Scalars["String"]["input"];
  district: Scalars["String"]["input"];
  fullname: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
  postcode: Scalars["String"]["input"];
  province: Scalars["String"]["input"];
  remark?: InputMaybe<Scalars["String"]["input"]>;
  subDistrict: Scalars["String"]["input"];
};

export type PasswordChangeInput = {
  confirmPassword: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Payment = {
  __typename?: "Payment";
  _id: Scalars["ID"]["output"];
  calculation?: Maybe<PricingCalculationMethodPayload>;
  cashDetail?: Maybe<CashDetail>;
  createdAt: Scalars["DateTimeISO"]["output"];
  creditDetail?: Maybe<InvoiceDetail>;
  history?: Maybe<Array<UpdateHistory>>;
  invoice?: Maybe<SubtotalCalculatedPayload>;
  paymentMethod: Scalars["String"]["output"];
  paymentNumber: Scalars["String"]["output"];
  rejectionOtherReason?: Maybe<Scalars["String"]["output"]>;
  rejectionReason?: Maybe<Scalars["String"]["output"]>;
  status: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type PaymentDetailInput = {
  address: Scalars["String"]["input"];
  contactNumber: Scalars["String"]["input"];
  district: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  postcode: Scalars["String"]["input"];
  province: Scalars["String"]["input"];
  subDistrict: Scalars["String"]["input"];
};

export type PostalDetail = {
  __typename?: "PostalDetail";
  createdDateTime: Scalars["DateTimeISO"]["output"];
  postalProvider: Scalars["String"]["output"];
  trackingNumber: Scalars["String"]["output"];
  updatedBy: Scalars["String"]["output"];
};

export type PriceItem = {
  __typename?: "PriceItem";
  cost?: Maybe<Scalars["Float"]["output"]>;
  label: Scalars["String"]["output"];
  price: Scalars["Float"]["output"];
};

export type PricingCalculationMethodPayload = {
  __typename?: "PricingCalculationMethodPayload";
  calculations: Array<CalculationResultPayload>;
  roundedCostPercent: Scalars["Float"]["output"];
  roundedPricePercent: Scalars["Float"]["output"];
  subTotalCost: Scalars["Float"]["output"];
  subTotalDropPointCost: Scalars["Float"]["output"];
  subTotalDropPointPrice: Scalars["Float"]["output"];
  subTotalPrice: Scalars["Float"]["output"];
  subTotalRoundedCost: Scalars["Float"]["output"];
  subTotalRoundedPrice: Scalars["Float"]["output"];
  totalCost: Scalars["Float"]["output"];
  totalPrice: Scalars["Float"]["output"];
};

export type Privilege = {
  __typename?: "Privilege";
  _id: Scalars["ID"]["output"];
  code: Scalars["String"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  defaultShow?: Maybe<Scalars["Boolean"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  discount: Scalars["Float"]["output"];
  endDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  isInfinity: Scalars["Boolean"]["output"];
  limitAmout?: Maybe<Scalars["Float"]["output"]>;
  maxDiscountPrice?: Maybe<Scalars["Float"]["output"]>;
  minPrice?: Maybe<Scalars["Float"]["output"]>;
  name: Scalars["String"]["output"];
  startDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  status: Scalars["String"]["output"];
  unit: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  usedAmout?: Maybe<Scalars["Float"]["output"]>;
  usedUser: Array<User>;
};

export type PrivilegeInput = {
  code: Scalars["String"]["input"];
  defaultShow?: InputMaybe<Scalars["Boolean"]["input"]>;
  description: Scalars["String"]["input"];
  discount: Scalars["Float"]["input"];
  endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  isInfinity?: InputMaybe<Scalars["Boolean"]["input"]>;
  limitAmout?: InputMaybe<Scalars["Float"]["input"]>;
  maxDiscountPrice?: InputMaybe<Scalars["Float"]["input"]>;
  minPrice?: InputMaybe<Scalars["Float"]["input"]>;
  name: Scalars["String"]["input"];
  startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status: Scalars["String"]["input"];
  unit: Scalars["String"]["input"];
};

export type PrivilegePaginationPayload = {
  __typename?: "PrivilegePaginationPayload";
  docs: Array<Privilege>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  nextPage?: Maybe<Scalars["Int"]["output"]>;
  offset?: Maybe<Scalars["Int"]["output"]>;
  page?: Maybe<Scalars["Int"]["output"]>;
  pagingCounter: Scalars["Int"]["output"];
  prevPage?: Maybe<Scalars["Int"]["output"]>;
  totalDocs: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type PrivilegeUsedPayload = {
  __typename?: "PrivilegeUsedPayload";
  _id: Scalars["ID"]["output"];
  code: Scalars["String"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  defaultShow?: Maybe<Scalars["Boolean"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  discount: Scalars["Float"]["output"];
  endDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  isInfinity: Scalars["Boolean"]["output"];
  limitAmout?: Maybe<Scalars["Float"]["output"]>;
  maxDiscountPrice?: Maybe<Scalars["Float"]["output"]>;
  minPrice?: Maybe<Scalars["Float"]["output"]>;
  name: Scalars["String"]["output"];
  startDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  status: Scalars["String"]["output"];
  unit: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  used: Scalars["Boolean"]["output"];
  usedAmout?: Maybe<Scalars["Float"]["output"]>;
  usedUser: Array<User>;
};

export type Province = {
  __typename?: "Province";
  geographyId: Scalars["Float"]["output"];
  id: Scalars["Float"]["output"];
  nameEn: Scalars["String"]["output"];
  nameTh: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  allBillingCycleIds: Array<Scalars["String"]["output"]>;
  allshipmentIds: Array<Scalars["String"]["output"]>;
  alluserIds: Array<Scalars["String"]["output"]>;
  billingCycle: BillingCycle;
  billingCycleList: BillingCyclePaginationAggregatePayload;
  billingNumberByShipment: Scalars["String"]["output"];
  calculateRoute: DirectionsResultPayload;
  calculateTransaction: TransactionPayload;
  getAboutusInfo?: Maybe<SettingAboutus>;
  getAdditionalService: AdditionalService;
  getAdditionalServices: AdditionalServicePaginationPayload;
  getAdditionalServicesByVehicleType: Array<AdditionalService>;
  getAddressByPostcode: AddressPayload;
  getAvailableShipment: Array<Shipment>;
  getAvailableShipmentByTrackingNumber: Shipment;
  getBookingConfig: BookingConfigPayload;
  getBusinessTypeInfo: Array<SettingBusinessType>;
  getContactusInfo?: Maybe<SettingContactUs>;
  getCustomerPoliciesInfo: SettingCustomerPolicies;
  getDistrict: Array<District>;
  getDriverPoliciesInfo: SettingDriverPolicies;
  getFAQInfo: Array<SettingFaq>;
  getInstructionInfo: Array<SettingInstruction>;
  getLatestOtp: OtpRequst;
  getOtps: OtpPaginationPayload;
  getPODAddress: Array<PodAddress>;
  getPricingCalculationMethod: PricingCalculationMethodPayload;
  getPricingCalculationMethodAvailableVehicle: Array<VehicleCostCalculationPayload>;
  getPrivilege: Privilege;
  getPrivilegeByCode: Privilege;
  getPrivilegeById: Privilege;
  getPrivileges: PrivilegePaginationPayload;
  getProvince: Array<Province>;
  getShipmentByTracking: Shipment;
  getSubDistrict: Array<SubDistrict>;
  getTransaction: Array<Transaction>;
  getUser: User;
  getUserByUsername: User;
  getVehicleCost: VehicleCost;
  getVehicleCostByVehicleType: VehicleCost;
  getVehicleCosts: Array<VehicleCost>;
  getVehicleType: VehicleType;
  getVehicleTypeAvailable: Array<VehicleType>;
  getVehicleTypeById: VehicleType;
  getVehicleTypeConfigs: Array<VehicleTypeConfigureStatusPayload>;
  getVehicleTypes: Array<VehicleType>;
  isNearbyDuedate: Scalars["Boolean"]["output"];
  locationMarker: Marker;
  locationMarkerByCoords: Marker;
  me: User;
  monthBilling: Array<BillingCycle>;
  notifications: Array<Notification>;
  requireBeforeSignin: RequireDataBeforePayload;
  searchLocations: Array<LocationAutocomplete>;
  searchPrivilegeByCode: Array<PrivilegeUsedPayload>;
  shipment: Shipment;
  shipmentList: ShipmentPaginationPayload;
  shipments: Array<Shipment>;
  statusBillingCount: Array<TotalBillingRecordPayload>;
  statusCount: Array<TotalRecordPayload>;
  totalAvailableShipment: Scalars["Int"]["output"];
  totalMonthBilling: Scalars["Int"]["output"];
  totalNotification: Scalars["Int"]["output"];
  totalShipment: Scalars["Int"]["output"];
  unreadCount: Scalars["Int"]["output"];
  users: UserPaginationAggregatePayload;
};

export type QueryAllBillingCycleIdsArgs = {
  billedDate?: InputMaybe<Array<Scalars["DateTimeISO"]["input"]>>;
  billingNumber?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  issueDate?: InputMaybe<Array<Scalars["DateTimeISO"]["input"]>>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  receiptDate?: InputMaybe<Array<Scalars["DateTimeISO"]["input"]>>;
  receiptNumber?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryAllshipmentIdsArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  dateRangeEnd?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  dateRangeStart?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  driverAgentName?: InputMaybe<Scalars["String"]["input"]>;
  driverName?: InputMaybe<Scalars["String"]["input"]>;
  endWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  paymentNumber?: InputMaybe<Scalars["String"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  startWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  trackingNumber?: InputMaybe<Scalars["String"]["input"]>;
  vehicleTypeId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryAlluserIdsArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  isVerifiedEmail?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVerifiedPhoneNumber?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastestOTP?: InputMaybe<Scalars["String"]["input"]>;
  lastestOTPRef?: InputMaybe<Scalars["String"]["input"]>;
  lineId?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  registration?: InputMaybe<Scalars["String"]["input"]>;
  serviceVehicleType?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  taxId?: InputMaybe<Scalars["String"]["input"]>;
  userNumber?: InputMaybe<Scalars["String"]["input"]>;
  userRole?: InputMaybe<Scalars["String"]["input"]>;
  userType?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
  validationStatus?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryBillingCycleArgs = {
  billingNumber: Scalars["String"]["input"];
};

export type QueryBillingCycleListArgs = {
  billedDate?: InputMaybe<Array<Scalars["DateTimeISO"]["input"]>>;
  billingNumber?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  issueDate?: InputMaybe<Array<Scalars["DateTimeISO"]["input"]>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  receiptDate?: InputMaybe<Array<Scalars["DateTimeISO"]["input"]>>;
  receiptNumber?: InputMaybe<Scalars["String"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryBillingNumberByShipmentArgs = {
  trackingNumber: Scalars["String"]["input"];
};

export type QueryCalculateRouteArgs = {
  destinations: Array<LocationInput>;
  origin: LocationInput;
};

export type QueryGetAdditionalServiceArgs = {
  name: Scalars["String"]["input"];
};

export type QueryGetAdditionalServicesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryGetAdditionalServicesByVehicleTypeArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetAddressByPostcodeArgs = {
  postcode: Scalars["Int"]["input"];
};

export type QueryGetAvailableShipmentArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status: Scalars["String"]["input"];
};

export type QueryGetAvailableShipmentByTrackingNumberArgs = {
  tracking: Scalars["String"]["input"];
};

export type QueryGetBusinessTypeInfoArgs = {
  includeOther?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type QueryGetDistrictArgs = {
  provinceThName?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryGetLatestOtpArgs = {
  phoneNumber: Scalars["String"]["input"];
};

export type QueryGetOtpsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  phoneNumber: Scalars["String"]["input"];
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryGetPricingCalculationMethodArgs = {
  distance?: InputMaybe<Scalars["Float"]["input"]>;
  dropPoint?: InputMaybe<Scalars["Float"]["input"]>;
  isRounded?: InputMaybe<Scalars["Boolean"]["input"]>;
  returnedDistance?: InputMaybe<Scalars["Float"]["input"]>;
  vehicleCostId: Scalars["String"]["input"];
};

export type QueryGetPricingCalculationMethodAvailableVehicleArgs = {
  distance?: InputMaybe<Scalars["Float"]["input"]>;
  dropPoint?: InputMaybe<Scalars["Float"]["input"]>;
  isRounded?: InputMaybe<Scalars["Boolean"]["input"]>;
  returnedDistance?: InputMaybe<Scalars["Float"]["input"]>;
};

export type QueryGetPrivilegeArgs = {
  name: Scalars["String"]["input"];
};

export type QueryGetPrivilegeByCodeArgs = {
  code: Scalars["String"]["input"];
};

export type QueryGetPrivilegeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetPrivilegesArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryGetShipmentByTrackingArgs = {
  trackingNumber: Scalars["String"]["input"];
};

export type QueryGetSubDistrictArgs = {
  districtName?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryGetTransactionArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryGetUserArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  isVerifiedEmail?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVerifiedPhoneNumber?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastestOTP?: InputMaybe<Scalars["String"]["input"]>;
  lastestOTPRef?: InputMaybe<Scalars["String"]["input"]>;
  lineId?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  registration?: InputMaybe<Scalars["String"]["input"]>;
  serviceVehicleType?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  taxId?: InputMaybe<Scalars["String"]["input"]>;
  userNumber?: InputMaybe<Scalars["String"]["input"]>;
  userRole?: InputMaybe<Scalars["String"]["input"]>;
  userType?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
  validationStatus?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryGetUserByUsernameArgs = {
  username: Scalars["String"]["input"];
};

export type QueryGetVehicleCostArgs = {
  vehicleTypeId: Scalars["String"]["input"];
};

export type QueryGetVehicleCostByVehicleTypeArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetVehicleTypeArgs = {
  name: Scalars["String"]["input"];
};

export type QueryGetVehicleTypeByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryLocationMarkerArgs = {
  placeId: Scalars["String"]["input"];
};

export type QueryLocationMarkerByCoordsArgs = {
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
};

export type QueryMonthBillingArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  monthofyear: Scalars["String"]["input"];
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QuerySearchLocationsArgs = {
  latitude: Scalars["Float"]["input"];
  longitude: Scalars["Float"]["input"];
  query: Scalars["String"]["input"];
};

export type QuerySearchPrivilegeByCodeArgs = {
  code: Scalars["String"]["input"];
};

export type QueryShipmentArgs = {
  id: Scalars["String"]["input"];
};

export type QueryShipmentListArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  dateRangeEnd?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  dateRangeStart?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  driverAgentName?: InputMaybe<Scalars["String"]["input"]>;
  driverName?: InputMaybe<Scalars["String"]["input"]>;
  endWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  paymentNumber?: InputMaybe<Scalars["String"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  trackingNumber?: InputMaybe<Scalars["String"]["input"]>;
  vehicleTypeId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryShipmentsArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  dateRangeEnd?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  dateRangeStart?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  driverAgentName?: InputMaybe<Scalars["String"]["input"]>;
  driverName?: InputMaybe<Scalars["String"]["input"]>;
  endWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  paymentNumber?: InputMaybe<Scalars["String"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  trackingNumber?: InputMaybe<Scalars["String"]["input"]>;
  vehicleTypeId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryStatusCountArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  dateRangeEnd?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  dateRangeStart?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  driverAgentName?: InputMaybe<Scalars["String"]["input"]>;
  driverName?: InputMaybe<Scalars["String"]["input"]>;
  endWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  paymentNumber?: InputMaybe<Scalars["String"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  startWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  trackingNumber?: InputMaybe<Scalars["String"]["input"]>;
  vehicleTypeId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryTotalAvailableShipmentArgs = {
  status: Scalars["String"]["input"];
};

export type QueryTotalMonthBillingArgs = {
  monthofyear: Scalars["String"]["input"];
};

export type QueryTotalShipmentArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  customerName?: InputMaybe<Scalars["String"]["input"]>;
  dateRangeEnd?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  dateRangeStart?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  driverAgentName?: InputMaybe<Scalars["String"]["input"]>;
  driverName?: InputMaybe<Scalars["String"]["input"]>;
  endWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  paymentMethod?: InputMaybe<Scalars["String"]["input"]>;
  paymentNumber?: InputMaybe<Scalars["String"]["input"]>;
  paymentStatus?: InputMaybe<Scalars["String"]["input"]>;
  startWorkingDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  trackingNumber?: InputMaybe<Scalars["String"]["input"]>;
  vehicleTypeId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryUsersArgs = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  isVerifiedEmail?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVerifiedPhoneNumber?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastestOTP?: InputMaybe<Scalars["String"]["input"]>;
  lastestOTPRef?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  lineId?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  registration?: InputMaybe<Scalars["String"]["input"]>;
  serviceVehicleType?: InputMaybe<Scalars["String"]["input"]>;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  sortField?: InputMaybe<Array<Scalars["String"]["input"]>>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  taxId?: InputMaybe<Scalars["String"]["input"]>;
  userNumber?: InputMaybe<Scalars["String"]["input"]>;
  userRole?: InputMaybe<Scalars["String"]["input"]>;
  userType?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
  validationStatus?: InputMaybe<Scalars["String"]["input"]>;
};

export type Refund = {
  __typename?: "Refund";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  imageEvidence?: Maybe<File>;
  paymentDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  paymentTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  refundAmout: Scalars["Float"]["output"];
  refundStatus: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  updatedBy: Scalars["String"]["output"];
};

export type RegisterBusinessInput = {
  acceptedEDocumentDate: Scalars["DateTimeISO"]["input"];
  acceptedPoliciesDate: Scalars["DateTimeISO"]["input"];
  acceptedPoliciesVersion: Scalars["Int"]["input"];
  acceptedTermConditionDate: Scalars["DateTimeISO"]["input"];
  acceptedTermConditionVersion: Scalars["Int"]["input"];
  address: Scalars["String"]["input"];
  businessBranch?: InputMaybe<Scalars["String"]["input"]>;
  businessEmail: Scalars["String"]["input"];
  businessName: Scalars["String"]["input"];
  businessTitle: Scalars["String"]["input"];
  businessType: Scalars["String"]["input"];
  businessTypeOther?: InputMaybe<Scalars["String"]["input"]>;
  contactNumber: Scalars["String"]["input"];
  district: Scalars["String"]["input"];
  paymentCashDetail?: InputMaybe<CashPaymentInput>;
  paymentCreditDetail?: InputMaybe<CreditPaymentInput>;
  paymentMethod: Scalars["String"]["input"];
  postcode: Scalars["String"]["input"];
  province: Scalars["String"]["input"];
  subDistrict: Scalars["String"]["input"];
  taxNumber: Scalars["String"]["input"];
};

export type RegisterIndividualInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  district?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  firstname: Scalars["String"]["input"];
  lastname: Scalars["String"]["input"];
  otherTitle?: InputMaybe<Scalars["String"]["input"]>;
  phoneNumber: Scalars["String"]["input"];
  postcode?: InputMaybe<Scalars["String"]["input"]>;
  province?: InputMaybe<Scalars["String"]["input"]>;
  subDistrict?: InputMaybe<Scalars["String"]["input"]>;
  taxId?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type RegisterInput = {
  acceptPolicyTime: Scalars["DateTimeISO"]["input"];
  acceptPolicyVersion: Scalars["Int"]["input"];
  businessDetail?: InputMaybe<RegisterBusinessInput>;
  individualDetail?: InputMaybe<RegisterIndividualInput>;
  password: Scalars["String"]["input"];
  remark?: InputMaybe<Scalars["String"]["input"]>;
  userType: Scalars["String"]["input"];
};

export type RegisterOtpInput = {
  otp: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
  ref: Scalars["String"]["input"];
};

export type RegisterPayload = {
  __typename?: "RegisterPayload";
  driverType: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
};

export type RequireDataBeforePayload = {
  __typename?: "RequireDataBeforePayload";
  requireAcceptedPolicy: Scalars["Boolean"]["output"];
  requirePasswordChange: Scalars["Boolean"]["output"];
};

export type SentPodDocumentShipmentStepInput = {
  images?: InputMaybe<Array<FileInput>>;
  provider: Scalars["String"]["input"];
  shipmentId: Scalars["String"]["input"];
  trackingNumber: Scalars["String"]["input"];
};

export type ServiceDescriptionInput = {
  _id: Scalars["String"]["input"];
  detail: Scalars["String"]["input"];
  vehicleTypes: Array<Scalars["String"]["input"]>;
};

export type SettingAboutus = {
  __typename?: "SettingAboutus";
  createdAt: Scalars["DateTimeISO"]["output"];
  history?: Maybe<Array<UpdateHistory>>;
  instructiontext?: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type SettingBusinessType = {
  __typename?: "SettingBusinessType";
  _id: Scalars["ID"]["output"];
  available: Scalars["Boolean"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  history?: Maybe<Array<UpdateHistory>>;
  name: Scalars["String"]["output"];
  seq: Scalars["Float"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type SettingBusinessTypeInput = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  seq: Scalars["Float"]["input"];
};

export type SettingContactUs = {
  __typename?: "SettingContactUs";
  address?: Maybe<Scalars["String"]["output"]>;
  email1?: Maybe<Scalars["String"]["output"]>;
  email1Detail?: Maybe<Scalars["String"]["output"]>;
  email2?: Maybe<Scalars["String"]["output"]>;
  email2Detail?: Maybe<Scalars["String"]["output"]>;
  facebook?: Maybe<Scalars["String"]["output"]>;
  facebookLink?: Maybe<Scalars["String"]["output"]>;
  history?: Maybe<Array<UpdateHistory>>;
  instructiontext?: Maybe<Scalars["String"]["output"]>;
  lineId?: Maybe<Scalars["String"]["output"]>;
  lineLink?: Maybe<Scalars["String"]["output"]>;
  linkedin?: Maybe<Scalars["String"]["output"]>;
  linkedinLink?: Maybe<Scalars["String"]["output"]>;
  phoneNumber?: Maybe<Scalars["String"]["output"]>;
  taxId?: Maybe<Scalars["String"]["output"]>;
};

export type SettingContactUsInput = {
  address: Scalars["String"]["input"];
  email1: Scalars["String"]["input"];
  email1Detail: Scalars["String"]["input"];
  email2: Scalars["String"]["input"];
  email2Detail: Scalars["String"]["input"];
  facebook: Scalars["String"]["input"];
  facebookLink: Scalars["String"]["input"];
  instructiontext: Scalars["String"]["input"];
  lineId: Scalars["String"]["input"];
  lineLink: Scalars["String"]["input"];
  linkedin: Scalars["String"]["input"];
  linkedinLink: Scalars["String"]["input"];
  phoneNumber: Scalars["String"]["input"];
  taxId: Scalars["String"]["input"];
};

export type SettingCustomerPolicies = {
  __typename?: "SettingCustomerPolicies";
  createdAt: Scalars["DateTimeISO"]["output"];
  customerPolicies?: Maybe<Scalars["String"]["output"]>;
  history?: Maybe<Array<UpdateHistory>>;
  updatedAt: Scalars["DateTimeISO"]["output"];
  version?: Maybe<Scalars["Float"]["output"]>;
};

export type SettingDriverPolicies = {
  __typename?: "SettingDriverPolicies";
  createdAt: Scalars["DateTimeISO"]["output"];
  driverPolicies?: Maybe<Scalars["String"]["output"]>;
  history?: Maybe<Array<UpdateHistory>>;
  updatedAt: Scalars["DateTimeISO"]["output"];
  version?: Maybe<Scalars["Float"]["output"]>;
};

export type SettingFaq = {
  __typename?: "SettingFAQ";
  _id: Scalars["ID"]["output"];
  answer: Scalars["String"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  history?: Maybe<Array<UpdateHistory>>;
  question: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type SettingFaqInput = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  answer: Scalars["String"]["input"];
  question: Scalars["String"]["input"];
};

export type SettingInstruction = {
  __typename?: "SettingInstruction";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  history?: Maybe<Array<UpdateHistory>>;
  instruction?: Maybe<Scalars["String"]["output"]>;
  instructionTitle: Scalars["String"]["output"];
  page: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type SettingInstructionInput = {
  _id?: InputMaybe<Scalars["String"]["input"]>;
  instruction: Scalars["String"]["input"];
  instructionTitle: Scalars["String"]["input"];
  page: Scalars["String"]["input"];
};

export type Shipment = {
  __typename?: "Shipment";
  _id: Scalars["ID"]["output"];
  additionalImages?: Maybe<Array<File>>;
  additionalServices: Array<ShipmentAdditionalServicePrice>;
  adminAcceptanceStatus: Scalars["String"]["output"];
  bookingDateTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  cancellationDetail?: Maybe<Scalars["String"]["output"]>;
  cancellationReason?: Maybe<Scalars["String"]["output"]>;
  cancelledDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  createdAt: Scalars["DateTimeISO"]["output"];
  currentStepSeq: Scalars["Int"]["output"];
  customer: User;
  deliveredDate?: Maybe<Scalars["DateTimeISO"]["output"]>;
  destinations: Array<Destination>;
  directionId: DirectionsResult;
  discountId?: Maybe<Privilege>;
  displayDistance: Scalars["Float"]["output"];
  displayTime: Scalars["Float"]["output"];
  distance: Scalars["Float"]["output"];
  distances: Array<ShipmentDistancePricing>;
  driver?: Maybe<User>;
  driverAcceptanceStatus: Scalars["String"]["output"];
  history?: Maybe<Array<UpdateHistory>>;
  isBookingWithDate: Scalars["Boolean"]["output"];
  isRoundedReturn: Scalars["Boolean"]["output"];
  payment: Payment;
  podDetail?: Maybe<ShipmentPodAddress>;
  refId?: Maybe<Scalars["String"]["output"]>;
  refund?: Maybe<Refund>;
  remark?: Maybe<Scalars["String"]["output"]>;
  requestedDriver?: Maybe<User>;
  requestedDriverAccepted?: Maybe<Scalars["Boolean"]["output"]>;
  returnDistance: Scalars["Float"]["output"];
  status: Scalars["String"]["output"];
  steps: Array<StepDefinition>;
  trackingNumber: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  vehicleId: VehicleType;
};

export type ShipmentAdditionalServicePrice = {
  __typename?: "ShipmentAdditionalServicePrice";
  _id: Scalars["ID"]["output"];
  cost: Scalars["Float"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  price: Scalars["Float"]["output"];
  reference: AdditionalServiceCostPricing;
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type ShipmentDistancePricing = {
  __typename?: "ShipmentDistancePricing";
  _id: Scalars["ID"]["output"];
  benefits: Scalars["Float"]["output"];
  cost: Scalars["Float"]["output"];
  from: Scalars["Float"]["output"];
  price: Scalars["Float"]["output"];
  to: Scalars["Float"]["output"];
  unit: Scalars["String"]["output"];
};

export type ShipmentInput = {
  additionalImage?: InputMaybe<Array<FileInput>>;
  additionalServices?: InputMaybe<Array<Scalars["String"]["input"]>>;
  bookingDateTime?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  cashPaymentDetail?: InputMaybe<TransferPaymentDetailInput>;
  directionRoutes: Scalars["String"]["input"];
  discountId?: InputMaybe<Scalars["String"]["input"]>;
  displayDistance: Scalars["Float"]["input"];
  displayTime: Scalars["Float"]["input"];
  distance: Scalars["Float"]["input"];
  favoriteDriverId?: InputMaybe<Scalars["String"]["input"]>;
  isBookingWithDate: Scalars["Boolean"]["input"];
  isRoundedReturn: Scalars["Boolean"]["input"];
  locations: Array<DestinationInput>;
  paymentDetail?: InputMaybe<PaymentDetailInput>;
  paymentMethod: Scalars["String"]["input"];
  podDetail?: InputMaybe<PodAddressInput>;
  refId?: InputMaybe<Scalars["String"]["input"]>;
  remark?: InputMaybe<Scalars["String"]["input"]>;
  returnDistance: Scalars["Float"]["input"];
  vehicleId: Scalars["String"]["input"];
};

export type ShipmentPodAddress = {
  __typename?: "ShipmentPODAddress";
  _id: Scalars["ID"]["output"];
  address: Scalars["String"]["output"];
  district: Scalars["String"]["output"];
  fullname: Scalars["String"]["output"];
  phoneNumber: Scalars["String"]["output"];
  postcode: Scalars["String"]["output"];
  provider?: Maybe<Scalars["String"]["output"]>;
  province: Scalars["String"]["output"];
  remark?: Maybe<Scalars["String"]["output"]>;
  subDistrict: Scalars["String"]["output"];
  trackingNumber?: Maybe<Scalars["String"]["output"]>;
};

export type ShipmentPaginationPayload = {
  __typename?: "ShipmentPaginationPayload";
  docs: Array<Shipment>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  nextPage?: Maybe<Scalars["Int"]["output"]>;
  offset?: Maybe<Scalars["Int"]["output"]>;
  page?: Maybe<Scalars["Int"]["output"]>;
  pagingCounter: Scalars["Int"]["output"];
  prevPage?: Maybe<Scalars["Int"]["output"]>;
  totalDocs: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type StepDefinition = {
  __typename?: "StepDefinition";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  customerMessage: Scalars["String"]["output"];
  driverMessage: Scalars["String"]["output"];
  images: Array<File>;
  seq: Scalars["Int"]["output"];
  step: Scalars["String"]["output"];
  stepName: Scalars["String"]["output"];
  stepStatus: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["DateTimeISO"]["output"]>;
};

export type SubDistrict = {
  __typename?: "SubDistrict";
  amphureId: Scalars["Float"]["output"];
  id: Scalars["Float"]["output"];
  nameEn: Scalars["String"]["output"];
  nameTh: Scalars["String"]["output"];
  zipCode: Scalars["Float"]["output"];
};

export type Subscription = {
  __typename?: "Subscription";
  getAdminNotificationCount: AdminNotificationCountPayload;
  requestLocationLimitCount: LocationRequestLimitPayload;
};

export type SubtotalCalculatedPayload = {
  __typename?: "SubtotalCalculatedPayload";
  additionalServices: Array<PriceItem>;
  discounts: Array<PriceItem>;
  shippingPrices: Array<PriceItem>;
  subTotalCost: Scalars["Float"]["output"];
  subTotalPrice: Scalars["Float"]["output"];
  taxs: Array<PriceItem>;
  totalCost: Scalars["Float"]["output"];
  totalPrice: Scalars["Float"]["output"];
};

export type TotalBillingRecordPayload = {
  __typename?: "TotalBillingRecordPayload";
  count: Scalars["Int"]["output"];
  key: Scalars["String"]["output"];
  label: Scalars["String"]["output"];
};

export type TotalRecordPayload = {
  __typename?: "TotalRecordPayload";
  count: Scalars["Int"]["output"];
  key: Scalars["String"]["output"];
  label: Scalars["String"]["output"];
};

export type Transaction = {
  __typename?: "Transaction";
  _id: Scalars["ID"]["output"];
  amount: Scalars["Float"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  description: Scalars["String"]["output"];
  ownerId: Scalars["String"]["output"];
  ownerType: Scalars["String"]["output"];
  refId: Scalars["String"]["output"];
  refType: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  transactionType: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
};

export type TransactionPayload = {
  __typename?: "TransactionPayload";
  totalIncome: Scalars["Float"]["output"];
  totalOutcome: Scalars["Float"]["output"];
  totalOverall: Scalars["Float"]["output"];
  totalPending?: Maybe<Scalars["Float"]["output"]>;
};

export type TransferPaymentDetailInput = {
  bank: Scalars["String"]["input"];
  bankName: Scalars["String"]["input"];
  bankNumber: Scalars["String"]["input"];
  imageEvidence: FileInput;
  paymentDate: Scalars["DateTimeISO"]["input"];
  paymentTime: Scalars["DateTimeISO"]["input"];
};

export type UpdateHistory = {
  __typename?: "UpdateHistory";
  _id: Scalars["ID"]["output"];
  afterUpdate: Scalars["JSONObject"]["output"];
  beforeUpdate?: Maybe<Scalars["JSONObject"]["output"]>;
  createdAt: Scalars["DateTimeISO"]["output"];
  referenceId: Scalars["String"]["output"];
  referenceType: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  who: User;
};

export type User = {
  __typename?: "User";
  _id: Scalars["ID"]["output"];
  acceptPolicyTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  acceptPolicyVersion?: Maybe<Scalars["Int"]["output"]>;
  adminDetail?: Maybe<Admin>;
  businessDetail?: Maybe<BusinessCustomer>;
  createdAt: Scalars["DateTimeISO"]["output"];
  drivingStatus?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  fcmToken?: Maybe<Scalars["String"]["output"]>;
  fullname?: Maybe<Scalars["String"]["output"]>;
  individualDetail?: Maybe<IndividualCustomer>;
  individualDriver?: Maybe<IndividualDriver>;
  isVerifiedEmail: Scalars["Boolean"]["output"];
  isVerifiedPhoneNumber: Scalars["Boolean"]["output"];
  lastestOTP?: Maybe<Scalars["String"]["output"]>;
  lastestOTPRef?: Maybe<Scalars["String"]["output"]>;
  lastestOTPTime?: Maybe<Scalars["DateTimeISO"]["output"]>;
  notifications?: Maybe<Array<Notification>>;
  profileImage?: Maybe<File>;
  registration: Scalars["String"]["output"];
  remark?: Maybe<Scalars["String"]["output"]>;
  status: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  upgradeRequest?: Maybe<BusinessCustomer>;
  userNumber: Scalars["String"]["output"];
  userRole: Scalars["String"]["output"];
  userType: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
  validationStatus: Scalars["String"]["output"];
};

export type UserPaginationAggregatePayload = {
  __typename?: "UserPaginationAggregatePayload";
  docs: Array<User>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  limit: Scalars["Int"]["output"];
  nextPage?: Maybe<Scalars["Int"]["output"]>;
  offset?: Maybe<Scalars["Int"]["output"]>;
  page?: Maybe<Scalars["Int"]["output"]>;
  pagingCounter: Scalars["Int"]["output"];
  prevPage?: Maybe<Scalars["Int"]["output"]>;
  totalDocs: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type VehicleCost = {
  __typename?: "VehicleCost";
  _id: Scalars["ID"]["output"];
  additionalServices: Array<AdditionalServiceCostPricing>;
  createdAt: Scalars["DateTimeISO"]["output"];
  distance: Array<DistanceCostPricing>;
  updatedAt: Scalars["DateTimeISO"]["output"];
  vehicleType: VehicleType;
};

export type VehicleCostCalculationPayload = {
  __typename?: "VehicleCostCalculationPayload";
  _id: Scalars["ID"]["output"];
  additionalServices: Array<AdditionalServiceCostPricing>;
  calculations?: Maybe<Array<CalculationResultPayload>>;
  createdAt: Scalars["DateTimeISO"]["output"];
  distance: Array<DistanceCostPricing>;
  subTotalCost?: Maybe<Scalars["Float"]["output"]>;
  subTotalDropPointCost?: Maybe<Scalars["Float"]["output"]>;
  subTotalDropPointPrice?: Maybe<Scalars["Float"]["output"]>;
  subTotalPrice?: Maybe<Scalars["Float"]["output"]>;
  subTotalRoundedCost?: Maybe<Scalars["Float"]["output"]>;
  subTotalRoundedPrice?: Maybe<Scalars["Float"]["output"]>;
  totalCost?: Maybe<Scalars["Float"]["output"]>;
  totalPrice?: Maybe<Scalars["Float"]["output"]>;
  updatedAt: Scalars["DateTimeISO"]["output"];
  vehicleType: VehicleType;
};

export type VehicleType = {
  __typename?: "VehicleType";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  details?: Maybe<Scalars["String"]["output"]>;
  height: Scalars["Float"]["output"];
  image: File;
  isLarger?: Maybe<Scalars["Boolean"]["output"]>;
  isPublic?: Maybe<Scalars["Boolean"]["output"]>;
  length: Scalars["Float"]["output"];
  maxCapacity: Scalars["Float"]["output"];
  maxDroppoint?: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  width: Scalars["Float"]["output"];
};

export type VehicleTypeConfigureStatusPayload = {
  __typename?: "VehicleTypeConfigureStatusPayload";
  _id: Scalars["ID"]["output"];
  createdAt: Scalars["DateTimeISO"]["output"];
  details?: Maybe<Scalars["String"]["output"]>;
  height: Scalars["Float"]["output"];
  image: File;
  isAdditionalServicesConfigured: Scalars["Boolean"]["output"];
  isConfigured: Scalars["Boolean"]["output"];
  isDistancesConfigured: Scalars["Boolean"]["output"];
  isLarger?: Maybe<Scalars["Boolean"]["output"]>;
  isPublic?: Maybe<Scalars["Boolean"]["output"]>;
  length: Scalars["Float"]["output"];
  maxCapacity: Scalars["Float"]["output"];
  maxDroppoint?: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  updatedAt: Scalars["DateTimeISO"]["output"];
  width: Scalars["Float"]["output"];
};

export type VehicleTypeInput = {
  details?: InputMaybe<Scalars["String"]["input"]>;
  height: Scalars["Float"]["input"];
  image?: InputMaybe<FileInput>;
  isLarger?: InputMaybe<Scalars["Boolean"]["input"]>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  length: Scalars["Float"]["input"];
  maxCapacity: Scalars["Float"]["input"];
  maxDroppoint: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
  width: Scalars["Float"]["input"];
};

export type VerifyOtpPayload = {
  __typename?: "VerifyOTPPayload";
  countdown: Scalars["DateTimeISO"]["output"];
  duration: Scalars["String"]["output"];
  ref: Scalars["String"]["output"];
};

export type VerifyPayload = {
  __typename?: "VerifyPayload";
  countdown: Scalars["DateTimeISO"]["output"];
  duration: Scalars["String"]["output"];
};

export type PaymentMethodPayload = {
  __typename?: "paymentMethodPayload";
  available: Scalars["Boolean"]["output"];
  detail: Scalars["String"]["output"];
  method: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  subTitle: Scalars["String"]["output"];
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "AuthPayload";
    token: string;
    requireAcceptedPolicy: boolean;
    requirePasswordChange: boolean;
    user: {
      __typename?: "User";
      _id: string;
      userNumber: string;
      userType: string;
      username: string;
      remark?: string | null;
      status: string;
      validationStatus: string;
      registration: string;
      lastestOTP?: string | null;
      lastestOTPRef?: string | null;
      isVerifiedEmail: boolean;
      isVerifiedPhoneNumber: boolean;
      acceptPolicyVersion?: number | null;
      acceptPolicyTime?: any | null;
      createdAt: any;
      updatedAt: any;
      userRole: string;
      fullname?: string | null;
      lastestOTPTime?: any | null;
      profileImage?: {
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      } | null;
      individualDriver?: {
        __typename?: "IndividualDriver";
        _id: string;
        title: string;
        otherTitle: string;
        firstname: string;
        lastname: string;
        taxId: string;
        phoneNumber: string;
        lineId: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postcode: string;
        bank: string;
        bankBranch: string;
        bankName: string;
        bankNumber: string;
        fullname?: string | null;
        balance: number;
        serviceVehicleType: {
          __typename?: "VehicleType";
          _id: string;
          type: string;
          isPublic?: boolean | null;
          isLarger?: boolean | null;
          name: string;
          width: number;
          length: number;
          height: number;
          maxCapacity: number;
          details?: string | null;
          createdAt: any;
          updatedAt: any;
          image: {
            __typename?: "File";
            _id: string;
            fileId: string;
            filename: string;
            mimetype: string;
            createdAt: any;
            updatedAt: any;
          };
        };
      } | null;
    };
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type ChangePasswordMutationVariables = Exact<{
  data: PasswordChangeInput;
}>;

export type ChangePasswordMutation = {
  __typename?: "Mutation";
  changePassword: boolean;
};

export type StoreFcmMutationVariables = Exact<{
  fcmToken: Scalars["String"]["input"];
}>;

export type StoreFcmMutation = { __typename?: "Mutation"; storeFCM: boolean };

export type IndividualDriverRegisterMutationVariables = Exact<{
  data: IndividualDriverRegisterInput;
}>;

export type IndividualDriverRegisterMutation = {
  __typename?: "Mutation";
  individualDriverRegister: {
    __typename?: "RegisterPayload";
    phoneNumber: string;
    driverType: string;
  };
};

export type VerifyIndiividualDriverDataMutationVariables = Exact<{
  data: IndividualDriverDetailInput;
}>;

export type VerifyIndiividualDriverDataMutation = {
  __typename?: "Mutation";
  verifyIndiividualDriverData: {
    __typename?: "IndividualDriverDetailVerifyPayload";
    policyVersion: number;
    driverType: string;
    title: string;
    otherTitle?: string | null;
    firstname: string;
    lastname: string;
    taxId: string;
    phoneNumber: string;
    lineId: string;
    password: string;
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
  };
};

export type AcceptShipmentMutationVariables = Exact<{
  shipmentId: Scalars["String"]["input"];
}>;

export type AcceptShipmentMutation = {
  __typename?: "Mutation";
  acceptShipment: boolean;
};

export type ConfirmShipmentDatetimeMutationVariables = Exact<{
  data: ConfirmShipmentDateInput;
}>;

export type ConfirmShipmentDatetimeMutation = {
  __typename?: "Mutation";
  confirmShipmentDatetime: boolean;
};

export type NextShipmentStepMutationVariables = Exact<{
  data: NextShipmentStepInput;
}>;

export type NextShipmentStepMutation = {
  __typename?: "Mutation";
  nextShipmentStep: boolean;
};

export type SentPodDocumentMutationVariables = Exact<{
  data: SentPodDocumentShipmentStepInput;
}>;

export type SentPodDocumentMutation = {
  __typename?: "Mutation";
  sentPODDocument: boolean;
};

export type MarkAsFinishMutationVariables = Exact<{
  shipmentId: Scalars["String"]["input"];
}>;

export type MarkAsFinishMutation = {
  __typename?: "Mutation";
  markAsFinish: boolean;
};

export type OtpRequestMutationVariables = Exact<{
  phoneNumber: Scalars["String"]["input"];
  action: Scalars["String"]["input"];
}>;

export type OtpRequestMutation = {
  __typename?: "Mutation";
  otpRequest: {
    __typename?: "OTPRequst";
    _id: string;
    phoneNumber: string;
    otp: string;
    ref: string;
    action: string;
    sentDateTime: any;
    countdown: any;
    expireDateTime: any;
    createdAt: any;
    updatedAt: any;
  };
};

export type FileUploadMutationVariables = Exact<{
  file: Scalars["Upload"]["input"];
}>;

export type FileUploadMutation = {
  __typename?: "Mutation";
  file_upload: {
    __typename?: "FileUploadPayload";
    fileId: string;
    filename: string;
    mimetype: string;
    url: string;
  };
};

export type GetProvinceQueryVariables = Exact<{ [key: string]: never }>;

export type GetProvinceQuery = {
  __typename?: "Query";
  getProvince: Array<{
    __typename?: "Province";
    id: number;
    geographyId: number;
    nameTh: string;
    nameEn: string;
  }>;
};

export type GetDistrictQueryVariables = Exact<{
  provinceThName?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetDistrictQuery = {
  __typename?: "Query";
  getDistrict: Array<{
    __typename?: "District";
    id: number;
    provinceId: number;
    nameTh: string;
    nameEn: string;
  }>;
};

export type GetSubDistrictQueryVariables = Exact<{
  districtName?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetSubDistrictQuery = {
  __typename?: "Query";
  getSubDistrict: Array<{
    __typename?: "SubDistrict";
    id: number;
    amphureId: number;
    zipCode: number;
    nameTh: string;
    nameEn: string;
  }>;
};

export type GetAvailableShipmentQueryVariables = Exact<{
  status: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sortField?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetAvailableShipmentQuery = {
  __typename?: "Query";
  totalAvailableShipment: number;
  getAvailableShipment: Array<{
    __typename?: "Shipment";
    _id: string;
    trackingNumber: string;
    status: string;
    adminAcceptanceStatus: string;
    driverAcceptanceStatus: string;
    displayDistance: number;
    displayTime: number;
    distance: number;
    returnDistance: number;
    isRoundedReturn: boolean;
    isBookingWithDate: boolean;
    bookingDateTime?: any | null;
    refId?: string | null;
    remark?: string | null;
    createdAt: any;
    updatedAt: any;
    deliveredDate?: any | null;
    cancellationReason?: string | null;
    cancellationDetail?: string | null;
    currentStepSeq: number;
    customer: {
      __typename?: "User";
      _id: string;
      userNumber: string;
      userRole: string;
      userType: string;
      username: string;
      remark?: string | null;
      status: string;
      validationStatus: string;
      registration: string;
      lastestOTP?: string | null;
      lastestOTPRef?: string | null;
      lastestOTPTime?: any | null;
      isVerifiedEmail: boolean;
      isVerifiedPhoneNumber: boolean;
      acceptPolicyVersion?: number | null;
      acceptPolicyTime?: any | null;
      createdAt: any;
      updatedAt: any;
      individualDetail?: {
        __typename?: "IndividualCustomer";
        _id: string;
        userNumber: string;
        email: string;
        title: string;
        otherTitle?: string | null;
        firstname: string;
        lastname: string;
        phoneNumber: string;
        taxId?: string | null;
        address?: string | null;
        province?: string | null;
        district?: string | null;
        subDistrict?: string | null;
        postcode?: string | null;
        fullname?: string | null;
      } | null;
      businessDetail?: {
        __typename?: "BusinessCustomer";
        _id: string;
        userNumber: string;
        businessTitle: string;
        businessName: string;
        businessBranch?: string | null;
        businessType: string;
        businessTypeOther?: string | null;
        taxNumber: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postcode: string;
        contactNumber: string;
        businessEmail: string;
        paymentMethod: string;
        acceptedEDocumentDate?: any | null;
        acceptedPoliciesVersion?: number | null;
        acceptedPoliciesDate?: any | null;
        acceptedTermConditionVersion?: number | null;
        acceptedTermConditionDate?: any | null;
        changePaymentMethodRequest?: boolean | null;
      } | null;
    };
    requestedDriver?: {
      __typename?: "User";
      _id: string;
      userNumber: string;
      userRole: string;
      userType: string;
      username: string;
      remark?: string | null;
      status: string;
      validationStatus: string;
      registration: string;
      lastestOTP?: string | null;
      lastestOTPRef?: string | null;
      lastestOTPTime?: any | null;
      isVerifiedEmail: boolean;
      isVerifiedPhoneNumber: boolean;
      acceptPolicyVersion?: number | null;
      acceptPolicyTime?: any | null;
      createdAt: any;
      updatedAt: any;
      individualDriver?: {
        __typename?: "IndividualDriver";
        _id: string;
        title: string;
        otherTitle: string;
        firstname: string;
        lastname: string;
        taxId: string;
        phoneNumber: string;
        lineId: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postcode: string;
        bank: string;
        bankBranch: string;
        bankName: string;
        bankNumber: string;
        fullname?: string | null;
      } | null;
    } | null;
    destinations: Array<{
      __typename?: "Destination";
      placeId: string;
      name: string;
      detail: string;
      contactName: string;
      contactNumber: string;
      customerRemark?: string | null;
      location: {
        __typename?: "Location";
        latitude: number;
        longitude: number;
      };
    }>;
    vehicleId: {
      __typename?: "VehicleType";
      _id: string;
      type: string;
      isPublic?: boolean | null;
      isLarger?: boolean | null;
      name: string;
      width: number;
      length: number;
      height: number;
      maxCapacity: number;
      details?: string | null;
      createdAt: any;
      updatedAt: any;
      image: {
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      };
    };
    additionalImages?: Array<{
      __typename?: "File";
      _id: string;
      fileId: string;
      filename: string;
      mimetype: string;
      createdAt: any;
      updatedAt: any;
    }> | null;
    steps: Array<{
      __typename?: "StepDefinition";
      _id: string;
      step: string;
      seq: number;
      stepName: string;
      customerMessage: string;
      driverMessage: string;
      stepStatus: string;
      createdAt: any;
      updatedAt?: any | null;
      images: Array<{
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      }>;
    }>;
    refund?: {
      __typename?: "Refund";
      _id: string;
      paymentDate?: any | null;
      paymentTime?: any | null;
    } | null;
    payment: {
      __typename?: "Payment";
      _id: string;
      status: string;
      paymentMethod: string;
      createdAt: any;
      updatedAt: any;
      calculation?: {
        __typename?: "PricingCalculationMethodPayload";
        subTotalDropPointCost: number;
        subTotalDropPointPrice: number;
        subTotalCost: number;
        subTotalPrice: number;
        subTotalRoundedCost: number;
        subTotalRoundedPrice: number;
        totalCost: number;
        totalPrice: number;
      } | null;
      invoice?: {
        __typename?: "SubtotalCalculatedPayload";
        totalCost: number;
      } | null;
    };
  }>;
};

export type GetAvailableShipmentByTrackingNumberQueryVariables = Exact<{
  tracking: Scalars["String"]["input"];
}>;

export type GetAvailableShipmentByTrackingNumberQuery = {
  __typename?: "Query";
  getAvailableShipmentByTrackingNumber: {
    __typename?: "Shipment";
    _id: string;
    trackingNumber: string;
    status: string;
    adminAcceptanceStatus: string;
    driverAcceptanceStatus: string;
    displayDistance: number;
    displayTime: number;
    distance: number;
    returnDistance: number;
    isRoundedReturn: boolean;
    isBookingWithDate: boolean;
    bookingDateTime?: any | null;
    refId?: string | null;
    remark?: string | null;
    createdAt: any;
    updatedAt: any;
    deliveredDate?: any | null;
    cancellationReason?: string | null;
    cancellationDetail?: string | null;
    currentStepSeq: number;
    customer: {
      __typename?: "User";
      _id: string;
      email?: string | null;
      fullname?: string | null;
      userNumber: string;
      userRole: string;
      userType: string;
      username: string;
      remark?: string | null;
      status: string;
      validationStatus: string;
      registration: string;
      lastestOTP?: string | null;
      lastestOTPRef?: string | null;
      lastestOTPTime?: any | null;
      isVerifiedEmail: boolean;
      isVerifiedPhoneNumber: boolean;
      acceptPolicyVersion?: number | null;
      acceptPolicyTime?: any | null;
      createdAt: any;
      updatedAt: any;
      profileImage?: {
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      } | null;
      individualDetail?: {
        __typename?: "IndividualCustomer";
        _id: string;
        userNumber: string;
        email: string;
        title: string;
        otherTitle?: string | null;
        firstname: string;
        lastname: string;
        phoneNumber: string;
        taxId?: string | null;
        address?: string | null;
        province?: string | null;
        district?: string | null;
        subDistrict?: string | null;
        postcode?: string | null;
        fullname?: string | null;
      } | null;
      businessDetail?: {
        __typename?: "BusinessCustomer";
        _id: string;
        userNumber: string;
        businessTitle: string;
        businessName: string;
        businessBranch?: string | null;
        businessType: string;
        businessTypeOther?: string | null;
        taxNumber: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postcode: string;
        contactNumber: string;
        businessEmail: string;
        paymentMethod: string;
        acceptedEDocumentDate?: any | null;
        acceptedPoliciesVersion?: number | null;
        acceptedPoliciesDate?: any | null;
        acceptedTermConditionVersion?: number | null;
        acceptedTermConditionDate?: any | null;
        changePaymentMethodRequest?: boolean | null;
        creditPayment?: {
          __typename?: "BusinessCustomerCreditPayment";
          _id: string;
          isSameAddress?: boolean | null;
          financialFirstname: string;
          financialLastname: string;
          financialContactNumber: string;
          financialContactEmails: Array<string>;
          financialAddress: string;
          financialPostcode: string;
          financialProvince: string;
          financialDistrict: string;
          financialSubDistrict: string;
          billedDateType: string;
          billedRoundType: string;
          acceptedFirstCreditTermDate?: any | null;
          creditLimit: number;
          creditUsage: number;
          billedDate: {
            __typename?: "BilledMonth";
            jan: number;
            feb: number;
            mar: number;
            apr: number;
            may: number;
            jun: number;
            jul: number;
            aug: number;
            sep: number;
            oct: number;
            nov: number;
            dec: number;
          };
          billedRound: {
            __typename?: "BilledMonth";
            jan: number;
            feb: number;
            mar: number;
            apr: number;
            may: number;
            jun: number;
            jul: number;
            aug: number;
            sep: number;
            oct: number;
            nov: number;
            dec: number;
          };
          businessRegistrationCertificateFile: {
            __typename?: "File";
            _id: string;
            fileId: string;
            filename: string;
            mimetype: string;
            createdAt: any;
            updatedAt: any;
          };
          copyIDAuthorizedSignatoryFile: {
            __typename?: "File";
            _id: string;
            fileId: string;
            filename: string;
            mimetype: string;
            createdAt: any;
            updatedAt: any;
          };
          certificateValueAddedTaxRegistrationFile?: {
            __typename?: "File";
            _id: string;
            fileId: string;
            filename: string;
            mimetype: string;
            createdAt: any;
            updatedAt: any;
          } | null;
        } | null;
        cashPayment?: {
          __typename?: "BusinessCustomerCashPayment";
          _id: string;
          acceptedEReceiptDate: any;
        } | null;
      } | null;
    };
    requestedDriver?: {
      __typename?: "User";
      _id: string;
      email?: string | null;
      fullname?: string | null;
      userNumber: string;
      userRole: string;
      userType: string;
      username: string;
      remark?: string | null;
      status: string;
      validationStatus: string;
      registration: string;
      lastestOTP?: string | null;
      lastestOTPRef?: string | null;
      lastestOTPTime?: any | null;
      isVerifiedEmail: boolean;
      isVerifiedPhoneNumber: boolean;
      acceptPolicyVersion?: number | null;
      acceptPolicyTime?: any | null;
      createdAt: any;
      updatedAt: any;
    } | null;
    destinations: Array<{
      __typename?: "Destination";
      placeId: string;
      name: string;
      detail: string;
      contactName: string;
      contactNumber: string;
      customerRemark?: string | null;
      location: {
        __typename?: "Location";
        latitude: number;
        longitude: number;
      };
    }>;
    vehicleId: {
      __typename?: "VehicleType";
      _id: string;
      type: string;
      isPublic?: boolean | null;
      isLarger?: boolean | null;
      name: string;
      width: number;
      length: number;
      height: number;
      maxCapacity: number;
      maxDroppoint?: number | null;
      details?: string | null;
      createdAt: any;
      updatedAt: any;
      image: {
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      };
    };
    additionalServices: Array<{
      __typename?: "ShipmentAdditionalServicePrice";
      _id: string;
      cost: number;
      price: number;
      createdAt: any;
      updatedAt: any;
      reference: {
        __typename?: "AdditionalServiceCostPricing";
        _id: string;
        available: boolean;
        type: string;
        cost: number;
        price: number;
        createdAt: any;
        updatedAt: any;
        additionalService: {
          __typename?: "AdditionalService";
          _id: string;
          type: string;
          name: string;
          permanent: boolean;
          status: string;
          createdAt: any;
          updatedAt: any;
          descriptions: Array<{
            __typename?: "AdditionalServiceDescription";
            _id: string;
            detail: string;
            vehicleTypes: Array<{
              __typename?: "VehicleType";
              _id: string;
              type: string;
              isPublic?: boolean | null;
              isLarger?: boolean | null;
              name: string;
              width: number;
              length: number;
              height: number;
              maxCapacity: number;
              maxDroppoint?: number | null;
              details?: string | null;
              createdAt: any;
              updatedAt: any;
              image: {
                __typename?: "File";
                _id: string;
                fileId: string;
                filename: string;
                mimetype: string;
                createdAt: any;
                updatedAt: any;
              };
            }>;
          }>;
        };
      };
    }>;
    distances: Array<{
      __typename?: "ShipmentDistancePricing";
      _id: string;
      from: number;
      to: number;
      unit: string;
      cost: number;
      price: number;
      benefits: number;
    }>;
    podDetail?: {
      __typename?: "ShipmentPODAddress";
      fullname: string;
      address: string;
      province: string;
      district: string;
      subDistrict: string;
      postcode: string;
      phoneNumber: string;
      remark?: string | null;
    } | null;
    discountId?: {
      __typename?: "Privilege";
      _id: string;
      status: string;
      name: string;
      code: string;
      startDate?: any | null;
      endDate?: any | null;
      discount: number;
      unit: string;
      minPrice?: number | null;
      maxDiscountPrice?: number | null;
      isInfinity: boolean;
      usedAmout?: number | null;
      limitAmout?: number | null;
      description?: string | null;
      createdAt: any;
      updatedAt: any;
    } | null;
    additionalImages?: Array<{
      __typename?: "File";
      _id: string;
      fileId: string;
      filename: string;
      mimetype: string;
      createdAt: any;
      updatedAt: any;
    }> | null;
    directionId: {
      __typename?: "DirectionsResult";
      _id: string;
      rawData: string;
    };
    steps: Array<{
      __typename?: "StepDefinition";
      _id: string;
      step: string;
      seq: number;
      stepName: string;
      customerMessage: string;
      driverMessage: string;
      stepStatus: string;
      createdAt: any;
      updatedAt?: any | null;
      images: Array<{
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      }>;
    }>;
    payment: {
      __typename?: "Payment";
      _id: string;
      status: string;
      paymentNumber: string;
      paymentMethod: string;
      rejectionOtherReason?: string | null;
      rejectionReason?: string | null;
      createdAt: any;
      updatedAt: any;
      calculation?: {
        __typename?: "PricingCalculationMethodPayload";
        subTotalDropPointCost: number;
        subTotalDropPointPrice: number;
        subTotalCost: number;
        subTotalPrice: number;
        subTotalRoundedCost: number;
        subTotalRoundedPrice: number;
        totalCost: number;
        totalPrice: number;
        calculations: Array<{
          __typename?: "CalculationResultPayload";
          _id: string;
          from: number;
          to: number;
          unit: string;
          cost: number;
          price: number;
          benefits: number;
          createdAt: any;
          updatedAt: any;
          costResult: number;
          priceResult: number;
        }>;
      } | null;
      cashDetail?: {
        __typename?: "CashDetail";
        bank: string;
        bankName: string;
        bankNumber: string;
        paymentDate: any;
        paymentTime: any;
        imageEvidence: {
          __typename?: "File";
          _id: string;
          fileId: string;
          filename: string;
          mimetype: string;
          createdAt: any;
          updatedAt: any;
        };
      } | null;
      creditDetail?: {
        __typename?: "InvoiceDetail";
        name: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postcode: string;
        contactNumber: string;
      } | null;
      invoice?: {
        __typename?: "SubtotalCalculatedPayload";
        subTotalCost: number;
        subTotalPrice: number;
        totalCost: number;
        totalPrice: number;
        shippingPrices: Array<{
          __typename?: "PriceItem";
          label: string;
          price: number;
          cost?: number | null;
        }>;
        discounts: Array<{
          __typename?: "PriceItem";
          label: string;
          price: number;
          cost?: number | null;
        }>;
        additionalServices: Array<{
          __typename?: "PriceItem";
          label: string;
          price: number;
          cost?: number | null;
        }>;
        taxs: Array<{
          __typename?: "PriceItem";
          label: string;
          price: number;
          cost?: number | null;
        }>;
      } | null;
    };
    driver?: {
      __typename?: "User";
      _id: string;
      email?: string | null;
      fullname?: string | null;
      userNumber: string;
      userRole: string;
      userType: string;
      username: string;
      remark?: string | null;
      status: string;
      validationStatus: string;
      registration: string;
      lastestOTP?: string | null;
      lastestOTPRef?: string | null;
      lastestOTPTime?: any | null;
      isVerifiedEmail: boolean;
      isVerifiedPhoneNumber: boolean;
      acceptPolicyVersion?: number | null;
      acceptPolicyTime?: any | null;
      createdAt: any;
      updatedAt: any;
      individualDriver?: {
        __typename?: "IndividualDriver";
        _id: string;
        title: string;
        otherTitle: string;
        firstname: string;
        lastname: string;
        taxId: string;
        phoneNumber: string;
        lineId: string;
        address: string;
        province: string;
        district: string;
        subDistrict: string;
        postcode: string;
        bank: string;
        bankBranch: string;
        bankName: string;
        bankNumber: string;
        fullname?: string | null;
      } | null;
      profileImage?: {
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      } | null;
    } | null;
    refund?: {
      __typename?: "Refund";
      _id: string;
      paymentDate?: any | null;
      paymentTime?: any | null;
      createdAt: any;
      updatedAt: any;
      imageEvidence?: {
        __typename?: "File";
        _id: string;
        fileId: string;
        filename: string;
        mimetype: string;
        createdAt: any;
        updatedAt: any;
      } | null;
    } | null;
  };
};

export type GetDriverPoliciesInfoQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetDriverPoliciesInfoQuery = {
  __typename?: "Query";
  getDriverPoliciesInfo: {
    __typename?: "SettingDriverPolicies";
    driverPolicies?: string | null;
    version?: number | null;
    createdAt: any;
    updatedAt: any;
  };
};

export type GetTransactionQueryVariables = Exact<{
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sortField?: InputMaybe<
    Array<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortAscending?: InputMaybe<Scalars["Boolean"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetTransactionQuery = {
  __typename?: "Query";
  getTransaction: Array<{
    __typename?: "Transaction";
    _id: string;
    ownerId: string;
    ownerType: string;
    refId: string;
    refType: string;
    amount: number;
    transactionType: string;
    description: string;
    status: string;
    createdAt: any;
    updatedAt: any;
  }>;
  calculateTransaction: {
    __typename?: "TransactionPayload";
    totalPending?: number | null;
    totalIncome: number;
    totalOutcome: number;
    totalOverall: number;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  unreadCount: number;
  me: {
    __typename?: "User";
    _id: string;
    userNumber: string;
    userRole: string;
    userType: string;
    username: string;
    remark?: string | null;
    status: string;
    validationStatus: string;
    registration: string;
    lastestOTP?: string | null;
    lastestOTPRef?: string | null;
    isVerifiedEmail: boolean;
    isVerifiedPhoneNumber: boolean;
    acceptPolicyVersion?: number | null;
    acceptPolicyTime?: any | null;
    createdAt: any;
    updatedAt: any;
    fullname?: string | null;
    fcmToken?: string | null;
    profileImage?: {
      __typename?: "File";
      _id: string;
      fileId: string;
      filename: string;
      mimetype: string;
      createdAt: any;
      updatedAt: any;
    } | null;
    individualDriver?: {
      __typename?: "IndividualDriver";
      _id: string;
      title: string;
      otherTitle: string;
      firstname: string;
      lastname: string;
      taxId: string;
      phoneNumber: string;
      lineId: string;
      address: string;
      province: string;
      district: string;
      subDistrict: string;
      postcode: string;
      bank: string;
      bankBranch: string;
      bankName: string;
      bankNumber: string;
      fullname?: string | null;
      balance: number;
      serviceVehicleType: {
        __typename?: "VehicleType";
        _id: string;
        type: string;
        isPublic?: boolean | null;
        isLarger?: boolean | null;
        name: string;
        width: number;
        length: number;
        height: number;
        maxCapacity: number;
        details?: string | null;
        createdAt: any;
        updatedAt: any;
        image: {
          __typename?: "File";
          _id: string;
          fileId: string;
          filename: string;
          mimetype: string;
          createdAt: any;
          updatedAt: any;
        };
      };
    } | null;
  };
  requireBeforeSignin: {
    __typename?: "RequireDataBeforePayload";
    requireAcceptedPolicy: boolean;
    requirePasswordChange: boolean;
  };
};

export type GetVehicleTypeAvailableQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetVehicleTypeAvailableQuery = {
  __typename?: "Query";
  getVehicleTypeAvailable: Array<{
    __typename?: "VehicleType";
    _id: string;
    type: string;
    isPublic?: boolean | null;
    isLarger?: boolean | null;
    name: string;
    width: number;
    length: number;
    height: number;
    maxCapacity: number;
    details?: string | null;
    maxDroppoint?: number | null;
    createdAt: any;
    updatedAt: any;
    image: {
      __typename?: "File";
      _id: string;
      fileId: string;
      filename: string;
      mimetype: string;
      createdAt: any;
      updatedAt: any;
    };
  }>;
};

export type GetVehicleTypeByIdQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type GetVehicleTypeByIdQuery = {
  __typename?: "Query";
  getVehicleTypeById: {
    __typename?: "VehicleType";
    _id: string;
    type: string;
    isPublic?: boolean | null;
    isLarger?: boolean | null;
    name: string;
    width: number;
    length: number;
    height: number;
    maxCapacity: number;
    details?: string | null;
    maxDroppoint?: number | null;
    createdAt: any;
    updatedAt: any;
    image: {
      __typename?: "File";
      _id: string;
      fileId: string;
      filename: string;
      mimetype: string;
      createdAt: any;
      updatedAt: any;
    };
  };
};

export const LoginDocument = gql`
  mutation Login($username: String!) {
    login(username: $username) {
      token
      requireAcceptedPolicy
      requirePasswordChange
      user {
        _id
        userNumber
        userType
        username
        remark
        status
        validationStatus
        registration
        lastestOTP
        lastestOTPRef
        isVerifiedEmail
        isVerifiedPhoneNumber
        acceptPolicyVersion
        acceptPolicyTime
        createdAt
        updatedAt
        userRole
        fullname
        lastestOTPTime
        profileImage {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
        individualDriver {
          _id
          title
          otherTitle
          firstname
          lastname
          taxId
          phoneNumber
          lineId
          address
          province
          district
          subDistrict
          postcode
          bank
          bankBranch
          bankName
          bankNumber
          fullname
          balance
          serviceVehicleType {
            _id
            type
            isPublic
            isLarger
            name
            width
            length
            height
            maxCapacity
            details
            createdAt
            updatedAt
            image {
              _id
              fileId
              filename
              mimetype
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options,
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options,
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($data: PasswordChangeInput!) {
    changePassword(data: $data)
  }
`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, options);
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>;
export type ChangePasswordMutationResult =
  Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;
export const StoreFcmDocument = gql`
  mutation StoreFCM($fcmToken: String!) {
    storeFCM(fcmToken: $fcmToken)
  }
`;
export type StoreFcmMutationFn = Apollo.MutationFunction<
  StoreFcmMutation,
  StoreFcmMutationVariables
>;

/**
 * __useStoreFcmMutation__
 *
 * To run a mutation, you first call `useStoreFcmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStoreFcmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [storeFcmMutation, { data, loading, error }] = useStoreFcmMutation({
 *   variables: {
 *      fcmToken: // value for 'fcmToken'
 *   },
 * });
 */
export function useStoreFcmMutation(
  baseOptions?: Apollo.MutationHookOptions<
    StoreFcmMutation,
    StoreFcmMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<StoreFcmMutation, StoreFcmMutationVariables>(
    StoreFcmDocument,
    options,
  );
}
export type StoreFcmMutationHookResult = ReturnType<typeof useStoreFcmMutation>;
export type StoreFcmMutationResult = Apollo.MutationResult<StoreFcmMutation>;
export type StoreFcmMutationOptions = Apollo.BaseMutationOptions<
  StoreFcmMutation,
  StoreFcmMutationVariables
>;
export const IndividualDriverRegisterDocument = gql`
  mutation IndividualDriverRegister($data: IndividualDriverRegisterInput!) {
    individualDriverRegister(data: $data) {
      phoneNumber
      driverType
    }
  }
`;
export type IndividualDriverRegisterMutationFn = Apollo.MutationFunction<
  IndividualDriverRegisterMutation,
  IndividualDriverRegisterMutationVariables
>;

/**
 * __useIndividualDriverRegisterMutation__
 *
 * To run a mutation, you first call `useIndividualDriverRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIndividualDriverRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [individualDriverRegisterMutation, { data, loading, error }] = useIndividualDriverRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useIndividualDriverRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    IndividualDriverRegisterMutation,
    IndividualDriverRegisterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    IndividualDriverRegisterMutation,
    IndividualDriverRegisterMutationVariables
  >(IndividualDriverRegisterDocument, options);
}
export type IndividualDriverRegisterMutationHookResult = ReturnType<
  typeof useIndividualDriverRegisterMutation
>;
export type IndividualDriverRegisterMutationResult =
  Apollo.MutationResult<IndividualDriverRegisterMutation>;
export type IndividualDriverRegisterMutationOptions =
  Apollo.BaseMutationOptions<
    IndividualDriverRegisterMutation,
    IndividualDriverRegisterMutationVariables
  >;
export const VerifyIndiividualDriverDataDocument = gql`
  mutation VerifyIndiividualDriverData($data: IndividualDriverDetailInput!) {
    verifyIndiividualDriverData(data: $data) {
      policyVersion
      driverType
      title
      otherTitle
      firstname
      lastname
      taxId
      phoneNumber
      lineId
      password
      address
      province
      district
      subDistrict
      postcode
      bank
      bankBranch
      bankName
      bankNumber
      serviceVehicleType
    }
  }
`;
export type VerifyIndiividualDriverDataMutationFn = Apollo.MutationFunction<
  VerifyIndiividualDriverDataMutation,
  VerifyIndiividualDriverDataMutationVariables
>;

/**
 * __useVerifyIndiividualDriverDataMutation__
 *
 * To run a mutation, you first call `useVerifyIndiividualDriverDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyIndiividualDriverDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyIndiividualDriverDataMutation, { data, loading, error }] = useVerifyIndiividualDriverDataMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useVerifyIndiividualDriverDataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VerifyIndiividualDriverDataMutation,
    VerifyIndiividualDriverDataMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    VerifyIndiividualDriverDataMutation,
    VerifyIndiividualDriverDataMutationVariables
  >(VerifyIndiividualDriverDataDocument, options);
}
export type VerifyIndiividualDriverDataMutationHookResult = ReturnType<
  typeof useVerifyIndiividualDriverDataMutation
>;
export type VerifyIndiividualDriverDataMutationResult =
  Apollo.MutationResult<VerifyIndiividualDriverDataMutation>;
export type VerifyIndiividualDriverDataMutationOptions =
  Apollo.BaseMutationOptions<
    VerifyIndiividualDriverDataMutation,
    VerifyIndiividualDriverDataMutationVariables
  >;
export const AcceptShipmentDocument = gql`
  mutation AcceptShipment($shipmentId: String!) {
    acceptShipment(shipmentId: $shipmentId)
  }
`;
export type AcceptShipmentMutationFn = Apollo.MutationFunction<
  AcceptShipmentMutation,
  AcceptShipmentMutationVariables
>;

/**
 * __useAcceptShipmentMutation__
 *
 * To run a mutation, you first call `useAcceptShipmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptShipmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptShipmentMutation, { data, loading, error }] = useAcceptShipmentMutation({
 *   variables: {
 *      shipmentId: // value for 'shipmentId'
 *   },
 * });
 */
export function useAcceptShipmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AcceptShipmentMutation,
    AcceptShipmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AcceptShipmentMutation,
    AcceptShipmentMutationVariables
  >(AcceptShipmentDocument, options);
}
export type AcceptShipmentMutationHookResult = ReturnType<
  typeof useAcceptShipmentMutation
>;
export type AcceptShipmentMutationResult =
  Apollo.MutationResult<AcceptShipmentMutation>;
export type AcceptShipmentMutationOptions = Apollo.BaseMutationOptions<
  AcceptShipmentMutation,
  AcceptShipmentMutationVariables
>;
export const ConfirmShipmentDatetimeDocument = gql`
  mutation ConfirmShipmentDatetime($data: ConfirmShipmentDateInput!) {
    confirmShipmentDatetime(data: $data)
  }
`;
export type ConfirmShipmentDatetimeMutationFn = Apollo.MutationFunction<
  ConfirmShipmentDatetimeMutation,
  ConfirmShipmentDatetimeMutationVariables
>;

/**
 * __useConfirmShipmentDatetimeMutation__
 *
 * To run a mutation, you first call `useConfirmShipmentDatetimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmShipmentDatetimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmShipmentDatetimeMutation, { data, loading, error }] = useConfirmShipmentDatetimeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useConfirmShipmentDatetimeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmShipmentDatetimeMutation,
    ConfirmShipmentDatetimeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ConfirmShipmentDatetimeMutation,
    ConfirmShipmentDatetimeMutationVariables
  >(ConfirmShipmentDatetimeDocument, options);
}
export type ConfirmShipmentDatetimeMutationHookResult = ReturnType<
  typeof useConfirmShipmentDatetimeMutation
>;
export type ConfirmShipmentDatetimeMutationResult =
  Apollo.MutationResult<ConfirmShipmentDatetimeMutation>;
export type ConfirmShipmentDatetimeMutationOptions = Apollo.BaseMutationOptions<
  ConfirmShipmentDatetimeMutation,
  ConfirmShipmentDatetimeMutationVariables
>;
export const NextShipmentStepDocument = gql`
  mutation NextShipmentStep($data: NextShipmentStepInput!) {
    nextShipmentStep(data: $data)
  }
`;
export type NextShipmentStepMutationFn = Apollo.MutationFunction<
  NextShipmentStepMutation,
  NextShipmentStepMutationVariables
>;

/**
 * __useNextShipmentStepMutation__
 *
 * To run a mutation, you first call `useNextShipmentStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNextShipmentStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [nextShipmentStepMutation, { data, loading, error }] = useNextShipmentStepMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useNextShipmentStepMutation(
  baseOptions?: Apollo.MutationHookOptions<
    NextShipmentStepMutation,
    NextShipmentStepMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    NextShipmentStepMutation,
    NextShipmentStepMutationVariables
  >(NextShipmentStepDocument, options);
}
export type NextShipmentStepMutationHookResult = ReturnType<
  typeof useNextShipmentStepMutation
>;
export type NextShipmentStepMutationResult =
  Apollo.MutationResult<NextShipmentStepMutation>;
export type NextShipmentStepMutationOptions = Apollo.BaseMutationOptions<
  NextShipmentStepMutation,
  NextShipmentStepMutationVariables
>;
export const SentPodDocumentDocument = gql`
  mutation SentPODDocument($data: SentPODDocumentShipmentStepInput!) {
    sentPODDocument(data: $data)
  }
`;
export type SentPodDocumentMutationFn = Apollo.MutationFunction<
  SentPodDocumentMutation,
  SentPodDocumentMutationVariables
>;

/**
 * __useSentPodDocumentMutation__
 *
 * To run a mutation, you first call `useSentPodDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSentPodDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sentPodDocumentMutation, { data, loading, error }] = useSentPodDocumentMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSentPodDocumentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SentPodDocumentMutation,
    SentPodDocumentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SentPodDocumentMutation,
    SentPodDocumentMutationVariables
  >(SentPodDocumentDocument, options);
}
export type SentPodDocumentMutationHookResult = ReturnType<
  typeof useSentPodDocumentMutation
>;
export type SentPodDocumentMutationResult =
  Apollo.MutationResult<SentPodDocumentMutation>;
export type SentPodDocumentMutationOptions = Apollo.BaseMutationOptions<
  SentPodDocumentMutation,
  SentPodDocumentMutationVariables
>;
export const MarkAsFinishDocument = gql`
  mutation MarkAsFinish($shipmentId: String!) {
    markAsFinish(shipmentId: $shipmentId)
  }
`;
export type MarkAsFinishMutationFn = Apollo.MutationFunction<
  MarkAsFinishMutation,
  MarkAsFinishMutationVariables
>;

/**
 * __useMarkAsFinishMutation__
 *
 * To run a mutation, you first call `useMarkAsFinishMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAsFinishMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAsFinishMutation, { data, loading, error }] = useMarkAsFinishMutation({
 *   variables: {
 *      shipmentId: // value for 'shipmentId'
 *   },
 * });
 */
export function useMarkAsFinishMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MarkAsFinishMutation,
    MarkAsFinishMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MarkAsFinishMutation,
    MarkAsFinishMutationVariables
  >(MarkAsFinishDocument, options);
}
export type MarkAsFinishMutationHookResult = ReturnType<
  typeof useMarkAsFinishMutation
>;
export type MarkAsFinishMutationResult =
  Apollo.MutationResult<MarkAsFinishMutation>;
export type MarkAsFinishMutationOptions = Apollo.BaseMutationOptions<
  MarkAsFinishMutation,
  MarkAsFinishMutationVariables
>;
export const OtpRequestDocument = gql`
  mutation OtpRequest($phoneNumber: String!, $action: String!) {
    otpRequest(action: $action, phoneNumber: $phoneNumber) {
      _id
      phoneNumber
      otp
      ref
      action
      sentDateTime
      countdown
      expireDateTime
      createdAt
      updatedAt
    }
  }
`;
export type OtpRequestMutationFn = Apollo.MutationFunction<
  OtpRequestMutation,
  OtpRequestMutationVariables
>;

/**
 * __useOtpRequestMutation__
 *
 * To run a mutation, you first call `useOtpRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOtpRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [otpRequestMutation, { data, loading, error }] = useOtpRequestMutation({
 *   variables: {
 *      phoneNumber: // value for 'phoneNumber'
 *      action: // value for 'action'
 *   },
 * });
 */
export function useOtpRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    OtpRequestMutation,
    OtpRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<OtpRequestMutation, OtpRequestMutationVariables>(
    OtpRequestDocument,
    options,
  );
}
export type OtpRequestMutationHookResult = ReturnType<
  typeof useOtpRequestMutation
>;
export type OtpRequestMutationResult =
  Apollo.MutationResult<OtpRequestMutation>;
export type OtpRequestMutationOptions = Apollo.BaseMutationOptions<
  OtpRequestMutation,
  OtpRequestMutationVariables
>;
export const FileUploadDocument = gql`
  mutation FileUpload($file: Upload!) {
    file_upload(file: $file) {
      fileId
      filename
      mimetype
      url
    }
  }
`;
export type FileUploadMutationFn = Apollo.MutationFunction<
  FileUploadMutation,
  FileUploadMutationVariables
>;

/**
 * __useFileUploadMutation__
 *
 * To run a mutation, you first call `useFileUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFileUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [fileUploadMutation, { data, loading, error }] = useFileUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useFileUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FileUploadMutation,
    FileUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FileUploadMutation, FileUploadMutationVariables>(
    FileUploadDocument,
    options,
  );
}
export type FileUploadMutationHookResult = ReturnType<
  typeof useFileUploadMutation
>;
export type FileUploadMutationResult =
  Apollo.MutationResult<FileUploadMutation>;
export type FileUploadMutationOptions = Apollo.BaseMutationOptions<
  FileUploadMutation,
  FileUploadMutationVariables
>;
export const GetProvinceDocument = gql`
  query GetProvince {
    getProvince {
      id
      geographyId
      nameTh
      nameEn
    }
  }
`;

/**
 * __useGetProvinceQuery__
 *
 * To run a query within a React component, call `useGetProvinceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProvinceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProvinceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProvinceQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProvinceQuery,
    GetProvinceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProvinceQuery, GetProvinceQueryVariables>(
    GetProvinceDocument,
    options,
  );
}
export function useGetProvinceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProvinceQuery,
    GetProvinceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProvinceQuery, GetProvinceQueryVariables>(
    GetProvinceDocument,
    options,
  );
}
export function useGetProvinceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetProvinceQuery,
        GetProvinceQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProvinceQuery, GetProvinceQueryVariables>(
    GetProvinceDocument,
    options,
  );
}
export type GetProvinceQueryHookResult = ReturnType<typeof useGetProvinceQuery>;
export type GetProvinceLazyQueryHookResult = ReturnType<
  typeof useGetProvinceLazyQuery
>;
export type GetProvinceSuspenseQueryHookResult = ReturnType<
  typeof useGetProvinceSuspenseQuery
>;
export type GetProvinceQueryResult = Apollo.QueryResult<
  GetProvinceQuery,
  GetProvinceQueryVariables
>;
export const GetDistrictDocument = gql`
  query GetDistrict($provinceThName: String) {
    getDistrict(provinceThName: $provinceThName) {
      id
      provinceId
      nameTh
      nameEn
    }
  }
`;

/**
 * __useGetDistrictQuery__
 *
 * To run a query within a React component, call `useGetDistrictQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDistrictQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDistrictQuery({
 *   variables: {
 *      provinceThName: // value for 'provinceThName'
 *   },
 * });
 */
export function useGetDistrictQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDistrictQuery,
    GetDistrictQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDistrictQuery, GetDistrictQueryVariables>(
    GetDistrictDocument,
    options,
  );
}
export function useGetDistrictLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDistrictQuery,
    GetDistrictQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDistrictQuery, GetDistrictQueryVariables>(
    GetDistrictDocument,
    options,
  );
}
export function useGetDistrictSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetDistrictQuery,
        GetDistrictQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetDistrictQuery, GetDistrictQueryVariables>(
    GetDistrictDocument,
    options,
  );
}
export type GetDistrictQueryHookResult = ReturnType<typeof useGetDistrictQuery>;
export type GetDistrictLazyQueryHookResult = ReturnType<
  typeof useGetDistrictLazyQuery
>;
export type GetDistrictSuspenseQueryHookResult = ReturnType<
  typeof useGetDistrictSuspenseQuery
>;
export type GetDistrictQueryResult = Apollo.QueryResult<
  GetDistrictQuery,
  GetDistrictQueryVariables
>;
export const GetSubDistrictDocument = gql`
  query GetSubDistrict($districtName: String) {
    getSubDistrict(districtName: $districtName) {
      id
      amphureId
      zipCode
      nameTh
      nameEn
    }
  }
`;

/**
 * __useGetSubDistrictQuery__
 *
 * To run a query within a React component, call `useGetSubDistrictQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubDistrictQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubDistrictQuery({
 *   variables: {
 *      districtName: // value for 'districtName'
 *   },
 * });
 */
export function useGetSubDistrictQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetSubDistrictQuery,
    GetSubDistrictQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSubDistrictQuery, GetSubDistrictQueryVariables>(
    GetSubDistrictDocument,
    options,
  );
}
export function useGetSubDistrictLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSubDistrictQuery,
    GetSubDistrictQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSubDistrictQuery, GetSubDistrictQueryVariables>(
    GetSubDistrictDocument,
    options,
  );
}
export function useGetSubDistrictSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetSubDistrictQuery,
        GetSubDistrictQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetSubDistrictQuery,
    GetSubDistrictQueryVariables
  >(GetSubDistrictDocument, options);
}
export type GetSubDistrictQueryHookResult = ReturnType<
  typeof useGetSubDistrictQuery
>;
export type GetSubDistrictLazyQueryHookResult = ReturnType<
  typeof useGetSubDistrictLazyQuery
>;
export type GetSubDistrictSuspenseQueryHookResult = ReturnType<
  typeof useGetSubDistrictSuspenseQuery
>;
export type GetSubDistrictQueryResult = Apollo.QueryResult<
  GetSubDistrictQuery,
  GetSubDistrictQueryVariables
>;
export const GetAvailableShipmentDocument = gql`
  query GetAvailableShipment(
    $status: String!
    $limit: Int
    $sortField: [String!]
    $sortAscending: Boolean
    $skip: Int
  ) {
    getAvailableShipment(
      status: $status
      limit: $limit
      sortField: $sortField
      sortAscending: $sortAscending
      skip: $skip
    ) {
      _id
      trackingNumber
      status
      adminAcceptanceStatus
      driverAcceptanceStatus
      displayDistance
      displayTime
      distance
      returnDistance
      isRoundedReturn
      isBookingWithDate
      bookingDateTime
      refId
      remark
      createdAt
      updatedAt
      deliveredDate
      cancellationReason
      cancellationDetail
      customer {
        _id
        userNumber
        userRole
        userType
        username
        remark
        status
        validationStatus
        registration
        lastestOTP
        lastestOTPRef
        lastestOTPTime
        isVerifiedEmail
        isVerifiedPhoneNumber
        acceptPolicyVersion
        acceptPolicyTime
        createdAt
        updatedAt
        individualDetail {
          _id
          userNumber
          email
          title
          otherTitle
          firstname
          lastname
          phoneNumber
          taxId
          address
          province
          district
          subDistrict
          postcode
          fullname
        }
        businessDetail {
          _id
          userNumber
          businessTitle
          businessName
          businessBranch
          businessType
          businessTypeOther
          taxNumber
          address
          province
          district
          subDistrict
          postcode
          contactNumber
          businessEmail
          paymentMethod
          acceptedEDocumentDate
          acceptedPoliciesVersion
          acceptedPoliciesDate
          acceptedTermConditionVersion
          acceptedTermConditionDate
          changePaymentMethodRequest
        }
      }
      requestedDriver {
        _id
        userNumber
        userRole
        userType
        username
        remark
        status
        validationStatus
        registration
        lastestOTP
        lastestOTPRef
        lastestOTPTime
        isVerifiedEmail
        isVerifiedPhoneNumber
        acceptPolicyVersion
        acceptPolicyTime
        createdAt
        updatedAt
        individualDriver {
          _id
          title
          otherTitle
          firstname
          lastname
          taxId
          phoneNumber
          lineId
          address
          province
          district
          subDistrict
          postcode
          bank
          bankBranch
          bankName
          bankNumber
          fullname
        }
      }
      destinations {
        placeId
        name
        detail
        contactName
        contactNumber
        customerRemark
        location {
          latitude
          longitude
        }
      }
      vehicleId {
        _id
        type
        isPublic
        isLarger
        name
        width
        length
        height
        maxCapacity
        details
        createdAt
        updatedAt
        image {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
      }
      additionalImages {
        _id
        fileId
        filename
        mimetype
        createdAt
        updatedAt
      }
      currentStepSeq
      steps {
        _id
        step
        seq
        stepName
        customerMessage
        driverMessage
        stepStatus
        createdAt
        updatedAt
        images {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
      }
      refund {
        _id
        paymentDate
        paymentTime
      }
      payment {
        _id
        status
        paymentMethod
        createdAt
        updatedAt
        calculation {
          subTotalDropPointCost
          subTotalDropPointPrice
          subTotalCost
          subTotalPrice
          subTotalRoundedCost
          subTotalRoundedPrice
          totalCost
          totalPrice
        }
        invoice {
          totalCost
        }
      }
    }
    totalAvailableShipment(status: $status)
  }
`;

/**
 * __useGetAvailableShipmentQuery__
 *
 * To run a query within a React component, call `useGetAvailableShipmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableShipmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableShipmentQuery({
 *   variables: {
 *      status: // value for 'status'
 *      limit: // value for 'limit'
 *      sortField: // value for 'sortField'
 *      sortAscending: // value for 'sortAscending'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetAvailableShipmentQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAvailableShipmentQuery,
    GetAvailableShipmentQueryVariables
  > &
    (
      | { variables: GetAvailableShipmentQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAvailableShipmentQuery,
    GetAvailableShipmentQueryVariables
  >(GetAvailableShipmentDocument, options);
}
export function useGetAvailableShipmentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAvailableShipmentQuery,
    GetAvailableShipmentQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAvailableShipmentQuery,
    GetAvailableShipmentQueryVariables
  >(GetAvailableShipmentDocument, options);
}
export function useGetAvailableShipmentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAvailableShipmentQuery,
        GetAvailableShipmentQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetAvailableShipmentQuery,
    GetAvailableShipmentQueryVariables
  >(GetAvailableShipmentDocument, options);
}
export type GetAvailableShipmentQueryHookResult = ReturnType<
  typeof useGetAvailableShipmentQuery
>;
export type GetAvailableShipmentLazyQueryHookResult = ReturnType<
  typeof useGetAvailableShipmentLazyQuery
>;
export type GetAvailableShipmentSuspenseQueryHookResult = ReturnType<
  typeof useGetAvailableShipmentSuspenseQuery
>;
export type GetAvailableShipmentQueryResult = Apollo.QueryResult<
  GetAvailableShipmentQuery,
  GetAvailableShipmentQueryVariables
>;
export const GetAvailableShipmentByTrackingNumberDocument = gql`
  query GetAvailableShipmentByTrackingNumber($tracking: String!) {
    getAvailableShipmentByTrackingNumber(tracking: $tracking) {
      _id
      trackingNumber
      status
      adminAcceptanceStatus
      driverAcceptanceStatus
      displayDistance
      displayTime
      distance
      returnDistance
      isRoundedReturn
      isBookingWithDate
      bookingDateTime
      refId
      remark
      createdAt
      updatedAt
      deliveredDate
      cancellationReason
      cancellationDetail
      customer {
        _id
        email
        fullname
        userNumber
        userRole
        userType
        username
        remark
        status
        validationStatus
        registration
        lastestOTP
        lastestOTPRef
        lastestOTPTime
        isVerifiedEmail
        isVerifiedPhoneNumber
        acceptPolicyVersion
        acceptPolicyTime
        createdAt
        updatedAt
        profileImage {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
        individualDetail {
          _id
          userNumber
          email
          title
          otherTitle
          firstname
          lastname
          phoneNumber
          taxId
          address
          province
          district
          subDistrict
          postcode
          fullname
        }
        businessDetail {
          _id
          userNumber
          businessTitle
          businessName
          businessBranch
          businessType
          businessTypeOther
          taxNumber
          address
          province
          district
          subDistrict
          postcode
          contactNumber
          businessEmail
          paymentMethod
          acceptedEDocumentDate
          acceptedPoliciesVersion
          acceptedPoliciesDate
          acceptedTermConditionVersion
          acceptedTermConditionDate
          changePaymentMethodRequest
          creditPayment {
            _id
            isSameAddress
            financialFirstname
            financialLastname
            financialContactNumber
            financialContactEmails
            financialAddress
            financialPostcode
            financialProvince
            financialDistrict
            financialSubDistrict
            billedDateType
            billedRoundType
            acceptedFirstCreditTermDate
            creditLimit
            creditUsage
            billedDate {
              jan
              feb
              mar
              apr
              may
              jun
              jul
              aug
              sep
              oct
              nov
              dec
            }
            billedRound {
              jan
              feb
              mar
              apr
              may
              jun
              jul
              aug
              sep
              oct
              nov
              dec
            }
            businessRegistrationCertificateFile {
              _id
              fileId
              filename
              mimetype
              createdAt
              updatedAt
            }
            copyIDAuthorizedSignatoryFile {
              _id
              fileId
              filename
              mimetype
              createdAt
              updatedAt
            }
            certificateValueAddedTaxRegistrationFile {
              _id
              fileId
              filename
              mimetype
              createdAt
              updatedAt
            }
          }
          cashPayment {
            _id
            acceptedEReceiptDate
          }
        }
      }
      requestedDriver {
        _id
        email
        fullname
        userNumber
        userRole
        userType
        username
        remark
        status
        validationStatus
        registration
        lastestOTP
        lastestOTPRef
        lastestOTPTime
        isVerifiedEmail
        isVerifiedPhoneNumber
        acceptPolicyVersion
        acceptPolicyTime
        createdAt
        updatedAt
      }
      destinations {
        placeId
        name
        detail
        contactName
        contactNumber
        customerRemark
        location {
          latitude
          longitude
        }
      }
      vehicleId {
        _id
        type
        isPublic
        isLarger
        name
        width
        length
        height
        maxCapacity
        maxDroppoint
        details
        createdAt
        updatedAt
        image {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
      }
      additionalServices {
        _id
        cost
        price
        createdAt
        updatedAt
        reference {
          _id
          available
          type
          cost
          price
          createdAt
          updatedAt
          additionalService {
            _id
            type
            name
            permanent
            status
            createdAt
            updatedAt
            descriptions {
              _id
              detail
              vehicleTypes {
                _id
                type
                isPublic
                isLarger
                name
                width
                length
                height
                maxCapacity
                maxDroppoint
                details
                createdAt
                updatedAt
                image {
                  _id
                  fileId
                  filename
                  mimetype
                  createdAt
                  updatedAt
                }
              }
            }
          }
        }
      }
      distances {
        _id
        from
        to
        unit
        cost
        price
        benefits
      }
      podDetail {
        fullname
        address
        province
        district
        subDistrict
        postcode
        phoneNumber
        remark
      }
      discountId {
        _id
        status
        name
        code
        startDate
        endDate
        discount
        unit
        minPrice
        maxDiscountPrice
        isInfinity
        usedAmout
        limitAmout
        description
        createdAt
        updatedAt
      }
      additionalImages {
        _id
        fileId
        filename
        mimetype
        createdAt
        updatedAt
      }
      directionId {
        _id
        rawData
      }
      currentStepSeq
      steps {
        _id
        step
        seq
        stepName
        customerMessage
        driverMessage
        stepStatus
        createdAt
        updatedAt
        images {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
      }
      payment {
        _id
        status
        paymentNumber
        paymentMethod
        rejectionOtherReason
        rejectionReason
        createdAt
        updatedAt
        calculation {
          subTotalDropPointCost
          subTotalDropPointPrice
          subTotalCost
          subTotalPrice
          subTotalRoundedCost
          subTotalRoundedPrice
          totalCost
          totalPrice
          calculations {
            _id
            from
            to
            unit
            cost
            price
            benefits
            createdAt
            updatedAt
            costResult
            priceResult
          }
        }
        cashDetail {
          bank
          bankName
          bankNumber
          paymentDate
          paymentTime
          imageEvidence {
            _id
            fileId
            filename
            mimetype
            createdAt
            updatedAt
          }
        }
        creditDetail {
          name
          address
          province
          district
          subDistrict
          postcode
          contactNumber
        }
        invoice {
          shippingPrices {
            label
            price
            cost
          }
          discounts {
            label
            price
            cost
          }
          additionalServices {
            label
            price
            cost
          }
          taxs {
            label
            price
            cost
          }
          subTotalCost
          subTotalPrice
          totalCost
          totalPrice
        }
      }
      driver {
        _id
        email
        fullname
        userNumber
        userRole
        userType
        username
        remark
        status
        validationStatus
        registration
        lastestOTP
        lastestOTPRef
        lastestOTPTime
        isVerifiedEmail
        isVerifiedPhoneNumber
        acceptPolicyVersion
        acceptPolicyTime
        createdAt
        updatedAt
        individualDriver {
          _id
          title
          otherTitle
          firstname
          lastname
          taxId
          phoneNumber
          lineId
          address
          province
          district
          subDistrict
          postcode
          bank
          bankBranch
          bankName
          bankNumber
          fullname
        }
        profileImage {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
      }
      refund {
        _id
        imageEvidence {
          _id
          fileId
          filename
          mimetype
          createdAt
          updatedAt
        }
        paymentDate
        paymentTime
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * __useGetAvailableShipmentByTrackingNumberQuery__
 *
 * To run a query within a React component, call `useGetAvailableShipmentByTrackingNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableShipmentByTrackingNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableShipmentByTrackingNumberQuery({
 *   variables: {
 *      tracking: // value for 'tracking'
 *   },
 * });
 */
export function useGetAvailableShipmentByTrackingNumberQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAvailableShipmentByTrackingNumberQuery,
    GetAvailableShipmentByTrackingNumberQueryVariables
  > &
    (
      | {
          variables: GetAvailableShipmentByTrackingNumberQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAvailableShipmentByTrackingNumberQuery,
    GetAvailableShipmentByTrackingNumberQueryVariables
  >(GetAvailableShipmentByTrackingNumberDocument, options);
}
export function useGetAvailableShipmentByTrackingNumberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAvailableShipmentByTrackingNumberQuery,
    GetAvailableShipmentByTrackingNumberQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAvailableShipmentByTrackingNumberQuery,
    GetAvailableShipmentByTrackingNumberQueryVariables
  >(GetAvailableShipmentByTrackingNumberDocument, options);
}
export function useGetAvailableShipmentByTrackingNumberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAvailableShipmentByTrackingNumberQuery,
        GetAvailableShipmentByTrackingNumberQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetAvailableShipmentByTrackingNumberQuery,
    GetAvailableShipmentByTrackingNumberQueryVariables
  >(GetAvailableShipmentByTrackingNumberDocument, options);
}
export type GetAvailableShipmentByTrackingNumberQueryHookResult = ReturnType<
  typeof useGetAvailableShipmentByTrackingNumberQuery
>;
export type GetAvailableShipmentByTrackingNumberLazyQueryHookResult =
  ReturnType<typeof useGetAvailableShipmentByTrackingNumberLazyQuery>;
export type GetAvailableShipmentByTrackingNumberSuspenseQueryHookResult =
  ReturnType<typeof useGetAvailableShipmentByTrackingNumberSuspenseQuery>;
export type GetAvailableShipmentByTrackingNumberQueryResult =
  Apollo.QueryResult<
    GetAvailableShipmentByTrackingNumberQuery,
    GetAvailableShipmentByTrackingNumberQueryVariables
  >;
export const GetDriverPoliciesInfoDocument = gql`
  query GetDriverPoliciesInfo {
    getDriverPoliciesInfo {
      driverPolicies
      version
      createdAt
      updatedAt
    }
  }
`;

/**
 * __useGetDriverPoliciesInfoQuery__
 *
 * To run a query within a React component, call `useGetDriverPoliciesInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDriverPoliciesInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDriverPoliciesInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDriverPoliciesInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDriverPoliciesInfoQuery,
    GetDriverPoliciesInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetDriverPoliciesInfoQuery,
    GetDriverPoliciesInfoQueryVariables
  >(GetDriverPoliciesInfoDocument, options);
}
export function useGetDriverPoliciesInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDriverPoliciesInfoQuery,
    GetDriverPoliciesInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDriverPoliciesInfoQuery,
    GetDriverPoliciesInfoQueryVariables
  >(GetDriverPoliciesInfoDocument, options);
}
export function useGetDriverPoliciesInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetDriverPoliciesInfoQuery,
        GetDriverPoliciesInfoQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetDriverPoliciesInfoQuery,
    GetDriverPoliciesInfoQueryVariables
  >(GetDriverPoliciesInfoDocument, options);
}
export type GetDriverPoliciesInfoQueryHookResult = ReturnType<
  typeof useGetDriverPoliciesInfoQuery
>;
export type GetDriverPoliciesInfoLazyQueryHookResult = ReturnType<
  typeof useGetDriverPoliciesInfoLazyQuery
>;
export type GetDriverPoliciesInfoSuspenseQueryHookResult = ReturnType<
  typeof useGetDriverPoliciesInfoSuspenseQuery
>;
export type GetDriverPoliciesInfoQueryResult = Apollo.QueryResult<
  GetDriverPoliciesInfoQuery,
  GetDriverPoliciesInfoQueryVariables
>;
export const GetTransactionDocument = gql`
  query GetTransaction(
    $limit: Int
    $sortField: [String!]
    $sortAscending: Boolean
    $skip: Int
  ) {
    getTransaction(
      limit: $limit
      sortField: $sortField
      sortAscending: $sortAscending
      skip: $skip
    ) {
      _id
      ownerId
      ownerType
      refId
      refType
      amount
      transactionType
      description
      status
      createdAt
      updatedAt
    }
    calculateTransaction {
      totalPending
      totalIncome
      totalOutcome
      totalOverall
    }
  }
`;

/**
 * __useGetTransactionQuery__
 *
 * To run a query within a React component, call `useGetTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      sortField: // value for 'sortField'
 *      sortAscending: // value for 'sortAscending'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetTransactionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTransactionQuery,
    GetTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTransactionQuery, GetTransactionQueryVariables>(
    GetTransactionDocument,
    options,
  );
}
export function useGetTransactionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTransactionQuery,
    GetTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTransactionQuery, GetTransactionQueryVariables>(
    GetTransactionDocument,
    options,
  );
}
export function useGetTransactionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTransactionQuery,
        GetTransactionQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetTransactionQuery,
    GetTransactionQueryVariables
  >(GetTransactionDocument, options);
}
export type GetTransactionQueryHookResult = ReturnType<
  typeof useGetTransactionQuery
>;
export type GetTransactionLazyQueryHookResult = ReturnType<
  typeof useGetTransactionLazyQuery
>;
export type GetTransactionSuspenseQueryHookResult = ReturnType<
  typeof useGetTransactionSuspenseQuery
>;
export type GetTransactionQueryResult = Apollo.QueryResult<
  GetTransactionQuery,
  GetTransactionQueryVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      _id
      userNumber
      userRole
      userType
      username
      remark
      status
      validationStatus
      registration
      lastestOTP
      lastestOTPRef
      isVerifiedEmail
      isVerifiedPhoneNumber
      acceptPolicyVersion
      acceptPolicyTime
      createdAt
      updatedAt
      fullname
      fcmToken
      profileImage {
        _id
        fileId
        filename
        mimetype
        createdAt
        updatedAt
      }
      individualDriver {
        _id
        title
        otherTitle
        firstname
        lastname
        taxId
        phoneNumber
        lineId
        address
        province
        district
        subDistrict
        postcode
        bank
        bankBranch
        bankName
        bankNumber
        fullname
        balance
        serviceVehicleType {
          _id
          type
          isPublic
          isLarger
          name
          width
          length
          height
          maxCapacity
          details
          createdAt
          updatedAt
          image {
            _id
            fileId
            filename
            mimetype
            createdAt
            updatedAt
          }
        }
      }
    }
    requireBeforeSignin {
      requireAcceptedPolicy
      requirePasswordChange
    }
    unreadCount
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    options,
  );
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetVehicleTypeAvailableDocument = gql`
  query GetVehicleTypeAvailable {
    getVehicleTypeAvailable {
      _id
      type
      isPublic
      isLarger
      name
      width
      length
      height
      maxCapacity
      details
      maxDroppoint
      createdAt
      updatedAt
      image {
        _id
        fileId
        filename
        mimetype
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * __useGetVehicleTypeAvailableQuery__
 *
 * To run a query within a React component, call `useGetVehicleTypeAvailableQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVehicleTypeAvailableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVehicleTypeAvailableQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVehicleTypeAvailableQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetVehicleTypeAvailableQuery,
    GetVehicleTypeAvailableQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVehicleTypeAvailableQuery,
    GetVehicleTypeAvailableQueryVariables
  >(GetVehicleTypeAvailableDocument, options);
}
export function useGetVehicleTypeAvailableLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVehicleTypeAvailableQuery,
    GetVehicleTypeAvailableQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVehicleTypeAvailableQuery,
    GetVehicleTypeAvailableQueryVariables
  >(GetVehicleTypeAvailableDocument, options);
}
export function useGetVehicleTypeAvailableSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetVehicleTypeAvailableQuery,
        GetVehicleTypeAvailableQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetVehicleTypeAvailableQuery,
    GetVehicleTypeAvailableQueryVariables
  >(GetVehicleTypeAvailableDocument, options);
}
export type GetVehicleTypeAvailableQueryHookResult = ReturnType<
  typeof useGetVehicleTypeAvailableQuery
>;
export type GetVehicleTypeAvailableLazyQueryHookResult = ReturnType<
  typeof useGetVehicleTypeAvailableLazyQuery
>;
export type GetVehicleTypeAvailableSuspenseQueryHookResult = ReturnType<
  typeof useGetVehicleTypeAvailableSuspenseQuery
>;
export type GetVehicleTypeAvailableQueryResult = Apollo.QueryResult<
  GetVehicleTypeAvailableQuery,
  GetVehicleTypeAvailableQueryVariables
>;
export const GetVehicleTypeByIdDocument = gql`
  query GetVehicleTypeById($id: String!) {
    getVehicleTypeById(id: $id) {
      _id
      type
      isPublic
      isLarger
      name
      width
      length
      height
      maxCapacity
      details
      maxDroppoint
      createdAt
      updatedAt
      image {
        _id
        fileId
        filename
        mimetype
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * __useGetVehicleTypeByIdQuery__
 *
 * To run a query within a React component, call `useGetVehicleTypeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVehicleTypeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVehicleTypeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetVehicleTypeByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetVehicleTypeByIdQuery,
    GetVehicleTypeByIdQueryVariables
  > &
    (
      | { variables: GetVehicleTypeByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVehicleTypeByIdQuery,
    GetVehicleTypeByIdQueryVariables
  >(GetVehicleTypeByIdDocument, options);
}
export function useGetVehicleTypeByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVehicleTypeByIdQuery,
    GetVehicleTypeByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVehicleTypeByIdQuery,
    GetVehicleTypeByIdQueryVariables
  >(GetVehicleTypeByIdDocument, options);
}
export function useGetVehicleTypeByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetVehicleTypeByIdQuery,
        GetVehicleTypeByIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetVehicleTypeByIdQuery,
    GetVehicleTypeByIdQueryVariables
  >(GetVehicleTypeByIdDocument, options);
}
export type GetVehicleTypeByIdQueryHookResult = ReturnType<
  typeof useGetVehicleTypeByIdQuery
>;
export type GetVehicleTypeByIdLazyQueryHookResult = ReturnType<
  typeof useGetVehicleTypeByIdLazyQuery
>;
export type GetVehicleTypeByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetVehicleTypeByIdSuspenseQuery
>;
export type GetVehicleTypeByIdQueryResult = Apollo.QueryResult<
  GetVehicleTypeByIdQuery,
  GetVehicleTypeByIdQueryVariables
>;
