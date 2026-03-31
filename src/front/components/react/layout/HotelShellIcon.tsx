import {
  BookOpen,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  Compass,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  HelpCircle,
  Home,
  Hotel,
  Lightbulb,
  LogOut,
  Map,
  Menu,
  Minus,
  Percent,
  Plane,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  User,
  Users,
  type LucideIcon
} from "lucide-react";

type HotelShellIconName =
  | "book-open"
  | "building-2"
  | "calendar"
  | "chevron-left"
  | "chevron-right"
  | "check-circle"
  | "clipboard-list"
  | "compass"
  | "credit-card"
  | "gift"
  | "headphones"
  | "heart"
  | "home"
  | "hotel"
  | "lightbulb"
  | "log-out"
  | "map"
  | "menu"
  | "minus"
  | "percent"
  | "plane"
  | "plus"
  | "search"
  | "shield-check"
  | "smartphone"
  | "user"
  | "users";

interface HotelShellIconProps {
  name: HotelShellIconName | string;
  className?: string;
}

const ICON_MAP: Record<HotelShellIconName, LucideIcon> = {
  "book-open": BookOpen,
  "building-2": Building2,
  calendar: Calendar,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "check-circle": CheckCircle2,
  "clipboard-list": ClipboardList,
  compass: Compass,
  "credit-card": CreditCard,
  gift: Gift,
  headphones: Headphones,
  heart: Heart,
  home: Home,
  hotel: Hotel,
  lightbulb: Lightbulb,
  "log-out": LogOut,
  map: Map,
  menu: Menu,
  minus: Minus,
  percent: Percent,
  plane: Plane,
  plus: Plus,
  search: Search,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  user: User,
  users: Users
};

export const HotelShellIcon = ({ name, className }: HotelShellIconProps) => {
  const Icon = ICON_MAP[name as HotelShellIconName] ?? HelpCircle;

  return <Icon className={className} strokeWidth={1.9} aria-hidden="true" focusable="false" />;
};
