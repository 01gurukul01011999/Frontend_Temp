'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { BarcodeIcon, LinkIcon, ShieldCheckIcon, CaretLeftIcon, CurrencyInrIcon, QrCodeIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';


export default function BarcodedPacketScan(): React.JSX.Element {
   const [open, setOpen] = React.useState(false);
   const [showModal, setShowModal] = React.useState(false);
   const [relink, setRelink] = React.useState(false);
   
     const vendors = [
       {
         name: 'Parin Polymers',
         location: 'Chandigarh',
         sizes: 9,
         price: 'Rs 2.03 per packet',
       },
       {
         name: 'Euphoria Packaging',
         location: 'Ahmedabad',
         sizes: 15,
         price: 'Rs 2.04 per packet',
       },
       {
         name: 'Global Parachem',
         location: 'Ghaziabad',
         sizes: 7,
         price: 'Rs 2.04 per packet',
       },
       {
         name: 'Shri Anand Polymers',
         location: 'Gurgaon',
         sizes: 9,
         price: 'Rs 2.04 per packet',
       },
       {
         name: 'PicknPack',
         location: 'New Delhi',
         sizes: 16,
         price: 'Rs 2.02 per packet',
       },
       {
         name: 'Pacfo',
         location: 'Surat',
         sizes: 11,
         price: 'Rs 2.03 per packet',
       },
       {
         name: 'Krishna Polymers',
         location: 'Ajmer',
         sizes: 9,
         price: 'Rs 2.01 per packet',
       },
       {
         name: 'Maruthi Plastics',
         location: 'Chennai',
         sizes: 16,
         price: 'Rs 2.05 per packet',
       }
     ];
   
   
  return (
    <Box sx={{ p: 3,  mx: 'auto', backgroundColor: '#fff' , mr:-3, ml:-3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>

        <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => history.back()}
            sx={{ mr: 1 }}
          >
            <CaretLeftIcon size={24} />
          </IconButton>
          Barcoded Packet Scan
        </Typography>
        <Button variant="outlined" onClick={() => setOpen(true)} sx={{ textTransform: 'none', borderColor: '#3b3ef5', color: '#3b3ef5' }}>
          Buy Barcoded Packets
        </Button>
      </Box>

      {/* Info Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, mb: 3, border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
        <Box sx={{flexBasis:1,  minWidth: '50px' , width: '100%', ml: 2, mt: 4 }}>
          <Image
            src="https://images.meeshosupplyassets.com/fulfillment/packet.svg"
            alt="Packet Icon"
          />
        </Box>
       <Box sx={{flexBasis:1,   minWidth: '450px', width: '100%' }}>
          <Typography fontWeight={600} sx={{ mb: 1 }}>
            Why use Barcoded Packets ?
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 14, mb: 0.5 }}>
            <ShieldCheckIcon size={25} style={{ marginRight: 6 }} />
            Barcoded packets are tamperproof and protect the shipments from fraud
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
            <CurrencyInrIcon size={25} style={{ marginRight: 6 }} />
            Enjoy up to 100% approval on RTO Claims for shipments scanned and shipped in Barcoded packets
          </Typography>
        </Box>
        <Box sx={{ flexBasis:1,  minWidth: '450px',  width: '100%' }}>
          <Typography fontWeight={600} sx={{ mb: 1 }}>
            How to Scan Barcoded Packets ?
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 14, mb: 0.5 }}>
            <BarcodeIcon size={25} style={{ marginRight: 6 }} />
            Scan the AWB barcode and packet QR using any scanning device on the laptop/computer
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
            <LinkIcon size={25} style={{ marginRight: 6 }} />
            Complete the mandatory linking of AWB & Barcoded packet QR by submitting the scan
          </Typography>
        </Box>
      </Box>

      {/* Scan Steps */}
      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Step 1 */}
          <Box sx={{ flex: 1, minWidth: '280px' }}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>Step 1</Typography>
            <TextField
              fullWidth
              label="AWB Number"
              placeholder="Scan/Type AWB Number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <BarcodeIcon size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography onMouseEnter={() => setShowModal(true)}  onMouseLeave={() => setShowModal(false)} sx={{ mt: 1, fontSize: 12, color: '#2563eb', cursor: 'pointer' }}>
              Don&apos;t have scanning device? try <strong >Scan with Mobile</strong> 
            </Typography>
          </Box>

          {/* Step 2 */}
          <Box sx={{ flex: 1, minWidth: '280px' }}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>Step 2</Typography>
            <TextField
              fullWidth
              label="Packet ID"
              placeholder=""
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <QrCodeIcon size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              sx={{ mt: 2, background: '#3b3ef5', textTransform: 'none', fontWeight: 600, float: 'right' }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>

      <Typography sx={{ mt: 2, fontSize: 12, textAlign: 'right' }}>
        To change the damaged packet, use <Box onClick={() => setRelink(true)} component="span" sx={{ color: '#3b3ef5', cursor: 'pointer' }}><strong>Re-link Packet</strong></Box>
      </Typography>
      
      {/* Modal */}
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 900,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          maxHeight: '90vh',
          overflowY: 'auto',
         
          }}
        >
          {/* Modal Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between'  }}>
            <Typography variant="h6" fontWeight={700}>
              Why use Barcoded Packets?
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ mt: -2 }}>
              <CloseIcon />
            </IconButton>
          </Box>
<Box sx={{ mt: 0, mb: 1 ,  display: 'flex',  flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'flex-start',}}>
              <Box sx={{ mr: 2 }}>
            <Image
              src="https://images.meeshosupplyassets.com/fulfillment/packet.svg"
              alt="Packet Icon"
              width={60}
              height={60}
            />
          </Box>
          {/* Benefits */}
          <Box sx={{ mt: 0 }}>
            <Typography fontSize={14}>
              ✅ Barcoded packets are tamperproof and protect the shipments from fraud.
            </Typography>
            <Typography fontSize={14} mt={1}>
              📦 It&apos;s mandatory to scan the AWB & QR code before dispatching to be eligible to raise RTO and Customer Return.
            </Typography>
          </Box>

         {/* Right: YouTube Video */}
        <Box
          sx={{
            width: 280,
            height: 120, 
            mt:-1
          }}
        >
          <iframe width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/-aDIExof4AU?list=RD-aDIExof4AU" 
          title="Shiv Bhajan - Bhakti Song" 
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; 
         picture-in-picture; web-share"  ></iframe>
        </Box>
</Box>
          <Divider sx={{ my: 1 }} />

          {/* Scanner Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 , border: '1px solid #ccc', p: 2, borderRadius: 2, mt: 2 }}>
            <Image src="https://images.meeshosupplyassets.com/fulfillment/scanning_device.svg" alt="Scanner" width={30} height={30} />
            <Typography fontSize={14}>
              To scan the packets using your Desktop/Laptop, a 2D scanning device that supports scanning of Barcode and QR Code will be needed
            </Typography>
          </Box>

          {/* Vendor Cards */}
          <Typography fontWeight={600} mt={2} mb={2}>
            Authorised Vendors
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'flex-start',
            }}
          >
            {vendors.map((vendor) => (
              <Box
                key={vendor.name}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  width: { xs: '100%', sm: '48%', md: 'calc(50% - 1rem)' },
                }}
              >
                <Typography fontWeight={600}>{vendor.name}</Typography>
                <Typography fontSize={13}>Location: {vendor.location}</Typography>
                <Typography fontSize={13}>Sizes available: {vendor.sizes}</Typography>
                <Typography fontSize={13}>Popular Size: 10x14</Typography>
                <Typography fontSize={13}>Price: {vendor.price}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    fontSize: 13,
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#eef2ff',
                      borderColor: '#6366f1',
                    },
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
      )}

 <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Barcoded Packet Scan on Mobile
        <IconButton
          aria-label="close"
          onClick={() => setShowModal(false)}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#666' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Use your smartphone to scan AWB barcode and Packet QR
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Typography fontWeight="bold" color="primary">1</Typography>
            </ListItemIcon>
            <ListItemText primary="Scan This QR Code using your smartphone" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Typography fontWeight="bold" color="primary">2</Typography>
            </ListItemIcon>
            <ListItemText primary="It will open Barcoded Packet Scan flow on your mobile browser" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Typography fontWeight="bold" color="primary">3</Typography>
            </ListItemIcon>
            <ListItemText primary="Scan the AWB barcode & Packet QR" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Typography fontWeight="bold" color="primary">4</Typography>
            </ListItemIcon>
            <ListItemText primary="Your order is linked with unique packet" />
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="center">
          <Box border={1} borderRadius={2} p={1}>
            <QrCodeIcon size={100} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>

     <Dialog open={relink} onClose={()=>setRelink(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Re-link Packet
        <IconButton
          aria-label="close"
          onClick={()=>setRelink(false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "#666" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          You can use re-link to utilise the packet of an cancelled order or to replace a damaged packet
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={2} sx={{ maxWidth: 260 }}>
            <Box
              sx={{
               
                width: 80,
                height:80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                
              }}
            >
             <Image src="https://images.meeshosupplyassets.com/fulfillment/bp_relink_step_one_dt.svg" alt="Packet Icon" width={60} height={80} />
            </Box>
            <Typography>
              Pack the product in a new Barcoded Packet and paste the label
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2} sx={{ maxWidth: 260 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image src="https://images.meeshosupplyassets.com/fulfillment/bp_relink_step_two_dt.svg" alt="Packet Icon" width={60} height={80} />
            </Box>
            <Typography>
              Scan the AWB barcode and Packet QR from new packet and confirm for re-linking
            </Typography>
          </Box>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={()=>setRelink(false)}>OK</Button>
        </Box>
      </DialogContent>
    </Dialog>


    </Box>
  );
}
