import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHelmet from '@/common/PageHelmet';
import { BarChart3, Store, Users, TrendingUp } from 'lucide-react';

const statCards = [
  {
    title: 'Total Stores',
    value: '--',
    icon: Store,
    description: 'Active stores on the platform',
  },
  {
    title: 'Total Customers',
    value: '--',
    icon: Users,
    description: 'Across all stores',
  },
  {
    title: 'Revenue',
    value: '--',
    icon: TrendingUp,
    description: 'Total platform revenue',
  },
  {
    title: 'Transactions',
    value: '--',
    icon: BarChart3,
    description: 'This month',
  },
];

const Home = () => {
  return (
    <>
      <PageHelmet
        title="Dashboard - RetailStack Metrics"
        description="RetailStack Metrics Dashboard overview"
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-tertiary">
            Overview of your RetailStack platform metrics
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(card => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary">
                  {card.title}
                </CardTitle>
                <card.icon className="size-4 text-text-quaternary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">{card.value}</div>
                <p className="text-xs text-text-tertiary">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center text-sm text-text-tertiary">
                Chart placeholder - connect API to populate
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">
                Store Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center text-sm text-text-tertiary">
                Chart placeholder - connect API to populate
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Home;
