import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pageName: "",
    status: "",
    platform: "",
    pageURL: ""
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`/api/page/update-page/${id}`);
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to fetch page data");
      }
    };

    fetchPageData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    let isValid = true;

    if (!formData.pageName) {
      errors.pageName = "Page Name is required";
      isValid = false;
    }

    if (!formData.platform) {
      errors.platform = "Platform is required";
      isValid = false;
    }

    if (!formData.pageURL) {
      errors.pageURL = "Page URL is required";
      isValid = false;
    }

    setErrors(errors);

    if (isValid) {
      try {
        const response = await axios.put(`/api/page/update-page-data/${id}`, formData);
        if (response.status === 200) {
          setSubmitSuccess(true);
          toast.success("Page updated successfully");
          navigate(`/page-list`);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to update page");
        }
      }
    } else {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  };

  return (
    <FormContainer>
      <div className="banner-box px-0 px-md-4 px-2 py-md-3 pb-0 pt-3 col-xl-5 col-lg-8 m-auto">
        <div className="boxLayout p-md-4 p-3 box-outline-shadow">
          <h2>Update Page</h2>
          <div className="mt-3 bannerLayout">
            <form onSubmit={handleSubmit}>
              <div className="bannerLayout-Row">
                <div className="bannerLayout-col row">
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide">
                    <Form.Label>Page Name:</Form.Label>
                    <input
                      className="form-control"
                      type="text"
                      name="pageName"
                      value={formData.pageName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide">
                    <Form.Label>Status:</Form.Label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide">
                    <Form.Label>Platform:</Form.Label>
                    <select
                      className="form-control"
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                    >
                      <option value="">Select Platform</option>
                      <option value="TJ">TJ</option>
                      <option value="TR">TR</option>
                      <option value="TG">TG</option>
                      <option value="IJ">IJ</option>
                      <option value="BJ">BJ</option>
                    </select>
                  </div>
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide">
                    <Form.Label>Page URL:</Form.Label>
                    <input
                      className="form-control"
                      type="url"
                      name="pageURL"
                      value={formData.pageURL}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="BtnLayout d-flex justify-content-end mt-2">
                <button type="submit" className="btn btn-primary btnfull">Submit</button>
              </div>
            </form>
            {submitSuccess && <p>Form submitted successfully!</p>}
          </div>
        </div>
      </div>
    </FormContainer>
  );
}

export default UpdatePage;
