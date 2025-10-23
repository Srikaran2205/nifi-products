import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, DollarSign, Package } from 'lucide-react';
import type { ProductSale, AggregatedProduct } from '../types';

const MOCK_DATA: ProductSale[] = [
  { id: "19", name: "Vehicle Service Contract", sold_count: 55, avg_price: 5652.290909 },
  { id: "48", name: "Appearance Protection", sold_count: 53, avg_price: 762.45283 },
  { id: "7", name: "GAP", sold_count: 51, avg_price: 4108.607843 },
  { id: "1", name: "Appearance Protection", sold_count: 49, avg_price: 4124.897959 },
  { id: "11", name: "Multi-Protect Bundle", sold_count: 48, avg_price: 5587.833333 },
  { id: "55", name: "Key Protection", sold_count: 44, avg_price: 554.863636 },
  { id: "13", name: "Pre-Paid Maintenance", sold_count: 44, avg_price: 6832.5 },
  { id: "54", name: "GAP", sold_count: 42, avg_price: 586.833333 },
  { id: "70", name: "Windshield", sold_count: 42, avg_price: 1899.0 },
  { id: "58", name: "Pre-Paid Maintenance", sold_count: 37, avg_price: 4720.891892 }
];

const COLORS = ['#0B3D91', '#1e5bc6', '#3b7dd6', '#5a9fe7', '#7ab8f5', '#9acfff', '#1a472a', '#2d7a4d', '#45a36c', '#5fc88d'];

export function DashboardPage() {
  const [data, setData] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [soldCountRange, setSoldCountRange] = useState<[number, number]>([0, 100]);
  const [avgPriceRange, setAvgPriceRange] = useState<[number, number]>([0, 10000]);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/products/sales');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.log('Using mock data');
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  const aggregatedData = useMemo((): AggregatedProduct[] => {
    const grouped = new Map<string, { sold_count: number; total_price: number; count: number }>();

    data.forEach(product => {
      const existing = grouped.get(product.name) || { sold_count: 0, total_price: 0, count: 0 };
      grouped.set(product.name, {
        sold_count: existing.sold_count + product.sold_count,
        total_price: existing.total_price + (product.avg_price * product.sold_count),
        count: existing.count + 1
      });
    });

    return Array.from(grouped.entries()).map(([name, values]) => ({
      name,
      sold_count: values.sold_count,
      avg_price: values.total_price / values.sold_count,
      total_revenue: values.total_price
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    return aggregatedData.filter(product =>
      product.sold_count >= soldCountRange[0] &&
      product.sold_count <= soldCountRange[1] &&
      product.avg_price >= avgPriceRange[0] &&
      product.avg_price <= avgPriceRange[1]
    );
  }, [aggregatedData, soldCountRange, avgPriceRange]);

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'top5') {
      const sorted = [...aggregatedData].sort((a, b) => b.sold_count - a.sold_count).slice(0, 5);
      const minSold = Math.min(...sorted.map(p => p.sold_count));
      setSoldCountRange([minSold, 100]);
      setAvgPriceRange([0, 10000]);
    } else if (preset === 'top10revenue') {
      const sorted = [...aggregatedData].sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 10);
      const minRevenue = Math.min(...sorted.map(p => p.total_revenue));
      const minPrice = minRevenue / Math.max(...sorted.map(p => p.sold_count));
      setAvgPriceRange([minPrice * 0.9, 10000]);
      setSoldCountRange([0, 100]);
    }
  };

  const resetFilters = () => {
    setActivePreset(null);
    setSoldCountRange([0, 100]);
    setAvgPriceRange([0, 10000]);
  };

  const totalRevenue = filteredData.reduce((sum, p) => sum + p.total_revenue, 0);
  const totalSold = filteredData.reduce((sum, p) => sum + p.sold_count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0B3D91]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Products Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze product sales performance and trends
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredData.length}</p>
            </div>
            <Package className="text-[#0B3D91] dark:text-blue-400" size={40} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Sold</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSold.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-[#0B3D91] dark:text-blue-400" size={40} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <DollarSign className="text-[#0B3D91] dark:text-blue-400" size={40} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Filters</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sold Count Range: {soldCountRange[0]} - {soldCountRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={soldCountRange[0]}
                onChange={(e) => setSoldCountRange([+e.target.value, soldCountRange[1]])}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91] transition-all duration-200"
                placeholder="Min"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input
                type="number"
                value={soldCountRange[1]}
                onChange={(e) => setSoldCountRange([soldCountRange[0], +e.target.value])}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91] transition-all duration-200"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avg Price Range: ${avgPriceRange[0]} - ${avgPriceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={avgPriceRange[0]}
                onChange={(e) => setAvgPriceRange([+e.target.value, avgPriceRange[1]])}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91] transition-all duration-200"
                placeholder="Min"
              />
              <span className="text-gray-500 dark:text-gray-400">to</span>
              <input
                type="number"
                value={avgPriceRange[1]}
                onChange={(e) => setAvgPriceRange([avgPriceRange[0], +e.target.value])}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0B3D91] transition-all duration-200"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => applyPreset('top5')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activePreset === 'top5'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Top 5 by Sold Count
          </button>
          <button
            onClick={() => applyPreset('top10revenue')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activePreset === 'top10revenue'
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Top 10 by Revenue
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sales Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="sold_count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.sold_count}`}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 overflow-x-auto">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Top Products
          </h3>
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Sold</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Price</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.sort((a, b) => b.total_revenue - a.total_revenue).map((product, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="py-3 px-2 text-sm text-gray-900 dark:text-white font-medium">
                    {product.name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                    {product.sold_count}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400 text-right">
                    ${product.avg_price.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-900 dark:text-white text-right">
                    ${product.total_revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
