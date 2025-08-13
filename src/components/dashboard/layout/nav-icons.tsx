import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquareIcon } from '@phosphor-icons/react/dist/ssr/XSquare';
import { BagIcon } from '@phosphor-icons/react/dist/ssr/Bag';
import { TagIcon } from '@phosphor-icons/react/dist/ssr/Tag';
import { PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';
import { DiamondsFourIcon } from '@phosphor-icons/react/dist/ssr/DiamondsFour';
import { TagSimpleIcon } from '@phosphor-icons/react/dist/ssr/TagSimple';
import { BankIcon } from '@phosphor-icons/react/dist/ssr/Bank';
import { BoxArrowUpIcon} from '@phosphor-icons/react/dist/ssr/BoxArrowUp';
import { StackIcon } from '@phosphor-icons/react/dist/ssr/Stack';
import { ShootingStarIcon } from '@phosphor-icons/react/dist/ssr/ShootingStar';
import {HandWithdrawIcon} from '@phosphor-icons/react/dist/ssr/HandWithdraw';
import {WalletIcon} from '@phosphor-icons/react/dist/ssr/Wallet';
import { HouseLineIcon } from '@phosphor-icons/react/dist/ssr/HouseLine';
import {ArrowUDownLeftIcon} from '@phosphor-icons/react/dist/ssr/ArrowUDownLeft';
import {CurrencyInrIcon} from '@phosphor-icons/react/dist/ssr/CurrencyInr';
import {MoneyWavyIcon} from '@phosphor-icons/react/dist/ssr/MoneyWavy';
import {ClipboardTextIcon} from '@phosphor-icons/react/dist/ssr/ClipboardText';
import {BarcodeIcon} from '@phosphor-icons/react/dist/ssr/Barcode';
import {UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';
import {ImagesIcon} from '@phosphor-icons/react/dist/ssr/Images';
import {WarehouseIcon} from '@phosphor-icons/react/dist/ssr/Warehouse';


export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquareIcon,
  'order': BagIcon,
   user: UserIcon,
   users: UsersIcon,
  'tags': TagIcon,
  'product': PackageIcon,
  'category': DiamondsFourIcon,
  'attributes': TagSimpleIcon,
  'bank': BankIcon,
  'BoxArrowUp': BoxArrowUpIcon,
  'cards' : StackIcon, 
  'star': ShootingStarIcon,
  'withdrawal': HandWithdrawIcon,
  'Wallet': WalletIcon,
  'home' : HouseLineIcon, // Assuming 'Wallet' refers to a similar icon
  'arrow-down': ArrowUDownLeftIcon, // Assuming 'arrow-down' refers to a similar icon
   'currency-inr': CurrencyInrIcon, // Assuming 'currency-inr' refers to a similar icon
  'money-wavy': MoneyWavyIcon, // Assuming 'money-wavy' refers to a similar icon
  'clipboard-text': ClipboardTextIcon, // Assuming 'clipboard-text' refers to a similar icon
  'barcode' : BarcodeIcon, // Assuming 'barcode' refers to a similar icon
  'upload-simple': UploadSimpleIcon, // Assuming 'upload-simple' refers to a similar icon
  'images': ImagesIcon, // Assuming 'images' refers to a similar icon
  'warehouse': WarehouseIcon, // Assuming 'warehouse' refers to a similar icon


  
 // 'cards': CardsThreeIcon, // Assuming 'cards' refers to a similar icon

 
} as Record<string, Icon>;
