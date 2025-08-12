'use client';
import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { Category, category } from '@/components/dashboard/product/category';
import Typography from '@mui/material/Typography';
import { UserContext } from '@/contexts/user-context';
import { toast, ToastContainer } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';

function Page(): React.JSX.Element {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [categories, setCategories] = React.useState<category[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const userContext = React.useContext(UserContext);
  const user = userContext?.user;
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'categoryfetch';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user ? { userId: user.id } : {}),
        });

        if (!res.ok) throw new Error('Failed to fetch categories');
        if (res.status === 204) {
          setError('No Data Found');
          return;
        }
        const data = await res.json();
        setCategories(data);
      } catch (error_: unknown) {
        if (error_ instanceof Error) {
          setError(error_.message || 'Error fetching categories');
        } else {
          setError('Error fetching categories');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [user]);

  React.useEffect(() => {
    if (searchParams.get('added')) {
      toast.success('Category added successfully!');
      // Remove the param so it doesn't show again on refresh
  const params = new URLSearchParams([...searchParams.entries()]);
      params.delete('added');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  // Delete handler
  const handleDelete = async (catId: string) => {
  if (!globalThis.window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'category/' + catId;
      const res = await fetch(apiUrl, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');
      setCategories((prev) => prev.filter((cat) => cat.catId !== catId));
    } catch (error_: unknown) {
      if (error_ instanceof Error) {
        alert(error_.message || 'Error deleting category');
      } else {
        alert('Error deleting category');
      }
    }
  };

  // Filter categories based on filter value
  const filteredCategories = React.useMemo(() => {
    if (filter === 'all') return categories;
    return categories.filter((cat) => cat.sta === filter);
  }, [categories, filter]);

  return (
    <div>
  
      {/* Top bar with filter, search, and add button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 4, gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Filter"
          size="small"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <TextField
          size="small"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/dashboard/product/categories/add"
        >
          Add Category
        </Button>
      </Box>
      {loading && <Typography>Loading categories...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
          <Grid
            size={{
              lg: 12,
              md: 12,
              xs: 12,
            }}
          >
            <Category
              category={filteredCategories}
              onDelete={handleDelete}
              sx={{ height: '100%' }}
            />
          </Grid>
          
        </>
        
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Page;