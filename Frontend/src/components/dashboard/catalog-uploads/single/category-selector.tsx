'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/modules/authentication';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Add, CheckCircle } from "@mui/icons-material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import {ToastContainer, toast} from 'react-toastify';
import {
	Box,
    Button,
    Typography,
    Paper,
    MenuItem,
    Select,
	FormControl,
	ListItemButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Stepper, Step, StepLabel,
	Link,
	Divider,
	FormControlLabel,
	Popover,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from "@mui/system";
import categoryTree, { CategoryNode } from '../bulk/category-tree';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getSiteURL } from '@/lib/get-site-url';
import formsJson from "./forms-json"; 


const steps = ["Select Category", "Add Product Details"];

// Types for product form state
type ProductSection = { [key: string]: string | string[] | number | boolean | Record<string, unknown> };
type ProductForm = {
	// optional id will be populated to uniquely identify each product form
	id?: string;
	ProductSizeInventory: ProductSection;
	ProductDetails: ProductSection;
	OtherAttributes: ProductSection;
};

// Represent file record returned by backend upload endpoints
type UploadedFile = { img_id?: string; publicUrl?: string; signedUrl?: string; storagePath?: string };

// SelectedImageItem is used by top-level helpers (e.g. resolvePreviewSrc)
// define it at module scope so functions outside the component can reference it.
type SelectedImageItem = { url?: string; gallery?: string[]; img_id?: string | string[]; publicUrl?: string; signedUrl?: string; file?: File } | string;

// Hoisted factory to avoid function-in-render linter rule
function initialFormData(): ProductForm {
	return {
		// id left undefined here; will be assigned when ensuring IDs
		ProductSizeInventory: {},
		ProductDetails: {},
		OtherAttributes: {},
	};
}

// Generate a stable unique id (uses crypto.randomUUID when available)
function genUniqueId(): string {
	try {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as unknown as { randomUUID?: () => string }).randomUUID?.() ?? '';
	} catch {
		// ignore and fallback
	}
	return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Ensure each product form has an `id` and return the updated array (pure function — does not touch component state)
function ensureProductFormIds(forms: ProductForm[]): (ProductForm & { id: string })[] {
	const updated = forms.map((f) => {
		const copy = { ...f } as ProductForm & { id?: string };
		if (!copy.id) {
			copy.id = genUniqueId();
		}
		return copy as ProductForm & { id: string };
	});
	return updated as (ProductForm & { id: string })[];
}
// Small deep clone helper to replace JSON.parse(JSON.stringify(...))
function deepClone<T>(v: T): T {
	// Use structuredClone if available
	if (typeof structuredClone === 'function') return structuredClone(v);
	// eslint-disable-next-line unicorn/prefer-structured-clone -- structuredClone may not exist in older environments
	return JSON.parse(JSON.stringify(v)) as T;
}

interface CustomStepIconRootProps {
  active?: boolean;
  completed?: boolean;
}

const CustomStepIconRoot = styled("div")<CustomStepIconRootProps>(({ theme, active, completed }) => {
	void theme;
	return {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: 28,
		height: 28,
		borderRadius: "50%",
		backgroundColor: completed ? "#43C15A1A" : (active ? "rgba(99, 102, 241, 0.1)" : "#f0f0f0"),
		color: completed ? "#43C15A" : (active ? "#6366f1" : "#9e9e9e"),
		fontWeight: 600,
		fontSize: 14,
		border: `1px solid ${completed ? "#43C15A" : (active ? "#6366f1" : "#ccc")}`
	};
});

interface CustomStepIconProps {
	active?: boolean;
	completed?: boolean;
	icon?: React.ReactNode;
	step?: number;
	activeStep?: number;
}

