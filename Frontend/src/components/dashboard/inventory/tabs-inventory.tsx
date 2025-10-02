"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, unicorn/prefer-structured-clone, @typescript-eslint/no-explicit-any, no-useless-escape, unicorn/prefer-optional-catch-binding, unicorn/catch-error-name, unicorn/prefer-string-replace-all, unicorn/prefer-spread, unicorn/no-for-loop, unicorn/prefer-switch, unicorn/no-negated-condition, no-empty, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import {
  Box, Typography, Tabs, Tab, Select, MenuItem,
  FormControl, InputLabel, Stack, Button, Divider, List, ListItem, ListItemButton,
  ListItemText, Tooltip, IconButton, InputAdornment,
  Card,
  CardContent,
  ListItemAvatar,
  Avatar,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { toast } from 'react-toastify';

const DATE_FILTER_TO_DAYS: Record<number, number | null> = {
  0: null,
  1: 7,
  2: 30,
  3: 90,
};
// Move stable lookup maps to module scope so hooks don't treat them as changing
const TAB_TO_QUERY: Record<number, string> = {
  0: 'active',
  1: 'activation_pending',
  2: 'blocked',
  3: 'paused',
};
const SUBTAB_TO_QUERY: Record<number, string> = {
  0: 'all_stock',
  1: 'out_of_stock',
  2: 'low_stock',
};
const QUERY_TO_SUBTAB: Record<string, number> = {
  all_stock: 0,
  out_of_stock: 1,
  low_stock: 2,
};
const BLOCKED_SUBTAB_TO_QUERY: Record<number, string> = {
  0: 'all',
  1: 'duplicate',
  2: 'poor_quality',
  3: 'verification_failed',
  4: 'account_paused',
  5: 'others',
};
const QUERY_TO_BLOCKED_SUBTAB: Record<string, number> = {
  all: 0,
  duplicate: 1,
  poor_quality: 2,
  verification_failed: 3,
  account_paused: 4,
  others: 5,
};

