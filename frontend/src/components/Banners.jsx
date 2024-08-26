import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { BsPencil } from 'react-icons/bs'; 
import { useNavigate } from 'react-router-dom';
import SwitchCheckbox from './SwitchCheckbox';

function Banners() {
  const [banners, setBanners] = useState([]);
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const navigate = useNavigate();
  const bannersPerPage = 10;
  const pagesVisited = pageNumber * bannersPerPage;

  const [showFilter,setShowFilter] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('/api/users/banner-list');
        const formattedBanners = response.data.map((banner) => ({
          ...banner,
          startDate: formatDate(banner.startDate),
          endDate: formatDate(banner.endDate),
        }));
        setBanners(formattedBanners);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
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

  const filterBanners = (banner) => {
    if (!platformFilter && !statusFilter) return true;
    if (!platformFilter) return banner.status === statusFilter;
    if (!statusFilter) return banner.platform === platformFilter;
    return banner.platform === platformFilter && banner.status === statusFilter;
  };

  const searchBanners = (banner) => {
    if (!searchTerm) return true;
    return banner.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const handleStatusToggle = async (id) => {
    const updatedBanners = banners.map((banner) =>
      banner._id === id ? { ...banner, status: banner.status === 'active' ? 'inactive' : 'active' } : banner
    );
    setBanners(updatedBanners);
    try {
      await axios.put(`/api/users/update-banner-status/${id}`, {
        status: updatedBanners.find((banner) => banner._id === id).status,
      });
      toast.success('Banner status updated successfully');
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if dateString is null or undefined
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
    return formattedDate;
  };

  const filteredBanners = banners.filter(filterBanners).filter(searchBanners);

  const pageCount = Math.ceil(filteredBanners.length / bannersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayBanners = filteredBanners.slice(pagesVisited, pagesVisited + bannersPerPage).map((banner, index) => (
    <tr key={banner._id}>
      <td className="plateformId bg-white">{index + 1}</td>
      <td className="plateformName bg-white"><div><img src={'/tractor-icon.svg'} width="30" height="27" className="img-fluid me-1" alt="Brand Logo" /> {banner.title}</div></td>
          {/* <td>
            {banner.desktopImage && (
              <img
                src={`${banner.desktopImage}`} // Adjusted path with 'public'
                alt={banner.title}
                className="img-fluid"
                style={{ maxWidth: '100px', maxHeight: '100px' }}
                onError={(e) => console.error('Error loading image:', e)}
              />
            )}
          </td>
        <td>
        {banner.mobileImage && (
            <img
            src={`${banner.mobileImage}`} // Adjusted path with 'public'
            alt={banner.title}
            className="img-fluid"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
            onError={(e) => console.error('Error loading image:', e)}
            />
        )}
        </td> */}

      {/* <td>{banner.position}</td> */}
      <td>{banner.page.pageName}</td>
      <td>{banner.startDate}</td>
      <td>{banner.endDate}</td>
      <td>
        {/* <Button onClick={() => handleStatusToggle(banner._id)} variant={banner.status === 'active' ? 'success' : 'danger'}>
          {banner.status === 'active' ? 'Active' : 'Inactive'}
        </Button> */}

        <SwitchCheckbox checked={banner.status === 'active' ? true : false} onChange={() => handleStatusToggle(banner._id)}/>
      </td>
      <td>{banner.platform}</td>
      <td>
        <Button variant="primary" onClick={() => handleEdit(banner._id)}>
          {/* <BsPencil /> */}
          <img src="/akar-icons_edit.svg" width="16" height="16" class="img-fluid" alt="edit icons"/>
        </Button>
        <Button variant="btn-outline-primary bg-transparent ms-2" onClick={() => navigate(`/activity-list/${banner._id}`)}>
                <img src="/mdi_eye-outline.svg" width="16" height="16" class="img-fluid" alt="View Activity" title="View Activity"/>
          </Button>
      </td>
    </tr>
  ));

  const handleEdit = (id) => {
    navigate(`/update-banner/${id}`);
  };

  return (
    <div className="banner-box px-0 px-md-4 px-2 py-md-3 pb-0 pt-3">
      <span className={`overlay d-block d-md-none  ${showFilter ? "act" : ""}`} onClick={()=>setShowFilter(false)}></span>
      <div class="d-flex justify-content-between mb-3">
        <h2>Banner List</h2>
        <div class="mob-applicationList-img d-block d-md-none" onClick={()=>setShowFilter(true)}>
          <img src="/filter-dashboard-icon.svg" width="33" height="33" class="img-fluid" alt="filter icon"/>
        </div>
      </div>
      <div className='boxLayout p-md-4 p-3 box-outline-shadow'>
        <div className='filterPlateform'>
          <div className={`mb-md-3 row mobileActive  ${showFilter ? "active" : ""}`}>
            <span class="closeApp d-block d-md-none" onClick={()=>setShowFilter(false)}>
              <img src="/close.png" width="16" height="16" class="img-fluid" alt="close icon" />
            </span>
            <Col md={3}>
              <Form.Group controlId="platformFilter">
                <Form.Label>Filter by Platform:</Form.Label>
                <Form.Control as="select" className='formSelect' value={platformFilter} onChange={handlePlatformFilterChange}>
                  <option value="">All</option>
                  <option value="TJ">TJ</option>
                  <option value="TR">TR</option>
                  <option value="TG">TG</option>
                  <option value="IJ">IJ</option>
                  <option value="BJ">BJ</option>
                  <option value="TG">TG</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="statusFilter">
                <Form.Label>Filter by Status:</Form.Label>
                <Form.Control as="select" className='formSelect' value={statusFilter} onChange={handleStatusFilterChange}>
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="searchTerm">
                <Form.Label>Search by Title:</Form.Label>
                <Form.Control type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Enter search term" />
              </Form.Group>
            </Col>
          </div>
          <div class="table-responsive">
            <Table table>
              <thead>
                <tr>
                  <th className="plateformIdTh">#</th>
                  <th className="plateformNameTh">Title</th>
                  {/* <th>Desktop Image</th>
                  <th>Mobile Image</th> */}
                  {/* <th>Position</th> */}
                  <th>Page Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Platform</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>{displayBanners}</tbody>
            </Table>
          </div>
          <ReactPaginate
            previousLabel={<i class="fa fa-angle-left" aria-hidden="true"></i>}
            nextLabel={<i class="fa fa-angle-right" aria-hidden="true"></i>}
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

export default Banners;
