'use client';
import React from "react";
import { Box, Typography, Button, IconButton, Avatar, Stack, Tooltip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions, } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/use-user';

const forbiddenImages = [
	{ label: "Watermark image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-1.png" },
	{ label: "Fake branded/1st copy", img: "https://static.meeshosupply.com/supplier-new/invalid-image-2.png" },
	{ label: "Image with price", img: "https://static.meeshosupply.com/supplier-new/invalid-image-3.png" },
	{ label: "Pixelated image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-4.png" },
	{ label: "Inverted image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-5.png" },
	{ label: "Blur/unclear image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-6.png" },
	{ label: "Incomplete image", img: "https://static.meeshosupply.com/supplier-new/invalid-image-7.png" },
];

export default function ImageBulkUpload(): React.JSX.Element {
	const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
	type UploadedFile = { img_name: string; name?: string; publicUrl?: string };
	const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
	// track uploading state per index
	const [uploadingIndices, setUploadingIndices] = React.useState<Record<number, boolean>>({});
	const [uploadingDeleteIndex, setUploadingDeleteIndex] = React.useState<number | null>(null);
	const { user } = useUser();
	//console.log(isLoading);

	// Remove image from selected files (local only)
	const handleRemoveImage = (idx: number) => {
		setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
		// if there is a matching uploadedFiles entry, remove it too
		const file = selectedFiles[idx];
		if (file) {
			setUploadedFiles(prev => prev.filter(u => u.img_name !== file.name));
		}
	};

	// Remove an uploaded image from server + UI. Assumes a delete endpoint exists at /api/delete-image
	// Body: { img_name?, publicUrl? }
	const handleRemoveUploadedImage = async (idx: number) => {
		const img = uploadedFiles[idx];
		if (!img) return;
		setUploadingDeleteIndex(idx);
		try {
			// Attempt server delete. NOTE: backend endpoint and payload are assumed; adjust if your backend differs.
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete-image`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ img_name: img.img_name, publicUrl: img.publicUrl }),
			});
			if (!res.ok) {
				const txt = await res.text();
				console.error('Delete failed', txt);
				toast.error('Failed to delete image from server');
				return;
			}
			const body = await res.json().catch(() => ({}));
			const ok = body?.success ?? true; // allow fallback to true if backend returns 200 without JSON
			if (!ok) {
				toast.error('Server reported failure deleting image');
				return;
			}
			// Remove from uploadedFiles
			setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
			// Also remove any selectedFiles matching this img_name
			setSelectedFiles(prev => prev.filter(f => f.name !== img.img_name));
			toast.success('Image deleted from server', { autoClose: 1400 });
		} catch (error) {
			console.error('Delete image error', error);
			toast.error('Failed to delete image');
		} finally {
			setUploadingDeleteIndex(null);
		}
	};

	// Confirmation dialog state for deleting uploaded images
	const [confirmOpen, setConfirmOpen] = React.useState(false);
	const [confirmIndex, setConfirmIndex] = React.useState<number | null>(null);

	const openConfirm = (idx: number) => {
		setConfirmIndex(idx);
		setConfirmOpen(true);
	};

	const closeConfirm = () => {
		setConfirmIndex(null);
		setConfirmOpen(false);
	};

	const handleConfirmDelete = async () => {
		if (confirmIndex === null) return closeConfirm();
		await handleRemoveUploadedImage(confirmIndex);
		closeConfirm();
	};

	// Handle file selection
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
		setSelectedFiles([...e.target.files]);
		}
	};

	const handleUploadImages = async () => {

		if (selectedFiles.length === 0) return;

		// mark all selected indices as uploading
		const uploadingMap: Record<number, boolean> = {};
		for (const [i] of selectedFiles.entries()) {
			uploadingMap[i] = true;
		}
		setUploadingIndices(uploadingMap);

		const formData = new FormData();
		for (const file of selectedFiles) formData.append('images', file);
		if (user && user.id) formData.append('uploaderId', user.id);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bulkImgupload`, {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			if (data.success && Array.isArray(data.files)) {
				setUploadedFiles(data.files as UploadedFile[]);
				// show toast per uploaded file with publicUrl
				for (const f of (data.files as UploadedFile[])) {
					if (f?.publicUrl) {
						toast.success(`${f.img_name || f.name || 'Image'} uploaded`, { autoClose: 1400 });
					}
				}
			}
		} catch (error) {
			console.error('Bulk upload failed', error);
			toast.error('Failed to upload images');
		} finally {
			// clear uploading flags
			setUploadingIndices({});
		}
	};

	return (
		<Box sx={{ display: 'flex', bgcolor: '#fff', flexDirection: 'row', gap: 2, mt: 1, mr: -3, ml: -3 }}>
			{/* Column 1: Left */}
			<Box p={3} sx={{ width: '80%', flexBasis: '80%' }}>
				<Box
					bgcolor="#f0f4ff"
					p={2}
					borderRadius={2}
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					mb={2}
				>
					<Box>
						<Typography fontWeight="bold">
							Introducing pre-filled templates for faster bulk uploads
						</Typography>
						<Typography variant="body2">
							Add product front images and get prefilled catalog template
						</Typography>
					</Box>
					<Button variant="outlined" color="primary">
						Get Started
					</Button>
				</Box>
				<Button
					variant="text"
					component="label"
					color="primary"
					sx={{ width: '100%' }}
				>
					<Box
						border="1px dashed #a08af7"
						bgcolor="#f6f8fd"
						height={200}
						display="flex"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						borderRadius={2}
						my={0}
						width='100%'
					>
						<CloudUploadIcon color="primary" sx={{ fontSize: 32 }} />
						<Typography fontWeight="bold" mt={1}>Add Images</Typography>
						<Typography variant="caption">You can drop images here</Typography>
						<input
							type="file"
							multiple
							accept="image/*"
							hidden
							onChange={handleImageChange}
						/>
					</Box>
				</Button>
				{/* Show selected images preview */}
				{selectedFiles.length > 0 && (
					<Box mt={2}>
						<Typography fontWeight="medium" mb={1}>Selected Images:</Typography>
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(7, 1fr)',
								gap: 2,
								p: 1,
								bgcolor: '#fafafa',
								borderRadius: 2,
							}}
						>
							{selectedFiles.map((file, idx) => {
								console.log("arry",uploadedFiles);
								const isUploaded = uploadedFiles.some(
									(img) => img.img_name === file.name
								);
								return (
									<Box key={idx} sx={{ position: 'relative', display: 'inline-block'}}>
										<Avatar
											src={URL.createObjectURL(file)}
											variant="rounded"
											sx={{ width: 90, height: 90, border: '1px solid #A6A6A6', borderRadius: 0.5 }}
										/>
										<IconButton
											size="small"
											sx={{
												position: 'absolute',
												top: -12,
												right: -12,
												background: '#fff',
												boxShadow: 1,
												zIndex: 2,
												width: 28,
												height: 28,
												borderRadius: '50%',
												border: '1px solid #eee',
												transition: 'background 0.2s',
												'&:hover': {
													background: '#ffeaea',
												},
											}}
											onClick={() => handleRemoveImage(idx)}
										>
											<CloseIcon sx={{ fontSize: 20, color: '#d32f2f' }} />
										</IconButton>
										{isUploaded && (
											<CheckCircleIcon
												sx={{
													position: 'absolute',
													right: 4,
													bottom: 4,
													color: '#4caf50',
													fontSize: 28,
													zIndex: 1,
													background: '#fff',
													borderRadius: '50%',
													boxShadow: 1,
												}}
											/>
										)}
										{uploadingIndices[idx] && (
											<Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)' }}>
												<CircularProgress size={28} />
											</Box>
										)}
									</Box>
								);
							})}
						</Box>
						<Box mt={2}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleUploadImages}
								disabled={selectedFiles.length === 0}
								sx={{ textTransform: 'none', fontWeight: 600 }}
							>
								Get Links
							</Button>
						</Box>
						{uploadedFiles && (
							<Box mt={5}>
				<Typography variant="h6" mb={2}>Image Links</Typography>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell><strong>Image</strong></TableCell>
								<TableCell><strong>Title</strong></TableCell>
								<TableCell ><strong>Link</strong></TableCell>
								<TableCell><strong>Actions</strong></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{uploadedFiles.map((img, idx) => (
								<TableRow key={idx}>
									<TableCell>
										<Avatar variant="rounded" src={img.publicUrl } />
									</TableCell>
									<TableCell sx={{ width: 80 }}>{img.img_name || img.name || `Image ${idx + 1}`}</TableCell>
									<TableCell sx={{ width: 250, maxWidth: 250 }}>
										<Tooltip title={img.publicUrl || ''} placement="top" arrow>
											<Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: 250 }}>
												{img.publicUrl}
											</Typography>
										</Tooltip>
									</TableCell>
									<TableCell>
										<Button size="small" variant="contained" color="primary" sx={{ mr: 1 }}
											onClick={() => img.publicUrl ? navigator.clipboard.writeText(img.publicUrl) : Promise.resolve()}>
											Copy Link
										</Button>
										<Button size="small" variant="outlined" color="secondary" onClick={() => openConfirm(idx)} disabled={uploadingDeleteIndex === idx}>
											{uploadingDeleteIndex === idx ? <CircularProgress size={18} /> : 'Remove Image'}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>)}
					</Box>
				)}

				{/* Confirmation Dialog */}
				<Dialog open={confirmOpen} onClose={closeConfirm}>
					<DialogTitle>Confirm delete</DialogTitle>
					<DialogContent>
						<Typography>Are you sure you want to delete this image from the server?</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={closeConfirm} variant="outlined">No</Button>
						<Button onClick={handleConfirmDelete} variant="contained" color="error">Yes</Button>
					</DialogActions>
				</Dialog>
			</Box>
			{/* Column 2: Right */}
			<Box sx={{ width: '30%', p: 3, bgcolor: '#fff', flexBasis: '30%', borderLeft: '1px solid #e0e0e0' }}>
				<Typography variant="subtitle1" color="error" fontWeight="medium" mb={2}>
					 Image types which are not allowed:
				</Typography>
				<Box>
					{forbiddenImages.map((img, idx) => (
						<Stack direction="row" alignItems="center" spacing={2} key={idx} mb={1}>
							<Avatar src={img.img} variant="rounded" sx={{ width: 56, height: 56, borderRadius: 1 }} />
							<Typography variant="body2">{img.label}</Typography>
						</Stack>
					))}
				</Box>
				</Box>
			</Box>
	)}
