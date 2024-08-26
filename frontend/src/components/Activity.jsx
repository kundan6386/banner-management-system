import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

function Activity() {
  const { id } = useParams();
  const [activityList, setActivityList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const activityPerPage = 10;
  const pagesVisited = pageNumber * activityPerPage;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/get-activity/${id}`);
        setActivityList(response.data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    };

    fetchActivity();
  }, [id]);

  const pageCount = Math.ceil(activityList.length / activityPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayActivities = activityList
    .slice(pagesVisited, pagesVisited + activityPerPage)
    .map((activity, index) => (
      <tr key={activity._id}>
        <td>{index + 1 + pagesVisited}</td>
        <td>{activity.userName}</td>
        <td>{activity.activity}</td>
        <td>{new Date(activity.createdAt).toLocaleString()}</td>
        <td>{new Date(activity.updatedAt).toLocaleString()}</td>
      </tr>
    ));

  return (
    <div className="banner-box px-0 px-md-4 px-2 pt-md-1 pb-md-3 pb-0 pt-2">
      <div className="boxLayout p-md-4 p-3 box-outline-shadow">
        <div className="d-flex justify-content-between mb-3">
          <h2>Activity</h2>
        </div>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Activity</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>{displayActivities}</tbody>
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
  );
}

export default Activity;
