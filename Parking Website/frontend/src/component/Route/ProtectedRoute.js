import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      element={
        loading ? (
          <div>Loading...</div>
        ) : isAuthenticated === false ? (
          <Navigate to="/login" />
        ) : isAdmin === true && user.role !== 'admin' ? (
          <Navigate to="/login" />
        ) : (
          <Component />
        )
      }
    />
  );
};

export default ProtectedRoute;
