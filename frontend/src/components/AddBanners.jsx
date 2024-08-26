import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from 'axios';
import DatePicker from "react-datepicker";
import sizeOf from 'image-size';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddBanners() {
  const [formData, setFormData] = useState({
    title: "",
    bannerClass: "",
    imageURL: "",
    startDate: "",
    endDate: "",
    platform: "TJ",
    page: "",
    placement: "",
    desktopImage: null,
    position: "",
    lang: "",
    mobileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [desktopImagePreview, setDesktopImagePreview] = useState("");
  const [mobileImagePreview, setMobileImagePreview] = useState("");
  const [pages, setPages] = useState([]);
  const [placements, setPlacements] = useState([]);
  const navigate = useNavigate();
  const [showDropdowns, setShowDropdowns] = useState({
    position: false,
    lang: false,
  });

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(`/api/page/page-list/?platform=${formData.platform}`);
        setPages(response.data);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, [formData.platform]);

  useEffect(() => {
    const fetchPlacements = async () => {
      if (formData.page) {
        console.log(formData.page);
        try {
          const response = await axios.get(`/api/page-attribute/page-attribute-list/?page_id=${formData.page}`);
          setPlacements(response.data);
        } catch (error) {
          console.error("Error fetching placements:", error);
        }
      }
    };

    fetchPlacements();
  }, [formData.page]);

  const handleChange = async (e) => {
    const { name, type } = e.target;
    const updatedFormData = { ...formData };
  
    if (type === "file") {
      const file = e.target.files[0];
  
      // Check if placement is not selected
      if (!formData.placement) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          placement: "Please select a placement before uploading an image"
        }));
        return;
      }
  
      if (file && !file.name.endsWith('.webp')) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only .webp image files are allowed"
        }));
        e.target.value = '';
        return;
      }
  
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          const arrayBuffer = fileReader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          const dimensions = sizeOf(uint8Array);
          const { width, height } = dimensions;
  
          let errorMessage = '';
  
          if (name === 'desktopImage' && placements.length) {
            const placement = placements[0];
            if (width !== parseInt(placement.placement_width) || height !== parseInt(placement.placement_height)) {
              errorMessage = `Image dimensions do not match the expected placement dimensions (${placement.placement_width}x${placement.placement_height})`;
            }
          }
  
          if (name === 'mobileImage' && placements.length) {
            const placement = placements[0];
            if (width !== parseInt(placement.mobile_placement_width) || height !== parseInt(placement.mobile_placement_height)) {
              errorMessage = `Image dimensions do not match the expected placement dimensions (${placement.mobile_placement_width}x${placement.mobile_placement_height})`;
            }
          }
  
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMessage
          }));
  
          if (!errorMessage) {
            updatedFormData[name] = file;
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.readyState === 2) {
                name === "desktopImage" ? setDesktopImagePreview(reader.result) : setMobileImagePreview(reader.result);
              }
            };
            reader.readAsDataURL(file);
            setFormData(updatedFormData);
          } else {
            e.target.value = '';
          }
        } catch (error) {
          console.error('Error reading image dimensions:', error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Error reading image dimensions'
          }));
          e.target.value = '';
        }
      };
  
      fileReader.readAsArrayBuffer(file);
    } else {
      updatedFormData[name] = e.target.value;
  
      if (name === "placement") {
        if (e.target.value === "Banner") {
          setShowDropdowns({
            position: true,
            lang: true,
          });
        } else {
          setShowDropdowns({
            position: false,
            lang: false,
          });
        }
      }
  
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
  
      if (name === 'placement') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          placement: ''
        }));
      }
  
      setFormData(updatedFormData);
    }
  };
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let errorMessages = {};

    if (!formData.title) {
      isValid = false;
      errorMessages.title = "Title is required";
    }

    if (!formData.bannerClass) {
      isValid = false;
      errorMessages.bannerClass = "Banner Class is required";
    }

    if (!formData.imageURL) {
      isValid = false;
      errorMessages.imageURL = "Image URL is required";
    }

    if (!formData.startDate) {
      isValid = false;
      errorMessages.startDate = "Start Date is required";
    } else {
      const startDate = new Date(formData.startDate);
      const currentDate = new Date();
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Get today's date without time
      if (startDate < today) {
        isValid = false;
        errorMessages.startDate = "Start Date must be today or in the future";
      }
    }
    

    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        isValid = false;
        errorMessages.endDate = "End Date must be greater than Start Date";
      }
    }

    
    if (!formData.platform) {
      isValid = false;
      errorMessages.platform = "Platform is required";
    }

    if (!formData.page) {
      isValid = false;
      errorMessages.page = "Page is required";
    }

    if (!formData.placement) {
      isValid = false;
      errorMessages.placement = "Placement is required";
    }

    if (!formData.desktopImage) {
      isValid = false;
      errorMessages.desktopImage = "Desktop Image is required";
    }

    if (!formData.mobileImage) {
      isValid = false;
      errorMessages.mobileImage = "Mobile Image is required";
    }

    setErrors(errorMessages);

    if (isValid) {
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        const response = await axios.post("/api/users/createbanner", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });

        if (response.status === 201) {
          toast.success("Banner added successfully");
          navigate('/banners');
        }

      } catch (error) {
        console.error("Error adding banner:", error);
        toast.error('Failed to add banner');
      }
    }
  };

  return (
    <div class="banner-box px-0 px-md-4 px-2 pt-md-2  pb-md-3 pb-0 pt-3">
      <div className="boxLayout p-md-4 p-3 box-outline-shadow">
        <h2>Add Banners</h2>
        <div className="mt-3 bannerLayout">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="bannerLayout-Row">
              <div className="bannerLayout-col row">
                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="title">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="bannerClass">
                  <Form.Label>Placement Class:</Form.Label>
                  <Form.Control
                    type="text"
                    name="bannerClass"
                     placeholder="Enter placement class"
                    value={formData.bannerClass}
                    onChange={handleChange}
                    isInvalid={!!errors.bannerClass}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bannerClass}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="imageURL">
                  <Form.Label>Action URL:</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageURL"
                    placeholder="Enter action URL"
                    value={formData.imageURL}
                    onChange={handleChange}
                    isInvalid={!!errors.imageURL}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.imageURL}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="startDate">
                  <Form.Label>Start Date:</Form.Label>
                  <DatePicker
                    selected={formData.startDate ? new Date(formData.startDate) : null}
                    onChange={(date) => setFormData({ ...formData, startDate: date ? date.toISOString().split('T')[0] : '' })}
                    className="form-control"
                    placeholderText="Select Start Date"
                  />
                  {errors.startDate && <div className="invalid-feedback d-block">{errors.startDate}</div>}
                </div>

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="endDate">
                  <Form.Label>End Date:</Form.Label>
                  <DatePicker
                    selected={formData.endDate ? new Date(formData.endDate) : null}
                    onChange={(date) => setFormData({ ...formData, endDate: date ? date.toISOString().split('T')[0] : '' })}
                    className="form-control"
                    placeholderText="Select End Date"
                  />
                    {errors.endDate && <div className="invalid-feedback d-block">{errors.endDate}</div>}
                </div>


                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="platform">
                  <Form.Label>Platform:</Form.Label>
                  <Form.Control
                    as="select"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    isInvalid={!!errors.platform}
                  >
                    <option value="TJ">TJ</option>
                    <option value="TR">TR</option>
                    <option value="TG">TG</option>
                    <option value="IJ">IJ</option>
                    <option value="BJ">BJ</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.platform}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="page">
                {/* <Form.Group controlId="page"> */}
                  <Form.Label>Page:</Form.Label>
                  <Form.Control
                    as="select"
                    name="page"
                    value={formData.page}
                    onChange={handleChange}
                    isInvalid={!!errors.page}
                  >
                    <option value="">Select Page</option>
                    {pages.map((page) => (
                      <option key={page._id} value={page._id}>
                        {page.pageName}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.page}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="placement">
                  <Form.Label>Placement:</Form.Label>
                  <Form.Control
                    as="select"
                    name="placement"
                    value={formData.placement}
                    onChange={handleChange}
                    isInvalid={!!errors.placement}
                  >
                    <option value="">Select Placement</option>
                    {placements.map((placement) => (
                      <option key={placement._id} value={placement.page_placement}>
                        {placement.page_placement}
                      </option>
                    ))}
                  </Form.Control>
                  
                  <Form.Control.Feedback type="invalid">
                    {errors.placement}
                  </Form.Control.Feedback>
                </div>
                
                {showDropdowns.position && (
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="position">
                    <Form.Label>Position:</Form.Label>
                    <Form.Control
                      as="select"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                    >
                      <option value="">Select Position</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </Form.Control>
                  </div>
                )}

                
                {showDropdowns.lang && (
                  <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="lang">
                    <Form.Label>Language:</Form.Label>
                    <Form.Control
                      as="select"
                      name="lang"
                      value={formData.lang}
                      onChange={handleChange}
                    >
                      <option value="">Select Language</option>
                      <option value="all">All</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </Form.Control>
                  </div>
                )}

                <div className="d-flex flex-column mb-md-2 mb-2 colWide col-md-6" controlId="desktopImage">
                  <Form.Label>Desktop Image:</Form.Label>
                  <Form.Control
                    type="file"
                    name="desktopImage"
                    onChange={handleChange}
                    isInvalid={!!errors.desktopImage}
                  />
                  {desktopImagePreview && <img src={desktopImagePreview} alt="Desktop Preview" className="img-fluid mt-2" />}
                  <Form.Control.Feedback type="invalid">
                    {errors.desktopImage}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="mobileImage">
                  <Form.Label>Mobile Image:</Form.Label>
                  <Form.Control
                    type="file"
                    name="mobileImage"
                    onChange={handleChange}
                    isInvalid={!!errors.mobileImage}
                  />
                  {mobileImagePreview && <img src={mobileImagePreview} alt="Mobile Preview" className="img-fluid mt-2" />}
                  <Form.Control.Feedback type="invalid">
                    {errors.mobileImage}
                  </Form.Control.Feedback>
                </div>
              </div>
            </div>
            <div className="BtnLayout d-flex justify-content-end mt-0">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddBanners;