export default function TabsInventory(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [stock, setStock] = useState(0);

  // UI state for inline editing of per-product stock
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [productStockEdits, setProductStockEdits] = useState<Record<number, string>>({});

  // Dialog state for showing product details popup
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Record<string, unknown> | null>(null);

  const openDetail = (p: Record<string, unknown> | null) => {
    setDetailProduct(p);
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailOpen(false);
    setDetailProduct(null);
  };

  // Helper to update selectedCatalog in-place for UI feedback when user saves edited stock
  const updateSelectedCatalogProductInventory = (idx: number, newVal: string) => {
    try {
      setSelectedCatalog(prev => {
        if (!prev) return prev;
        // deep clone minimal structure to avoid mutating state
        const copy = JSON.parse(JSON.stringify(prev)) as Record<string, any>;
        const pforms = Array.isArray(copy.product_forms) ? copy.product_forms : [];
        while (pforms.length <= idx) pforms.push({});
        if (!pforms[idx].ProductSizeInventory || typeof pforms[idx].ProductSizeInventory !== 'object') pforms[idx].ProductSizeInventory = {};
        // set top-level Inventory
        pforms[idx].ProductSizeInventory['Inventory'] = newVal;
        try {
          const psi = pforms[idx].ProductSizeInventory as Record<string, any>;
          // If there's a Size object with per-size entries, update each size's Inventory field where possible
          if (psi && psi['Size'] && typeof psi['Size'] === 'object') {
            const sizeObj = psi['Size'] as Record<string, any>;
            for (const sizeKey of Object.keys(sizeObj)) {
              const entry = sizeObj[sizeKey];
              if (entry && typeof entry === 'object') {
                if (Object.prototype.hasOwnProperty.call(entry, 'Inventory')) entry['Inventory'] = newVal;
                else if (Object.prototype.hasOwnProperty.call(entry, 'inventory')) entry['inventory'] = newVal;
              } else if (typeof entry === 'string') {
                // try to replace Inventory=... pattern inside serialized strings
                try {
                  const replaced = entry.replace(/(Inventory\s*=\s*)([^;\}\n\r]+)/i, `$1${newVal}`);
                  sizeObj[sizeKey] = replaced;
                } catch {
                  // if replacement fails, leave as-is
                }
              } else {
                // primitive -> convert to object with Inventory
                sizeObj[sizeKey] = { Inventory: newVal };
              }
            }
          }
        } catch (e) {
          // ignore size update failures
        }

        // Sync inventory_json map if present so UI components that read inventory_json see the change
        try {
          if (!copy.inventory_json || typeof copy.inventory_json !== 'object') copy.inventory_json = {};
          const pf = pforms[idx] as Record<string, any> | undefined;
          const pfId = pf ? String(pf['id'] ?? '') : '';
          // Common keys: Inventory, Inventory_<productId>, Inventory_<size>
          copy.inventory_json['Inventory'] = newVal;
          if (pfId) {
            copy.inventory_json[`Inventory_${pfId}`] = newVal;
            copy.inventory_json[`Inventory_${pfId.replace(/\s+/g,'_')}`] = newVal;
          }
        } catch (e) {
          // ignore inventory_json update failures
        }
        copy.product_forms = pforms;
        return copy;
      });
    } catch (e) {
      // ignore
    }
  };

  // Send update to backend. Expects backend endpoint at /api/update-inventory
  const updateInventoryOnServer = async (catalogId: string, productIndex: number, newInventory: string, productId?: string) => {
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const apiUrl = backend.replace(/\/$/, '') + '/api/update-inventory';
      const body = {
        catalogId: catalogId,
        productIndex,
        productId: productId ?? null,
        newInventory: String(newInventory ?? ''),
        userId: (user as any)?.id ?? null,
      };
      // Debug logs so developer can confirm request/response in browser console
      console.log('updateInventoryOnServer -> POST', apiUrl, body);
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text().catch(() => '');
      let data: any = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      console.log('updateInventoryOnServer <- response', res.status, data);
      if (!res.ok) {
        console.error('update-inventory failed', res.status, text);
        return { ok: false, status: res.status, text };
      }
      // Prefer to return server-updated row when available
      if (data && typeof data === 'object' && data.success && data.data) {
        return { ok: true, status: res.status, data: data.data };
      }
      return { ok: true, status: res.status, data: data };
    } catch (e) {
      console.error('updateInventoryOnServer error', e);
      return { ok: false, status: 0, error: String(e) };
    }
  };

  // catalogs fetched from backend filtered by QC_status === 'pass' and userId
  const { user } = useUser();
  const [catalogs, setCatalogs] = useState<unknown[]>([]);
  const [catalogsLoading, setCatalogsLoading] = useState(false);
  // Pagination for left-side catalog list
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;
//console.log('catalogs:', catalogs);



  // tab/subtab maps are module-level to keep hooks stable
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('Highest Estimated Orders');
  //console.log('Rendering TabsInventory with mainTab:', mainTab, 'subTab:', subTab, 'category:', category, 'sort:', sort);
   //const [selectedCatalog, setSelectedCatalog] = useState(catalogData[0]);

  // Tooltip hint for Active tab (session-only; no localStorage)
  const [hintOpen, setHintOpen] = useState(true);

  const closeHint = () => {
    try {
      if (globalThis !== undefined && globalThis.sessionStorage !== undefined) {
        globalThis.sessionStorage.setItem('inventory_active_hint_seen', '1');
      }
    } catch {
      // ignore
    }
    setHintOpen(false);
  };

  useEffect(() => {
    try {
      if (globalThis === undefined || globalThis.sessionStorage === undefined) return;
      const seen = globalThis.sessionStorage.getItem('inventory_active_hint_seen');
      if (seen) setHintOpen(false);
    } catch {
      // ignore
    }
  }, []);

  // Initialize subTab from query param if present (supports Active and Blocked)
  useEffect(() => {
    try {
      const tabParam = searchParams?.get('tab');
      const subParam = searchParams?.get('subtab');
      // Also set the main tab according to the tab param so links open correct main tab
      if (tabParam === 'active') {
        setMainTab(0);
        if (subParam && QUERY_TO_SUBTAB[subParam] !== undefined) setSubTab(QUERY_TO_SUBTAB[subParam]);
      } else if (tabParam === 'activation_pending') {
        setMainTab(1);
        // activation pending has no active subtab mapping; reset to 0
        setSubTab(0);
      } else if (tabParam === 'blocked') {
        setMainTab(2);
        if (subParam && QUERY_TO_BLOCKED_SUBTAB[subParam] !== undefined) setSubTab(QUERY_TO_BLOCKED_SUBTAB[subParam]);
      } else if (tabParam === 'paused') {
        setMainTab(3);
        setSubTab(0);
      } else {
        setMainTab(0);
        setSubTab(0);
      }
    } catch {
      // ignore
    }
  }, [searchParams]);

  // Subtabs for Active tab
  const activeSubTabs = [
    'All Stock',
    'Out of Stock',
    'Low Stock',
  ];

  // Date filter tabs for Active tab
  const dateFilterLabels = [
    'All',
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
  ];
  const [dateFilter, setDateFilter] = useState<number>(0);
  // (Removed requireBoth checkbox — Activation Pending uses OR by default)
  // DATE_FILTER_TO_DAYS is defined at module level to keep a stable reference for hooks

  // Subtabs for Blocked tab
  const blockedSubTabs = [
    'All',
    'Duplicate',
    'Poor Quality',
    'Verification Failed',
    'Account Paused',
    'Others',
  ];
  // Selected catalog on the right side
  const [selectedCatalog, setSelectedCatalog] = useState<Record<string, unknown> | null>(null);

  // Fetch catalogs for current user where QC_status === 'pass'
  // Reusable fetch function so we can refresh data after updates
  const fetchCatalogs = async () => {
    if (!user || !user.id) return;
    setCatalogsLoading(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000').replace(/\/$/, '') + '/api/fetch-catalogs';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `fetch error ${res.status}`);
      }

      if (res.status === 204) {
        setCatalogs([]);
        return;
      }

      const data = await res.json();
      setCatalogs(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      console.error('Failed to fetch catalogs', error);
      setCatalogs([]);
    } finally {
      setCatalogsLoading(false);
    }
  };

  useEffect(() => {
    // initial load when user becomes available
    if (!user || !user.id) return;
    fetchCatalogs();
  }, [user]);
  // Derived list of available categories from fetched catalogs using category_path[3]
  const availableCategories = useMemo(() => {
    try {
      const set = new Set<string>();
      for (const c of Array.isArray(catalogs) ? catalogs : []) {
        const item = c as Record<string, unknown> | null;
        const cp = item?.['category_path'];
        if (Array.isArray(cp) && cp.length > 3 && cp[3]) {
          set.add(String(cp[3]));
          continue;
        }
        const cat = item?.['category'] ?? item?.['title'];
        if (cat) set.add(String(cat));
      }
      return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b));
    } catch (e) {
      return [] as string[];
    }
  }, [catalogs]);

  // Counts for each blocked subtab (All, Duplicate, Poor Quality, Verification Failed, Account Paused, Others)
  const blockedSubtabCounts = useMemo(() => {
    const counts = blockedSubTabs.map(() => 0);
    if (!catalogs || catalogs.length === 0) return counts;
    const getField = (obj: unknown, names: string[]): string | undefined => {
      const anyObj = obj as Record<string, unknown> | null;
      if (!anyObj) return undefined;
      for (const n of names) {
        if (Object.prototype.hasOwnProperty.call(anyObj, n)) {
          const v = anyObj[n];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      const targetLower = new Set(names.map((s) => s.toLowerCase()));
      for (const key of Object.keys(anyObj)) {
        if (targetLower.has(key.toLowerCase())) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      return undefined;
    };

    for (const c of Array.isArray(catalogs) ? catalogs : []) {
      try {
        const webVal = getField(c, ['web_status', 'webStatus', 'web']) || '';
        const qcVal = getField(c, ['Qc_status', 'qc_status', 'QcStatus']) || '';
        const webLower = String(webVal).toLowerCase();
        const qcLower = String(qcVal).toLowerCase();
        const isBlocked = webLower === 'blocked' || qcLower === 'blocked';
        if (!isBlocked) continue;
        counts[0] += 1; // All
        let matched = false;
        const serialized = (() => { try { return JSON.stringify(c).toLowerCase(); } catch { return ''; } })();
        // Duplicate
        if (webLower === 'duplicate' || serialized.includes('duplicate')) { counts[1] += 1; matched = true; }
        // Poor Quality
        if (webLower === 'poor_quality' || serialized.includes('poor quality') || serialized.includes('poor_quality')) { counts[2] += 1; matched = true; }
        // Verification Failed
        if (webLower === 'verification_failed' || serialized.includes('verification failed') || serialized.includes('verification_failed')) { counts[3] += 1; matched = true; }
        // Account Paused
        if (webLower === 'account_paused' || webLower === 'paused' || serialized.includes('account paused') || serialized.includes('account_paused')) { counts[4] += 1; matched = true; }
        if (!matched) counts[5] += 1; // Others
      } catch {
        // ignore per-item failures
      }
    }
    return counts;
  }, [catalogs]);
  const displayedCatalogs = useMemo(() => {
    try {
      const list = Array.isArray(catalogs) ? [...catalogs] : [];
      const getField = (obj: unknown, names: string[]): string | undefined => {
        const anyObj = obj as Record<string, unknown> | null;
        if (!anyObj) return undefined;
        for (const n of names) {
          if (Object.prototype.hasOwnProperty.call(anyObj, n)) {
            const v = anyObj[n];
            if (v !== undefined && v !== null) return String(v);
          }
        }
        const targetLower = new Set(names.map((s) => s.toLowerCase()));
        for (const key of Object.keys(anyObj)) {
          if (targetLower.has(key.toLowerCase())) {
            const v = anyObj[key];
            if (v !== undefined && v !== null) return String(v);
          }
        }
        for (const key of Object.keys(anyObj)) {
          const kl = key.toLowerCase();
          if (names.some(n => n.toLowerCase().includes('qc')) && kl.includes('qc') && kl.includes('status')) {
            const v = anyObj[key];
            if (v !== undefined && v !== null) return String(v);
          }
          if (names.some(n => n.toLowerCase().includes('web')) && kl.includes('web') && kl.includes('status')) {
            const v = anyObj[key];
            if (v !== undefined && v !== null) return String(v);
          }
        }
        return undefined;
      };

      // Initial filtered list depending on mainTab
      const filtered = list.filter((c) => {
        try {
          const qcVal = getField(c, ['Qc_status', 'qc_status', 'QcStatus']);
          const webVal = getField(c, ['web_status', 'webStatus', 'web']);
          const qcPass = String(qcVal ?? '').toLowerCase() === 'pass';
          const webLower = String(webVal ?? '').toLowerCase();
          if (mainTab === 0) return qcPass && webLower === 'active';
          if (mainTab === 1) return qcPass && webLower === '';
          if (mainTab === 2) return (qcPass && webLower === 'blocked') || String(qcVal ?? '').toLowerCase() === 'blocked';
          if (mainTab === 3) return webLower === 'paused';
          return true;
        } catch {
          return false;
        }
      });

      const days = DATE_FILTER_TO_DAYS[dateFilter];
      let dateFiltered = filtered;
    if (days) {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      dateFiltered = filtered.filter((c) => {
        const item = c as Record<string, unknown> | null;
        const raw = item?.['created_at'] ?? item?.['createdAt'] ?? item?.['createdDate'] ?? item?.['created'];
        if (!raw) return false;
        const t = new Date(String(raw)).getTime();
        if (Number.isNaN(t)) return false;
        return t >= cutoff;
      });
    }

    // Apply category filter if set (match category_path[3] first, then fallback to category/title)
    if (category && String(category).trim() !== '') {
      dateFiltered = dateFiltered.filter((c) => {
        try {
          const item = c as Record<string, unknown> | null;
          const cp = item?.['category_path'];
          if (Array.isArray(cp) && cp.length > 3 && cp[3]) {
            return String(cp[3]) === String(category);
          }
          const cat = item?.['category'] ?? item?.['title'];
          if (cat) return String(cat) === String(category);
          return false;
        } catch {
          return false;
        }
      });
    }

    // If we're on the Blocked main tab and a blocked-subtab is selected, apply blocked-subtab filtering
    if (mainTab === 2) {
      try {
        const key = BLOCKED_SUBTAB_TO_QUERY[subTab] ?? 'all';
        if (key && key !== 'all') {
          const lowerKey = String(key).toLowerCase();
          dateFiltered = dateFiltered.filter((c) => {
            try {
              const item = c as Record<string, unknown> | null;
              const webVal = getField(item, ['web_status', 'webStatus', 'web']);
              const qcVal = getField(item, ['Qc_status', 'qc_status', 'QcStatus']);
              if (String(webVal ?? '').toLowerCase() === lowerKey) return true;
              // If QC is blocked, try to detect reason text anywhere in the object that mentions the subtab key
              if (String(qcVal ?? '').toLowerCase() === 'blocked') {
                // shallow scan for string values mentioning the key
                for (const k of Object.keys(item ?? {})) {
                  const v = (item as Record<string, unknown>)[k];
                  if (typeof v === 'string' && v.toLowerCase().includes(lowerKey)) return true;
                  if (typeof v === 'object' && v !== null) {
                    try {
                      const s = JSON.stringify(v).toLowerCase();
                      if (s.includes(lowerKey)) return true;
                    } catch {
                      // ignore stringify errors
                    }
                  }
                }
              }
              return false;
            } catch {
              return false;
            }
          });
        }
      } catch {
        // ignore
      }
    }

    // Helper: get total inventory for a catalog by summing product_forms' Inventory fields
      // Recursively scan an object for any 'Inventory'/'inventory' keys and sum numeric values
      const sumInventoryInObject = (obj: unknown): number => {
        try {
          if (!obj || typeof obj !== 'object') return 0;
          let sum = 0;
          const stack: unknown[] = [obj];
          while (stack.length > 0) {
            const node = stack.pop();
            if (!node || typeof node !== 'object') continue;
            for (const k of Object.keys(node as Record<string, unknown>)) {
              const v = (node as Record<string, unknown>)[k];
              if (k.toLowerCase() === 'inventory') {
                if (v !== undefined && v !== null) {
                  const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
                  if (!Number.isNaN(n)) sum += Math.max(0, Math.floor(n));
                }
              } else if (typeof v === 'object') {
                stack.push(v);
              }
            }
          }
          return sum;
        } catch {
          return 0;
        }
      };

      // Return total inventory for a catalog by summing each product_form's inventory
      const totalInventoryForCatalog = (c: unknown): number => {
        try {
          const item = c as Record<string, unknown> | null;
          const pforms = Array.isArray(item?.['product_forms']) ? (item!['product_forms'] as unknown[]) : [];
          let total = 0;
          for (const pf of pforms) {
            const pfObj = pf as Record<string, unknown> | null;
            const psi = pfObj?.['ProductSizeInventory'];
            if (!psi) continue;
            total += sumInventoryInObject(psi);
          }
          return total;
        } catch {
          return 0;
        }
      };

      // Return inventory number for a single product_form (sum across sizes or Inventory field)
      const inventoryForProductForm = (pf: unknown): number => {
        try {
          const pfObj = pf as Record<string, unknown> | null;
          const psi = pfObj?.['ProductSizeInventory'] as Record<string, unknown> | undefined;
          if (!psi || typeof psi !== 'object') return 0;
          // If there is a top-level Inventory field, use that
          const invRaw = psi['Inventory'] ?? psi['inventory'];
          if (invRaw !== undefined && invRaw !== null) {
            const n = Number(String(invRaw).replace(/[^0-9.-]+/g, ''));
            return Number.isNaN(n) ? 0 : Math.max(0, Math.floor(n));
          }
          // Otherwise look under Size -> each size may have Inventory
          const sizeObj = psi['Size'] as Record<string, unknown> | undefined;
          if (sizeObj && typeof sizeObj === 'object') {
            let s = 0;
            for (const k of Object.keys(sizeObj)) {
              const v = (sizeObj[k] as Record<string, unknown>)?.['Inventory'] ?? (sizeObj[k] as Record<string, unknown>)?.['inventory'];
              if (v !== undefined && v !== null) {
                const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
                if (!Number.isNaN(n)) s += Math.max(0, Math.floor(n));
              }
            }
            return s;
          }
          // Fallback: scan object for inventory-like keys
          return sumInventoryInObject(psi);
        } catch {
          return 0;
        }
      };

      // Return indexes of product_forms that are zero-inventory
      const zeroInventoryProductIndexes = (c: unknown): number[] => {
        try {
          const item = c as Record<string, unknown> | null;
          const pforms = Array.isArray(item?.['product_forms']) ? (item!['product_forms'] as unknown[]) : [];
          const out: number[] = [];
          for (let i = 0; i < pforms.length; i++) {
            const inv = inventoryForProductForm(pforms[i]);
            if (inv === 0) out.push(i);
          }
          return out;
        } catch {
          return [];
        }
      };

  // Apply active subtab filtering when mainTab === 0
    if (mainTab === 0) {
      const LOW_THRESHOLD = 10;
      if (subTab === 1) {
        // out of stock: if catalog has 2 or more product_forms and any single product_form has inventory === 0,
        // treat the catalog as Out Of Stock. Otherwise (single product form), require total inventory === 0.
        return dateFiltered.filter(c => {
          try {
            const item = c as Record<string, unknown> | null;
            const pforms = Array.isArray(item?.['product_forms']) ? (item!['product_forms'] as unknown[]) : [];
            if (pforms.length >= 2) {
              const zeros = zeroInventoryProductIndexes(c);
              return zeros.length > 0;
            }
            return totalInventoryForCatalog(c) === 0;
          } catch {
            return false;
          }
        });
      }
      if (subTab === 2) {
        // low stock: >0 and < LOW_THRESHOLD
        return dateFiltered.filter(c => {
          try {
            const item = c as Record<string, unknown> | null;
            const pforms = Array.isArray(item?.['product_forms']) ? (item!['product_forms'] as unknown[]) : [];
            if (pforms.length >= 2) {
              // multi-product: if any single product_form is low (0 < inv < LOW_THRESHOLD)
              for (const pf of pforms) {
                const inv = inventoryForProductForm(pf);
                if (inv > 0 && inv < LOW_THRESHOLD) return true;
              }
              return false;
            }
            const t = totalInventoryForCatalog(c);
            return t > 0 && t < LOW_THRESHOLD;
          } catch {
            return false;
          }
        });
      }
      // subTab === 0 => All Stock (return all active/date-filtered)
      return dateFiltered;
    }

    return dateFiltered;
    } catch {
      return [] as unknown[];
    }
  }, [catalogs, dateFilter, mainTab, subTab, category]);

  // Compute counts for Active subtabs so labels show numbers
  const activeSubtabCounts = useMemo(() => {
    if (!catalogs || catalogs.length === 0) return { all_stock: 0, out_of_stock: 0, low_stock: 0 };
    // Reuse the same active filter logic without date filtering for counts (counts reflect active set)
    const list = Array.isArray(catalogs) ? [...catalogs] : [];
    const getField = (obj: unknown, names: string[]): string | undefined => {
      const anyObj = obj as Record<string, unknown> | null;
      if (!anyObj) return undefined;
      for (const n of names) {
        if (Object.prototype.hasOwnProperty.call(anyObj, n)) {
          const v = anyObj[n];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      const targetLower = new Set(names.map((s) => s.toLowerCase()));
      for (const key of Object.keys(anyObj)) {
        if (targetLower.has(key.toLowerCase())) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      for (const key of Object.keys(anyObj)) {
        const kl = key.toLowerCase();
        if (names.some(n => n.toLowerCase().includes('qc')) && kl.includes('qc') && kl.includes('status')) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
        if (names.some(n => n.toLowerCase().includes('web')) && kl.includes('web') && kl.includes('status')) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      return undefined;
    };
    const activeList = list.filter((c) => {
      const qcVal = getField(c, ['Qc_status', 'qc_status', 'QcStatus']);
      const webVal = getField(c, ['web_status', 'webStatus', 'web']);
      const qcPass = String(qcVal ?? '').toLowerCase() === 'pass';
      const webActive = String(webVal ?? '').toLowerCase() === 'active';
      return qcPass && webActive;
    });
  const totals = { all_stock: activeList.length, out_of_stock: 0, low_stock: 0 };
  const LOW_THRESHOLD = 10;
    // helper: sum inventory for a product form (mirrors logic in displayedCatalogs memo)
    const sumInventoryInObject = (obj: unknown): number => {
      try {
        if (!obj || typeof obj !== 'object') return 0;
        let sum = 0;
        const stack: unknown[] = [obj];
        while (stack.length > 0) {
          const node = stack.pop();
          if (!node || typeof node !== 'object') continue;
          for (const k of Object.keys(node as Record<string, unknown>)) {
            const v = (node as Record<string, unknown>)[k];
            if (k.toLowerCase() === 'inventory') {
              if (v !== undefined && v !== null) {
                const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
                if (!Number.isNaN(n)) sum += Math.max(0, Math.floor(n));
              }
            } else if (typeof v === 'object') {
              stack.push(v);
            }
          }
        }
        return sum;
      } catch {
        return 0;
      }
    };

    const inventoryForProductForm = (pf: unknown): number => {
      try {
        const pfObj = pf as Record<string, unknown> | null;
        const psi = pfObj?.['ProductSizeInventory'] as Record<string, unknown> | undefined;
        if (!psi || typeof psi !== 'object') return 0;
        const invRaw = psi['Inventory'] ?? psi['inventory'];
        if (invRaw !== undefined && invRaw !== null) {
          const n = Number(String(invRaw).replace(/[^0-9.-]+/g, ''));
          return Number.isNaN(n) ? 0 : Math.max(0, Math.floor(n));
        }
        const sizeObj = psi['Size'] as Record<string, unknown> | undefined;
        if (sizeObj && typeof sizeObj === 'object') {
          let s = 0;
          for (const k of Object.keys(sizeObj)) {
            const v = (sizeObj[k] as Record<string, unknown>)?.['Inventory'] ?? (sizeObj[k] as Record<string, unknown>)?.['inventory'];
            if (v !== undefined && v !== null) {
              const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
              if (!Number.isNaN(n)) s += Math.max(0, Math.floor(n));
            }
          }
          return s;
        }
        return sumInventoryInObject(psi);
      } catch {
        return 0;
      }
    };

    const zeroIndexes = (c: unknown): number[] => {
      try {
        const item = c as Record<string, unknown> | null;
        const pforms = Array.isArray(item?.['product_forms']) ? (item!['product_forms'] as unknown[]) : [];
        const out: number[] = [];
        for (let i = 0; i < pforms.length; i++) {
          if (inventoryForProductForm(pforms[i]) === 0) out.push(i);
        }
        return out;
      } catch {
        return [];
      }
    };

    for (const c of activeList) {
      const pforms = Array.isArray((c as Record<string, unknown>)?.['product_forms']) ? ((c as Record<string, unknown>)['product_forms'] as unknown[]) : [];
      // If multi-product, treat as Out Of Stock when any single product_form inventory === 0
      if (pforms.length >= 2) {
        // Out of stock check for multi-product catalogs
        if (zeroIndexes(c).length > 0) {
          totals.out_of_stock += 1;
          continue;
        }
        // Low stock check: if any single product_form has 0 < inv < LOW_THRESHOLD
        let foundLow = false;
        for (const pf of pforms) {
          const inv = inventoryForProductForm(pf);
          if (inv > 0 && inv < LOW_THRESHOLD) {
            foundLow = true;
            break;
          }
        }
        if (foundLow) {
          totals.low_stock += 1;
          continue;
        }
      }
      // Otherwise fall back to total inventory for single-product catalogs
      const total = (() => {
        try {
          let s = 0;
          for (const pf of pforms) {
            s += inventoryForProductForm(pf);
          }
          return s;
        } catch {
          return 0;
        }
      })();
      if (total === 0) totals.out_of_stock += 1;
      else if (total > 0 && total < LOW_THRESHOLD) totals.low_stock += 1;
    }
    return totals;
  }, [catalogs]);


  //console.log('displayedCatalogs:', displayedCatalogs);
  // Compute counts for main tabs using the same defensive field lookup used above
  const tabCounts = useMemo(() => {
    const list = Array.isArray(catalogs) ? catalogs : [];
    const getField = (obj: unknown, names: string[]): string | undefined => {
      const anyObj = obj as Record<string, unknown> | null;
      if (!anyObj) return undefined;
      for (const n of names) {
        if (Object.prototype.hasOwnProperty.call(anyObj, n)) {
          const v = anyObj[n];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      const targetLower = new Set(names.map((s) => s.toLowerCase()));
      for (const key of Object.keys(anyObj)) {
        if (targetLower.has(key.toLowerCase())) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      for (const key of Object.keys(anyObj)) {
        const kl = key.toLowerCase();
        if (names.some(n => n.toLowerCase().includes('qc')) && kl.includes('qc') && kl.includes('status')) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
        if (names.some(n => n.toLowerCase().includes('web')) && kl.includes('web') && kl.includes('status')) {
          const v = anyObj[key];
          if (v !== undefined && v !== null) return String(v);
        }
      }
      return undefined;
    };

    let active = 0;
    let activationPending = 0;
    let blocked = 0;
    let paused = 0;
    for (const c of list) {
      const qcVal = getField(c, ['Qc_status', 'qc_status', 'QcStatus']);
      const webVal = getField(c, ['web_status', 'webStatus', 'web']);
      const qcPass = String(qcVal ?? '').toLowerCase() === 'pass';
      const webActive = String(webVal ?? '').toLowerCase() === 'active';
      const webBlank = String(webVal ?? '').trim() === '';
      const webBlocked = String(webVal ?? '').toLowerCase() === 'blocked';
  const qcBlocked = String(qcVal ?? '').toLowerCase() === 'blocked';
      const webPaused = String(webVal ?? '').toLowerCase() === 'paused';
      if (qcPass && webActive) active += 1;
      if (qcPass && webBlank) activationPending += 1;
  if (qcPass && webBlocked) blocked += 1;
  // also count if QC is blocked
  if (qcBlocked) blocked += 1;
      if (webPaused) paused += 1;
    }
    return { active, activationPending, blocked, paused };
  }, [catalogs]);
  // derived list of product forms for the selected catalog
  const selectedProductForms: Array<Record<string, unknown> | null> = selectedCatalog
    ? ((((selectedCatalog['product_forms'] as unknown) as Array<unknown>) ?? []) as Array<Record<string, unknown> | null>)
    : [];
 //console.log('selectedCatalog:', selectedCatalog);

  // Rendered product forms: when viewing Active -> Out of Stock, show only product_forms with inventory === 0
  const renderedProductForms = useMemo(() => {
    try {
      const pforms = selectedProductForms ?? [];
      // Helper to compute inventory for a product form (mirrors earlier helpers)
      const inventoryForProductForm = (pf: unknown): number => {
        try {
          const pfObj = pf as Record<string, unknown> | null;
          const psi = pfObj?.['ProductSizeInventory'] as Record<string, unknown> | undefined;
          if (!psi || typeof psi !== 'object') return 0;
          const invRaw = psi['Inventory'] ?? psi['inventory'];
          if (invRaw !== undefined && invRaw !== null) {
            const n = Number(String(invRaw).replace(/[^0-9.-]+/g, ''));
            return Number.isNaN(n) ? 0 : Math.max(0, Math.floor(n));
          }
          const sizeObj = psi['Size'] as Record<string, unknown> | undefined;
          if (sizeObj && typeof sizeObj === 'object') {
            let s = 0;
            for (const k of Object.keys(sizeObj)) {
              const v = (sizeObj[k] as Record<string, unknown>)?.['Inventory'] ?? (sizeObj[k] as Record<string, unknown>)?.['inventory'];
              if (v !== undefined && v !== null) {
                const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
                if (!Number.isNaN(n)) s += Math.max(0, Math.floor(n));
              }
            }
            return s;
          }
          // fallback: recursive scan for inventory keys
          const sumInventoryInObject = (obj: unknown): number => {
            try {
              if (!obj || typeof obj !== 'object') return 0;
              let sum = 0;
              const stack: unknown[] = [obj];
              while (stack.length > 0) {
                const node = stack.pop();
                if (!node || typeof node !== 'object') continue;
                for (const k of Object.keys(node as Record<string, unknown>)) {
                  const v = (node as Record<string, unknown>)[k];
                  if (k.toLowerCase() === 'inventory') {
                    if (v !== undefined && v !== null) {
                      const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
                      if (!Number.isNaN(n)) sum += Math.max(0, Math.floor(n));
                    }
                  } else if (typeof v === 'object') stack.push(v);
                }
              }
              return sum;
            } catch {
              return 0;
            }
          };
          return sumInventoryInObject(psi);
        } catch {
          return 0;
        }
      };

      // If Active Out of Stock subtab, filter product_forms to those with inventory === 0
      if (mainTab === 0 && subTab === 1) {
        const out: { pf: Record<string, unknown> | null; idx: number }[] = [];
        for (let i = 0; i < pforms.length; i++) {
          if (inventoryForProductForm(pforms[i]) === 0) out.push({ pf: pforms[i], idx: i });
        }
        return out;
      }
      // If Active Low Stock subtab, filter product_forms to those with 0 < inventory < LOW_THRESHOLD
      if (mainTab === 0 && subTab === 2) {
        const LOW_THRESHOLD = 10;
        const out: { pf: Record<string, unknown> | null; idx: number }[] = [];
        for (let i = 0; i < pforms.length; i++) {
          const inv = inventoryForProductForm(pforms[i]);
          if (inv > 0 && inv < LOW_THRESHOLD) out.push({ pf: pforms[i], idx: i });
        }
        return out;
      }
      // Otherwise return all product forms with their original indexes
      return pforms.map((pf, idx) => ({ pf, idx }));
    } catch {
      return [] as { pf: Record<string, unknown> | null; idx: number }[];
    }
  }, [selectedProductForms, mainTab, subTab]);

  // Helper: safely read a field from ProductSizeInventory preferring Size -> first size entry, then top-level keys
  const getPSIField = (pfItem: Record<string, unknown> | null | undefined, fieldName: string): string => {
    try {
      if (!pfItem) return '';
      const psi = pfItem['ProductSizeInventory'] as Record<string, unknown> | undefined;
      if (!psi || typeof psi !== 'object') return '';
      // If Size is an object mapping sizeName -> fields, prefer the first size's value
      const sizeObj = psi['Size'] as Record<string, unknown> | undefined;
      if (sizeObj && typeof sizeObj === 'object') {
        const firstKey = Object.keys(sizeObj)[0];
        if (firstKey) {
          const val = (sizeObj as Record<string, any>)[firstKey]?.[fieldName];
          if (val !== undefined && val !== null) return String(val);
        }
      }
      // Prefer top-level direct field
      if (Object.prototype.hasOwnProperty.call(psi, fieldName)) {
        const v = psi[fieldName];
        if (v !== undefined && v !== null) return String(v);
      }
      // Fallback: find any key that starts with the field name (case-insensitive)
      const lower = fieldName.toLowerCase();
      for (const k of Object.keys(psi)) {
        if (k.toLowerCase().startsWith(lower)) {
          const v = psi[k];
          if (v !== undefined && v !== null) return String(v);
        }
      }
    } catch {
      // ignore
    }
    return '';
  };
  // Helper: convert a string to Proper Case (Title Case)
  const toProperCase = (s: string | undefined | null): string => {
    if (!s) return '';
    try {
      return String(s)
        .split(/(\s|-|_)+/)
        .map(part => {
          // Keep separators as-is
          if (/^(\s|-|_)+$/.test(part)) return part;
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join('');
    } catch {
      return String(s);
    }
  };
  // Auto-select first catalog when list updates
  useEffect(() => {
    if (displayedCatalogs && displayedCatalogs.length > 0) {
      const first = displayedCatalogs[0] as Record<string, unknown> | null;
      setSelectedCatalog(first);
    } else {
      setSelectedCatalog(null);
    }
  }, [displayedCatalogs]);

  // Reset pagination when the filtered list or filters change
  useEffect(() => {
    setPage(1);
  }, [displayedCatalogs.length, category, dateFilter, mainTab, subTab]);


  console.log('selectedCatalog:', selectedCatalog);
  return (
    <Box sx={{ pl: 2, pr: 2, backgroundColor: '#fff', mr: -3, ml: -3 , pb:-4, pt:-4,  }}>
      {/* Top Tabs */}
      <Tabs value={mainTab} onChange={(e, val) => {
        setMainTab(val);
        setSubTab(0);
        try {
          const q = TAB_TO_QUERY[val] || 'active';
          const params = new URLSearchParams(searchParams?.toString() ?? '');
          params.set('tab', q);
          if (val !== 0) params.delete('subtab');
          router.replace(`${pathname}?${params.toString()}`);
        } catch {
          // ignore navigation errors
        }
      }} sx={{ mb: 0 ,  }}>
        <Tab
          label={(
            <Tooltip
              open={hintOpen}
              disableHoverListener
              disableFocusListener
              disableTouchListener
              disableInteractive={false}
              arrow
              placement="bottom-start"
            sx={{
              '& .MuiTooltip-tooltip': { backgroundColor: '#000', color: '#fff', borderRadius: 1, padding: 0 },
              '& .MuiTooltip-arrow': { color: '#000' },
            }}
            title={(
                <Box sx={{ position: 'relative', p: 0, maxWidth: 280 }}>
                  <IconButton size="small" onClick={closeHint} sx={{ position: 'absolute', top: 6, right: 6, color: '#fff' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: 13 }}>Find all your live catalogs here</Typography>
                    <Button size="small" onClick={closeHint} sx={{ ml: 'auto', bgcolor: '#ffffff', color: '#000', textTransform: 'none' }}>GOT IT</Button>
                  </Box>
                </Box>
              )}
            >
              <span style={{ display: 'inline-block' }}>Active ({tabCounts.active})</span>
            </Tooltip>
          )}
        />
        <Tab label={`Activation Pending (${tabCounts.activationPending})`} />
        <Tab label={`Blocked (${tabCounts.blocked})`} />
        <Tab label={`Paused (${tabCounts.paused})`} />
      </Tabs>

  {/* Initialize from query param if present - moved to component body */}

      {/* Tooltip used instead of Popover; controlled by hintOpen */}

      {/* Sub Tabs or Filter UI based on mainTab */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {mainTab === 0 && (
          <>
            {/* Active tab: show subtabs */}
            <Tabs
            value={subTab}
            onChange={(e, val) => {
              setSubTab(val);
              try {
                const sub = SUBTAB_TO_QUERY[val] || 'all_stock';
                const params = new URLSearchParams(searchParams?.toString() ?? '');
                params.set('tab', 'active');
                params.set('subtab', sub);
                router.replace(`${pathname}?${params.toString()}`);
              } catch {
                // ignore
              }
            }}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`All Stock (${activeSubtabCounts.all_stock ?? 0})`} />
            <Tab label={`Out of Stock (${activeSubtabCounts.out_of_stock ?? 0})`} />
            <Tab label={`Low Stock (${activeSubtabCounts.low_stock ?? 0})`} />
            </Tabs>
          </>
        )}
        {mainTab === 1 && (
          // Activation Pending tab: show filter by text and category dropdown
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Filter by:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select Category</InputLabel>
              <Select
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {availableCategories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {mainTab === 2 && (
          // Blocked tab: show blocked subtabs
          <Tabs
            value={subTab}
            onChange={(e, val) => {
              setSubTab(val);
              try {
                const sub = BLOCKED_SUBTAB_TO_QUERY[val] || 'all';
                const params = new URLSearchParams(searchParams?.toString() ?? '');
                params.set('tab', 'blocked');
                params.set('subtab', sub);
                router.replace(`${pathname}?${params.toString()}`);
                //console.log('Router replace:',sub);
              } catch {
                // ignore
              }
            }}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {blockedSubTabs.map((label, idx) => (
              <Tab key={label} label={`${label} (${blockedSubtabCounts[idx] ?? 0})`} />
            ))}
          </Tabs>
        )}
        {/* Bulk Stock Update button always visible */}
        <Button
          variant="text"
          sx={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'none' }}
        >
          📦 Bulk Stock Update
        </Button>
      </Box>

      {/* Filter and Sort section (only for Active and Activation Pending) */}
      {(mainTab === 0 ) && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ mb: 2 }}
        >
          {/* Filter by Category (Active only) */}
          {mainTab === 0 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select Category</InputLabel>
              <Select
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {availableCategories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Sort catalogs by */}
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Typography sx={{ mr: 1 }}>Sort catalogs by:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="Highest Estimated Orders">Highest Estimated Orders</MenuItem>
                <MenuItem value="Lowest Estimated Orders">Lowest Estimated Orders</MenuItem>
                <MenuItem value="Recently Added">Recently Added</MenuItem>
              </Select>
            </FormControl>
            {/* Date Range dropdown */}
            <Box sx={{ ml: 2 }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={String(dateFilter)}
                  label="Date Range"
                  onChange={(e) => setDateFilter(Number(e.target.value))}
                >
                  {dateFilterLabels.map((label, idx) => (
                    <MenuItem key={label} value={idx}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* Require-both control removed (Active enforces AND) */}
          </Box>
        </Stack>
      )}

    <Box sx={{ display: 'flex', gap: 0, mt: -1, flexDirection: { xs: 'column', md: 'row' } }}>
      <Card sx={{ height: '340px', borderRadius: 0, width: '100%', overflow: "auto", maxWidth: { md: '30%' }, flex: '0 0 30%' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Catalog: {mainTab === 0 ? activeSubTabs[subTab] : mainTab === 2 ? blockedSubTabs[subTab] : 'All'}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {catalogsLoading ? (
              <Typography>Loading catalogs…</Typography>
            ) : displayedCatalogs.length === 0 ? (
              <Typography color="text.secondary">No catalogs found for the selected filters.</Typography>
            ) : (
              <>
                {/* Render a single paged list of catalogs */}
                {(() => {
                  const start = (page - 1) * ITEMS_PER_PAGE;
                  const end = start + ITEMS_PER_PAGE;
                  return (
                    <>
                      <List>
                        {displayedCatalogs.slice(start, end).map((cat) => {
                          const item = cat as Record<string, unknown> | null;
                          const rawKey = (item && (item['catalog_id'] ?? item['id'] ?? item['_id'])) ?? JSON.stringify(item);
                          const key = String(rawKey);
                          // Safely extract image URL
                          let img = '/placeholder.png';
                          if (item) {
                            const pf = item['product_forms'];
                            if (Array.isArray(pf) && pf.length > 0) {
                              const first = pf[0] as Record<string, unknown> | null;
                              const other = first?.['OtherAttributes'] as Record<string, unknown> | undefined;
                              const urls = other && other['image_urls'];
                              if (Array.isArray(urls) && urls.length > 0) {
                                img = String(urls[0]);
                              }
                            }
                          }
                          // Safely extract title/category
                          let title = 'Untitled';
                          if (item) {
                            const cp = item['category_path'];
                            if (Array.isArray(cp) && cp.length > 3 && cp[3]) title = String(cp[3]);
                            else if (item['title']) title = String(item['title']);
                          }
                          const catalogId = item ? String(item['catalog_id'] ?? item['id'] ?? '') : '';
                          return (
                            <ListItem key={key} alignItems="flex-start" disablePadding>
                              <ListItemButton onClick={() => setSelectedCatalog(item)}>
                                <ListItemAvatar>
                                  <Avatar variant="square" src={img} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={title}
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                        Catalog ID: {catalogId}
                                      </Typography>
                                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                        Category: {title}
                                      </Typography>
                                    </>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                      <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                        <Pagination
                          count={Math.max(1, Math.ceil((displayedCatalogs.length || 0) / ITEMS_PER_PAGE))}
                          page={page}
                          onChange={(_, val) => setPage(val)}
                          size="small"
                        />
                      </Box>
                    </>
                  );
                })()}
              </>
            )}
      </CardContent>
        </Card>
     

      {/* Right Side - Catalog Details */}
    
  <Card sx={{ borderRadius: 0, width: '100%', flex: '1 1 70%', maxWidth: { md: '70%' } }}>
    <CardContent sx={{ p: 2 }}>
      {selectedCatalog ? (
        <>
          <Typography variant="body2" color="text.secondary">
            Catalog ID: {String(selectedCatalog['catalog_id'] ?? selectedCatalog['id'] ?? '')} | Category: {String(((selectedCatalog['category_path'] as unknown) as Array<unknown>)?.[3] ?? selectedCatalog['category'] ?? '—')}
          </Typography>
          <Divider sx={{ my: 1 }} />

          {/* Out Of Stock banner for multi-product catalogs */}
          {(() => {
            try {
              if (!selectedCatalog) return null;
              const pforms = Array.isArray(selectedCatalog['product_forms']) ? (selectedCatalog['product_forms'] as unknown[]) : [];
              if (pforms.length < 2) return null;
              const zeroIdxs: number[] = [];
              const inventoryForProductForm = (pf: unknown): number => {
                try {
                  const pfObj = pf as Record<string, unknown> | null;
                  const psi = pfObj?.['ProductSizeInventory'] as Record<string, unknown> | undefined;
                  if (!psi || typeof psi !== 'object') return 0;
                  const invRaw = psi['Inventory'] ?? psi['inventory'];
                  if (invRaw !== undefined && invRaw !== null) {
                    const n = Number(String(invRaw).replace(/[^0-9.-]+/g, ''));
                    return Number.isNaN(n) ? 0 : Math.max(0, Math.floor(n));
                  }
                  const sizeObj = psi['Size'] as Record<string, unknown> | undefined;
                  if (sizeObj && typeof sizeObj === 'object') {
                    let s = 0;
                    for (const k of Object.keys(sizeObj)) {
                      const v = (sizeObj[k] as Record<string, unknown>)?.['Inventory'] ?? (sizeObj[k] as Record<string, unknown>)?.['inventory'];
                      if (v !== undefined && v !== null) {
                        const n = Number(String(v).replace(/[^0-9.-]+/g, ''));
                        if (!Number.isNaN(n)) s += Math.max(0, Math.floor(n));
                      }
                    }
                    return s;
                  }
                  return 0;
                } catch {
                  return 0;
                }
              };
              for (let i = 0; i < pforms.length; i++) {
                if (inventoryForProductForm(pforms[i]) === 0) zeroIdxs.push(i);
              }
              if (zeroIdxs.length === 0) return null;
              return (
                <Box sx={{ bgcolor: '#ffebee', border: '1px solid #f44336', color: '#b71c1c', p: 1, borderRadius: 1, mb: 1 }}>
                  <Typography fontWeight="bold">Out Of Stock</Typography>
                  <Typography variant="body2">The following product(s) in this catalog have zero inventory:</Typography>
                  <List dense sx={{ pl: 2 }}>
                    {zeroIdxs.map((i) => {
                      const pf = (pforms[i] as Record<string, unknown> | null);
                      const pid = String(pf?.['id'] ?? '');
                      const pname = (pf && (pf['ProductSizeInventory'] ? ((pf['ProductSizeInventory'] as Record<string, unknown>)['Product Name'] ?? pf['title']) : pf['title'])) ?? '';
                      return (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemText primary={`${pname ? String(pname) + ' — ' : ''}Product ID: ${pid || '—'}`} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              );
            } catch {
              return null;
            }
          })()}

          {selectedProductForms.length > 0 && (
            <Table size="small" sx={{ bgcolor: '#fafafa', borderRadius: 1, mb: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 64, borderRight: '1px solid #e0e0e0' }} />
                  <TableCell sx={{ width: 240, borderRight: '1px solid #e0e0e0', fontWeight: 'bold' }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #e0e0e0' }}>Variation</TableCell>
                  <TableCell sx={{ Width: 100, borderRight: '1px solid #e0e0e0', fontWeight: 'bold', }}>Current Stock</TableCell>
                  <TableCell sx={{ width: 120, fontWeight: 'bold' }}>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderedProductForms.length > 0 ? (
                  renderedProductForms.map(({ pf, idx: origIdx }, renderIdx) => {
                    const pfItem = pf as Record<string, unknown> | null;
                    const pfOther = pfItem ? (pfItem['OtherAttributes'] as Record<string, unknown> | undefined) : undefined;
                    const pfImg = (pfOther && Array.isArray(pfOther['image_urls']) && (pfOther['image_urls'] as Array<unknown>)[0]) ? String((pfOther['image_urls'] as Array<unknown>)[0]) : '/placeholder.png';
                    const pfTitle = (() => {
                      const psi = pfItem ? (pfItem['ProductSizeInventory'] as unknown) : undefined;
                      if (psi && typeof psi === 'object') {
                        const psiObj = psi as Record<string, unknown>;
                        const name = psiObj['Product Name'];
                        if (name !== undefined && name !== null) return String(name);
                      }
                      return String(pfItem?.['title'] ?? selectedCatalog?.['title'] ?? '');
                    })();
                    const pfSku = pfItem ? String(pfItem['id'] ?? '') : '';
                    const pfPrice = getPSIField(pfItem, 'Techpotli Price') || getPSIField(pfItem, 'price');
                    const pfStock = getPSIField(pfItem, 'Inventory') || getPSIField(pfItem, 'inventory') || '';
                    return (
                        <TableRow key={String(origIdx)}>
                        <TableCell sx={{ width: 64, borderRight: '1px solid #e0e0e0' }}>
                          <Avatar variant="square" src={pfImg} sx={{ width: 64, height: 64, cursor: 'pointer' }} onClick={() => openDetail(pfItem)} />
                        </TableCell>
                        <TableCell sx={{ pr: 1, borderRight: '1px solid #e0e0e0' }}>
                          <Typography fontWeight="bold">{toProperCase(pfTitle) || toProperCase(String(selectedCatalog['title'] ?? ''))}</Typography>
                          <Typography variant="body2" color="text.secondary">Product ID: {pfSku}</Typography>
                          <Typography variant="body2" fontWeight="bold">Price: {pfPrice || '—'}</Typography>
                        </TableCell>
                        <TableCell sx={{ pr: 1, borderRight: '1px solid #e0e0e0' }}>
                          {(() => {
                            try {
                              const psi = (pfItem?.['ProductSizeInventory'] as Record<string, unknown> | undefined);
                              const sizeObj = psi?.['Size'] as Record<string, unknown> | undefined;
                              if (sizeObj && typeof sizeObj === 'object') {
                                const sizes = Object.keys(sizeObj).join(', ');
                                return <Typography variant="body2" color="text.secondary">{sizes}</Typography>;
                              }
                              const fallbackSize = pfItem?.['Size'] ?? (pfItem && (pfItem['size'] ?? ''));
                              if (fallbackSize) return <Typography variant="body2" color="text.secondary">Size: {String(fallbackSize)}</Typography>;
                            } catch {
                              // ignore
                            }
                            return null;
                          })()}
                        </TableCell>
                        <TableCell sx={{ pr: 1, borderRight: '1px solid #e0e0e0' }}>
                          {mainTab !== 2 ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <TextField
                                value={editingProductIndex === origIdx ? (productStockEdits[origIdx] ?? pfStock) : (pfStock || String(stock))}
                                onChange={(e) => {
                                  const v = String(e.target.value);
                                  setProductStockEdits(prev => ({ ...prev, [origIdx]: v }));
                                }}
                                size="small"
                                type="number"
                                sx={{ width: 150 }}
                                inputProps={{ inputMode: 'numeric', style: { textAlign: 'center' } }}
                                InputProps={{
                                  readOnly: editingProductIndex !== origIdx,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton size="small" onClick={async () => {
                                        try {
                                          if (editingProductIndex === origIdx) {
                                            const val = productStockEdits[origIdx] ?? pfStock ?? '';
                                            const catalogId = String(selectedCatalog?.['catalog_id'] ?? selectedCatalog?.['id'] ?? '');
                                            const productId = pfItem ? String(pfItem['id'] ?? '') : '';
                                            const res = await updateInventoryOnServer(catalogId, origIdx, String(val), productId || undefined);
                                            if (res && res.ok) {
                                              // If server returned the updated row, use it to refresh UI state.
                                              if (res.data && typeof res.data === 'object') {
                                                try { setSelectedCatalog(res.data as Record<string, unknown>); } catch { /* ignore */ }
                                                // Refresh full catalog list so left pane/paging/filters reflect latest inventory
                                                try { fetchCatalogs(); } catch { /* ignore */ }
                                              } else {
                                                // Fallback: optimistic local update
                                                updateSelectedCatalogProductInventory(origIdx, String(val));
                                              }
                                              setEditingProductIndex(null);
                                              toast.success('Inventory updated');
                                            } else {
                                              toast.error('Failed to update inventory');
                                            }
                                          } else {
                                            setProductStockEdits(prev => ({ ...prev, [origIdx]: pfStock ?? String(stock) }));
                                            setEditingProductIndex(origIdx);
                                          }
                                        } catch (e) {
                                          console.error(e);
                                          toast.error('Failed to update inventory');
                                        }
                                      }}>
                                        {editingProductIndex === origIdx ? <ArrowForwardIosIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>{pfStock || '—'}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{
                            ((): string => {
                              try {
                                // Prefer product-form PSI remark
                                const r1 = getPSIField(pfItem, 'Remark') || getPSIField(pfItem, 'remark');
                                if (r1) return r1;
                                // Direct product-form fields
                                if (pfItem && (pfItem['remark'] ?? pfItem['Remark'])) return String(pfItem['remark'] ?? pfItem['Remark']);
                                // OtherAttributes fallback
                                const other = pfItem ? (pfItem['OtherAttributes'] as Record<string, unknown> | undefined) : undefined;
                                if (other && (other['remark'] ?? other['Remark'])) return String(other['remark'] ?? other['Remark']);
                                // Catalog-level fallback (check several possible keys)
                                const cat = selectedCatalog as Record<string, any> | null;
                                if (cat) {
                                  const crem = cat['remark'] ?? cat['Remark'] ?? cat['QC_Remark'] ?? cat['qc_remark'];
                                  if (crem) return String(crem);
                                }
                              } catch {}
                              return '';
                            })()
                          }</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  // Single product fallback: render one row using first product form
                    <TableRow>
                    <TableCell sx={{ width: 64, borderRight: '1px solid #e0e0e0' }}>
                      <Avatar variant="square" src={String(((((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined)?.['OtherAttributes'] ? (((((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined)?.['OtherAttributes'] as Record<string, unknown>)['image_urls'] as Array<unknown>)?.[0] : '/placeholder.png'))} sx={{ width: 64, height: 64, cursor: 'pointer' }} onClick={() => openDetail((((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined) ?? null)} />
                    </TableCell>
                    <TableCell sx={{ pr: 1, borderRight: '1px solid #e0e0e0' }}>
                      <Typography fontWeight="bold">{toProperCase(getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Product Name') || String((((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined)?.['title'] ?? ''))}</Typography>
                      <Typography variant="body2" color="text.secondary">Product ID: {String((((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined)?.['id'] ?? '')}</Typography>
                      <Typography variant="body2" fontWeight="bold">Price: {getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Techpotli Price') || String(selectedCatalog['price'] ?? '—')}</Typography>
                    </TableCell>
                    <TableCell sx={{ pr: 1, borderRight: '1px solid #e0e0e0' }}>
                      {(() => {
                        try {
                          const pf0 = (((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined);
                          const psi = pf0 ? (pf0['ProductSizeInventory'] as Record<string, unknown> | undefined) : undefined;
                          const sizeObj = psi?.['Size'] as Record<string, unknown> | undefined;
                          if (sizeObj && typeof sizeObj === 'object') {
                            const sizes = Object.keys(sizeObj).join(', ');
                            return <Typography variant="body2" color="text.secondary">Size: {sizes}</Typography>;
                          }
                          const fallbackSize = pf0?.['Size'] ?? (pf0 && (pf0['size'] ?? ''));
                          if (fallbackSize) return <Typography variant="body2" color="text.secondary">Size: {String(fallbackSize)}</Typography>;
                        } catch {}
                        return null;
                      })()}
                    </TableCell>
                    <TableCell sx={{ pr: 1, borderRight: '1px solid #e0e0e0' }}>
                      {mainTab !== 2 ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            value={editingProductIndex === 0 ? (productStockEdits[0] ?? getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Inventory') ?? String(stock)) : (getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Inventory') || String(stock))}
                            onChange={(e) => setProductStockEdits(prev => ({ ...prev, 0: String(e.target.value) }))}
                            size="small"
                            type="number"
                            sx={{ width: 150 }}
                            inputProps={{ inputMode: 'numeric', style: { textAlign: 'center' } }}
                            InputProps={{
                              readOnly: editingProductIndex !== 0,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton size="small" onClick={async () => {
                                    try {
                                      if (editingProductIndex === 0) {
                                        const val = productStockEdits[0] ?? getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Inventory') ?? '';
                                        const catalogId = String(selectedCatalog?.['catalog_id'] ?? selectedCatalog?.['id'] ?? '');
                                        const pf0 = (((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined);
                                        const productId = pf0 ? String(pf0['id'] ?? '') : '';
                                        const res = await updateInventoryOnServer(catalogId, 0, String(val), productId || undefined);
                                        if (res && res.ok) {
                                          if (res.data && typeof res.data === 'object') {
                                            try { setSelectedCatalog(res.data as Record<string, unknown>); } catch { /* ignore */ }
                                            try { fetchCatalogs(); } catch { /* ignore */ }
                                          } else {
                                            updateSelectedCatalogProductInventory(0, String(val));
                                          }
                                          setEditingProductIndex(null);
                                          toast.success('Inventory updated');
                                        } else {
                                          toast.error('Failed to update inventory');
                                        }
                                      } else {
                                        setProductStockEdits(prev => ({ ...prev, 0: getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Inventory') || String(stock) }));
                                        setEditingProductIndex(0);
                                      }
                                    } catch (e) {
                                      console.error(e);
                                      toast.error('Failed to update inventory');
                                    }
                                  }}>
                                    {editingProductIndex === 0 ? <ArrowForwardIosIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>{getPSIField(((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined, 'Inventory') || String(stock) || '—'}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{
                        ((): string => {
                          try {
                            const pf0 = (((selectedCatalog['product_forms'] as unknown) as Array<unknown>)?.[0] as Record<string, unknown> | undefined);
                            const r = getPSIField(pf0, 'Remark') || getPSIField(pf0, 'remark');
                            if (r) return r;
                            if (pf0 && (pf0['remark'] ?? pf0['Remark'])) return String(pf0['remark'] ?? pf0['Remark']);
                            const other = pf0 ? (pf0['OtherAttributes'] as Record<string, unknown> | undefined) : undefined;
                            if (other && (other['remark'] ?? other['Remark'])) return String(other['remark'] ?? other['Remark']);
                            const cat = selectedCatalog as Record<string, any> | null;
                            if (cat) return String(cat['remark'] ?? cat['Remark'] ?? cat['QC_Remark'] ?? cat['qc_remark'] ?? '');
                            return '';
                          } catch {
                            return '';
                          }
                        })()
                      }</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </>
      ) : (
        <Typography color="text.secondary">Select a catalog to see details</Typography>
      )}
    </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={detailOpen} onClose={closeDetail} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Product Details
          <IconButton
            aria-label="close"
            onClick={closeDetail}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, pt: 1, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: '0 0 40%', display: 'flex', justifyContent: 'center' }}>
              <Box component="img" src={(() => {
                try {
                  if (!detailProduct) return '/placeholder.png';
                  const other = (detailProduct as any)['OtherAttributes'];
                  if (other && Array.isArray(other['image_urls']) && other['image_urls'].length > 0) return String(other['image_urls'][0]);
                  const psi = (detailProduct as any)['ProductSizeInventory'];
                  if (psi && psi['image_url']) return String(psi['image_url']);
                  return '/placeholder.png';
                } catch { return '/placeholder.png'; }
              })()} alt="product" style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }} />
            </Box>
            <Box sx={{ flex: '1 1 60%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{(() => {
                try {
                  if (!detailProduct) return '';
                  const pn = getPSIField(detailProduct, 'Product Name') || getPSIField(detailProduct, 'product_name');
                  if (pn) return pn;
                  return String((detailProduct as any)['title'] ?? '');
                } catch { return String((detailProduct as any)?.['title'] ?? ''); }
              })()}</Typography>
              <Typography variant="body2" color="text.secondary">Product ID: {String((detailProduct as any)?.['id'] ?? '')}</Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>Price: {getPSIField(detailProduct, 'Techpotli Price') || getPSIField(detailProduct, 'price') || '—'}</Typography>

              {/* Additional metadata grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Style ID</Typography>
                  <Typography variant="body2">{getPSIField(detailProduct, 'Style ID') || String((detailProduct as any)?.['style_id'] ?? (detailProduct as any)?.['styleId'] ?? '')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">SLA</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['SLA'] ?? (detailProduct as any)?.['sla'] ?? (detailProduct as any)?.['dispatch'] ?? '')}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Techpotli Price</Typography>
                  <Typography variant="body2">{getPSIField(detailProduct, 'Techpotli Price') || String((detailProduct as any)?.['techpotli_price'] ?? '')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Wrong/Defective Returns only Price</Typography>
                  <Typography variant="body2">{getPSIField(detailProduct, 'Wrong/Defective Returns only Price') || String((detailProduct as any)?.['wrong_price'] ?? '')}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Monetization Percentage</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['Monetization Percentage'] ?? (detailProduct as any)?.['monetization_percentage'] ?? '')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Package Weight</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['Package Weight'] ?? (detailProduct as any)?.['package_weight'] ?? '')}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">HSN Code</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['HSN Code'] ?? (detailProduct as any)?.['hsn_code'] ?? '')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Product GST</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['Product GST'] ?? (detailProduct as any)?.['product_gst'] ?? '')}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Catalog Name</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['Catalog Name'] ?? (detailProduct as any)?.['catalog_name'] ?? '')}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Share Text</Typography>
                  <Typography variant="body2">{String((detailProduct as any)?.['Share Text'] ?? (detailProduct as any)?.['share_text'] ?? '')}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />
              {/* Catalog-level remark (show when present or when product form lacks remark) */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">Catalog Remark</Typography>
                <Typography variant="body2">{(() => {
                  try {
                    // Prefer product-level remark if present, otherwise fall back to selectedCatalog remark
                    const pRem = getPSIField(detailProduct, 'Remark') || getPSIField(detailProduct, 'remark') || ((detailProduct as any)?.['remark']);
                    if (pRem) return String(pRem);
                    return String((selectedCatalog as any)?.['remark'] ?? (selectedCatalog as any)?.['QC_Remark'] ?? '');
                  } catch { return '' }
                })()}</Typography>
              </Box>

              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{(() => {
                try {
                  if (!detailProduct) return '';
                  const desc = (detailProduct as any)['description'] || getPSIField(detailProduct, 'Description') || (detailProduct as any)['desc'] || '';
                  if (desc) return String(desc);
                  const other = (detailProduct as any)['OtherAttributes'];
                  if (other && other['description']) return String(other['description']);
                  return '';
                } catch { return ''; }
              })()}</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      </Box>
   </Box>
    
  );
}

