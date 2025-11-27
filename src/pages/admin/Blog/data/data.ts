import { BadgeCheck, BadgeX, CircleOff, Timer } from "lucide-react";

export const statuses = [
  {
    label: 'In Progress',
    value: '1' as const,
    icon: Timer,
  },
  {
    label: 'Canceled',
    value: '0' as const,
    icon: CircleOff,
  },
]

export const actives = [
    {
    label: 'Active',
    value: '1' as const,
    icon: BadgeCheck,
  },
  {
    label: 'No Active',
    value: '0' as const,
    icon: BadgeX,
  },
]

