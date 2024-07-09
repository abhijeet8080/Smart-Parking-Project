import React, { useEffect } from 'react';
import './MyOrders.css';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { Typography } from '@mui/material';
import MetaData from '../layout/MetaData';
import LaunchIcon from '@mui/icons-material/Launch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { myOrders } from '../../store/reducers/bookingSlice';
import { loadUser } from '../../store/reducers/userSlice';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, error, bookings } = useSelector((state) => state.booking);
  console.log(bookings)
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
    if (bookings.length === 0 && user) {
      dispatch(myOrders());
    }
  }, [dispatch, user, bookings]);

  const columns = [
    // Define your columns
    { field: 'id', headerName: 'Booking ID', minWidth: 300, flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) =>
        params.row.status === 'Completed' ? 'greenColor' : 'redColor',
      
    },
    {
      field: 'itemsQty',
      headerName: 'Spaces',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 150,
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/booking/${params.row.id}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows =[];
  bookings &&
  bookings.forEach((item, index) => {
      rows.push({
        itemsQty: item.bookedParkings.length,
        id: item._id,
        status: item.status,
        amount: item.totalPrice,
      });
    });
  if (loading || !user ) {
    // Render loader while loading or if user/bookings are not available
    return <Loader />;
  }

  return (
    <>
      <MetaData title={`${user.name} - Bookings`} />
      {
        loading?(<Loader />):(
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />

          <Typography id="myOrdersHeading">{user.name}'s Bookings</Typography>
        </div>
      )}
      
    </>
  );
};

export default MyOrders;
