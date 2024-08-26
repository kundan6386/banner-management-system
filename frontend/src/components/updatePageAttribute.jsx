import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UpdatePageAttribute = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    platform: 'TJ',
    page_id: '',
    page_placement: '',
    placement_width: '',
    placement_height: '',
    mobile_placement_width: '',
    mobile_placement_height: '',
  });
  

  const fetchPages = async () => {
    try {
      const response = await axios.get(`/api/page/page-list?platform=${formData.platform}`);
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [formData.platform]);

  useEffect(() => {
    const fetchPageAttributeData = async () => {
      try {
        const response = await axios.get(`/api/page-attribute/update-page-attributes/${id}`);
        const { data } = response;
  
        setFormData({
          ...formData,
          page_id: data.page_id || '',
          page_placement: data.page_placement || '',
          placement_width: data.placement_width || '',
          placement_height: data.placement_height || '',
          mobile_placement_width: data.mobile_placement_width || '',
          mobile_placement_height: data.mobile_placement_height || '',
        });
        setSelectedPage(data.page_id || ''); // Set selectedPage to page_id
        setFormData(prevFormData => ({
          ...prevFormData,
          platform: data.platform || '' // Set formData.platform to the fetched platform value
        }));
      } catch (error) {
        console.error('Error fetching page attribute data:', error);
      }
    };
  
    fetchPageAttributeData();
  }, [id]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch pages when platform changes
    if (name === 'platform') {
      fetchPages();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/page-attribute/update-page-attributes/${id}`, formData);

      if (response.status === 200) {
        toast.success('Page attribute updated successfully');
        navigate(`/page-attributes-list`);
      }
    } catch (error) {
      console.error('Error updating page attribute:', error);
      toast.error('Failed to update page attribute');
    }
  };

  return (
    <Container className="banner-box px-0 px-md-4 px-2 py-md-3 pb-0 pt-3">
      <div className="boxLayout p-md-4 p-3 box-outline-shadow">
        <h2>Update Page Attribute</h2>
        <div className="mt-3 bannerLayout">
          <Form onSubmit={handleSubmit}>
            <div className="bannerLayout-Row">
              <div className="bannerLayout-col row">
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6">
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
                    <option value="TG">TG</option>
                  </select>
                </div>
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="selectedPage">
                  <Form.Label>Select Page</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedPage}
                    onChange={(e) => {
                      setSelectedPage(e.target.value);
                      setFormData({
                        ...formData,
                        page_id: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select Page</option>
                    {Array.isArray(pages) && pages.length > 0 && pages.map((page) => (
                      <option key={page._id} value={page._id}>
                        {page.pageName}
                      </option>
                    ))}
                  </Form.Control>
                </div>
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="page_placement">
                  <Form.Label>Page Placement</Form.Label>
                  <Form.Control
                    type="text"
                    name="page_placement"
                    value={formData.page_placement}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="placement_width">
                  <Form.Label>Desktop Placement Width</Form.Label>
                  <Form.Control
                    type="text"
                    name="placement_width"
                    value={formData.placement_width}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="placement_height">
                  <Form.Label>Desktop Placement Height</Form.Label>
                  <Form.Control
                    type="text"
                    name="placement_height"
                    value={formData.placement_height}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="mobile_placement_width">
                  <Form.Label>Mobile Placement Width</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile_placement_width"
                    value={formData.mobile_placement_width}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex flex-column mb-md-3 mb-2 colWide col-md-6" controlId="mobile_placement_height">
                  <Form.Label>Mobile Placement Height</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile_placement_height"
                    value={formData.mobile_placement_height}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="BtnLayout d-flex justify-content-end mt-2">
              <Button variant="primary" type="submit">
                Update Page Attribute
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default UpdatePageAttribute;
