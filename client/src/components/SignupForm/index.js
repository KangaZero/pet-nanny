import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';

const SignupForm = () => {
  // set initial form state
  const [userFormData, setUserFormData] = useState(
    {
      firstName: '',
      lastName: '',
      address: '',
      postcode: '',
      role: 'Pawrent',
      email: '',
      password: ''
    });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER)

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value })
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.createUser.token);

    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      firstName: '',
      lastName: '',
      address: '',
      postcode: '',
      role: '',
      email: '',
      password: ''
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group>
          <Form.Label htmlFor='first-name'>First Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your First Name'
            name='firstName'
            onChange={handleInputChange}
            value={userFormData.firstName}
            required
          />
          <Form.Control.Feedback type='invalid'>Please enter your first name!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mt-3'>
          <Form.Label htmlFor='last-name'>Last Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your Last Name'
            name='lastName'
            onChange={handleInputChange}
            value={userFormData.lastName}
            required
          />
          <Form.Control.Feedback type='invalid'>Please enter your last name!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mt-3'>
          <Form.Label htmlFor='address'>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='29 Example Street'
            name='address'
            onChange={handleInputChange}
            value={userFormData.address}
            required
          />
          <Form.Control.Feedback type='invalid'>Address is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mt-3'>
          <Form.Label htmlFor='postcode'>Postcode</Form.Label>
          <Form.Control
            type='number'
            placeholder='e.g. 2000'
            name='postcode'
            onChange={handleInputChange}
            value={userFormData.postcode}
            required
          />
          <Form.Control.Feedback type='invalid'>Postcode is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mt-3'>
          <Form.Label htmlFor='role'>Role</Form.Label>
          <Form.Select
          name='role'
          onChange={handleInputChange}
          value={userFormData.role}
          required>
            <option>Pawrent</option>
            <option>Nanny</option>
          </Form.Select>
          
        </Form.Group>

        <Form.Group className='mt-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='sarah@example.com'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mt-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.firstName && userFormData.lastName && userFormData.email && userFormData.password && userFormData.address && userFormData.role && userFormData.postcode)}
          type='submit'
          variant='primary'
          className='mt-3'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;