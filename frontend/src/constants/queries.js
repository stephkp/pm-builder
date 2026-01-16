export const INVESTOR_QUERY = `
  query Investor($id: ID!) {
    investor(id: $id) {
      id
      firstName
      lastName
      dateOfBirth
      phoneNumber
      streetAddress
      city
      state
      zipCode
      ssn
      documents {
        id
        filename
        byteSize
        downloadUrl
      }
    }
  }
`;
