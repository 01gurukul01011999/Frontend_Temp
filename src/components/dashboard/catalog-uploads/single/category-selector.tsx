'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRef } from "react";
import { useUser } from '@/hooks/use-user';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoIcon from '@mui/icons-material/Info';
import {
	Box,
	Typography,
	Button,
	Paper,
	ListItemButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Stepper, Step, StepLabel,
	Link,
	Divider
} from '@mui/material';
import { flex, styled } from "@mui/system";
import categoryTree, { CategoryNode } from '../bulk/category-tree';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getSiteURL } from '@/lib/get-site-url';
import Isvg from './isvg';
import PlusSvg from './plus-svg';
import DownloadSvg from './download-svg';
import UploadSvg from './upload-svg';


const steps = ["Select Category", "Add Product Details"];

interface CustomStepIconRootProps {
  active?: boolean;
}

const CustomStepIconRoot = styled("div")<CustomStepIconRootProps>(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  backgroundColor: active ? "rgba(99, 102, 241, 0.1)" : "#f0f0f0",
  color: active ? "#6366f1" : "#9e9e9e",
  fontWeight: 600,
  fontSize: 14,
  border: `1px solid ${active ? "#6366f1" : "#ccc"}`
}));

interface CustomStepIconProps {
  active?: boolean;
  completed?: boolean;
  icon?: React.ReactNode;
}

function CustomStepIcon(props: CustomStepIconProps) {
  const { active, completed, icon } = props;
  return <CustomStepIconRoot active={!!active}>{icon}</CustomStepIconRoot>;
}

// Helper to flatten category tree into array of full paths
function getAllCategoryPaths(tree: Record<string, unknown>, prefix: string[] = []): string[][] {
	let paths: string[][] = [];
	for (const key in tree) {
		if (tree[key] === null) {
			paths.push([...prefix, key]);
		} else if (typeof tree[key] === 'object') {
			paths = [...paths, ...getAllCategoryPaths(tree[key] as Record<string, unknown>, [...prefix, key])];
		}
	}
	return paths;
}

