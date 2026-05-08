import { useEffect, useRef } from 'react';
import * as LucideReact from 'lucide-react';

export function Icon({ name, size = 24, color = 'currentColor', className = '', strokeWidth = 2 }) {
  const Comp = LucideReact[name];
  if (!Comp) return null;
  return <Comp size={size} color={color} className={className} strokeWidth={strokeWidth} />;
}

// Named shortcuts
export const Calendar      = (p) => <Icon name="Calendar" {...p} />;
export const ShieldCheck   = (p) => <Icon name="ShieldCheck" {...p} />;
export const Star          = (p) => <Icon name="Star" {...p} />;
export const X             = (p) => <Icon name="X" {...p} />;
export const PlusCircle    = (p) => <Icon name="PlusCircle" {...p} />;
export const LogOut        = (p) => <Icon name="LogOut" {...p} />;
export const LayoutGrid    = (p) => <Icon name="LayoutGrid" {...p} />;
export const ThumbsUp      = (p) => <Icon name="ThumbsUp" {...p} />;
export const Download      = (p) => <Icon name="Download" {...p} />;
export const Heart         = (p) => <Icon name="Heart" {...p} />;
export const Send          = (p) => <Icon name="Send" {...p} />;
export const Search        = (p) => <Icon name="Search" {...p} />;
export const Check         = (p) => <Icon name="Check" {...p} />;
export const Loader2       = (p) => <Icon name="Loader2" {...p} />;
export const AlertTriangle = (p) => <Icon name="AlertTriangle" {...p} />;
export const Settings      = (p) => <Icon name="Settings" {...p} />;
export const Wifi          = (p) => <Icon name="Wifi" {...p} />;
export const WifiOff       = (p) => <Icon name="WifiOff" {...p} />;
export const Users         = (p) => <Icon name="Users" {...p} />;
export const Printer       = (p) => <Icon name="Printer" {...p} />;
export const BookOpen      = (p) => <Icon name="BookOpen" {...p} />;
export const Contact       = (p) => <Icon name="Contact" {...p} />;
export const CalendarDays  = (p) => <Icon name="CalendarDays" {...p} />;
export const CreditCard    = (p) => <Icon name="CreditCard" {...p} />;
export const Clock         = (p) => <Icon name="Clock" {...p} />;
export const Pencil        = (p) => <Icon name="Pencil" {...p} />;
export const Save          = (p) => <Icon name="Save" {...p} />;
export const ImageIcon     = (p) => <Icon name="Image" {...p} />;
export const UploadCloud   = (p) => <Icon name="UploadCloud" {...p} />;
export const Wand2         = (p) => <Icon name="Wand2" {...p} />;
export const GripHorizontal= (p) => <Icon name="GripHorizontal" {...p} />;
export const FileSpreadsheet=(p) => <Icon name="FileSpreadsheet" {...p} />;
export const MapPin        = (p) => <Icon name="MapPin" {...p} />;
export const MessageCircle = (p) => <Icon name="MessageCircle" {...p} />;
export const UserCheck     = (p) => <Icon name="UserCheck" {...p} />;
export const Info          = (p) => <Icon name="Info" {...p} />;
export const Sun           = (p) => <Icon name="Sun" {...p} />;
export const Moon          = (p) => <Icon name="Moon" {...p} />;
export const RefreshCw = (p) => <Icon name="RefreshCw" {...p} />;
export const Camera = (p) => <Icon name="Camera" {...p} />;
export const Menu = (p) => <Icon name="Menu" {...p} />;
export const User = (p) => <Icon name="User" {...p} />;
export const Phone = (p) => <Icon name="Phone" {...p} />;
