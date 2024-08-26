import React, { useState } from "react";
import { Container, Form } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreatePage() {
  const [formData, setFormData] = useState({
    pageName: "",
    status: "active",
    platform: "",
    pageURL: ""
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  
    // Clear the corresponding error from the state
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
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
        const response = await axios.post("/api/page/create-page", formData);
        if (response.status === 201) {
          toast.success("Page created successfully");
          navigate(`/page-list`);
        }
      } catch (error) {
        console.error('Error creating page:', error);
      }
    }
  };

  return (
    <Container>
      <div className="banner-box px-0 px-md-4 px-2 py-md-3 pb-0 pt-3 col-xl-5 col-lg-8 m-auto">
        <div className="boxLayout p-md-4 p-3 box-outline-shadow">
          <h2>Create Page</h2>
          <div className="mt-3 bannerLayout">
            <form onSubmit={handleSubmit}>
              <div className="bannerLayout-Row">
                <div className="bannerLayout-col row">
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide">
                    <Form.Label>Page Name:</Form.Label>
                    <input
                      className={`form-control ${errors.pageName && 'is-invalid'}`}
                      type="text"
                      placeholder="Enter page name"
                      name="pageName"
                      value={formData.pageName}
                      onChange={handleChange}
                      isInvalid={!!errors.pageName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.pageName}
                    </Form.Control.Feedback>
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
                      className={`form-control ${errors.platform && 'is-invalid'}`}
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      isInvalid={!!errors.platform}
                    >
                      <option value="">Select Platform</option>
                      <option value="TJ">TJ</option>
                      <option value="TR">TR</option>
                      <option value="TG">TG</option>
                      <option value="IJ">IJ</option>
                      <option value="BJ">BJ</option>
                    </select>
                    <Form.Control.Feedback type="invalid">
                      {errors.platform}
                    </Form.Control.Feedback>
                  </div>
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide">
                    <Form.Label>Preview Page URL:</Form.Label>
                    <input
                      className={`form-control ${errors.pageURL && 'is-invalid'}`}
                      type="url"
                      placeholder="Enter page URL."
                      name="pageURL"
                      value={formData.pageURL}
                      onChange={handleChange}
                      isInvalid={!!errors.pageURL}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.pageURL}
                    </Form.Control.Feedback>
                  </div>
                </div>
              </div>
              <div className="BtnLayout d-flex justify-content-end mt-2">
                <button type="submit" className="btn btn-primary btnfull">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CreatePage;
