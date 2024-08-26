import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const AddPageAttribute = () => {
  const [platform, setPlatform] = useState('TJ');
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [formData, setFormData] = useState({
    platform: 'TJ',
    page_id: '',
    page_placement: '',
    placement_width: '',
    placement_height: '',
    mobile_placement_width: '',
    mobile_placement_height: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, [platform]);

  const fetchPages = async () => {
    try {
      const response = await axios.get(`/api/page/page-list?platform=${platform}`);
      console.log("Fetched pages:", response.data);
      setPages(response.data);
      if (!response.data.some(page => page._id === selectedPage)) {
        setSelectedPage('');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };
  

   const handleChange = (e) => {
     const { name, value } = e.target;
     const numbersOnly = /^[0-9]*$/;
    
     // Clear the corresponding error from the state
     setErrors({
       ...errors,
       [name]: ""
     });
  
     
    if(name === 'platform'){
      
      setFormData({
        ...formData,
        [name]: value,
      });

      setPlatform(value);
      setSelectedPage('');
      fetchPages();

    }else if (name === 'page_placement') {
       setFormData({
         ...formData,
         [name]: value,
       });
     } else {
       if (!numbersOnly.test(value)) {
         setErrors({
         ...errors,
           [name]: `Only numbers are allowed in ${name}`,
         });
         return;
       }
       setFormData({
         ...formData,
         [name]: value,
       });
     }
    
    
     if (name === 'selectedPage') {
       setSelectedPage(value);
       setFormData({
         ...formData,
         page_id: value,
       });
       setErrors({
         ...errors,
         selectedPage: ""
       });
     }
   };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let newErrors = {};
  
    if (!selectedPage) {
      newErrors.selectedPage = "Please select a page";
      isValid = false;
  }

    if (!formData.page_placement) {
      newErrors.page_placement = "Page placement is required";
      isValid = false;
    }

    if (!formData.placement_width) {
      newErrors.placement_width = "Desktop placement width is required";
      isValid = false;
    } else if (!/^[0-9]+$/.test(formData.placement_width)) {
      newErrors.placement_width = "Desktop placement width should only contain numbers";
      isValid = false;
    }

    if (!formData.placement_height) {
      newErrors.placement_height = "Desktop placement height is required";
      isValid = false;
    } else if (!/^[0-9]+$/.test(formData.placement_height)) {
      newErrors.placement_height = "Desktop placement height should only contain numbers";
      isValid = false;
    }

    if (!formData.mobile_placement_width) {
      newErrors.mobile_placement_width = "Mobile placement width is required";
      isValid = false;
    } else if (!/^[0-9]+$/.test(formData.mobile_placement_width)) {
      newErrors.mobile_placement_width = "Mobile placement width should only contain numbers";
      isValid = false;
    }

    if (!formData.mobile_placement_height) {
      newErrors.mobile_placement_height = "Mobile placement height is required";
      isValid = false;
    } else if (!/^[0-9]+$/.test(formData.mobile_placement_height)) {
      newErrors.mobile_placement_height = "Mobile placement height should only contain numbers";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors); 
      Object.values(newErrors).forEach(error => {
      });
      return;
    }

    try {
      const response = await axios.post('/api/page-attribute/create-page-attributes', formData);

      if (response.status === 201) {
        toast.success('Page attribute added successfully');
        navigate('/page-attributes-list');
        setFormData({
          ...formData,
          page_id: '',
          page_placement: '',
          placement_width: '',
          placement_height: '',
          mobile_placement_width: '',
          mobile_placement_height: '',
        });
        setSelectedPage('');
        setErrors({});
       
      }
    } catch (error) {
      console.error('Error adding page attribute:', error);
      toast.error('Failed to add page attribute');
    }
  };

  return (
    <Container className="banner-box px-0 px-md-4 px-2 py-md-3 pb-0 pt-3">
      <div className="boxLayout p-md-4 p-3 box-outline-shadow">
        <h2>Add Page Attribute</h2>
        <div className="mt-3 bannerLayout">
          <Form onSubmit={handleSubmit}>
            <div className="bannerLayout-Row">
              <div className="bannerLayout-col row">
                  <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
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
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
                  <Form.Label>Select Page</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedPage}
                      onChange={(e) => {
                        setSelectedPage(e.target.value);
                        setFormData({ ...formData, page_id: e.target.value });
                      }}
                      isInvalid={!!errors.selectedPage}
                    >
                      <option value="">Select Page</option>
                      {pages.map((page) => (
                        <option key={page._id} value={page._id}>
                          {page.pageName}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.selectedPage}
                    </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
                  <Form.Label>Page Placement</Form.Label>
                  <Form.Control
                    type="text"
                    name="page_placement"
                    value={formData.page_placement}
                    onChange={handleChange}
                    isInvalid={!!errors.page_placement}
                  />
                   <Form.Control.Feedback type="invalid">
                      {errors.page_placement}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
                  <Form.Label>Desktop Placement Width</Form.Label>
                  <Form.Control
                    type="text"
                    name="placement_width"
                    value={formData.placement_width}
                    onChange={handleChange}
                    isInvalid={!!errors.placement_width}
                  />
                  <Form.Control.Feedback type="invalid">
                      {errors.placement_width}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
                  <Form.Label>Desktop Placement Height</Form.Label>
                  <Form.Control
                    type="text"
                    name="placement_height"
                    value={formData.placement_height}
                    onChange={handleChange}
                    isInvalid={!!errors.placement_height}
                  />
                 <Form.Control.Feedback type="invalid">
                      {errors.placement_height}
                  </Form.Control.Feedback>
                </div>
                
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
                  <Form.Label>Mobile Placement Width</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile_placement_width"
                    value={formData.mobile_placement_width}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile_placement_width}
                  />
                   <Form.Control.Feedback type="invalid">
                      {errors.mobile_placement_width}
                  </Form.Control.Feedback>
                </div>

                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
                  <Form.Label>Mobile Placement Height</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile_placement_height"
                    value={formData.mobile_placement_height}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile_placement_height}
                  />
                   <Form.Control.Feedback type="invalid">
                      {errors.mobile_placement_height}
                  </Form.Control.Feedback>
                </div>

              </div>
            </div>
            <div className="BtnLayout d-flex justify-content-end mt-2">
              <Button variant="primary" type="submit">
                Add Page Attribute
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default AddPageAttribute;
