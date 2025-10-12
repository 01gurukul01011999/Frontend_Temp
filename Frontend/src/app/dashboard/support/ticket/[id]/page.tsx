"use client";
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Typography, Button, Paper, Tabs, Tab, Avatar } from '@mui/material';
import mockTickets from '@/lib/mock-tickets';

export default function TicketPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const ticket = mockTickets.find((t) => t.id === id);

  React.useEffect(() => {
    console.debug('TicketPage mounted, params id=', id);
  }, [id]);

  if (!ticket) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Ticket not found</Typography>
        <Button onClick={() => router.back()} sx={{ mt: 2 }}>Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 , backgroundColor: '#ffffff', ml: -3, mr: -3, }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Support</Typography>
    
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, }}
       
      >
      <Box component="span"  onClick={() => router.push('/dashboard/support?support=my-tickets&sub=all')}
        role="link" sx={{":hover": { textDecoration: "underline" , color: "#0300bdff" , cursor: "pointer" ,}  }} >My Tickets</Box>  &gt; {ticket.id}
      </Typography>
     

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 2, mt: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{ticket.issue}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Created on {new Date(ticket.createdOn).toLocaleString()}</Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'inline-block', background: '#e6fff2', color: '#2e7d32', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700 }}>{ticket.status}</Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Sub Order Number</Typography>
                <Typography sx={{ fontWeight: 700, mt: 0.5 }}>88796286744663360_1</Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Packet ID</Typography>
                <Typography sx={{ mt: 0.5 }}>DLVPCS156252762</Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Callback Number</Typography>
                <Typography sx={{ mt: 0.5 }}>9911269944</Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">State of the packet</Typography>
              <Typography sx={{ mt: 1 }}>Intact</Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Barcode Image</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Avatar variant="rounded" src="/public/uploads/1750940808101-258456.jpeg" sx={{ width: 72, height: 72 }} />
                  <Avatar variant="rounded" src="/public/uploads/1750945708832-985645.jpeg" sx={{ width: 72, height: 72 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Updates</Typography>
          <Box sx={{ mt: 1 }}>
            {[{ date: '3', month: 'DEC', text: ticket.lastUpdate ?? 'Your claim payment of Rs 1521.04 for this order was done on 03 Dec 2024 with a transaction id: IN6ON241203046NK', time: '05:11 PM' }, { date: '2', month: 'DEC', text: 'Your claim of Rs.1521.036 for this order has been scheduled on 03 Dec 2024. As per the updated Platform policy no Reverse Shipping Charges will be ...', time: '12:30 PM' }, { date: '28', month: 'NOV', text: 'Meesho support agent will share an update within 3 hours', time: '07:02 PM' }].map((u, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 1, borderBottom: '1px dashed #eee' }}>
                <Box sx={{ border: '1px solid #6b46c1', color: '#6b46c1', borderRadius: 1, width: 48, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontWeight: 700 }}>{u.date}</Typography>
                  <Typography sx={{ fontSize: 11 }}>{u.month}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13 }}>{u.text.length > 120 ? `${u.text.slice(0, 120)}...` : u.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{u.time}</Typography>
                  {u.text.length > 120 && <Button size="small">Show more</Button>}
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => router.back()}>Back to list</Button>
      </Box>
    </Box>
  );
}
