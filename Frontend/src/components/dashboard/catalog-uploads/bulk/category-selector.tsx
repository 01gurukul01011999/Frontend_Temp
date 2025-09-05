'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/modules/authentication';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
} from '@mui/material';
import categoryTree from './category-tree';
import AddIcon from '@mui/icons-material/Add';
import { getSiteURL } from '@/lib/get-site-url';
import Isvg from './isvg';
import PlusSvg from './plus-svg';
import DownloadSvg from './download-svg';
import UploadSvg from './upload-svg';

// Helper to flatten category tree into array of full paths
function getAllCategoryPaths(tree: Record<string, unknown>, prefix: string[] = []): string[][] {
	let paths: string[][] = [];
	for (const key in tree) {
		if ((tree as Record<string, unknown>)[key] === null) {
			paths.push([...prefix, key]);
		} else if (typeof (tree as Record<string, unknown>)[key] === 'object') {
			paths = [...paths, ...getAllCategoryPaths((tree as Record<string, unknown>)[key] as Record<string, unknown>, [...prefix, key])];
		}
	}
	return paths;
}

export default function CategorySelector(): React.JSX.Element {
	 const [uploadPopupOpen, setUploadPopupOpen] = useState(false);

	// Inject loader CSS for the spinner animation
	React.useEffect(() => {
		if (globalThis.window !== undefined && !globalThis.document?.querySelector('#category-selector-loader-style')) {
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
	const [popupOpen, setPopupOpen] = useState(true);
console.log('uploadimages', uploadedImages);
	const { user } = useAuth();
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
	const globalWithImages = globalThis as { uploadedImageNames?: unknown };
	const imageNames = Array.isArray(globalWithImages.uploadedImageNames) ? globalWithImages.uploadedImageNames as string[] : undefined;
		const selectedFiles: File[] = Array.isArray(imageNames) && imageNames.length === uploadedImages.length
			? await Promise.all(uploadedImages.map((img, idx) => compressBase64ToFile(img, imageNames[idx])))
			: await Promise.all(uploadedImages.map((img, idx) => compressBase64ToFile(img, `image_${idx + 1}.jpg`)));

		// Calculate total size after compression
		let totalSize = 0;
		for (const file of selectedFiles) {
			totalSize += file.size;
		}
		if (totalSize > MAX_TOTAL_SIZE) {
			alert('Total compressed image size exceeds 5MB. Please upload fewer or smaller images.');
			return;
		}

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
	let currentTree: Record<string, unknown> | null = categoryTree as Record<string, unknown> | null;

	for (let level = 0; ; level++) {
		if (currentTree === undefined) break;
		if (currentTree === null) break;
		if (typeof currentTree !== 'object') break;
		const options = Object.keys(currentTree);
		if (options.length === 0) break;
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
		currentTree = ((currentTree as Record<string, unknown>)[selectionPath[level] as string] as Record<string, unknown> | null) ?? null;
	}

	// Helper to check if the current selection is a leaf (null) in the original tree
	function isLeaf(tree: Record<string, unknown>, path: string[]): boolean {
		let node: Record<string, unknown> | null = tree as Record<string, unknown> | null;
		for (const p of path) {
			if (!node || typeof node !== 'object') return false;
			node = (node as Record<string, unknown>)[p] as Record<string, unknown> | null;
		}
		return node === null && path.length > 0;
	}

const url =getSiteURL();
//console.log(url+'assets/woemns category.png');
	// Show right panel ONLY if the selected path is a leaf in the original categoryTree
	const showRightPanel = isLeaf(categoryTree, selectionPath);

	//const downloadExcel = () => {
	//  const data = [
	//    ['Product Name', 'Price', 'Category'], // headers
	//    [form.ProductName, form.Price, form.Category], // data
	//  ];
//
	//  const worksheet = XLSX.utils.aoa_to_sheet(data);
	//  const workbook = XLSX.utils.book_new();
	//  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//
	//  // Export as .xlsx file
	//  XLSX.writeFile(workbook, 'generated-template.xlsx');
	//};

	// Download the Excel template from the backend and trigger a download
	const [downloading, setDownloading] = useState(false);
	const handleDownload = async () => {
		setDownloading(true);
		try {
			const res = await fetch('/template', { method: 'GET' });
			if (!res.ok) {
				alert('Failed to download template.');
				setDownloading(false);
				return;
			}
			const blob = await res.blob();
			// Optional: check if the blob is a valid Excel file by checking the first few bytes (magic number)
			const reader = new FileReader();
			reader.addEventListener('load', function(e) {
				if (!e.target) {
					alert('Error reading file.');
					setDownloading(false);
					return;
				}
				const arr = new Uint8Array(e.target.result as ArrayBuffer);
				if (arr[0] !== 0x50 || arr[1] !== 0x4B) {
					alert('Downloaded file is not a valid Excel file.');
					setDownloading(false);
					return;
				}
				const url = globalThis.URL.createObjectURL(blob);
				const a = globalThis.document?.createElement('a');
				if (a) {
					a.href = url;
					a.download = 'meesho-template.xlsx';
					a.click();
				}
				globalThis.URL.revokeObjectURL(url);
				setDownloading(false);
			});
			// Removed unused variable 'buf'. Use reader.readAsArrayBuffer(blob) only.
			await blob.arrayBuffer();
		} catch {
			alert('Error downloading template.');
			setDownloading(false);
		}
	};

	return (
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
					renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: string[]) => {
						// Use a stable key derived from the option path, and spread typed props.
						const optionKey = option.join('-');
						const last = option.at(-1);
						const path = option.slice(0, -1).join(' > ');
						return (
							<li key={optionKey} {...props} style={{ alignItems: 'flex-start', paddingTop: 8, paddingBottom: 8, display: 'block' }}>
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
								Already have your {selectionPath[3]} template filled?
							</Typography>
						<Box
							sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							my: 2,
							}}
						>
							<Box
							sx={{
								border: '2px dashed #ccc',
								borderRadius: 2,
								p: 3,
								textAlign: 'center',
								width: '300px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
							>
							<input
								type="file"
								accept=".xlsx,.xls"
								id="excel-upload"
								style={{ display: 'none' }}
								onChange={(_e) => {
								// handle file selection here if needed
								}}
							/>
							<Button
								variant="text"
								color="inherit"
								sx={{
								alignItems: 'center',
								'&:hover': {
									backgroundColor: 'transparent',
								},
								}}
								onClick={() => {
								const input = globalThis.document?.querySelector('#excel-upload') as HTMLInputElement | null;
								if (input) input.click();
								}}
							>
								<AddIcon />
								Upload Template File
							</Button>
							</Box>
						</Box>

						<Box sx={{ mt: 3 }}>
							<Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
									Dont have {selectionPath[3]} template?
							</Typography>
							<Box display="flex" flexDirection="column" gap={2}>
									<Box display="flex" flexDirection="column" gap={1}>
										<Button
											variant="outlined"
                      
											onClick={() => setUploadPopupOpen(true)}
											sx={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', textAlign: 'left', p: 2 }}
										>
											<Typography variant="inherit" sx={{ fontWeight: 800 }}>
												Generate Prefilled Template
											</Typography>
											<Typography variant="subtitle2" color="text.secondary">
												Upload product front images and generate your prefilled template
											</Typography>
										</Button>
									</Box>
			{/* Upload Product Images Popup */}
			<Dialog open={uploadPopupOpen} onClose={() => setUploadPopupOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle sx={{ pb: 0 }}>
					<Typography variant="h6" fontWeight="normal" sx={{pb:2}}>Upload product front images to generate template</Typography>
				</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'row', gap: 3, minHeight: 400 }}>
					{/* Left: Tabs and Upload */}
					<Box sx={{ flex: 1, minWidth: 320 }}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, display: 'flex' }}>
							<Button
								variant="text"
								sx={{ borderBottom: uploadTab === 'files' ? '2px solid #4d0aff' : 'none', borderRadius: 0, color: uploadTab === 'files' ? '#4d0aff' : '#888', fontWeight: 600 }}
								onClick={() => setUploadTab('files')}
							>
								Upload Image files
							</Button>
							<Button
								variant="text"
								sx={{ color: uploadTab === 'links' ? '#4d0aff' : '#888', borderBottom: uploadTab === 'links' ? '2px solid #4d0aff' : 'none', fontWeight: 600, ml: 2, borderRadius: 0 }}
								onClick={() => setUploadTab('links')}
							>
								Upload Image links
							</Button>
						</Box>
						{uploadTab === 'files' ? (
							<>
								<Box sx={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 1, p: 1.5, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
									<Isvg style={{ color:'rgb(247, 190, 0)' }}/>
									<Typography sx={{ fontSize: 13,  fontWeight: 300 }}>
										Please provide only <b><span style={{ color: '#000' }}>front image</span></b> for each product. Additional images can be added while updating the bulk template
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 100, justifyContent: 'flex-start', width: '100%' }}>
									<Button
										variant="outlined"
										sx={{ border: '1.5px dashed #4d0aff', color: '#4d0aff', fontWeight: 'normal', borderRadius: 2, p: 0.5, width: 100, height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, background: '#fafbff', fontSize:'12px', textAlign:'center', mb: 2 }}
										component="label" 
									>
										<PlusSvg />
										Add Front Images
										<input
											type="file"
											accept="image/*"
											multiple
											hidden
											onChange={async e => {
																		const files = [...(e.target.files || [])];
												// Compress each image using canvas
												const compressImage = (file: File) => {
													return new Promise<string>((resolve, reject) => {
														const reader = new FileReader();
														reader.addEventListener('load', ev => {
															const img = new globalThis.Image();
															img.addEventListener('load', () => {
																const canvas = globalThis.document?.createElement('canvas');
																if (!canvas) return reject('Canvas not supported');
																// Resize logic: max width/height 1024px
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
																if (ctx) {
																	ctx.drawImage(img, 0, 0, width, height);
																} else {
																	return reject('Canvas context error');
																}
																// Compress to JPEG, quality 0.7
																canvas.toBlob(
																	blob => {
																		if (!blob) return reject('Compression failed');
																		const reader2 = new FileReader();
																		reader2.addEventListener('load', ev2 => resolve((ev2.target as FileReader)?.result as string));
																		reader2.addEventListener('error', reject);
																		reader2.readAsDataURL(blob);
																	},
																	'image/jpeg',
																	0.7
																);
															});
															img.addEventListener('error', reject);
															img.src = (ev.target as FileReader)?.result as string;
														});
														reader.addEventListener('error', reject);
														reader.readAsDataURL(file);
													});
												};
												const compressedImgs = await Promise.all(files.map(file => compressImage(file)));
												setUploadedImages(prev => [...prev, ...compressedImgs]);
												e.target.value = '';
											}}
										/>
									</Button>
									{uploadedImages.length > 0 && (
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, width: '100%' }}>
											{uploadedImages.map((img, idx) => (
												<Box key={idx} sx={{ position: 'relative', width: 100, height: 100, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee', background: '#fafbff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<Image src={img} alt={`uploaded`} fill style={{ objectFit: 'cover' }} />
													<IconButton
														size="small"
														sx={{ position: 'absolute', top: 2, right: 2, background: '#fff', boxShadow: 1, zIndex: 2 }}
														onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
													>
														<CloseIcon fontSize="small" />
													</IconButton>
												</Box>
											))}
										</Box>
									)}
								</Box>
							</>
						) : (
							<>
								<Box sx={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 1, p: 1, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
									<Isvg style={{ color:'rgb(247, 190, 0)' }}/>
									<Typography sx={{ fontSize: 13, fontWeight: 300 }}>
										Use this only if you have your <b>product front image</b> links ready.
									</Typography>
								</Box>
								<Typography variant="h6" fontWeight={700} sx={{ mb: 2, fontSize: 15 }}>
									Follow steps to submit product front image links
								</Typography>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px dashed #ddd', pb: 2 }}>
										<Box>
											<Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: 16 }}>Step 1</Typography>
											<Typography variant="body2">Download front image link template</Typography>
										</Box>
										<Button variant="outlined" sx={{ borderColor: '#4d0aff', color: '#4d0aff', fontWeight: 700, px: 3, borderRadius: 0.5, textTransform: 'none' }} startIcon={<DownloadSvg />}>
											Download
										</Button>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2 }}>
										<Box>
											<Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: 16 }}>Step 2</Typography>
											<Typography variant="body2">Update the file with image links and upload it back</Typography>
										</Box>
										<Button variant="outlined" sx={{ borderColor: '#4d0aff', color: '#4d0aff', fontWeight: 700, px: 3, borderRadius: 0.5, textTransform: 'none' }} startIcon={<UploadSvg />}>
											Upload
										</Button>
									</Box>
								</Box>
							</>
						)}
					</Box>
					{/* Right: Not Allowed List */}
					<Box sx={{ minWidth: 260, maxWidth: 320, pl: 2, borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 1 }}>
						<Typography sx={{ color: '#ff2d2d', fontWeight: 700, mb: 1 }}>
							<span style={{ fontSize: 20, verticalAlign: 'middle', marginRight: 6 }}>6ab</span> Image types which are not allowed:
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							{[
								{ label: 'Watermark image', img: url + 'assets/invalid-image-1.png' },
								{ label: 'Fake branded/1st copy', img: url + 'assets/invalid-image-2.png' },
								{ label: 'Image with price', img: url + 'assets/invalid-image-3.png' },
								{ label: 'Pixelated image', img: url + 'assets/invalid-image-4.png' },
								{ label: 'Inverted image', img: url + 'assets/invalid-image-5.png' },
								{ label: 'Blur/unclear image', img: url + 'assets/invalid-image-6.png' },
								{ label: 'Incomplete image', img: url + 'assets/invalid-image-7.png' },
								{ label: 'Stretched/shrunk image', img: url + 'assets/invalid-image-8.png' },
								{ label: 'Image with props', img: url + 'assets/invalid-image-9.png' },
								{ label: 'Image with text', img: url + 'assets/invalid-image-10.png' },
                
							].map(item => (
								<Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
									<Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', background: '#f4f4f4', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Image src={item.img} alt={item.label} width={50} height={50} style={{ width: '100%', height:'100%', objectFit: 'contain', filter: 'grayscale(1)' }} />
									</Box>
									<Box>
										<Typography sx={{ fontSize: 15, fontWeight: 500 }}>{item.label}</Typography>
										<Typography sx={{ fontSize: 12, color: '#888' }}>  6ab NOT ALLOWED</Typography>
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2 }}>
					<Button onClick={() => setUploadPopupOpen(false)} variant="outlined" sx={{ minWidth: 120 }}>Discard</Button>
					<Button
						variant="contained"
						color={uploadedImages.length > 0 ? 'primary' : 'inherit'}
						disabled={uploadedImages.length === 0}
						sx={{
							minWidth: 180,
							fontWeight: 600,
							background: uploadedImages.length > 0 ? '#4d0aff' : '#e0e0e0',
							color: uploadedImages.length > 0 ? '#fff' : '#888',
							'&:hover': {
								background: uploadedImages.length > 0 ? '#3a08c7' : '#e0e0e0',
							},
						}}
						onClick={handleGenerateTemplate}
					>
						Generate Template
					</Button>
				</DialogActions>
			</Dialog>
									<Typography variant="body2" align="center">or</Typography>
									<Button variant="text" onClick={handleDownload} disabled={downloading}>
										{downloading ? (
											<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
												<span className="loader" style={{ width: 16, height: 16, border: '2px solid #ccc', borderTop: '2px solid #4d0aff', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
												Downloading...
											</span>
										) : (
											'Download Empty Template'
										)}
									</Button>
  

							</Box>
						</Box>
           
					</Paper>
				</Box>
			)}

			{/* Popup */}
			<Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="sm" fullWidth>
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
						✅ 705 Add <strong>Front images</strong> of your product.<br />
						✅ 705 Get a pre-filled template, quickly add variants, review and enjoy faster catalog bulk uploads.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setPopupOpen(false)} variant="outlined">
						Got it
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