function CustomStepIcon(props: CustomStepIconProps) {
	const { active, completed, icon, step, activeStep } = props;
	// If step 0 and activeStep > 0, show green check
	if (typeof step === 'number' && step === 0 && typeof activeStep === 'number' && activeStep > 0) {
		return (
			<CustomStepIconRoot active={false} completed={true}>
				<CheckCircle sx={{ color: '#43C15A', fontSize: 22 }} />
			</CustomStepIconRoot>
		);
	}
	return <CustomStepIconRoot active={!!active} completed={!!completed}>{icon}</CustomStepIconRoot>;
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

// Helper to check if the given path is a leaf in the category tree
function _isLeaf(tree: CategoryNode, path: string[]): boolean {
	let node: CategoryNode | null = tree;
	for (const p of path) {
		if (!node || typeof node !== 'object') return false;
		node = (node as Record<string, CategoryNode | null>)[p] ?? null;
	}
	return node === null && path.length > 0;
}

// Module-scoped helper to read a File into a Data URL. Moved out of component to satisfy
// unicorn/consistent-function-scoping.
const _readFileToDataUrl = (f: File): Promise<string> =>
	Promise.resolve(URL.createObjectURL(f));

// PreviewImage: uses <img> for blob:data URLs (object URLs/data URLs) because next/image
// cannot reliably render those. For normal http/https or relative urls use next/image.
function PreviewImage(props: { src?: string | null; alt?: string; width?: number; height?: number; style?: React.CSSProperties; onClick?: () => void }) {
	const { src, alt, width, height, style, onClick } = props;
	if (!src) return null;
	const s = String(src || '');
	// Treat object/blob/data URLs and external http(s) signed URLs as plain <img>
	const isBlobOrDataOrHttp = s.startsWith('blob:') || s.startsWith('data:') || /^https?:\/\//.test(s);
	if (isBlobOrDataOrHttp) {
		return (
			<Image
				src={s}
				alt={alt ?? ''}
				width={width ?? 80}
				height={height ?? 80}
				style={style}
				onClick={onClick}
				unoptimized
			/>
		);
	}
	// For local assets (relative paths) keep using next/image for optimization
	return <Image src={s} alt={alt || ''} width={width ?? 80} height={height ?? 80} style={style} onClick={onClick} />;
}

// Resolve a preview source from a SelectedImageItem or string.
// Prefer `publicUrl` for previewing. Signed URLs are kept only as a fallback in the rest of the code,
// but previews should use `publicUrl` when available.
function resolvePreviewSrc(item?: SelectedImageItem | string): string {
	if (!item) return '';
	if (typeof item === 'string') return item;
	const rec = item as { signedUrl?: string; publicUrl?: string; url?: string };
	return (rec.publicUrl as string) ?? (rec.url as string) ?? '';
}

export default function CategorySelector(): React.JSX.Element {
	// Removed: const [techpotliInfoAnchor, setTechpotliInfoAnchor] = useState<HTMLElement | null>(null);
	
	const [popupOpen, setPopupOpen] = useState(false);
	const [intropopupOpen, setIntroPopupOpen] = useState(false);
	const [selectedImages, setSelectedImages] = useState<SelectedImageItem[]>([]);
	// Track the active product tab (0-based index)
	const [activeProductIndex, setActiveProductIndex] = useState(0);
	const [_uploadedImagesjson, _setUploadedImagesjson] = useState<UploadedFile[]>([]);
	// track which product indices are currently uploading
	const [uploadingIndices, setUploadingIndices] = useState<Record<number, boolean>>({});
	//console.log('uploadedImagesjson', _uploadedImagesjson);
	// Store form data for each product
	const [productForms, setProductForms] = useState<ProductForm[]>([]);
	//console.log('productForms', productForms);
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

	const _handleRemoveImage = (idx: number) => {
		setSelectedImages(images => {
			const newImages = images.filter((_, i) => i !== idx);
			setProductForms(forms => forms.filter((_, i) => i !== idx));
			setActiveProductIndex(prev => prev >= newImages.length ? 0 : prev);
			return newImages;
		});
	};
	const handleAddProduct = () => {
		inputRef.current?.click();
	};
	const handleContinue = async () => {
		// First, upload selected images to backend
		if (selectedImages && selectedImages.length > 0) {
			// proceed
		} else {
			toast.error('No images selected to upload');
			return;
		}
		try {
			// Build File[] from selectedImages: prefer already-stored File objects (from selection),
			// otherwise fetch blob from the preview URL as a fallback.
			const files: File[] = await Promise.all(selectedImages.map(async (img, idx) => {
				if (typeof img === 'string') {
					const resp = await fetch(img);
					const blob = await resp.blob();
					const ext = blob.type?.split('/')?.[1] || 'jpg';
					return new File([blob], `image_${idx + 1}.${ext}`, { type: blob.type || 'image/jpeg' });
				}
				const obj = img as { file?: File; url?: string };
				if (obj.file instanceof File) return obj.file;
				const dataUrl = obj.url ?? '';
				if (!dataUrl) throw new Error('Invalid image');
				const resp = await fetch(dataUrl);
				const blob = await resp.blob();
				const ext = blob.type?.split('/')?.[1] || 'jpg';
				return new File([blob], `image_${idx + 1}.${ext}`, { type: blob.type || 'image/jpeg' });
			}));

			const formData = new FormData();
			for (const f of files) formData.append('images', f);
			if (user && user.id) formData.append('uploaderId', user.id);

			const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bulkImgupload`;
			const res = await fetch(uploadUrl, { method: 'POST', body: formData });
					if (res.ok === false) {
				console.error('Image upload failed', await res.text());
				toast.error('Image upload failed. Please try again.');
				return;
			}
			// Optionally read response
			 const body = await res.json();
			 const uploaded: UploadedFile[] = (body.files || []) as UploadedFile[];
			_setUploadedImagesjson(uploaded);
			//console.log('Upload response', uploaded);
			// Use publicUrl from the upload response for UI and JSON (fall back to signedUrl only if necessary).
			try {
				setProductForms(prev => {
					const copy = [...prev];
			for (const [i, fileRec] of uploaded.entries()) {
				const rec = fileRec as UploadedFile | null;
				// Only use publicUrl for stored image URLs. Skip if publicUrl not available.
				const pub = rec?.publicUrl ?? null;
				if (!pub) continue;
						if (!copy[i]) copy[i] = initialFormData();
						if (!copy[i].OtherAttributes) copy[i].OtherAttributes = {};
						const other = copy[i].OtherAttributes as Record<string, unknown>;
						const existing = Array.isArray(other.image_urls) ? (other.image_urls as string[]) : [];
						other.image_urls = [...new Set([...existing, pub])];
					}
					return copy;
				});
				} catch (error) {
				console.error('Failed to merge uploaded URLs into productForms', error);
			}
//console.log('uploaded', uploaded);
			// Replace local previews with server-provided URLs (prefer publicUrl, fallback to signedUrl)
			try {
				// Prefer publicUrl for previews; do not fall back to signedUrl for preview URLs.
				const urls = uploaded.map((u) => u.publicUrl || '');

				setSelectedImages((prev) => prev.map((item, idx) => {
					const chosen = urls[idx] || '';
					if (!chosen) return item;
					if (typeof item === 'string') return chosen;
					const it = { ...(item as Record<string, unknown>) } as Record<string, unknown>;
					const rec = uploaded[idx] || {};
					if (rec.publicUrl) it.publicUrl = rec.publicUrl;
					// do not set signedUrl as an image URL; keep signedUrl only in uploaded metadata
					it.url = chosen;
					return it as SelectedImageItem;
				}));

				// store preview URLs separately for convenience
				setUploadedImages(urls.filter(Boolean) as string[]);
			} catch (error) {
				console.warn('Failed to map uploaded URLs for images', error);
			}
			toast.success('Images uploaded successfully', { autoClose: 2000 });
		} catch (error) {
			console.error('Upload error', error);
			toast.error('Failed to upload images');
			return;
		}

		// Proceed to next step only after successful upload
		setPopupOpen(false);
		setActiveStep(1);
		setActiveProductIndex(0); // Always start with first product tab
		// Ensure productForms matches selectedImages
		setProductForms(forms => {
			const formsCopy = [...forms];
			while (formsCopy.length < selectedImages.length) {
				formsCopy.push(initialFormData());
			}
			return formsCopy.slice(0, selectedImages.length);
		});
	};
	const handleClose = () => setPopupOpen(false);
	
	 const [_uploadPopupOpen, setUploadPopupOpen] = useState(false);
	 const [activeStep, setActiveStep] = React.useState(0);
	// Removed duplicate inputRef declaration to fix redeclaration error.

	// Removed duplicate handleImageChange function to fix redeclaration error.

	// Inject loader CSS for the spinner animation
	React.useEffect(() => {
		// If document is not available or the loader style already exists, do nothing.
		if (typeof globalThis === 'undefined' || globalThis.document?.querySelector('#category-selector-loader-style')) return;
		const loaderStyle = globalThis.document?.createElement('style');
		if (loaderStyle) {
			loaderStyle.id = 'category-selector-loader-style';
			loaderStyle.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
			globalThis.document?.head?.append(loaderStyle);
		}
	}, []);
	//const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [selectionPath, setSelectionPath] = useState<string[]>([]);
	// If editing an existing catalog, store its catalog_id here
	const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
	// saving state for drafts
	const [isSavingDraft, setIsSavingDraft] = useState(false);
	// currently selected form id derived from category tree when user picks a leaf
	const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
	//console.log('selectedFormId', selectedFormId);
	// Active form object loaded from formsJson when a formId is found
	const [activeForm, setActiveForm] = useState<FormDef | null>(null);

	// On mount, check if another page stored a selected catalog to edit.
 	React.useEffect(() => {
		try {
			const raw = typeof globalThis === 'undefined' ? null : globalThis.localStorage?.getItem('techpotli_selected_catalog');
			if (raw) {
				const parsed = JSON.parse(raw) as unknown;
				console.log ('parsed', parsed);
				if (parsed) {
					// Preload images and product forms if available
					const parsedObj = parsed as Record<string, unknown>;
					if (Array.isArray(parsedObj.product_forms)) {
						// Build productForms and selectedImages per product using OtherAttributes.image_urls
						const mappedForms: ProductForm[] = (parsedObj.product_forms as unknown[]).map((pf) => {
							const pfObj = pf as Record<string, unknown> | undefined;
							return {
								id: pfObj?.id ? String(pfObj.id) : undefined,
								ProductSizeInventory: (pfObj?.ProductSizeInventory as ProductSection) || {},
								ProductDetails: (pfObj?.ProductDetails as ProductSection) || {},
								OtherAttributes: (pfObj?.OtherAttributes as ProductSection) || {},
							} as ProductForm;
						});

						// Create selectedImages array aligned to productForms: use first image as main and rest as gallery
						const selImgs: SelectedImageItem[] = mappedForms.map((pf) => {
							const oa = (pf.OtherAttributes as Record<string, unknown>) || {};
							const arr = Array.isArray(oa.image_urls) ? (oa.image_urls as unknown[]).filter(i => typeof i === 'string').map(String) as string[] : [];
							if (arr.length === 0) return '' as SelectedImageItem; // empty placeholder
							const [first, ...rest] = arr;
							return ({ url: first, publicUrl: first, gallery: rest } as SelectedImageItem);
						});

						// Store product forms and selectedImages aligned by index
						setProductForms(ensureProductFormIds(mappedForms as ProductForm[]));
						setSelectedImages(selImgs);
						// Also store flat uploadedImages for UI conveniences (optional)
						setUploadedImages(selImgs.map(s => (typeof s === 'string' ? s : (resolvePreviewSrc(s) || ''))).filter(Boolean) as string[]);
					}
					// Set selectionPath/category if available
					{
						// parsedObj is already created above as Record<string, unknown>
						const maybeCat = (parsedObj as Record<string, unknown>)?.category_path;
						if (Array.isArray(maybeCat)) {
							// Normalize to string[] before using
							const path = (maybeCat as unknown[]).map(String);
							setSelectionPath(path);
							// derive form id from category tree and set active form if available
							try {
								const fid = getFormIdFromCategoryTree(categoryTree, path);
								if (fid) {
									setSelectedFormId(fid);
									const formDef = (formsJson as unknown as Record<string, unknown>)[fid] as FormDef | undefined;
									if (formDef) {
										setActiveForm(formDef);
									} else {
										setActiveForm(null);
									}
								} else {
									setSelectedFormId(null);
									setActiveForm(null);
								}
							} catch (_error) {
								console.warn('Failed to derive form id from category_path', _error);
							}
						}
					}
					// store editing catalog id if present so submit uses update
					// use parsedObj (already narrowed to Record<string, unknown>) instead of raw parsed to satisfy TS
					if (parsedObj && parsedObj.catalog_id) {
						setEditingCatalogId(String(parsedObj.catalog_id));
					}
					// Open Add Product Details tab/step
					setActiveStep(1);
					// remove stored key so future navigations don't auto-open
					globalThis.localStorage?.removeItem('techpotli_selected_catalog');
				}
			}
					} catch (error) {
						console.warn('Failed to hydrate selected catalog', error);
					}
		// Also check query param activeStep to set step accordingly
		try {
			if (typeof globalThis !== 'undefined') {
				const params = new URLSearchParams(globalThis.location?.search || '');
				const as = params.get('activeStep');
				if (as) {
					const n = Number(as);
					if (!Number.isNaN(n)) setActiveStep(n);
				}
			}
		} catch {
			// ignore
		}
	}, []);
	// Snackbar for messages (prefix unused binding with _ to satisfy lint rule)

	// Validation helper: returns an array of missing fields descriptions (empty if valid)
	const validateRequiredFields = (formsToCheck: ProductForm[]): string[] => {
		const missing: string[] = [];
		// Define required fields per section.
		// Note: many forms store Net Weight and Product Name under ProductSizeInventory (see forms-json).
		// Validate the canonical required fields against ProductSizeInventory to avoid false positives.
		// Make all fields from ProductDetails required by default (labels come from the active form definition)
		const productDetailsRequired: string[] = Array.isArray(form?.ProductDetails) ? form.ProductDetails.map(f => f.label) : [];
		// Required fields in the size/inventory section. Some fields are stored per-size as `<label>_<size>` keys,
		// so validator will accept either the plain key or any `<label>_...` variant.
		const sizeInventoryRequired = [
			"Net Weight (gm)",
			"Product Name",
			"Size",
			"GST %",
			"HSN Code",
			"Techpotli Price",
			"Wrong/Defective Returns Price",
			"MRP",
		];

		const isEmpty = (val: unknown) => {
			if (val === undefined || val === null) return true;
			if (typeof val === 'string') return val.trim() === '';
			if (Array.isArray(val)) return val.length === 0;
			return false;
		};

		for (const [i, f] of formsToCheck.entries()) {
			// i is index, f is form
			const pd = (f.ProductDetails || {}) as ProductSection;
			for (const key of productDetailsRequired) {
				if (isEmpty(pd[key])) missing.push(`Product ${i + 1}: ${key}`);
			}

			const psi = (f.ProductSizeInventory || {}) as ProductSection;
			for (const key of sizeInventoryRequired) {
				// Direct key (some forms store single values)
				if (!isEmpty(psi[key])) continue;
				// Check per-size variants like "Techpotli Price_S" or "Techpotli Price_Free Size"
			const anyPerSize = Object.keys(psi).some(k => k.startsWith(`${key}_`) && !isEmpty((psi as Record<string, unknown>)[k]));
				if (!anyPerSize) missing.push(`Product ${i + 1}: ${key}`);
			}
		}
		return missing;
	};

	// For Autocomplete
	const allCategoryPaths = React.useMemo(() => getAllCategoryPaths(categoryTree), []);
	const [searchValue, setSearchValue] = useState<string>('');
	
//console.log('uploadimages', uploadedImages);
	const { user } = useAuth();
	const router = useRouter();
	const [_submitError, setSubmitError] = React.useState<string | null>(null);
	// Upload images to backend
	const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB
	const _handleGenerateTemplate = async () => {
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
				img.addEventListener('error', () => reject(new Error('Image load error')));
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
		//console.log('Path', newPath);

		if (newPath.length === 4) {
			const fid = getFormIdFromCategoryTree(categoryTree, newPath);
			
			setSelectedFormId(fid);
			if (fid) {
				const formDef = (formsJson as unknown as Record<string, unknown>)[fid] as FormDef | undefined;
				if (formDef) {
					// Load form definition into state but do NOT automatically open the form UI.
					// The UI will remain on the category selection step until the user continues.
					setActiveForm(formDef);
				} else {
					setActiveForm(null);
					toast.info("Form available but definition not found.");
				}
			} else {
				setActiveForm(null);
				toast.info("Form not available for selected category");
			}
		}
	};

	const columns = [];
	let currentTree: Record<string, unknown> | null = categoryTree as unknown as Record<string, unknown>;
	//console.log('currentTree', currentTree);

	for (let level = 0; level < 4; level++) {
		if (currentTree === undefined) break;
		if (currentTree === null) break;
		if (typeof currentTree !== 'object') break;
		const options = Object.keys(currentTree);
		if (options.length === 0) break;
		//console.log('currentTree', currentTree);
	   
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
		// Safely read the next node and cast to the expected Record type so TypeScript knows the index signature exists
		const nextNode: Record<string, unknown> | null | undefined = (currentTree as Record<string, unknown>)[selectionPath[level] as string] as Record<string, unknown> | null | undefined;
		currentTree = nextNode === undefined ? null : (nextNode as Record<string, unknown> | null);
	}

// Helper: traverse category tree by path and read a formId if present on the leaf
function getFormIdFromCategoryTree(tree: Record<string, unknown> | string | null, path: string[]): string | null {
	let node: unknown = tree;
	for (const seg of path) {
		// Ensure node is an object with string keys (not an array)
		if (node && typeof node === 'object' && !Array.isArray(node)) {
			const obj = node as Record<string, unknown>;
			if (!(seg in obj)) return null;
			node = obj[seg];
		} else {
			return null;
		}
	}
	if (node === null || node === undefined) return null;
	if (typeof node === 'string') return node; // leaf could be a string form id
	// If node is an object, try to read a formId property
	if (typeof node === 'object' && !Array.isArray(node) && node !== null) {
		const obj = node as Record<string, unknown>;
		const formId = obj['formId'];
		if (typeof formId === 'string') return formId;
		
	}
	return null;
}

	// Use module-scoped _isLeaf helper
const url =getSiteURL();
//console.log(url+'assets/woemns category.png');
	// Show right panel if the selected path is a leaf (null) or the value is the string 'null'
// Show right panel only if the user has selected 4 levels AND there is an active form
// Also prevent opening the panel when a snackbar is being displayed for missing form
const showRightPanel = selectionPath.length === 4 && activeForm !== null;


	const [imageGuidelinesPopupOpen, setImageGuidelinesPopupOpen] = useState(false);
	

	const inputRef = React.useRef<HTMLInputElement>(null);
	const addProductInputRef = React.useRef<HTMLInputElement>(null);
	// allow multi-select for per-product input when triggered via Add Images in edit mode
	const [perProductMultiSelect, setPerProductMultiSelect] = useState<boolean>(false);

	// Helper to immutably update selectedImages at a given index.
	// `updater` can be an object to merge or a function (cur => newCur).
	const updateSelectedImageAt = (index: number, updater: Record<string, unknown> | ((cur?: SelectedImageItem) => SelectedImageItem)) => {
		setSelectedImages(prev => {
			const copy = [...prev];
			const cur = copy[index];
			let newVal: SelectedImageItem;
			if (typeof updater === 'function') {
	                // call updater with the proper function signature
	                newVal = (updater as (cur?: SelectedImageItem) => SelectedImageItem)(cur);
			} else {
				const base = (cur && typeof cur === 'object') ? { ...(cur as Record<string, unknown>) } : {} as Record<string, unknown>;
				newVal = { ...base, ...(updater as Record<string, unknown>) } as SelectedImageItem;
			}
			copy[index] = newVal;
			return copy;
		});
	};

	// ...existing code...

	// Handler for file input change (Add Product) — support multiple files: create previews, reserve slots, upload each file and update corresponding entries
	const handleAddProductImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;
	const fileArray = [...files];

		// Create preview items and reserve product slots
		const startIndex = selectedImages.length;
		const newItems: SelectedImageItem[] = fileArray.map((file) => ({ url: URL.createObjectURL(file), file } as SelectedImageItem));

		setSelectedImages(prev => {
			const merged = [...prev, ...newItems];
			return merged;
		});

		setProductForms(prev => {
			const formsCopy = [...prev];
			while (formsCopy.length < startIndex + newItems.length) formsCopy.push(initialFormData());
			return formsCopy;
		});

		// Move active product to last added
		setActiveProductIndex(startIndex + newItems.length - 1);

		try {
			const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bulkImgupload`;
			const uploaderId = (user as { id?: string } | null)?.id;

			// Upload files sequentially to keep server-friendly and preserve ordering
			for (const [i, file] of fileArray.entries()) {
				const idx = startIndex + i;
				// mark this index as uploading so the UI can show a loader
				setUploadingIndices(prev => ({ ...prev, [idx]: true }));
				try {
					const formData = new FormData();
					formData.append('images', file);
					if (uploaderId) formData.append('uploaderId', uploaderId);
					const res = await fetch(uploadUrl, { method: 'POST', body: formData });
					if (!res.ok) {
						const txt = await res.text();
						console.error('Upload failed', txt);
						toast.error('Image upload failed. Showing preview only.');
						continue;
					}
					const body = await res.json();
					const uploaded: UploadedFile[] = (body.files || []) as UploadedFile[];
					const rec = uploaded[0] || null;
					const pub = rec?.publicUrl ?? null;
					const signed = rec?.signedUrl ?? null;

					// Update selectedImages at the specific index
					updateSelectedImageAt(idx, (cur) => {
						const base = (cur && typeof cur === 'object') ? { ...(cur as Record<string, unknown>) } : {} as Record<string, unknown>;
						if (pub) base.publicUrl = pub;
						else if (signed) base.signedUrl = signed;
						base.url = pub || base.url || signed || base.url;
						// ensure gallery exists
						base.gallery = Array.isArray(base.gallery) ? [...(base.gallery as string[])] : [];
						// any additional uploaded elements after first should go into gallery
						const additional = (uploaded || []).slice(1).map((p: UploadedFile | null | undefined) => p?.publicUrl).filter(Boolean) as string[];
						for (const g of additional) {
							if (!(base.gallery as string[]).includes(g)) (base.gallery as string[]).push(g);
						}
						return base as SelectedImageItem;
					});

					// Merge publicUrl into productForms OtherAttributes.image_urls for this product
					if (pub || signed) {
						setProductForms(prev => {
							const copy = [...prev];
							if (!copy[idx]) copy[idx] = initialFormData();
							if (!copy[idx].OtherAttributes) copy[idx].OtherAttributes = {};
							const other = copy[idx].OtherAttributes as Record<string, unknown>;
							const existing = Array.isArray(other.image_urls) ? (other.image_urls as string[]) : [];
							other.image_urls = [...new Set([...existing, ...(pub ? [pub] : [])])];
							return copy;
						});

						// store uploaded metadata
						_setUploadedImagesjson(prev => {
							try {
								const toPush: UploadedFile = rec ?? { img_id: undefined, publicUrl: undefined, storagePath: undefined, signedUrl: undefined };
								return [...prev, toPush];
							} catch {
								return prev;
							}
						});

						if (signed) toast.success('Image uploaded and product added', { autoClose: 1500 });
					}
				} catch (error) {
					console.error('Error uploading add-product image', error);
					toast.error('Failed to upload image. Showing preview only.');
				} finally {
					// clear uploading flag for this index
					setUploadingIndices(prev => {
						const copy = { ...prev };
						delete copy[idx];
						return copy;
					});
				}
			}
		} catch (error) {
			console.error('Error during bulk add-product upload loop', error);
			toast.error('Failed to add images');
		} finally {
			if (addProductInputRef.current) addProductInputRef.current.value = '';
		}
	};

	const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;
		const fileArray = [...files];
		const prevCount = selectedImages.length;

		try {
			// For each file: create a preview object and keep the File for later upload
			const newItems: SelectedImageItem[] = fileArray.map((file) => {
				const dataUrl = URL.createObjectURL(file);
				return { url: dataUrl, file, img_id: undefined } as SelectedImageItem;
			});

			// Append previews and ensure productForms length
			setSelectedImages(prev => {
				const merged = [...prev, ...newItems];
				return merged;
			});

			setProductForms(prev => {
				const formsCopy = [...prev];
				while (formsCopy.length < prevCount + newItems.length) formsCopy.push(initialFormData());
				// No img_id available at selection time; img_id will be set after server upload
				return formsCopy;
			});

			// Make UI show popup with previews
			setPopupOpen(true);
			// Move active product to last added
			setActiveProductIndex(prevCount + newItems.length - 1);
		} catch (error) {
			console.error('Error processing selected images', error);
			toast.error('Failed to add images');
		} finally {
			// Reset input so same file can be selected again
			if (inputRef.current) inputRef.current.value = '';
		}
	};

	// Define the slots for product images
	const _imageSlots = [
	  { key: 'front1', label: 'Front View *', desc: 'Upload Front View Image' },
	  { key: 'front2', label: 'Front View *', desc: 'Upload Front View Image' },
	  { key: 'back1', label: 'Back View *', desc: 'Upload Back View Image' },
	  { key: 'back2', label: 'Back View *', desc: 'Upload Back View Image' },
	  { key: 'size', label: 'Size Chart *', desc: 'Size chart size wise body measurements should be given.' },
	];

	// State to hold images for each slot
	const [_slotImages, _setSlotImages] = useState<{ [key: string]: string | null }>({
	  front1: null,
	  front2: null,
	  back1: null,
	  back2: null,
	  size: null,
	});




	type FormDef = {
		AddProductDetails: { ProductSizeInventory: FormField[] };
		ProductDetails: FormField[];
		OtherAttributes: FormField[];
	};

	function isFormDef(obj: unknown): obj is FormDef {
		if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
		const o = obj as Record<string, unknown>;

		const add = o["AddProductDetails"];
		if (!add || typeof add !== "object" || Array.isArray(add)) return false;
		const addRec = add as Record<string, unknown>;
		if (!Array.isArray(addRec["ProductSizeInventory"])) return false;
		const psi = addRec["ProductSizeInventory"] as unknown[];
		if (!psi.every(el => el && typeof el === "object" && !Array.isArray(el) && typeof (el as Record<string, unknown>)["type"] === "string" && typeof (el as Record<string, unknown>)["label"] === "string")) return false;

		const pd = o["ProductDetails"];
		if (!Array.isArray(pd) || !pd.every(el => el && typeof el === "object" && !Array.isArray(el) && typeof (el as Record<string, unknown>)["type"] === "string" && typeof (el as Record<string, unknown>)["label"] === "string")) return false;

		const oa = o["OtherAttributes"];
		if (!Array.isArray(oa) || !oa.every(el => el && typeof el === "object" && !Array.isArray(el) && typeof (el as Record<string, unknown>)["type"] === "string" && typeof (el as Record<string, unknown>)["label"] === "string")) return false;

		return true;
	}

	const form: FormDef = (() => {
		const root = formsJson as unknown;
		if (selectedFormId && root && typeof root === "object" && !Array.isArray(root)) {
			const candidate = (root as Record<string, unknown>)[selectedFormId];
			if (isFormDef(candidate)) return candidate;
		}
		return {
			AddProductDetails: { ProductSizeInventory: [] },
			ProductDetails: [],
			OtherAttributes: [],
		};
	})();

interface FormField {
	type: "dropdown" | "text" | "textarea";
	label: string;
	placeholder?: string;
	options?: string[];
	maxlength?: number;
	info?: string;
}

// Pass productIndex to renderField for per-product state

// --- Add these hooks and handlers before renderField ---
const [_sizePopoverAnchor, setSizePopoverAnchor] = useState<null | HTMLElement>(null);
const [sizePopoverValue, setSizePopoverValue] = useState<string[]>([]);
const [sizePopoverProductIndex, setSizePopoverProductIndex] = useState<number | null>(null);
const [sizePopoverSection, setSizePopoverSection] = useState<keyof ProductForm | "">("");
const [sizePopoverLabel, setSizePopoverLabel] = useState<string>("");

// Copy-all checkbox state (ensures `copyAll` is defined before any usage)
const [copyAll, setCopyAll] = useState<boolean>(false);
// Delete confirmation dialog state
const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

const handleProceedDelete = () => {
	try {
		const idx = activeProductIndex;
		const oldLen = productForms.length;
		// remove product at idx from productForms
		setProductForms(prev => {
			const copy = [...prev];
			if (idx >= 0 && idx < copy.length) copy.splice(idx, 1);
			return copy;
		});
		// remove corresponding selected image
		setSelectedImages(prev => {
			const copy = [...prev];
			if (idx >= 0 && idx < copy.length) copy.splice(idx, 1);
			return copy;
		});
		// remove uploadedImages entry
		setUploadedImages(prev => {
			const copy = [...prev];
			if (idx >= 0 && idx < copy.length) copy.splice(idx, 1);
			return copy;
		});
		// remove uploaded metadata
		_setUploadedImagesjson(prev => {
			const copy = [...prev];
			if (idx >= 0 && idx < copy.length) copy.splice(idx, 1);
			return copy;
		});

		const newLen = Math.max(0, oldLen - 1);
		const newIndex = newLen === 0 ? 0 : Math.min(idx, newLen - 1);
		setActiveProductIndex(newIndex);
		setDeleteDialogOpen(false);
		toast.success('Product deleted from catalog', { autoClose: 1500 });
	} catch (error) {
		console.error('Failed to delete product', error);
		toast.error('Failed to delete product');
		setDeleteDialogOpen(false);
	}
};

const handleCancelDelete = () => setDeleteDialogOpen(false);

const _handleSizeDropdownClick = (
  e: React.MouseEvent<HTMLElement>,
  value: string | string[],
  productIndex: number,
  section: keyof ProductForm | "",
  label: string
) => {
  setSizePopoverAnchor(e.currentTarget);
  // Normalize to string[] (if a single string is passed, convert to a single-item array)
  setSizePopoverValue(Array.isArray(value) ? value : (value ? [value] : []));
  setSizePopoverProductIndex(productIndex);
  setSizePopoverSection(section);
  setSizePopoverLabel(label);
};

const _handleSizePopoverClose = () => {
	setSizePopoverAnchor(null);
};

const _handleSizePopoverApply = () => {
  if (
	sizePopoverProductIndex !== null &&
	sizePopoverSection &&
	sizePopoverLabel
  ) {
	const sectionKey = sizePopoverSection as keyof ProductForm;
	setProductForms((forms) => {
	  const updated = [...forms];
	  if (!updated[sizePopoverProductIndex]) updated[sizePopoverProductIndex] = initialFormData();
	  // Cast the product entry to a generic record so we can safely ensure the section is an object
	  const target = updated[sizePopoverProductIndex] as unknown as Record<string, unknown>;
	  if (!target[sectionKey] || typeof target[sectionKey] === 'string') {
		target[sectionKey] = {};
	  }
	  const sectionObj = target[sectionKey] as ProductSection;
	  sectionObj[sizePopoverLabel] = sizePopoverValue;
			if (copyAll) {
				return updated.map(() => deepClone(updated[sizePopoverProductIndex]));
			}
	  return updated;
	});
  }
  setSizePopoverAnchor(null);
};

const _handleSizePopoverClear = () => {
	setSizePopoverValue([]);
};
// --- End of added hooks and handlers ---

// Local size options JSON (can be moved to external JSON file)
// Use sizes from formsJson if available (search common locations), fallback to defaults
const sizeOptionsJson: string[] = (() => {
	const obj = formsJson as unknown as Record<string, unknown>;
//console.log('new', obj);
	// First, check the structured AddProductDetails.ProductSizeInventory in form_101
	try {
		const f101 = typeof selectedFormId === 'string' ? obj[selectedFormId] : undefined;
		if (f101 && typeof f101 === 'object') {
			const f101Obj = f101 as Record<string, unknown>;
			const add = f101Obj['AddProductDetails'];
			if (add && typeof add === 'object') {
				const addObj = add as Record<string, unknown>;
				const psi = addObj['ProductSizeInventory'];
				if (Array.isArray(psi)) {
					for (const field of psi) {
						if (field && typeof field === 'object') {
							const fieldObj = field as Record<string, unknown>;
							const label = String(fieldObj.label || '').toLowerCase();
							const options = fieldObj.options;
							if (label.includes('size') && Array.isArray(options)) {
								const opts = options as unknown[];
								if (opts.every((it): it is string => typeof it === 'string')) return opts as string[];
							}
						}
					}
				}
			}
		}
	} catch {
		// ignore and fall back
	}

	const candidatePaths: string[][] = [
		['sizeOptions'],
		['size_options'],
		['sizes'],
		['sizeOptionsJson'],
		['common', 'sizeOptions'],
		['common', 'sizes'],
		
	];

	for (const path of candidatePaths) {
		// Use unknown and narrow before indexing to satisfy TS safely
		let cur: unknown = obj;
		for (const seg of path) {
			if (cur && typeof cur === 'object' && seg in (cur as Record<string, unknown>)) {
				cur = (cur as Record<string, unknown>)[seg];
			} else {
				cur = undefined;
				break;
			}
		}
		if (Array.isArray(cur) && cur.every((it: unknown) => typeof it === 'string')) return cur as string[];
	}

	return ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
})();

// Size filter popover-specific state & handlers (for the small standalone size filter UI)
const [sizeFilterAnchor, setSizeFilterAnchor] = useState<HTMLElement | null>(null);
const [filterFreeSize, setFilterFreeSize] = useState<boolean>(false);
const [selectedSizeFilters, setSelectedSizeFilters] = useState<Record<string, boolean>>(() => {
	const map: Record<string, boolean> = {};
	for (const s of sizeOptionsJson) map[s] = false;
	return map;
});

const _handleSizeInputClick = (e: React.MouseEvent<HTMLElement>) => {
	setSizeFilterAnchor(e.currentTarget);
};

const handleClearFilter = () => {
	setFilterFreeSize(false);
	setSelectedSizeFilters(() => {
		const map: Record<string, boolean> = {};
		for (const s of sizeOptionsJson) map[s] = false;
		return map;
	});
};

const handleApplyFilter = () => {
	// In this simplified implementation we set ProductSizeInventory on the first product when applied
	const selected = Object.keys(selectedSizeFilters).filter(k => selectedSizeFilters[k]);
	if (filterFreeSize) selected.push('Free Size');
	setProductForms(forms => {
		const updated = [...forms];
		if (!updated[0]) updated[0] = initialFormData();
		(updated[0].ProductSizeInventory as ProductSection)['Size'] = selected.length === 1 ? selected[0] : selected;
		return updated;
	});
	setSizeFilterAnchor(null);
};


// --- Modern two-column form field renderer with info icons and required asterisks ---
const renderField = (
	field: FormField,
	index: number,
	section: Exclude<keyof ProductForm, 'id'>,
	productIndex: number
) => {
	// Narrow the section to ProductSection before indexing to satisfy TS
	const sectionObj = (productForms[productIndex]?.[section]) as ProductSection | undefined;
	const value = (sectionObj?.[field.label] ?? "") as string | string[] | number;

	const handleChange = (
		e: SelectChangeEvent<string | number | string[]> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		_child?: React.ReactNode
	) => {
		// Normalize value from different event shapes (SelectChangeEvent or input change)
		const selectEvent = e as SelectChangeEvent<string | number | string[]>;
		const inputEvent = e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
		const rawVal = selectEvent.target?.value ?? inputEvent.target?.value ?? "";
		// Narrow the value to the allowed ProductSection value types
		const val = rawVal as string | number | string[] | boolean | Record<string, unknown>;
		setProductForms(forms => {
			let updated = [...forms];
			if (!updated[productIndex]) updated[productIndex] = initialFormData();
			if (!updated[productIndex][section]) updated[productIndex][section] = {};
			// Ensure the section object is treated as ProductSection before assignment
			const sectionObj = updated[productIndex][section] as ProductSection;
			sectionObj[field.label] = val;
					if (copyAll) {
						updated = updated.map(() => deepClone(updated[productIndex]));
					}
			return updated;
		});
	};

	// Info icon tooltips and sublabels for specific fields
	const infoMap: Record<string, string> = {
		"Net Weight (gm)": "Enter the net weight of the product in grams.",
		"Product Name": "Enter the product name as you want it to appear to customers.",
		"Style Code / Product ID (optional)": "This is an optional field for your internal reference.",
	};
	const subLabelMap: Record<string, string> = {
		"Net Weight (gm)": "(gms)",
		"Style Code / Product ID": "(optional)",
	};
	// Fields that should always be required by label
	const alwaysRequired = ["Net Weight (gm)", "Product Name", "Size", "GST %", "HSN Code"];
	// Make entire ProductDetails section required, and ensure GST % / HSN Code are required in ProductSizeInventory (size/inventory)
	const isRequired = section === "ProductDetails" || alwaysRequired.includes(field.label) || (section === "ProductSizeInventory" && ["GST %", "HSN Code"].includes(field.label));
	// Prefer info supplied in forms JSON; fall back to hard-coded map
	const infoText = field.info ?? infoMap[field.label];
	const showInfo = typeof infoText === 'string' && infoText.length > 0;
	const subLabel = subLabelMap[field.label];

	// Label and input inline (side by side)
	const labelNode = (
		<Box sx={{ display: 'flex', alignItems: 'center', minWidth: 160, pr: 2 }}>
			<span style={{ fontWeight: 500, color: '#222', fontSize: 12 }}>{field.label.replace(' (gm)', '')}</span>
			{isRequired && <span style={{ color: '#f44336', marginLeft: 2 }}>*</span>}
			{showInfo && (
				<Tooltip title={infoText} arrow placement="top">
					<InfoOutlinedIcon sx={{ fontSize: 16, color: '#888', ml: 0.5, verticalAlign: 'middle', cursor: 'pointer' }} />
				</Tooltip>
			)}
			{subLabel && (
				<span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{subLabel}</span>
			)}
		</Box>
	);

	if (field.type === "dropdown" && field.label.toLowerCase().includes("size")) {
		// For size fields, open our custom popover driven by sizeOptionsJson
		const displayVal = Array.isArray(value) ? (value as string[]).join(', ') : (value as string);
		return (
			<Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
				{labelNode}
				<TextField
					value={displayVal}
					required={isRequired}
					onClick={(e) => _handleSizeDropdownClick(e, value as string | string[], productIndex, section, field.label)}
					placeholder="Select size"
					fullWidth
					sx={{ minWidth: 200, background: '#fff', cursor: 'pointer' }}
					InputProps={{ readOnly: true }}
				/>
			</Box>
		);
	}
	if (field.type === "dropdown") {
		return (
			<Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
				{labelNode}
				<FormControl fullWidth sx={{ minWidth: 200 }} required={isRequired}>
					<Select
						value={value}
						onChange={handleChange}
						displayEmpty
						inputProps={{ 'aria-label': field.label, 'aria-required': isRequired }}
						required={isRequired}
						sx={{ background: '#fff' }}
					>
						<MenuItem value="">Select</MenuItem>
						{field.options?.map((opt: string, i: number) => (
							<MenuItem key={i} value={opt}>{opt}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
		);
	}
	if (field.type === "text") {
		return (
			<Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
				{labelNode}
				<TextField
					placeholder={field.placeholder || ""}
					value={value}
					required={isRequired}
					onChange={handleChange}
					fullWidth
					sx={{ minWidth: 200, background: '#fff' }}
				/>
			</Box>
		);
	}
	if (field.type === "textarea") {
		return (
			<Box key={index} sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
				{labelNode}
				<TextField
					placeholder={field.placeholder || ""}
					multiline
					rows={3}
					value={value}
					required={isRequired}
					onChange={handleChange}
					inputProps={{ maxLength: field.maxlength || 500 }}
					fullWidth
					sx={{ minWidth: 200, background: '#fff' }}
				/>
			</Box>
		);
	}
	return null;
};

		return (<>
			{/* Size Filter Input with Popover */}
			
				
				<Popover
					open={Boolean(sizeFilterAnchor)}
					anchorEl={sizeFilterAnchor}
					onClose={() => setSizeFilterAnchor(null)}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					transformOrigin={{ vertical: 'top', horizontal: 'left' }}
					PaperProps={{ sx: { p: 2, borderRadius: 2, boxShadow: 3, minWidth: 220 } }}
				>
					<FormControlLabel
						control={
							<input
								type="checkbox"
								checked={filterFreeSize}
								onChange={e => setFilterFreeSize(e.target.checked)}
								style={{ accentColor: '#4d0aff', width: 18, height: 18 }}
							/>
						}
						label={<Typography sx={{ fontWeight: 500, color: '#222', fontSize: 16 }}>Free Size</Typography>}
						sx={{ mb: 2, ml: 0 }}
					/>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 220, overflowY: 'auto', pr: 1 }}>
						{sizeOptionsJson.filter(s => s !== 'Free Size').map(opt => (
							<label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<input
									type="checkbox"
									checked={!!selectedSizeFilters[opt]}
									onChange={e => setSelectedSizeFilters(prev => ({ ...prev, [opt]: e.target.checked }))}
									style={{ accentColor: '#4d0aff', width: 16, height: 16 }}
								/>
								<span style={{ fontSize: 14 }}>{opt}</span>
							</label>
						))}
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
						<Button
							variant="text"
							sx={{ color: '#4d0aff', fontWeight: 600, textTransform: 'none', pl: 0 }}
							onClick={handleClearFilter}
						>
							Clear Filter
						</Button>
						<Button
							variant="contained"
							sx={{ background: '#4d0aff', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, ml: 'auto' }}
							onClick={handleApplyFilter}
						>
							Apply
						</Button>
					</Box>
				</Popover>
				{/* Per-product size popover (opens when user clicks a Size field in the form) */}
				<Popover
					open={Boolean(_sizePopoverAnchor)}
					anchorEl={_sizePopoverAnchor}
					onClose={_handleSizePopoverClose}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					transformOrigin={{ vertical: 'top', horizontal: 'left' }}
					PaperProps={{ sx: { p: 2, borderRadius: 2, boxShadow: 3, minWidth: 220 } }}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 260, overflowY: 'auto', pr: 1 }}>
						{sizeOptionsJson.map(opt => (
							<label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<input
									type="checkbox"
									checked={sizePopoverValue.includes(opt)}
									onChange={e => {
										const checked = e.target.checked;
										setSizePopoverValue(prev => checked ? [...new Set([...prev, opt])] : prev.filter(s => s !== opt));
									}}
									style={{ accentColor: '#4d0aff', width: 16, height: 16 }}
								/>
								<span style={{ fontSize: 14 }}>{opt}</span>
							</label>
						))}
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
						<Button
							variant="text"
							sx={{ color: '#4d0aff', fontWeight: 600, textTransform: 'none', pl: 0 }}
							onClick={() => setSizePopoverValue([])}
						>
							Clear
						</Button>
						<Button
							variant="contained"
							sx={{ background: '#4d0aff', color: '#fff', fontWeight: 700, borderRadius: 2, px: 3, ml: 'auto' }}
							onClick={_handleSizePopoverApply}
						>
							Apply
						</Button>
					</Box>
				</Popover>
		{/* Trigger for demo: open popup when clicking first image */}
		{/* <Button onClick={handleOpenPopup} sx={{ mb: 2 }}>Open Product Images Popup</Button> */}

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
						// Green for completed step 0
						'&.Mui-completed': {
							color: '#43C15A',
							fontWeight: 700,
						},
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
					<Step key={label} completed={index === 0 && activeStep > 0}>
						<StepLabel StepIconComponent={(props) => <CustomStepIcon {...props} step={index} activeStep={activeStep} />}>{label}</StepLabel>
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
	
	{activeStep === 0 && (<>
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
			
			{/* Delete confirmation dialog removed from here and rendered at top-level to avoid z-index/layout issues */}
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
						<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
							{selectedImages.map((img, idx) => {
								const imgUrl = resolvePreviewSrc(img);
								return (

										<Box key={idx} sx={{ position: 'relative', width: 80, height: 80, borderRadius: 2,  border: '1px solid #e0e0e0' }}>
													<PreviewImage key={imgUrl || `thumb-${idx}`} src={imgUrl} alt={`Product ${idx + 1}`} width={80} height={80} style={{ objectFit: 'cover', width: 80, height: 80 , borderRadius: 2, }} />
											<IconButton
												size="small"
												onClick={() => setSelectedImages(images => images.filter((_, i) => i !== idx))}
												sx={{ position: 'absolute', top: -6, right: -6, background: '#1b1717ff', width: 18, height: 18, p: 0 ,  color:' #e0e0e0',
													"&:hover": {
                                                           background: "#3b3636ff", // 🔴 red background on hover
                                                           color: "#fff",        // white icon color
                                                         },
												  }}
											>
												<CloseIcon sx={{ fontSize: 14 }} />
											</IconButton>
										</Box>
										
									
								);
							})}
						</Box>
					</Box>
					<Box sx={{ flex: 1 }}>
						<Typography sx={{ color: '#F44336', fontWeight: 700, mb: 2 }}>
							Image types which are not allowed
						</Typography>
						<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
							{imageTypeList.map((type) => (
								<Paper key={type.label} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
									<Image src={type.icon} alt={type.label} width={40} height={40} style={{ objectFit: 'contain' }} />
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
			</>)}
		{/* Step 2: Add Product Details - Image Slots */}
{activeStep === 1 && (() => {
	const selectedSizes = productForms[activeProductIndex]?.ProductSizeInventory?.["Size"] || [];
	return (
	<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, }}>
		{/* Product Tabs */}
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, maxWidth: '1150px', overflowX: 'auto' }}>

					{(productForms && productForms.length > 0 ? Array.from({ length: productForms.length }) : selectedImages).map((_, idx) => {
						// Render tabs deterministically from productForms when present, otherwise use selectedImages
						// Use a single main image per product; extra images remain in the gallery
						let thumbSrc = '';
						const prodItem = selectedImages[idx] as SelectedImageItem | undefined;
						if (prodItem) thumbSrc = resolvePreviewSrc(prodItem);
						// Fallback to productForms OtherAttributes.image_urls[0]
						if (!thumbSrc && productForms && productForms[idx] && productForms[idx].OtherAttributes) {
							const oa = productForms[idx].OtherAttributes as Record<string, unknown> | undefined;
							if (oa) {
								const arr = Array.isArray(oa.image_urls) ? (oa.image_urls as unknown[]) : [];
								if (arr.length > 0 && typeof arr[0] === 'string') thumbSrc = String(arr[0]);
							}
						}
      //console.log('Thumbnail Source:', thumbSrc); // Debug log to verify the thumbnail source
				return (
				<Button
					key={idx}
					variant={activeProductIndex === idx ? "contained" : "outlined"}
					color={activeProductIndex === idx ? "primary" : "inherit"}
					onClick={() => setActiveProductIndex(idx)}
					sx={{ minWidth: 120, display: 'flex', alignItems: 'center', gap: 1 }}
				>
					<Box sx={{ position: 'relative', width: 48, height: 48, mr: 1 }}>
						<PreviewImage key={thumbSrc || `tab-${idx}`} src={thumbSrc} alt={`Product ${idx + 1}`} width={48} height={48} style={{ width:48, height:48,borderRadius: 4, border: activeProductIndex === idx ? '2px solid #6366f1' : '1px solid #ccc' }} />
						{uploadingIndices[idx] && (
							<Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 1 }}>
								<Box sx={{ width: 24, height: 24, border: '3px solid #ccc', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
							</Box>
						)}
					</Box>
					Product {idx + 1}
				</Button>
				);
			})}
			{(productForms?.length ?? 0) < 9 && (
				<>
					<Button
						variant="outlined"
						color="primary"
						sx={{ minWidth: 120, height: 56, display: 'flex', alignItems: 'center', gap: 1, borderStyle: 'dashed', borderColor: '#6366f1' }}
						onClick={() => {
							if (addProductInputRef.current) addProductInputRef.current.value = '';
							addProductInputRef.current?.click();
						}}
					>
						<Add sx={{ fontSize: 28, color: '#6366f1' }} />
						Add Product
					</Button>
					<input
						type="file"
						accept="image/*"
						multiple
						ref={addProductInputRef}
						style={{ display: 'none' }}
						onChange={handleAddProductImage}
					/>
				</>
			)}
		</Box>
		{/* Main Content */}
		<Box sx={{ display: "flex", gap: 2, mb: 10 }}>
			{/* Left: Form */}
			<Paper sx={{ flex: 2, p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Typography variant="h5" sx={{fontWeight:"1600px"}}>Add Product Details</Typography>
					{productForms.length > 1 && (
						<Button
						  color="primary"
						  variant="text"
						  onClick={() => setDeleteDialogOpen(true)}
						  sx={{ textTransform: 'none', color: '#4d0aff', fontWeight: 600, ":hover": { backgroundColor: "#ffffffff" } }}
						  startIcon={<DeleteIcon />}
						>
						  Delete this product from catalog
						</Button>
					)}
				</Box>
				{activeProductIndex === 0 && (
					<>
					<Box sx={{  mx: 1 ,backgroundColor: "#f2f5fa" , p:2 , borderRadius: 1, }}>
						<FormControlLabel
							control={<input type="checkbox" checked={copyAll} onChange={e => {
								const checked = e.target.checked;
								setCopyAll(checked);
											if (checked && productForms[activeProductIndex]) {
												setProductForms(forms => forms.map(() => deepClone(forms[activeProductIndex])));
											}
							}} />}
							label="Copy input details to all product "
						/>
						<Typography variant="body2" sx={{ ml:1,mt: 0, color: "#555" }}>
							If you want to change specific fields for particular product like Color, Fabric etc, you can change it by selecting that product.
						</Typography>
						</Box>
					</>
				)}
				<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
					{/* Product, Size and Inventory */}
										<Box>
												<Typography variant="h6" gutterBottom>
														Product, Size and Inventory
												</Typography>
												<Divider sx={{ mt: 1, mb:2}} />
												<Box sx={{
													display: 'grid',
													gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
													gap: 3,
													alignItems: 'center',
												}}>
													{form.AddProductDetails.ProductSizeInventory.map((field, idx) =>
														renderField(field, idx, "ProductSizeInventory", activeProductIndex)
													)}
												</Box>
										</Box>
					{/* Get selected sizes for this product */}
		{Array.isArray(selectedSizes) && selectedSizes.length > 0 && (
		  <Box sx={{ mt: -2, mb: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
			  <FormControlLabel
				control={
				  <input
					type="checkbox"
					checked={Boolean(productForms[activeProductIndex]?.ProductSizeInventory?.copyPriceAll)}
					onChange={e => {
					  const checked = e.target.checked;
					  setProductForms(forms => {
						const updated = [...forms];
						if (!updated[activeProductIndex]) updated[activeProductIndex] = initialFormData();
						if (!updated[activeProductIndex].ProductSizeInventory) updated[activeProductIndex].ProductSizeInventory = {};
						updated[activeProductIndex].ProductSizeInventory.copyPriceAll = checked;
						// If checked, copy first row's values to all
						if (checked && selectedSizes.length > 1) {
						  const first = selectedSizes[0];
							const fields = ["Techpotli Price", "Wrong/Defective Returns Price", "MRP", "Inventory", "SKU (Optional)","Actions"];
							for (const field of fields) {
								const val = updated[activeProductIndex].ProductSizeInventory[`${field}_${first}`] || "";
								for (const size of selectedSizes) {
									updated[activeProductIndex].ProductSizeInventory[`${field}_${size}`] = val;
								}
							}
						}
						return updated;
					  });
					}}
				  />
				}
				label="Copy price details to all sizes"
				sx={{ mb: 0, ml:2 }}
			  />
			
			</Box>
			<Box sx={{ overflowX: "auto", borderRadius: 1, border: "1px solid #e0e0e0", width:800  }}>
			  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
				<thead style={{ background: "#f5f6fa" }}>
								<tr>
											<th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>Size</th><th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>Techpotli Price&nbsp;<sup>*</sup><Tooltip title={<span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>This is the normal/regular price at which you sell on Techpotli. This price shall be lower than the Maximum Retail Price (MRP) of the Product.</span>} arrow placement="bottom" enterTouchDelay={0} leaveTouchDelay={3000} slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { backgroundColor: '#2B2B2B', color: 'white', border: '1px solid #000000' } } } }}><InfoOutlinedIcon sx={{ fontSize: 18, color: '#888', cursor: 'pointer', ml: 0.5, verticalAlign: 'middle' }} /></Tooltip></th><th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>Wrong/Defective Returns Price&nbsp;<sup>*</sup><Tooltip title={<span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>Customers buying at this price can only return wrong/defective delivered items</span>} arrow placement="bottom" enterTouchDelay={0} leaveTouchDelay={3000} slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { backgroundColor: '#2B2B2B', color: 'white', border: '1px solid #000000' } } } }}><InfoOutlinedIcon sx={{ fontSize: 18, color: '#888', cursor: 'pointer', ml: 0.5, verticalAlign: 'middle' }} /></Tooltip></th><th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>MRP&nbsp;<sup>*</sup><Tooltip title={<span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>“MRP” stands for “Maximum Retail Price”. It&apos;s the highest price that a seller is allowed to sell a product for including taxes, charges added on the basic price of the product. No seller can sell a product for a price higher than MRP. Acceptable in INR ONLY. This information is generally available on the packaging label for pre-packed products. If you are not listing a pre-packed product, please provide the MRP as per the explanation above.</span>} arrow placement="bottom" enterTouchDelay={0} leaveTouchDelay={3000} slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { backgroundColor: '#2B2B2B', color: 'white', border: '1px solid #000000' } } } }}><InfoOutlinedIcon sx={{ fontSize: 18, color: '#888', cursor: 'pointer', ml: 0.5, verticalAlign: 'middle' }} /></Tooltip></th><th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>Inventory&nbsp;<sup>*</sup></th><th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>SKU (Optional)</th><th style={{ textAlign: "left", padding: 12, fontWeight: 600 }}>Action</th>
										</tr>
				</thead>
				<tbody>
									{selectedSizes.map((size: string, idx: number) => (
										<tr key={size}>
											<td style={{ padding: 12 }}>{size}</td>{["Techpotli Price", "Wrong/Defective Returns Price", "MRP", "Inventory", "SKU"].map(field => (
												<td style={{ padding: 12 }} key={field}>
													<TextField
														size="small"
														value={productForms[activeProductIndex]?.ProductSizeInventory?.[`${field}_${size}`] || ""}
														onChange={e => {
															const val = e.target.value;
															setProductForms(forms => {
																const updated = [...forms];
																if (!updated[activeProductIndex]) updated[activeProductIndex] = initialFormData();
																if (!updated[activeProductIndex].ProductSizeInventory) updated[activeProductIndex].ProductSizeInventory = {};
																updated[activeProductIndex].ProductSizeInventory[`${field}_${size}`] = val;
																// If "copy all" is checked and editing first row, update all
																if (
																	productForms[activeProductIndex]?.ProductSizeInventory?.copyPriceAll &&
																	idx === 0
																) {
																	for (const sz of selectedSizes) {
																		updated[activeProductIndex].ProductSizeInventory[`${field}_${sz}`] = val;
																	}
																}
																return updated;
															});
														}}
														placeholder={field}
													/>
												</td>
											))}
											<td style={{ padding: 12 }}>
												<Button
													color="error"
													size="small"
													onClick={() => {
														// Remove this size from selectedSizes and all related fields
														setProductForms(forms => {
															const updated = [...forms];
															if (!updated[activeProductIndex]) updated[activeProductIndex] = initialFormData();
															const inv = updated[activeProductIndex].ProductSizeInventory || {};
															const newSizes = selectedSizes.filter(sz => sz !== size);
															inv.Size = newSizes;
															for (const field of ["Meesho Price", "Wrong/Defective Returns Price", "MRP", "Inventory", "SKU"]) {
																delete inv[`${field}_${size}`];
															}
															updated[activeProductIndex].ProductSizeInventory = inv;
															return updated;
														});
													}}
												>
													Delete
												</Button>
											</td>
										</tr>
									))}
				</tbody>
			  </table>
			</Box>
		  </Box>
		)}
					{/* Product Details */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Product Details
						</Typography>
						<Divider sx={{ mt: 1, mb:2}} />
						<Box sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
							gap: 3,
							alignItems: 'center',
						}}>
							{form.ProductDetails.map((field, idx) => renderField(field, idx, "ProductDetails", activeProductIndex))}
						</Box>
					</Box>
					{/* Other Attributes */}
					<Box>
						<Typography variant="h6" gutterBottom>
							Other Attributes
						</Typography>
						<Divider sx={{ mt: 1, mb:2}} />
						<Box sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
							gap: 3,
							alignItems: 'center',
						}}>
							{form.OtherAttributes.map((field, idx) => renderField(field, idx, "OtherAttributes", activeProductIndex))}
						</Box>
					</Box>
				</Box>
				</Paper>
				
			{/* Right Sidebar */}
			<Paper sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 2, alignItems: "stretch", boxSizing: "border-box", maxHeight: "100vh", overflowY: "auto" }}>
				<Typography variant="subtitle1">Follow guidelines to reduce quality check failure</Typography>
				<Typography variant="body2" color="text.secondary">
					- Images with text/watermark are not acceptable in primary images.
					<br />- Product image should not have any text.
					<br />- Add product image without props.
				</Typography>
				<Typography variant="subtitle2" sx={{ mt: 2 }}>
					Add images with details listed here
				</Typography>
				<ul style={{ margin: 0, paddingLeft: "20px" }}>
					<li>Front View Image *</li>
					<li>Side View Image *</li>
					<li>Back View Image *</li>
					<li>Zoom View Image *</li>
				</ul>
				<Box sx={{ mt: 2 }}>
					<Typography variant="subtitle2">Uploaded Images</Typography>
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
						{(() => {
							const prodItem = selectedImages[activeProductIndex] as SelectedImageItem | undefined;
							const mainUrl: string | undefined = resolvePreviewSrc(prodItem) || undefined;
							const gallery: string[] = prodItem && typeof prodItem === 'object' && Array.isArray((prodItem as { gallery?: unknown }).gallery) ? (prodItem as { gallery?: string[] }).gallery as string[] : [];

							const openPerProductInput = (replaceMain = false, allowMulti = false) => {
								const el = document.querySelector<HTMLInputElement>(`#per-product-input-${activeProductIndex}`);
								if (!el) return;
								el.dataset.replace = replaceMain ? 'true' : 'false';
								// set flag to allow multi-select when opening via Add Images button in edit flow
								setPerProductMultiSelect(!!allowMulti);
								el.multiple = !!allowMulti;
								el.value = '';
								el.click();
								// clear the flag after short timeout to avoid leaving input in multi state
								setTimeout(() => {
									try { el.multiple = false; } catch { /* ignore */ }
									setPerProductMultiSelect(false);
								}, 5000);
							};
//console.log('gallery:', gallery); // Debug log to verify the gallery array
							const MAX_PER_PRODUCT = 5;
							const totalNow = (mainUrl ? 1 : 0) + (Array.isArray(gallery) ? gallery.length : 0);
							const removeGalleryAt = (gIndex: number) => {
								setSelectedImages(prev => {
									const copy = [...prev];
									const cur = copy[activeProductIndex] && typeof copy[activeProductIndex] === 'object' ? { ...(copy[activeProductIndex] as Record<string, unknown>) } : {} as Record<string, unknown>;
									cur.gallery = Array.isArray(cur.gallery) ? [...(cur.gallery as string[])] : [];
									(cur.gallery as string[]).splice(gIndex, 1);
									// if main missing and gallery has items, promote first gallery to main
									if (!cur.url && (cur.gallery as string[]).length > 0) {
										cur.url = (cur.gallery as string[]).shift();
									}
									copy[activeProductIndex] = cur as { url?: string; gallery?: string[] };
									return copy;
								});
							};

							const changeMainImage = () => openPerProductInput(true);

							return (
								<>
									{/* Main front image card */}
									<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
										<Box sx={{ position: 'relative', width: 80, height: 80, borderRadius: 1, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
											{mainUrl ? (
												<Box sx={{ position: 'relative', width: 80, height: 80 }}>
													<PreviewImage key={mainUrl || `main-${activeProductIndex}`} src={mainUrl} alt={`Main ${activeProductIndex + 1}`} width={80} height={80} style={{ objectFit: 'cover', width: 80, height: 80 }} onClick={changeMainImage} />
													{uploadingIndices[activeProductIndex] && (
														<Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)' }}>
															<Box sx={{ width: 32, height: 32, border: '4px solid #ddd', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
														</Box>
													)}
												</Box>
											) : (
												<Box
													onClick={() => openPerProductInput(false, true)}
													sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa', cursor: 'pointer' }}
												>
													<Add sx={{ color: '#6C63FF' }} />
												</Box>
											)}
										</Box>

										<Box sx={{ textAlign: 'center' }}>
											<Typography sx={{ fontSize: 12, fontWeight: 700 }}>Front Image <span style={{ color: '#f44336' }}>*</span></Typography>
											<Typography
												component="button"
												onClick={changeMainImage}
												sx={{ display: 'block', mt: 0.5, fontSize: 12, color: '#3a08c7', background: 'none', border: 'none', cursor: 'pointer', p: 0 }}
											>
												CHANGE
											</Typography>
										</Box>
									</Box>

									{/* Gallery thumbnails */}
										{gallery.map((g, gi) => (
										<Box key={gi} sx={{display:"flex", flexDirection: 'column', alignItems: 'center', gap: 1}}>
											<Box
												sx={{ position: 'relative', width: 80, height: 80, borderRadius: 8,  border: '1px solid #e0e0e0', cursor: 'pointer' }}
												onClick={() => {
													// Promote this gallery image to be the main image for the active product
													setSelectedImages(prev => {
														const copy = [...prev];
														const existing = copy[activeProductIndex];
														if (typeof existing === 'string') {
															// replace string entry with selected gallery url
															copy[activeProductIndex] = g;
															return copy;
														}
														const cur = existing && typeof existing === 'object' ? { ...(existing as Record<string, unknown>) } as Record<string, unknown> : {} as Record<string, unknown>;
														cur.url = g;
														// if the promoted image exists in gallery, move it to front of gallery array
														cur.gallery = Array.isArray(cur.gallery) ? [...(cur.gallery as string[])] : [];
														// remove the promoted image from gallery to avoid duplication
														const idxInGallery = (cur.gallery as string[]).indexOf(g);
														if (idxInGallery !== -1) {
															(cur.gallery as string[]).splice(idxInGallery, 1);
														}
														// Optionally keep it in gallery (append) or just set as main; keep existing behavior of not duplicating
														copy[activeProductIndex] = cur as SelectedImageItem;
														return copy;
													});
												}}
											>
												<Box sx={{ position: 'relative', width: 80, height: 80 }}>
													<PreviewImage key={g || `gallery-${activeProductIndex}-${gi}`} src={g} alt={`gallery-${gi}`} width={80} height={80} style={{ objectFit: 'cover', width: 80, height: 80 , borderRadius: 8 }} />
													{uploadingIndices[activeProductIndex] && (
														<Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.5)' }}>
															<Box sx={{ width: 20, height: 20, border: '3px solid #ddd', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
														</Box>
													)}
												</Box>
												<IconButton
													size="small"
													onClick={(ev) => { ev.stopPropagation(); removeGalleryAt(gi); }}
													sx={{ position: 'absolute', top: -6, right: -6, background: '#1b1717ff', width: 18, height: 18, p: 0 ,  color:' #e0e0e0',
														"&:hover": {
																background: "#3b3636ff",
																color: "#fff",
															},
														}}
												>
													<CloseIcon sx={{ fontSize: 14 }} />
												</IconButton>
											</Box>
											<Typography sx={{ fontSize: 12, fontWeight: 700 }}> Image {gi + 2} </Typography>
										</Box>
									))}

									{/* Add Images tile - hide when total images reached MAX_PER_PRODUCT */}
									{totalNow < MAX_PER_PRODUCT && (
									<Box
										role="button"
										aria-label={`Add images for product ${activeProductIndex + 1}`}
										onClick={() => openPerProductInput(false, true)}
										sx={{
											border: "1px dashed #c4c4c4",
											borderRadius: 1,
											textAlign: "center",
											cursor: "pointer",
											width: 80,
											height: 80,
											p: 1,
											display: "flex",
											flexDirection: 'column',
											alignItems: "center",
											justifyContent: "center",
											minWidth: 80
										}}
									>
										<Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#f5f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
											<Add sx={{ color: '#6366f1' }} />
										</Box>
										<Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>Add Images</Typography>
									</Box>
									)}

									
																			<input
																				id={`per-product-input-${activeProductIndex}`}
																				type="file"
																				accept="image/*"
																				style={{ display: "none" }}
																				data-replace="false"
																				multiple={perProductMultiSelect}
																				onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
																					const replaceMain = (e.currentTarget.dataset.replace === 'true');
																					const files = e.target.files ? [...e.target.files] : [];
																					if (files.length === 0) return;
																					const MAX_PER_PRODUCT = 5;
																					// Enforce max images per product (count primary + gallery)
																					try {
																						const sel = selectedImages[activeProductIndex] as SelectedImageItem | undefined;
																						const hasMain = sel && typeof sel === 'object' && !!(sel as Record<string, unknown>).url;
																						const galleryArr = sel && typeof sel === 'object' && Array.isArray((sel as Record<string, unknown>).gallery) ? (sel as Record<string, unknown>).gallery as string[] : [];
																						const currentTotal = (hasMain ? 1 : 0) + galleryArr.length;
																						const allowed = MAX_PER_PRODUCT - currentTotal;
																						if (allowed <= 0) {
																							toast.error(`Maximum ${MAX_PER_PRODUCT} images allowed per product`);
																							if (e.currentTarget) e.currentTarget.value = '';
																							return;
																						}
																					} catch {
																						// if any error reading state, continue with upload but guard later
																					}

																				// use hoisted _readFileToDataUrl helper

																				try {
																					// Upload files to server first
																					const fd = new FormData();
																					for (const f of files) fd.append('images', f);
																					const uploaderId = (user as { id?: string } | null)?.id;
																					if (uploaderId) fd.append('uploaderId', String(uploaderId));

																					const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bulkImgupload`;
																					const res = await fetch(uploadUrl, { method: 'POST', body: fd });
																					if (res.ok === false) {
																						const text = await res.text().catch(() => 'upload failed');
																						console.error('Per-product upload failed', text);
																						toast.error('Image upload failed. Please try again.');
																						// still clear input
																						if (e.currentTarget) e.currentTarget.value = '';
																						return;
																					}
																					const body = await res.json().catch(() => ({}));
																					const uploaded = Array.isArray(body.files) ? body.files : [];

																					// Map uploaded files to preview urls and ids. If server didn't return url, fall back to reading the file.
																					const previews: { previewUrl: string; imgId?: string; publicUrl?: string; signedUrl?: string }[] = await Promise.all(
																						files.map(async (file, idx) => {
																							const fileRec = uploaded[idx] || {};
																							// prefer publicUrl for previews (signedUrl kept only as metadata)
																							const previewUrl = fileRec.publicUrl || fileRec.signedUrl || fileRec.storagePath || fileRec.url;
																							if (previewUrl) {
																								return { previewUrl, imgId: fileRec.img_id, publicUrl: fileRec.publicUrl, signedUrl: fileRec.signedUrl };
																							}
																							// fallback to dataUrl
																							const dataUrl = await _readFileToDataUrl(file);
																							return { previewUrl: dataUrl, imgId: fileRec.img_id };
																						})
																					);

																					// Update selectedImages and productForms for this product index
																					// Build deterministic chosenMain and chosenGallery from server response (prefer publicUrl)
																					const first = previews[0];
																					const chosenMain = first?.publicUrl || first?.previewUrl || undefined;
																					const chosenGallery = previews.slice(1).map(p => p.publicUrl || p.previewUrl).filter(Boolean) as string[];
																					const newImgIds = previews.map(p => p.imgId).filter(Boolean) as string[];

																					// Update selectedImages for this product index deterministically
																					updateSelectedImageAt(activeProductIndex, (cur) => {
																						const existingObj = (cur && typeof cur === 'object') ? (cur as Record<string, unknown>) : {} as Record<string, unknown>;
																						const curObj: Record<string, unknown> = { ...existingObj };

																						if (replaceMain) {
																							// Explicitly replace the main image using publicUrl (preferred) or previewUrl.
																							const newMain = first?.publicUrl || first?.previewUrl || chosenMain;
																							// capture previous main so we can remove it from galleries and productForms
																							const oldMain = curObj.url as string | undefined;
																							if (newMain) {
																								curObj.url = newMain;
																								if (first?.publicUrl) curObj.publicUrl = first.publicUrl;
																								if (first?.signedUrl) curObj.signedUrl = curObj.signedUrl ?? first.signedUrl;
																								// ensure gallery does not contain the new main (avoid duplicates)
																								curObj.gallery = Array.isArray(curObj.gallery) ? [...(curObj.gallery as string[])] : [];
																								// remove both the newMain (if present) and the oldMain (we want to drop the previous main)
																								curObj.gallery = (curObj.gallery as string[]).filter(g => g !== newMain && g !== oldMain);
																							}
																							// Merge the new main image into productForms OtherAttributes.image_urls (prefer publicUrl)
																							const toAdd = first?.publicUrl ? [first.publicUrl] : (newMain ? [newMain] : []);
																							if (toAdd.length > 0) {
																								setProductForms(forms => {
																									const fcopy = [...forms];
																									while (fcopy.length <= activeProductIndex) fcopy.push(initialFormData());
																									if (!fcopy[activeProductIndex].OtherAttributes) fcopy[activeProductIndex].OtherAttributes = {};
																									const other = fcopy[activeProductIndex].OtherAttributes as Record<string, unknown>;
																									const existingImgs = Array.isArray(other.image_urls) ? (other.image_urls as string[]) : [];
																									// remove the oldMain from existing images (if present)
																									const filtered = existingImgs.filter(u => u !== oldMain);
																									// toAdd contains only publicUrl values; ensure uniqueness
																									other.image_urls = [...new Set([...filtered, ...toAdd])];
																									return fcopy;
																								});
																							}
																						} else if (chosenMain) {
																							// When user is adding images to gallery (replaceMain === false),
																							// do NOT replace the existing primary image. Always append the
																							// uploaded image to the gallery (if not present) and respect
																							// the MAX_PER_PRODUCT limit.
																							curObj.gallery = Array.isArray(curObj.gallery) ? [...(curObj.gallery as string[])] : [];
																							// Only add to gallery when total images (main + gallery) stays within limit
																							{
																								const hasMainNow = !!curObj.url;
																								const curGalleryNow = Array.isArray(curObj.gallery) ? [...(curObj.gallery as string[])] : [];
																								const totalNow = (hasMainNow ? 1 : 0) + curGalleryNow.length;
																								if (totalNow < MAX_PER_PRODUCT && !curGalleryNow.includes(chosenMain as string)) {
																									curGalleryNow.push(chosenMain as string);
																								}
																								curObj.gallery = curGalleryNow;
																							}
																							// Also ensure the product form's OtherAttributes.image_urls
																							// is kept in sync with uploaded public/preview urls and
																							// preserve any existing primary image entries.
																							try {
																								const toAddUrls = [chosenMain, ...chosenGallery].filter(Boolean) as string[];
																								if (toAddUrls.length > 0) {
																									setProductForms(forms => {
																										const fcopy = [...forms];
																										while (fcopy.length <= activeProductIndex) fcopy.push(initialFormData());
																										if (!fcopy[activeProductIndex].OtherAttributes) fcopy[activeProductIndex].OtherAttributes = {};
																										const other = fcopy[activeProductIndex].OtherAttributes as Record<string, unknown>;
																										const existingImgs = Array.isArray(other.image_urls) ? (other.image_urls as string[]) : [];
																										other.image_urls = [...new Set([...existingImgs, ...toAddUrls])];
																										return fcopy;
																									});
																								}
																							} catch {
																								// ignore sync failures
																							}
																						}

																						// Merge gallery while respecting MAX_PER_PRODUCT
																						const curGallery = Array.isArray(curObj.gallery) ? [...(curObj.gallery as string[])] : [];
																						for (const g of chosenGallery) {
																							const totalNow = ((curObj.url) ? 1 : 0) + curGallery.length;
																							if (totalNow >= MAX_PER_PRODUCT) break;
																							if (!curGallery.includes(g)) curGallery.push(g);
																						}
																						curObj.gallery = curGallery;

																						// Merge img ids
																						const curImgIds = Array.isArray(curObj.img_id) ? [...(curObj.img_id as string[])] : [];
																						for (const id of newImgIds) if (!curImgIds.includes(id)) curImgIds.push(id);
																						curObj.img_id = curImgIds;

																						// also merge into productForms OtherAttributes.image_ids
																						setProductForms(forms => {
																							const fcopy = [...forms];
																							while (fcopy.length <= activeProductIndex) fcopy.push(initialFormData());
																							if (!fcopy[activeProductIndex].OtherAttributes) fcopy[activeProductIndex].OtherAttributes = {};
																							const other = fcopy[activeProductIndex].OtherAttributes as Record<string, unknown>;
																							const existingIds = Array.isArray(other.image_ids) ? (other.image_ids as string[]) : [];
																							other.image_ids = [...new Set([...existingIds, ...newImgIds])];
																							return fcopy;
																						});

																						return curObj as SelectedImageItem;
																					});

																					//console.log('selectedImages updated for product', activeProductIndex, 'chosenMain=', chosenMain);

																					toast.success('Images uploaded and added', { autoClose: 1500 });
																				} catch (error) {
																					console.error('Per-product input handler error', error);
																					toast.error('Failed to upload images');
																				} finally {
																					// reset input and dataset.replace
																					const inputEl = document.querySelector<HTMLInputElement>(`#per-product-input-${activeProductIndex}`);
																					if (inputEl) {
																						inputEl.dataset.replace = 'false';
																						inputEl.value = '';
																					}
																				}
																			}}
																		/>
									
								</>
							);
						})()}
					</Box>
				</Box>
			</Paper>
		</Box>
		
	</Box>
	);
	})()}
			<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
					{/* Delete confirmation dialog (top-level so it's above fixed footer) */}
					<Dialog
						open={deleteDialogOpen}
						onClose={handleCancelDelete}
						maxWidth="xs"
						fullWidth
						BackdropProps={{ sx: { zIndex: 2000 } }}
						PaperProps={{ sx: { zIndex: 2100, borderRadius: 2, p: 1 } }}
						aria-labelledby="delete-product-dialog"
					>
						<DialogTitle id="delete-product-dialog">
							<Typography sx={{ fontSize: 16, fontWeight: 600 }}>Are you sure you want to delete this product from catalog?</Typography>
						</DialogTitle>
						<DialogActions sx={{ px: 3, pb: 2 }}>
							<Button variant="outlined" onClick={handleCancelDelete}>Cancel</Button>
							<Button variant="contained" onClick={handleProceedDelete} sx={{ background: '#4d0aff', color: '#fff' }}>Proceed</Button>
						</DialogActions>
					</Dialog>
			 <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left:0,
          backgroundColor: '#ffffff',
          padding: '8px 16px',
          width: '100%',
          zIndex: 1300, // Ensures it's on the top layer
          boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
          //opacity: 0.2,
        }}
            >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            sx={{
              color: '#4d0aff',
              borderColor: '#4d0aff',
              fontWeight: 'bold',
              textTransform: 'none',
              ml: 8,
            }}
            onClick={() => globalThis.history.back()}
          >
            Discard Catalog
          </Button>
				
				{activeStep === 1 ? (
					<Box
						sx={{mr:12}}
					>
						{/*<Button
							variant="text"
							sx={{ mr: 2 }}
							onClick={() => {
								try {
									const ensured = ensureProductFormIds(productForms);
									const inventoryJson: Record<string, ProductSection> = {};
									for (const pf of ensured) inventoryJson[pf.id] = pf.ProductSizeInventory || {};
									const blob = new Blob([JSON.stringify(inventoryJson, null, 2)], { type: 'application/json' });
									const url = URL.createObjectURL(blob);
									const a = document.createElement('a');
									a.href = url;
									a.download = 'inventory.json';
									a.click();
									URL.revokeObjectURL(url);
								} catch {
									toast.error('Failed to export inventory');
								}
							}}
						>
							Export Inventory
						</Button>*/}
						<Button
							type="button"
							variant="outlined"
							color="inherit"
							sx={{ mr: 2 }}
							onClick={async () => {
								if (isSavingDraft) return;
								setIsSavingDraft(true);
								let draft: Record<string, unknown> | null = null;
								try {
									const ensured = ensureProductFormIds(productForms);
									const catalogId = genUniqueId();
									const inventoryJson: Record<string, ProductSection> = {};
									for (const pf of ensured) inventoryJson[pf.id] = pf.ProductSizeInventory || {};

									const cleanedForDraft = ensured.map(pf => {
										const copy = deepClone(pf) as ProductForm & { id?: string };
										if (copy.OtherAttributes && typeof copy.OtherAttributes === 'object') {
											const oa = copy.OtherAttributes as Record<string, unknown>;
											if ('image_ids' in oa) delete oa.image_ids;
											if (Array.isArray(oa.image_urls)) {
												try {
													const arr = (oa.image_urls as unknown[]).filter(i => typeof i === 'string') as string[];
													const filtered = [...new Set(arr.filter(u => /^https?:\/\//i.test(u)))];
													oa.image_urls = filtered;
												} catch { /* ignore */ }
											}
										}
										return copy as ProductForm & { id?: string };
									});

									draft = {
										catalog_id: catalogId,
										user_id: user?.id ?? null,
										category_path: selectionPath,
										product_forms: cleanedForDraft,
										inventory_json: inventoryJson,
									};

									const payload = {
										...draft,
										status: 'draft',
										QC_status: 'notyet',
										trough: 'single',
									};

									const endpoint = editingCatalogId ?
										`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogs/${encodeURIComponent(editingCatalogId)}` :
										`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogs`;
									const method = editingCatalogId ? 'PUT' : 'POST';
									const res = await fetch(endpoint, {
										method,
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify(payload),
									});

									let body: unknown = null;
									const contentType = res.headers.get('content-type') || '';
									if (contentType.includes('application/json')) {
										try { body = await res.json(); } catch { body = null; }
									} else {
										try { body = await res.text(); } catch { body = null; }
									}

									if (res.ok) {
										try {
											if (body && typeof body === 'object' && !Array.isArray(body)) {
												const obj = body as Record<string, unknown>;
												const dataField = obj.data as unknown;
												const row = Array.isArray(dataField) && ((dataField as unknown[]).length > 0) ? (dataField as unknown[])[0] : (obj.data ?? obj);
												if (row && typeof row === 'object') {
													const rowObj = row as Record<string, unknown>;
													if (rowObj.catalog_id) setEditingCatalogId(String(rowObj.catalog_id));
												}
											}
										} catch { /* ignore */ }
										toast.success('Draft uploaded to server', { autoClose: 2000 });
										setTimeout(() => {
											try { router.push('/dashboard/catalog-uploads'); } catch { try { globalThis.window.location.href = '/dashboard/catalog-uploads'; } catch { globalThis.history.back(); } }
										}, 600);
									} else {
										console.error('Draft save failed', res.status, body);
										try { if (draft) localStorage.setItem('draftProductCatalog', JSON.stringify(draft)); } catch { /* ignore */ }
										toast.error('Draft save failed. Saved locally as fallback.');
									}
								} catch (error) {
									console.error('Error uploading draft', error);
									try { if (draft) localStorage.setItem('draftProductCatalog', JSON.stringify(draft)); } catch { /* ignore */ }
									toast.error('Failed to upload draft. Saved locally as fallback.');
								} finally {
									setIsSavingDraft(false);
								}
							}}
							disabled={isSavingDraft}
						>
							{isSavingDraft ? 'Saving...' : 'Save and Go Back'}
						</Button>


						<Button
							variant="contained"
							color="primary"
							onClick={async () => {
								// Validate required fields before final submit
								const missing = validateRequiredFields(productForms);
								if (missing.length > 0) {
									// Show a toast with detailed missing fields and focus on the first missing product
									const message = "Please fill required fields";
									toast.error(message, { autoClose: 5000 });
									// set active product to the first missing product index (assumes format 'Product N: Field')
									const m = missing[0].match(/Product (\d+):/);
									if (m) {
										const idx = Number.parseInt(m[1], 10) - 1;
										setActiveProductIndex(Math.max(0, idx));
									}
									return;
								}
								// Inline submit error banner (rendered below outside handler)
								// Placeholder submit handler — replace with real API call
								                                try {
																		// send payload to server-side API which uses service role to insert
																		try {
																			const ensured = ensureProductFormIds(productForms);
																			const catalogId = genUniqueId();
																			const inventoryJson: Record<string, ProductSection> = {};
																			for (const pf of ensured) {
																				inventoryJson[pf.id] = pf.ProductSizeInventory || {};
																			}

																			// Remove image_ids from OtherAttributes before sending to server
																			const cleanedForSubmit = ensured.map(pf => {
																				const copy = deepClone(pf) as ProductForm & { id?: string };
																				if (copy.OtherAttributes && typeof copy.OtherAttributes === 'object') {
																					const oa = copy.OtherAttributes as Record<string, unknown>;
																					if ('image_ids' in oa) delete oa.image_ids;
																					// Ensure image_urls only contains http(s) public urls
																					if (Array.isArray(oa.image_urls)) {
																						try {
																							const arr = (oa.image_urls as unknown[]).filter(i => typeof i === 'string') as string[];
																							const filtered = [...new Set(arr.filter(u => /^https?:\/\//i.test(u)))];
																							oa.image_urls = filtered;
																						} catch { /* ignore */ }
																					}
																				}
																				return copy as ProductForm & { id?: string };
																			});

																			// Build payload. When editing an existing catalog (editingCatalogId)
																			// do not include `catalog_id` in the request body — the identifier
																			// is sent via the URL and trying to change it can trigger DB errors.
																			const payloadBase = {
																				user_id: user?.id ?? null,
																				category_path: selectionPath,
																				product_forms: cleanedForSubmit,
																				inventory_json: inventoryJson,
																				status: 'submitted',
																				QC_status: 'pending',
																				trough: 'single',
																			} as Record<string, unknown>;
																			const payload = editingCatalogId ? payloadBase : { ...payloadBase, catalog_id: catalogId };
																			console.log('Submitting payload to server API:', payload);

																			try {
																				const endpoint = editingCatalogId ?
																					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogs/${encodeURIComponent(editingCatalogId)}` :
																					`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/catalogs`;
																				const method = editingCatalogId ? 'PUT' : 'POST';
																				const res = await fetch(endpoint, {
																					method,
																					headers: { 'Content-Type': 'application/json' },
																					body: JSON.stringify(payload),
																				});

																				// Try to read JSON first, fallback to text when server returns HTML/plain 500
																				let body: unknown = null;
																				const contentType = res.headers.get('content-type') || '';
																				if (contentType.includes('application/json')) {
																					try {
																						body = await res.json();
																					} catch {
																						body = null;
																					}
																				} else {
																					try {
																						body = await res.text();
																					} catch {
																						body = null;
																					}
																				}

																				if (res.ok === false) {
																					console.error('Server insert error', res.status, res.statusText, body);
																					const serverMsg = (() => {
																						// If body is an object, attempt to safely extract an error.message field
																						if (body && typeof body === 'object' && !Array.isArray(body)) {
																							const obj = body as Record<string, unknown>;
																							if ('error' in obj) {
																								const err = obj.error as unknown;
																								if (err && typeof err === 'object' && !Array.isArray(err) && 'message' in (err as Record<string, unknown>)) {
																									return String((err as Record<string, unknown>).message);
																								}
																							}
																							// Fallback: stringify the object
																							try { return JSON.stringify(obj); } catch { return String(obj); }
																						}
																						if (typeof body === 'string') return body;
																						return res.statusText;
																					})();
																					// Show full status and server message to the user and set inline banner
																					const msg = `Failed to save catalog (${res.status}): ${serverMsg}`;
																					setSubmitError(msg);
																					toast.error(msg);
																				} else {
																					// If server returned JSON with the saved/updated row, set editingCatalogId to the returned catalog_id
																					try {
																						if (body && typeof body === 'object' && !Array.isArray(body)) {
																							const obj = body as Record<string, unknown>;
																							const dataField = obj.data as unknown;
																							const row = Array.isArray(dataField) && ((dataField as unknown[]).length > 0) ? (dataField as unknown[])[0] : (obj.data ?? obj);
																							if (row && typeof row === 'object') {
																								const rowObj = row as Record<string, unknown>;
																								if (rowObj.catalog_id) setEditingCatalogId(String(rowObj.catalog_id));
																							}
																						}
																					} catch { /* ignore */ }
																					// Clear any previous submit error
																					setSubmitError(null);
																					toast.success('Catalog submitted and saved to database', { autoClose: 2500 });
																					// redirect to catalog uploads list after short delay so toast is visible
																					setTimeout(() => {
																						try { router.push('/dashboard/catalog-uploads'); } catch { try { globalThis.window.location.href = '/dashboard/catalog-uploads'; } catch { globalThis.history.back(); } }
																					}, 600);
																				}
																			} catch (error) {
																				console.error('Fetch to /api/catalogs failed', error);
																				const msg = (error instanceof Error ? error.message : String(error));
																				setSubmitError('Failed to reach server API: ' + msg);
																				toast.error('Failed to reach server API: ' + msg);
																			}
																		} catch (error) {
																			console.error('Submit error', error);
																			toast.error('Submit failed');
																		}
							
									
									// Optionally move to a confirmation step or reset
								} catch {
									toast.error('Submit failed', { autoClose: 2500 });
								}
							}}
						>
							Submit Catalog
						</Button>
					</Box>
				) : null}
		 </Box>
            </Box>
			</>
			);
}
