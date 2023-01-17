import React, { useState } from 'react';
import { Link, useParams, Navigate  } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_SINGLE_USER } from '../utils/queries';

import { Container, Row, Col, Button, Card, Nav, Navbar, Modal, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTrash, faCamera } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/react-fontawesome';

import Auth from '../utils/auth';


import './Profile.css';
import BookingList from './BookingList';
import OrderList from './OrderList';
import UploadImageForm from './UploadImageForm';


const Profile = () => {
    const { profileId } = useParams();

    const { data, loading, error } = useQuery( profileId ? QUERY_SINGLE_USER : QUERY_ME,
        {
          variables: { userId: profileId },
        }
      );

      console.log(data)
      const user = data?.me || data?.user || {};

      // Use React Router's `<Redirect />` component to redirect to personal profile page if username is yours
      if (Auth.loggedIn() && Auth.getProfile().data._id === profileId) {
        return <Navigate to="/me" />;
      }  

    if (loading) return <img
            src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
            className="animation"
            alt="loading"
             />;
    if (error) return <p>Error</p>;

    if (!user) {
        return (
            <Container fluid className="p-5 vh-100 d-grid place-items-center">
              <h4 className="text-center">
                You need to be logged in to see your profile page. Use the navigation
                links above to sign up or log in!
              </h4>
            </Container>
          );
      }
  
    return (
        <div className="w-auto vh-100 bg-light">
         <Card className="w-auto vh-100 bg-white">
            <Card.Header className="bg-secondary">
                <Card.Title>
                {user.firstName + " " + user.lastName}
                </Card.Title>
            </Card.Header>
      <Card.Body>
      <img id="profile-img" className="rounded-circle" variant='top' src={user.picture} alt="Profile image" />
        <Row className="pt-3">
            <Link to="/upload">
                <FontAwesomeIcon icon={faCamera}/>
            </Link>
        </Row>
        <div id="description-container" className='py-5'>
        <Card.Footer>
          {user.description}
        </Card.Footer>
        </div>
        <div id="about-title-container" className='text-left'>
        <Card.Title>About </Card.Title>
        </div>
        <div id="about-container" className='py-1 pb-5'>
        <Card.Footer>
    <Row className="align-items-center">
        <p xs={6} className="text-center">{user.email}</p>
    </Row>
    <Row className="align-items-center">
        <p xs={6} className="text-right">{user.address}, {user.postcode}</p>
    </Row>
    </Card.Footer>
        </div>
        {Auth.getProfile().data._id === user._id &&   
            <Link to="/update-user-form">
                <Button variant="primary">Edit Profile</Button>
            </Link>
        }
        { user.role === 'Nanny' && Auth.getProfile().data._id === !user._id &&
        <Button variant="secondary">Book</Button>
        }
      </Card.Body>
    </Card>
            { user.role === 'Nanny' && 
                <div className="booking-container">
                    <BookingList />
                </div>
            }
            { user.role === 'Pawrent' && 
                <div className="order-container">
                    <OrderList />
                </div>
            }
        </div>
    );
};

export default Profile;