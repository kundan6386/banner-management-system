import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import SwitchCheckbox from './SwitchCheckbox';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const PageAttributesList = () => {
  const [pageAttributes, setPageAttributes] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchPageAttributes = async () => {
      try {
        const response = await axios.get('/api/page-attribute/page-attribute-list');
        setPageAttributes(response.data);
      } catch (error) {
        console.error('Error fetching page attributes:', error);
        toast.error('Failed to fetch page attributes');
      }
    };

    fetchPageAttributes();
  }, []);

  const filteredPageAttributes = pageAttributes.filter(
    (attribute) =>
      attribute.page_id.pageName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (platformFilter ? attribute.platform.toLowerCase() === platformFilter.toLowerCase() : true)
  );

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPageAttributes.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (id) => {
    navigate(`/update-page-attribute/${id}`);
  };

  const handleStatusToggle = async (id) => {
    try {
      const updatedAttributes = pageAttributes.map((attribute) =>
        attribute._id === id ? { ...attribute, status: attribute.status === 'active' ? 'inactive' : 'active' } : attribute
      );

      await axios.put(`/api/page-attribute/update-status/${id}`, {
        status: updatedAttributes.find((attribute) => attribute._id === id).status,
      });

      setPageAttributes(updatedAttributes);
      toast.success('Page attribute status updated successfully');
    } catch (error) {
      console.error('Error updating page attribute status:', error);
      toast.error('Failed to update page attribute status');
    }
  };

  const handlePlatformFilterChange = (e) => {
    setPlatformFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const pageCount = Math.ceil(filteredPageAttributes.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Container className="banner-box px-0 px-md-4 px-2 pt-md-1 pb-md-3 pb-0 pt-3">

      <span className={`overlay d-block d-md-none  ${showFilter ? "act" : ""}`} onClick={() => setShowFilter(false)}></span>

      <div className="d-flex justify-content-between mb-3">
        <h2>Page Attributes List</h2>
        <div className="mob-applicationList-img d-block d-md-none" onClick={() => setShowFilter(true)}>
          <img src="/filter-dashboard-icon.svg" width="33" height="33" className="img-fluid" alt="filter icon" />
        </div>
      </div>
      <div className="boxLayout p-md-4 p-3 box-outline-shadow">
        <div className='filterPlateform'>
          <Form>
            <div className={`mb-md-3 row mobileActive  ${showFilter ? "active" : ""}`}>
              <span className="closeApp d-block d-md-none" onClick={() => setShowFilter(false)}>
                <img src="/close.png" width="16" height="16" className="img-fluid" alt="close icon" />
              </span>
              <div className="col-md-3" controlId="platformFilter">
                <Form.Label>Filter by Platform:</Form.Label>
                <Form.Control as="select" value={platformFilter} onChange={handlePlatformFilterChange}>
                  <option value="">All</option>
                  <option value="TJ">TJ</option>
                  <option value="TR">TR</option>
                  <option value="TG">TG</option>
                  <option value="IJ">IJ</option>
                  <option value="BJ">BJ</option>
                  <option value="TG">TG</option>
                </Form.Control>
              </div>
              <div className="col-md-3" controlId="searchTerm">
                <Form.Label>Search by Page Name:</Form.Label>
                <Form.Control type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Enter search term" />
              </div>
            </div>
          </Form>
          <div className='table-responsive'>
            <Table table>
              <thead>
                <tr>
                  <th className="plateformIdTh">#</th>
                  <th className="plateformNameTh">Page Name</th>
                  <th>Platform</th>
                  <th>Page Placement</th>
                  <th>Desktop Placement Width</th>
                  <th>Desktop Placement Height</th>
                  <th>Mobile Placement Width</th>
                  <th>Mobile Placement Height</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((attribute, index) => (
                  <tr key={attribute._id}>
                    <td className="plateformId bg-white">{indexOfFirstItem + index + 1}</td>
                    <td className="plateformName bg-white">{attribute.page_id.pageName}</td>
                    <td>{attribute.platform}</td>
                    <td>{attribute.page_placement}</td>
                    <td>{attribute.placement_width}</td>
                    <td>{attribute.placement_height}</td>
                    <td>{attribute.mobile_placement_width}</td>
                    <td>{attribute.mobile_placement_height}</td>
                    <td>
                      <SwitchCheckbox checked={attribute.status === 'active'} onChange={() => handleStatusToggle(attribute._id)} />
                    </td>
                    <td>
                      <Button variant="primary" onClick={() => handleEdit(attribute._id)}>
                        <img src="/akar-icons_edit.svg" width="16" height="16" className="img-fluid" alt="edit icons" />
                      </Button>
                      <Button variant="btn-outline-primary bg-transparent ms-2" onClick={() => navigate(`/activity-list/${attribute._id}`)}>
                        <img src="/mdi_eye-outline.svg" width="16" height="16" className="img-fluid" alt="View Activity" title="View Activity" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <ReactPaginate
            previousLabel={<i className="fa fa-angle-left" aria-hidden="true"></i>}
            nextLabel={<i className="fa fa-angle-right" aria-hidden="true"></i>}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>
    </Container>
  );
};

export default PageAttributesList;
