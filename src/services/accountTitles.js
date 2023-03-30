import axios from "axios";

export const locationTitles = () => {
  const res = axios.get(
    "http://10.10.2.76:8000/api/dropdown/location?status=all&paginate=0&api_for=vladimir",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 22|I20DZXCeqIvjxTyZo33x0HsA59QHC3vi1ufPJFVA",
      },
    }
  );
  return res.data;
};

export const departmentTitles = () => {
  const res = axios.get(
    "http://10.10.2.76:8000/api/dropdown/department?status=all&paginate=0&api_for=vladimir",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 22|I20DZXCeqIvjxTyZo33x0HsA59QHC3vi1ufPJFVA",
      },
    }
  );
  return res.data;
};

export const companyTitles = () => {
  const res = axios.get(
    "http://10.10.2.76:8000/api/dropdown/company?status=all&paginate=0&api_for=vladimir",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 22|I20DZXCeqIvjxTyZo33x0HsA59QHC3vi1ufPJFVA",
      },
    }
  );
  return res.data;
};

export const accountTitles = () => {
  const res = axios.get(
    "http://10.10.2.76:8000/api/dropdown/account?status=all&paginate=0&api_for=vladimir",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 22|I20DZXCeqIvjxTyZo33x0HsA59QHC3vi1ufPJFVA",
      },
    }
  );
  return res.data;
};
