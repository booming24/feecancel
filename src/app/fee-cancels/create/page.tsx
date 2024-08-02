'use client';

import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Container, Box, TextField, Button, Typography, CircularProgress, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const CreateFeeCancel = () => {
  const [fee, setFee] = useState<string>(''); // Use string to handle input
  const [userId, setUserId] = useState<string>(''); // Use string to handle selection
  const [users, setUsers] = useState<{ iduser: string, nama_lengkap: string }[]>([]);
  const [namaLengkap, setNamaLengkap] = useState<string>(''); // State to store nama_lengkap
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/users/datauser');
        const userData = Object.keys(response.data.data).map(key => ({
          iduser: key,
          ...response.data.data[key]
        }));
        setUsers(userData);
      } catch (error) {
        setError('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const selectedUser = users.find(user => user.iduser === userId);
    setNamaLengkap(selectedUser?.nama_lengkap || '');
  }, [userId, users]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const feeValue = fee.trim();
    const userIdValue = userId.trim();

    if (feeValue === '' || userIdValue === '' || isNaN(Number(feeValue)) || isNaN(Number(userIdValue))) {
      setError('Fee and User ID must be valid numbers.');
      return;
    }

    const feeInt = parseInt(feeValue, 10);
    const userIdInt = parseInt(userIdValue, 10);

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/feecancel/store', {
        fee: feeInt,
        user_id: userIdInt,
        nama_lengkap: namaLengkap // Include nama_lengkap in the request
      });

      console.log('Response from API:', response.data); // Log response
      router.push('/fee-cancels');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error creating fee cancel:', error.response.data);
        setError('Error creating fee cancel: ' + error.response.data.message);
      } else {
        setError('Error creating fee cancel');
        console.error('Error creating fee cancel:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '10rem' }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
          Create Fee Cancel
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Fee"
              type="text"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              fullWidth
              required
              variant="outlined"
            />
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>User</InputLabel>
              <Select
                value={userId}
                onChange={(e) => setUserId(e.target.value as string)}
                label="User"
                required
              >
                {users.map((user) => (
                  <MenuItem key={user.iduser} value={user.iduser}>
                    {user.iduser} - {user.nama_lengkap}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: '1rem' }}>
            <TextField
              label="Nama Lengkap"
              type="text"
              value={namaLengkap}
              disabled
              fullWidth
              variant="outlined"
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateFeeCancel;
