// fee-cancels/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Button,
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ref, set, onValue } from 'firebase/database'; // Import Firebase Database functions

// Define TypeScript types for fee cancel
interface FeeCancel {
  id_fee_cancels: number;
  fee: number;
  user: {
    iduser: string;
    nama_lengkap: string;
  };
}

const FeeCancels: React.FC = () => {
  const [feeCancels, setFeeCancels] = useState<FeeCancel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch data from API and sync with Firebase Realtime Database
    const fetchFeeCancels = async () => {
      try {
        const response = await axios.get<FeeCancel[]>(
          'http://localhost:8000/api/feecancel/index'
        );

        // Sync with Firebase Realtime Database
        const feeCancelsRef = ref(realtimeDb, 'feeCancels'); // Reference to 'feeCancels' node in Realtime Database
        await set(feeCancelsRef, response.data); // Set data to Realtime Database

        setFeeCancels(response.data);
      } catch (error) {
        setError('Error fetching fee cancels');
        console.error('Error fetching fee cancels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeCancels();
  }, []);

  // Listen for real-time updates from Firebase Realtime Database
  useEffect(() => {
    const feeCancelsRef = ref(realtimeDb, 'feeCancels'); // Reference to 'feeCancels' node in Realtime Database

    const unsubscribe = onValue(feeCancelsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFeeCancels(Object.values(data));
      }
    });

    return () => {
      unsubscribe(); // Clean up the subscription
    };
  }, []);

  const handleDelete = async (id_fee_cancels: number) => {
    try {
      // Use DELETE method for the destroy operation
      await axios.delete(
        `http://localhost:8000/api/feecancel/destroy/${id_fee_cancels}`
      );

      // Remove from Firebase Realtime Database
      const feeCancelsRef = ref(realtimeDb, `feeCancels/${id_fee_cancels}`);
      await set(feeCancelsRef, null);

      // Filter out the deleted fee cancel entry
      setFeeCancels(
        feeCancels.filter(
          (feeCancel) => feeCancel.id_fee_cancels !== id_fee_cancels
        )
      );
    } catch (error) {
      setError('Error deleting fee cancel');
      console.error('Error deleting fee cancel:', error);
    }
  };

  const handleEdit = (id_fee_cancels: number) => {
    router.push(`/fee-cancels/${id_fee_cancels}/edit`);
  };

  const handleCreate = () => {
    router.push('/fee-cancels/create');
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          marginTop: '10rem',
        }}
      >
        <Typography variant="h4">Fee Cancels</Typography>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create New Fee Cancel
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && (
        <TableContainer component={Paper} sx={{ backgroundColor: 'white' }}>
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
                  <TableRow key={feeCancel.id_fee_cancels}>
                    <TableCell>{feeCancel.id_fee_cancels}</TableCell>
                    <TableCell>{feeCancel.fee}</TableCell>
                    <TableCell>{feeCancel.user?.iduser || 'N/A'}</TableCell>
                    <TableCell>
                      {feeCancel.user?.nama_lengkap || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(feeCancel.id_fee_cancels)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(feeCancel.id_fee_cancels)}
                        style={{ marginLeft: '1rem' }}
                      >
                        Delete
                      </Button>
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
