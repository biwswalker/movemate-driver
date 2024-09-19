import { AxiosResponse } from "axios";
import axios from "axios";
import { ApolloError } from "@apollo/client/errors";
import { FileUploadPayload } from "@graphql/generated/graphql";

export const fileUpload = async (file: {
  uri: string;
  name: string;
  type: string;
}): Promise<
  AxiosResponse<{
    data: { fileUpload: FileUploadPayload };
    errors: ApolloError;
  }>
> => {
  const graphql = `${process.env.EXPO_PUBLIC_API_URL}/graphql`;
  const formData = new FormData();
  formData.append(
    "operations",
    '{ "query": "mutation FileUpload($file: Upload!){file_upload(file: $file){fileId filename mimetype url}}" }'
  );
  formData.append("map", '{"0": ["variables.file"]}');
  formData.append("0", file as any, file.name);

  return axios.postForm(graphql, formData, {
    headers: {
      "Apollo-Require-Preflight": "true",
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fileUploadAPI = async (file: {
  uri: string;
  name: string;
  type: string;
}): Promise<AxiosResponse<FileUploadPayload>> => {
  const uploadAPI = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/upload`;
  const formData = new FormData();
  formData.append("file", file as any);
  console.log('formData--', JSON.stringify(formData))

  return axios.postForm(uploadAPI, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: () => {
      return formData;
    },
  });
};
