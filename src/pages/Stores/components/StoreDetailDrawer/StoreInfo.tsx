import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  User,
  Phone,
  ShoppingBag,
  Monitor,
  Users,
  CreditCard,
  Package,
} from 'lucide-react';
import type { StoreOperationalStatus } from '@/services/types/metrics';

interface StoreInfoProps {
  store: StoreOperationalStatus;
}

const storeTypeLabels: Record<StoreOperationalStatus['store_type'], string> = {
  supermarket: 'Supermarket',
  mini_mart: 'Mini Mart',
  kiosk: 'Kiosk',
  wholesale: 'Wholesale',
};

const planVariants: Record<
  StoreOperationalStatus['subscription_plan'],
  'outline' | 'info' | 'positive'
> = {
  starter: 'outline',
  growth: 'info',
  enterprise: 'positive',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export function StoreInfo({ store }: StoreInfoProps) {
  const age = daysSince(store.created_at);
  const months = Math.floor(age / 30);

  const rows = [
    {
      icon: Calendar,
      label: 'Onboarded',
      value: formatDate(store.created_at),
      detail: months > 0 ? `${months} month${months > 1 ? 's' : ''} ago` : `${age} days ago`,
    },
    {
      icon: User,
      label: 'Owner',
      value: store.owner_name,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: store.owner_phone,
    },
    {
      icon: ShoppingBag,
      label: 'Store Type',
      value: storeTypeLabels[store.store_type],
    },
    {
      icon: Package,
      label: 'Catalogue Size',
      value: `${store.total_skus.toLocaleString()} SKUs`,
    },
    {
      icon: Monitor,
      label: 'POS Terminals',
      value: `${store.pos_terminals}`,
    },
    {
      icon: Users,
      label: 'Staff',
      value: `${store.staff_count} member${store.staff_count > 1 ? 's' : ''}`,
    },
    {
      icon: CreditCard,
      label: 'Plan',
      value: store.subscription_plan,
      isBadge: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">Store Information</CardTitle>
        <CardDescription className="text-xs">Account details and configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {rows.map(row => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-secondary">
                  <Icon className="size-4 text-text-tertiary" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-text-quaternary">{row.label}</span>
                  {row.isBadge ? (
                    <Badge
                      variant={planVariants[store.subscription_plan]}
                      className="w-fit capitalize"
                    >
                      {row.value}
                    </Badge>
                  ) : (
                    <span className="text-sm font-medium text-text-primary">{row.value}</span>
                  )}
                  {'detail' in row && row.detail && (
                    <span className="text-xs text-text-tertiary">{row.detail}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