export default function CategorySelector(): React.JSX.Element {
	const [popupOpen, setPopupOpen] = useState(false);
	const [intropopupOpen, setIntroPopupOpen] = useState(false);
	const [selectedImages, setSelectedImages] = useState<Array<{ url: string }>>([]);

	const imageTypeList = [
		{ label: 'Watermark image', icon: '/assets/invalid-image-1.png' },
		{ label: 'Fake branded/1st copy', icon: '/assets/invalid-image-2.png' },
		{ label: 'Image with price', icon: '/assets/invalid-image-3.png' },
		{ label: 'Pixelated image', icon: '/assets/invalid-image-4.png' },
		{ label: 'Inverted image', icon: '/assets/invalid-image-5.png' },
		{ label: 'Blur/unclear image', icon: '/assets/invalid-image-6.png' },
		{ label: 'Incomplete image', icon: '/assets/invalid-image-7.png' },
		{ label: 'Stretched/shrunk image', icon: '/assets/invalid-image-8.png' },
		{ label: 'Image with props', icon: '/assets/invalid-image-9.png' },
		{ label: 'Image with text', icon: '/assets/invalid-image-10.png' },
	];

	const handleRemoveImage = (idx: number) => {
		setSelectedImages(images => images.filter((_, i) => i !== idx));
	};
	const handleAddProduct = () => {
		inputRef.current?.click();
	};
	const handleContinue = () => {
		setPopupOpen(false);
		setActiveStep(1);
		// Map selected images to slots in order
		setSlotImages(prev => {
			const newSlots = { ...prev };
			selectedImages.forEach((img, idx) => {
				if (imageSlots[idx]) newSlots[imageSlots[idx].key] = img.url;
			});
			return newSlots;
		});
		setSelectedImages([]);
	};
	const handleClose = () => setPopupOpen(false);
	
	 const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
	 const [activeStep, setActiveStep] = React.useState(0);
	// Removed duplicate inputRef declaration to fix redeclaration error.

	// Removed duplicate handleImageChange function to fix redeclaration error.

	// Inject loader CSS for the spinner animation
	React.useEffect(() => {
		if (typeof globalThis !== 'undefined' && !globalThis.document?.querySelector('#category-selector-loader-style')) {
			const loaderStyle = globalThis.document?.createElement('style');
			if (loaderStyle) {
				loaderStyle.id = 'category-selector-loader-style';
				loaderStyle.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
				globalThis.document?.head?.append(loaderStyle);
			}
		}
	}, []);
	const [uploadTab, setUploadTab] = useState<'files' | 'links'>('files');
	//const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [selectionPath, setSelectionPath] = useState<string[]>([]);
	// For Autocomplete
	const allCategoryPaths = React.useMemo(() => getAllCategoryPaths(categoryTree), []);
	const [searchValue, setSearchValue] = useState<string>('');
	
console.log('uploadimages', uploadedImages);
	const { user } = useUser();
	// Upload images to backend
	const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB
	const handleGenerateTemplate = async () => {
		if (uploadedImages.length === 0) return;
		// Helper to compress a base64 image string and return a File with the original name
		// We'll keep a mapping of uploadedImages to their original file names
		// So, uploadedImages: string[] and uploadedImageNames: string[]
		// If uploadedImageNames is not available, fallback to previous behavior
		const compressBase64ToFile = (base64: string, name: string): Promise<File> => {
			return new Promise((resolve, reject) => {
				const img = new globalThis.Image();
				img.addEventListener('load', () => {
					const canvas = globalThis.document?.createElement('canvas');
					if (!canvas) return reject('Canvas context error');
					let width = img.width;
					let height = img.height;
					const maxDim = 1024;
					if (width > maxDim || height > maxDim) {
						if (width > height) {
							height = Math.round((height * maxDim) / width);
							width = maxDim;
						} else {
							width = Math.round((width * maxDim) / height);
							height = maxDim;
						}
					}
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext('2d');
					if (!ctx) return reject('Canvas context error');
					ctx.drawImage(img, 0, 0, width, height);
					canvas.toBlob(
						blob => {
							if (!blob) return reject('Compression failed');
							// Use the original file name, but force .jpg extension
							let fileName = name;
							if (!fileName.toLowerCase().endsWith('.jpg') && !fileName.toLowerCase().endsWith('.jpeg')) {
								fileName = fileName.replace(/\.[^/.]+$/, '') + '.jpg';
							}
							const file = new File([blob], fileName, { type: 'image/jpeg' });
							resolve(file);
						},
						'image/jpeg',
						0.7
					);
				});
				img.addEventListener('error', reject);
				img.src = base64;
			});
		};

		// We'll need to keep track of the original file names when uploading
		// So, let's assume uploadedImageNames: string[] is available and kept in sync with uploadedImages
		// If not, fallback to old behavior
	const imageNames = (globalThis as { uploadedImageNames?: string[] }).uploadedImageNames as string[] | undefined;
	let selectedFiles: File[] = [];
		selectedFiles = Array.isArray(imageNames) && imageNames.length === uploadedImages.length
			? await Promise.all(uploadedImages.map((img, idx) => compressBase64ToFile(img, imageNames[idx])))
			: await Promise.all(uploadedImages.map((img, idx) => compressBase64ToFile(img, `image_${idx + 1}.jpg`)));

		// Calculate total size after compression
		let totalSize = 0;
		for (const file of selectedFiles) {
			totalSize += file.size;
		}
		if (totalSize > MAX_TOTAL_SIZE) return alert('Total compressed image size exceeds 5MB. Please upload fewer or smaller images.');

		const formData = new FormData();
		for (const file of selectedFiles) {
			formData.append('images', file);
		}
		if (user && user.id) {
			formData.append('uploaderId', user.id);
		}
		// Optionally add more fields to formData here
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/bulkImgupload`, {
				method: 'POST',
				body: formData,
			});
			if (res.ok) {
				setUploadPopupOpen(false);
				setUploadedImages([]);
				// Optionally show a success message
			} else {
				alert('Upload failed');
			}
		} catch {
			alert('Upload error');
		}
	};
 
	const handleSelect = (level: number, value: string) => {
		const newPath = [...selectionPath.slice(0, level), value];
		setSelectionPath(newPath);
		//console.log('Path', newPath[3]);
	};

	const columns = [];
	let currentTree: CategoryNode | null = categoryTree;
	//console.log('currentTree', currentTree);

	for (let level = 0; level < 4; level++) {
		if (currentTree === undefined) break;
		if (currentTree === null) break;
		if (typeof currentTree !== 'object') break;
		const options = Object.keys(currentTree);
		if (options.length === 0) break;
		console.log('currentTree', currentTree);
		columns.push(
			<Box key={level} sx={{ width: 200, mr: 2, overflowY: 'auto', maxHeight: '58vh' }}>
				{options.map((opt) => (
					<ListItemButton
						key={opt}
						selected={selectionPath[level] === opt}
						onClick={() => handleSelect(level, opt)}
						sx={{
							bgcolor: selectionPath[level] === opt ? '#00038A' : '#fff',
							color: selectionPath[level] === opt ? '#fff' : '#000',
							mb: 0,
							borderBottom: '1px solid #ccc',
							borderRadius: 0,
							'&.Mui-selected': {
								bgcolor: '#00038A',
								color: '#fff',
								'&:hover': {
									bgcolor: '#00038A',
									color: '#fff',
								},
							},
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
							<span>{opt}</span>
							{selectionPath[level] === opt && (
								<ArrowForwardIosIcon sx={{ fontSize: 16, ml: 1 }} />
							)}
						</Box>
					</ListItemButton>
				))}
			</Box>
		);
		currentTree = currentTree?.[selectionPath[level]] ?? null;
	}

	// Helper to check if the current selection is a leaf (null) in the original tree
	function isLeaf(tree: CategoryNode, path: string[]): boolean {
		let node: CategoryNode | null = tree;
		for (const p of path) {
			if (!node || typeof node !== 'object') return false;
			node = node[p] ?? null;
		}
		return node === null && path.length > 0;
	}

const url =getSiteURL();
//console.log(url+'assets/woemns category.png');
	// Show right panel ONLY if the selected path is a leaf in the original categoryTree
	const showRightPanel = selectionPath.length > 0;


	const [imageGuidelinesPopupOpen, setImageGuidelinesPopupOpen] = useState(false);
	

	const inputRef = React.useRef<HTMLInputElement>(null);

	// Handler for file input change
	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const fileArray = Array.from(files);
			Promise.all(
				fileArray.map(file => {
					return new Promise<{ url: string }>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => {
							if (typeof reader.result === 'string') {
								resolve({ url: reader.result });
							} else {
								reject('Failed to read file');
							}
						};
						reader.onerror = reject;
						reader.readAsDataURL(file);
					});
				})
			).then((images) => {
				setSelectedImages(prev => [...prev, ...images]);
				setPopupOpen(true);
			});
		}
	};

	// Define the slots for product images
	const imageSlots = [
	  { key: 'front1', label: 'Front View *', desc: 'Upload Front View Image' },
	  { key: 'front2', label: 'Front View *', desc: 'Upload Front View Image' },
	  { key: 'back1', label: 'Back View *', desc: 'Upload Back View Image' },
	  { key: 'back2', label: 'Back View *', desc: 'Upload Back View Image' },
	  { key: 'size', label: 'Size Chart *', desc: 'Size chart size wise body measurements should be given.' },
	];

	// State to hold images for each slot
	const [slotImages, setSlotImages] = useState<{ [key: string]: string | null }>({
	  front1: null,
	  front2: null,
	  back1: null,
	  back2: null,
	  size: null,
	});

	return (<>
		{/* Trigger for demo: open popup when clicking first image 
		<Button onClick={handleOpenPopup} sx={{ mb: 2 }}>Open Product Images Popup</Button>
*/}
		
	<Box sx={{ px: 3, pt: 2, background: '#fff' , mt:-3, width:'100%' , mb:2, ml:0, mr:0 , pb:1 , display: 'flex' }}>

			<Stepper
				activeStep={activeStep}
				alternativeLabel={false}
				sx={{
					background: 'transparent',
					"& .MuiStepLabel-label": {
						fontSize: "12px",
						fontWeight: 500,
						color: "#888",
					},
					"& .MuiStepLabel-label.Mui-active": {
						color: "#4d0aff",
						fontWeight: 700,
					},
					"& .MuiStepIcon-root": {
						background: "#f5f6ff",
						color: "#4d0aff",
						borderRadius: "50%",
						width: 25,
						height: 25,
						fontSize: "12px",
						border: "none",
						boxShadow: "none",
					},
					"& .MuiStepIcon-root.Mui-active": {
						background: "rgba(99,102,241,0.1)",
						color: "#4d0aff",
						fontWeight: 700,
						border: "none",
					},
					"& .MuiStepConnector-root": {
						top: 16,
					},
					"& .MuiStepConnector-line": {
						borderColor: "#e0e7ff",
						borderTopWidth: 2,
					},
					"& .MuiStepper-root": {
						borderBottom: "2px solid #4d0aff",
						paddingBottom: "2px",
						justifyContent: "flex-start",
					},
				}}
			>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<Box sx={{ position: 'absolute', right: 0, marginRight:8, mt: -1 }}>
          <Button
            startIcon={<HeadsetMicIcon />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderColor: '#4d0aff',
              color: '#4d0aff', 
              fontWeight: 600,
              backgroundColor: 'white',
            }}
          >
            Need Help?
          </Button>
        </Box>
		</Box>
	
	
	<Box sx={{ display: 'flex', flexDirection: 'row', p:1 , maxheight:'500px', mb:10, overflowY: 'auto', overflowX: 'hidden' }}>
			
			
			
			
			{/* Left: Search and category columns */}
			<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
				<Autocomplete
					options={allCategoryPaths}
					getOptionLabel={option => option.join(' > ')}
					value={selectionPath.length > 0 ? selectionPath : null}
					onChange={(_, newValue) => {
						if (Array.isArray(newValue)) {
							setSelectionPath(newValue);
							setSearchValue(newValue.at(-1) || '');
						}
					}}
					inputValue={searchValue}
					onInputChange={(_, newInputValue, reason) => {
						// Only update searchValue if user is typing, not on selection
						if (reason === 'input') setSearchValue(newInputValue);
						if (reason === 'clear') setSearchValue('');
					}}
					renderInput={params => (
						<TextField
							{...params}
							placeholder="Search category..."
							size="small"
							sx={{ mb: 2, width: 420, borderRadius: 0.5, '& .MuiOutlinedInput-root': { borderRadius: 0.5 } }}
						/>
					)}
					isOptionEqualToValue={(opt, val) => Array.isArray(opt) && Array.isArray(val) && opt.join('/') === val.join('/')}
					sx={{ mb: 2, width: 420, borderRadius: 2, boxShadow: 0 }}
					filterOptions={(options, { inputValue }) => {
						// Only show options if input has at least 3 characters
						if (!inputValue || inputValue.length < 3) return [];
						return options.filter(opt => opt.join(' > ').toLowerCase().includes(inputValue.toLowerCase()));
					}}
					renderOption={(props, option) => {
						// Find the match index for bolding
						//const label = option.join(' > ');
						//const lowerLabel = label.toLowerCase();
						//const lowerInput = inputValue.toLowerCase();
						//const matchIndex = lowerLabel.indexOf(lowerInput);
						// Removed unused variable 'main'.
						// Show last part as main, rest as path
						const last = option.at(-1);
						const path = option.slice(0, -1).join(' > ');
						return (
							<li {...props} style={{ alignItems: 'flex-start', paddingTop: 8, paddingBottom: 8, display: 'block' }}>
								<div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>{last}</div>
								<div style={{ color: '#6b6b6b', fontSize: 10, marginTop: 2 }}>
									{path && (
										<>
											<span style={{ fontWeight: 400, color: '#888', fontSize: 10 }}>{path}</span>
											<span style={{ color: '#888' }}> &gt; </span>
										</>
									)}
									<span style={{ fontWeight: 500 }}>{last}</span>
								</div>
							</li>
						);
					}}
				/>
				{/* Dynamic category columns with vertical and horizontal scroll */}
	<Box sx={{ display: 'flex', overflowY: 'auto', overflowX: 'hidden', maxHeight: '600px', width: '100%' }}>{columns}</Box>
			</Box>

			{/* Right Panel */}
			{showRightPanel && (
			<Box sx={{ width: '30%',mt:8, minWidth: 300, ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          
					<Paper sx={{ p: 2, mb: 2 }}>
						<Box sx={{backgroundColor:'#C4C4C4' , padding:1, width:'auto', mt:-2, mr:-2, ml:-2 , mb:2}}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{selectionPath.join(' / ')}
					</Typography>
					</Box>
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mb: 2 }}>
								<Image src={url + 'assets/woemns category.png'} alt="woemns category" width={200} height={120} style={{ width: '200px', height: 'auto' }} />
							</Box>
						<Typography variant="body1" fontWeight="medium" gutterBottom>
								Please provide only front image for each product
							</Typography>
						

 {/* Add Product Button */}
	<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mb: 2, mt: 2 }}>
	<Button
		variant="contained"
		startIcon={<AddPhotoAlternateIcon />}
		sx={{
			backgroundColor: "#6C63FF",
			borderRadius: "8px",
			textTransform: "none",
			px: 3,
			py: 1.2,
			fontWeight: 600,
			"&:hover": { backgroundColor: "#5a52d1" }
		}}
		onClick={handleAddProduct}
	>
		Add Product Images
	</Button>
		<input
	type="file"
	accept="image/*"
	multiple
	ref={inputRef}
	style={{ display: 'none' }}
	onChange={handleImageChange} // your handler for selected image
/>
	</Box>

      <Box
        sx={{
          backgroundColor: "#FFF8E1",
          border: "1px solid #FFE082",
          borderRadius: "8px",
          p: 1,
          
          textAlign: "left"
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold",  display: "flex", alignItems: "center" }}>
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#FFC107",
              mr: 1
            }}
          />
          Follow guidelines to reduce quality check failure
        </Typography>
</Box>
<Box sx={{ mt: 2, mb: 2 }}>
  {/* General Guidelines */}
  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
    General Guidelines
  </Typography>
  <Box sx={{ mb: 2 }}>
	{[
	  "You can add minimum 1 and maximum 9 products to create a catalog",
	  "Upload the products from the same category that you have chosen"
	].map((text, idx) => (
	  <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
		<Box
		  sx={{
			width: 24,
			height: 24,
			borderRadius: "50%",
			background: "#f5f6ff",
			color: "#4d0aff",
			fontWeight: 700,
			fontSize: 16,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			mr: 1,
			mt: "2px"
		  }}
		>
		  {idx + 1}
		</Box>
		<Typography variant="body2" sx={{ color: "#222", fontWeight: 500 }}>
		  {text}
		</Typography>
	  </Box>
	))}
  </Box>

  {/* Image Guidelines */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      Image Guidelines
    </Typography>
	<Link
	  href="#"
	  underline="hover"
	  sx={{ fontWeight: 700, color: "#3a08c7", fontSize: "14px", ml: 2 }}
	  onClick={e => {
		e.preventDefault();
		setImageGuidelinesPopupOpen(true);
	  }}
	>
	  View Full Image Guidelines
	</Link>
	<Dialog
	  open={!!imageGuidelinesPopupOpen}
	  onClose={() => setImageGuidelinesPopupOpen(false)}
	  maxWidth="sm"
	  fullWidth
	>
	  <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
      Image Guidelines
    </Typography>
    <IconButton
      aria-label="close"
      onClick={() => setImageGuidelinesPopupOpen(false)}
      sx={{ color: '#222' }}
      size="small"
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <Divider sx={{ mb: 2 }} />
    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
      Image format
    </Typography>
    <ul style={{ marginLeft: 16, marginBottom: 16 }}>
      <li>
        We only accept <strong>.JPEG</strong> images. Any other format is not accepted.
      </li>
      <li>
        We accept Images only in <strong>RGB color space</strong>. We don’t accept images in CMYK or any other color space.
      </li>
    </ul>
    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
      Following Images will be rejected
    </Typography>
    <ul style={{ marginLeft: 16, marginBottom: 16 }}>
      <li>Graphic/ Inverted/ Pixelated image are not accepted.</li>
      <li>Images with text/Watermark are not acceptable in primary images.</li>
      <li>Blur images and clutter images are not accepted.</li>
      <li>Images should not contain price/brand logo for the product.</li>
      <li>Product images must not be shrunk, elongated or stretched.</li>
      <li>Partial product image is not allowed.</li>
      <li>Offensive/Objectionable images/products are not acceptable.</li>
    </ul>
    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
      Image standards
    </Typography>
    <ul style={{ marginLeft: 16 }}>
      <li>Solo product image without any props.</li>
      <li>Product image should not have any text.</li>
    </ul>
  </DialogContent>
</Dialog>
  </Box>
  <Box>
	{[
	  "Images with text/Watermark are not acceptable in primary images",
	  "Product image should not have any text",
	  "Please add solo product image without any props"
	].map((text, idx) => (
	  <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
		<Box
		  sx={{
			width: 24,
			height: 24,
			borderRadius: "50%",
			background: "#f5f6ff",
			color: "#4d0aff",
			fontWeight: 700,
			fontSize: 16,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			mr: 1,
			mt: "2px"
		  }}
		>
		  {idx + 1}
		</Box>
		<Typography variant="body2" sx={{ color: "#222", fontWeight: 500 }}>
		  {text}
		</Typography>
	  </Box>
	))}
  </Box>
</Box>






						</Paper>
				</Box>
			)}

			{/* Popup */}
			<Dialog open={intropopupOpen} onClose={() => setIntroPopupOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>
					<Typography sx={{ fontSize: 14, fontWeight: 600, color: 'red' }}>
						NEW
					</Typography>
					Introducing Prefilled Templates
				</DialogTitle>
				<DialogContent>
					<Image
						src="https://via.placeholder.com/400x150?text=Template+Preview"
						alt="template preview"
						width={400}
						height={150}
						style={{ width: '100%', borderRadius: 8 }}
					/>
					<Typography variant="body2" sx={{ mt: 2 }}>
						705 Add <strong>Front images</strong> of your product.<br />
						705 Get a pre-filled template, quickly add variants, review and enjoy faster catalog bulk uploads.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIntroPopupOpen(false)} variant="outlined">
						Got it
					</Button>
				</DialogActions>
			</Dialog>
		
		</Box>






		<Dialog open={popupOpen} onClose={handleClose} maxWidth="md" fullWidth>
			<DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>
				Selected Product Images
			</DialogTitle>
			<DialogContent>
				<Typography sx={{ mb: 2 }}>
					Please review the selected images. You can add only front images of your product.
				</Typography>
				<Box sx={{ display: 'flex', gap: 4 }}>
					<Box sx={{ minWidth: 100 }}>
						<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
							{selectedImages.map((img, idx) => (
								<Box key={idx} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
									<img src={img.url} alt={`Product ${idx + 1}`} style={{ width:80 , height:80, objectFit: 'cover', borderRadius: 8 }} />
									<IconButton
										size="small"
										sx={{ position: 'absolute', top: 4, right: 4, background: '#fff' }}
										onClick={() => setSelectedImages(images => images.filter((_, i) => i !== idx))}
									>
										<CloseIcon />
									</IconButton>
								</Box>
							))}
						</Box>
					</Box>
					<Box sx={{ flex: 1 }}>
						<Typography sx={{ color: '#F44336', fontWeight: 700, mb: 2 }}>
							Image types which are not allowed
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
							{imageTypeList.map((type) => (
								<Paper key={type.label} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
									<img src={type.icon} alt={type.label} style={{ width: 40, height: 40, objectFit: 'contain' }} />
									<Box>
										<Typography sx={{ fontWeight: 600 }}>{type.label}</Typography>
										<Typography sx={{ color: '#888', fontSize: 13 }}>NOT ALLOWED</Typography>
									</Box>
								</Paper>
							))}
						</Box>
					</Box>
				</Box>
			</DialogContent>
			<DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
				<Button variant="outlined" onClick={handleClose}>Cancel</Button>
				<Button variant="contained" color="primary" onClick={handleContinue}>Continue</Button>
			</DialogActions>
		</Dialog>

		{/* Step 2: Add Product Details - Image Slots */}
		{activeStep === 1 && (
  <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add images with details listed here
      </Typography>
      {imageSlots.map((slot, idx) => (
        <Box key={slot.key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 60, height: 60, border: '1px solid #eee', borderRadius: 2, overflow: 'hidden', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
            {slotImages[slot.key] ? (
              <img src={slotImages[slot.key] as string} alt={slot.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Typography sx={{ color: '#bbb', fontSize: 12 }}>No Image</Typography>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>{slot.label}</Typography>
            <Typography sx={{ color: '#888', fontSize: 13 }}>{slot.desc}</Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            component="label"
            sx={{ ml: 2 }}
          >
            {slotImages[slot.key] ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      setSlotImages(prev => ({ ...prev, [slot.key]: reader.result as string }));
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Button>
        </Box>
      ))}
    </Box>
  </Box>
		)}
		</>
	);
}
