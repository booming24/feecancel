'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

// Define TypeScript types for fee cancel
interface FeeCancel {
  id: string;
  fee: string; // Jika `fee` disimpan sebagai string di Firebase
  nama_lengkap: string;
  user_id: string;
}

const FeeCancels: React.FC = () => {
  const [feeCancels, setFeeCancels] = useState<FeeCancel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFeeCancels = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/feecancel/index');
        
        const data: {[key: string]: FeeCancel} = response.data;
        const feeCancelArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        setFeeCancels(feeCancelArray);
      } catch (error) {
        setError('Error fetching fee cancels');
        console.error('Error fetching fee cancels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeCancels();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.get(`http://localhost:8000/api/feecancel/destroy/${id}`);
      setFeeCancels(feeCancels.filter((feeCancel) => feeCancel.id !== id));
    } catch (error) {
      setError('Error deleting fee cancel');
      console.error('Error deleting fee cancel:', error);
    }
  };
  

  const handleEdit = (id: string) => {
    router.push(`/fee-cancels/${id}/edit`);
  };

  const handleCreate = () => {
    router.push('/fee-cancels/create');
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '10rem' }}>
        <Typography variant="h4">Fee Cancels</Typography>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create New Fee Cancel
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeCancels.length > 0 ? (
                feeCancels.map((feeCancel) => (
                  <TableRow key={feeCancel.id}>
                    <TableCell>{feeCancel.id}</TableCell>
                    <TableCell>{feeCancel.fee}</TableCell>
                    <TableCell>{feeCancel.user_id}</TableCell>
                    <TableCell>{feeCancel.nama_lengkap}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleEdit(feeCancel.id)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(feeCancel.id)} style={{ marginLeft: '1rem' }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default FeeCancels;
