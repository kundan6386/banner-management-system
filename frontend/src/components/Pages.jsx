import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import SwitchCheckbox from './SwitchCheckbox';

function Pages() {
  const [pages, setPages] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const navigate = useNavigate();
  const pagesPerPage = 10;
  const pagesVisited = pageNumber * pagesPerPage;
  const [showFilter,setShowFilter] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get('/api/page/page-list-data');
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };

    fetchPages();
  }, []);

  const handlePlatformFilterChange = (e) => {
    setPlatformFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusToggle = async (id) => {
    try {
      const updatedPages = pages.map((page) =>
        page._id === id ? { ...page, status: page.status === 'active' ? 'inactive' : 'active' } : page
      );
  
      await axios.put(`/api/page/update-status/${id}`, {
        status: updatedPages.find((page) => page._id === id).status,
      });
  
      setPages(updatedPages);
      toast.success('Page status updated successfully');
    } catch (error) {
      console.error('Error updating page status:', error);
      toast.error('Failed to update page status');
    }
  };
  

  const filterPages = (page) => {
    if (!platformFilter && !statusFilter) return true;
    if (!platformFilter) return page.status === statusFilter;
    if (!statusFilter) return page.platform === platformFilter;
    return page.platform === platformFilter && page.status === statusFilter;
  };

  const searchPages = (page) => {
    if (!searchTerm) return true;
    return page.pageName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredPages = pages.filter(filterPages).filter(searchPages);

  const pageCount = Math.ceil(filteredPages.length / pagesPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayPages = filteredPages.slice(pagesVisited, pagesVisited + pagesPerPage).map((page, index) => (
    <tr key={page._id}>
      <td className='plateformId bg-white'>{index + pagesVisited + 1}</td>
      <td className='plateformName bg-white'>{page.pageName}</td>
      <td>
        <SwitchCheckbox checked={page.status === 'active'} onChange={() => handleStatusToggle(page._id)} />
      </td>
      <td>{page.platform}</td>
      <td><a href={page.pageURL} target='_blank'>{page.pageURL}</a></td>
      <td>
        <Button variant="primary" onClick={() => handleEdit(page._id)}>
          <img src="/akar-icons_edit.svg" width="16" height="16" className="img-fluid" alt="edit icons"/>
        </Button>
      </td>
      <td>
         <Button variant="btn-outline-primary bg-transparent" onClick={() => navigate(`/activity-list/${page._id}`)}>
          <img src="/mdi_eye-outline.svg" width="16" height="16" className="img-fluid" alt="View Activity" title="View Activity"/>
        </Button>
      </td>
    </tr>
  ));

  const handleEdit = (id) => {
    navigate(`/update-page/${id}`);
  };

  return (
    <div className="banner-box px-0 px-md-4 px-2 pt-md-1 pb-md-3 pb-0 pt-2">

      <span className={`overlay d-block d-md-none  ${showFilter ? "act" : ""}`} onClick={()=>setShowFilter(false)}></span>

      <div className='d-flex justify-content-between mb-3'>
        <h2>Page List</h2>

        <div className="mob-applicationList-img d-block d-md-none" onClick={()=>setShowFilter(true)}>
          <img src="/filter-dashboard-icon.svg" width="33" height="33" className="img-fluid" alt="filter icon"/>
        </div>

      </div>
      
      <div className="boxLayout p-md-4 p-3 box-outline-shadow">
        <div className='filterPlateform'>
          <Row className={`mb-md-3 mobileActive  ${showFilter ? "active" : ""}`}>
            <span className="closeApp d-block d-md-none" onClick={()=>setShowFilter(false)}>
              <img src="/close.png" width="16" height="16" className="img-fluid" alt="close icon"/>
            </span>
            <Col md={3}>
              <Form.Group controlId="platformFilter">
                <Form.Label>Filter by Platform:</Form.Label>
                <Form.Control as="select" value={platformFilter} onChange={handlePlatformFilterChange}>
                  <option value="">All</option>
                  <option value="TJ">TJ</option>
                  <option value="TR">TR</option>
                  <option value="TG">TG</option>
                  <option value="IJ">IJ</option>
                  <option value="BJ">BJ</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="statusFilter">
                <Form.Label>Filter by Status:</Form.Label>
                <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange}>
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="searchTerm">
                <Form.Label>Search by Page Name:</Form.Label>
                <Form.Control type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Enter search term" />
              </Form.Group>
            </Col>
          </Row>
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th className='plateformIdTh'>#</th>
                  <th className='plateformNameTh'>Page Name</th>
                  <th>Status</th>
                  <th>Platform</th>
                  <th>Page URL</th>
                  <th>Edit</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>{displayPages}</tbody>
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
    </div>
  );
}

export default Pages;
