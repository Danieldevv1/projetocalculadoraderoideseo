import { useState } from 'react';

interface RoiFormProps {
  onCalculate: (data: any) => void;
  loading: boolean;
}

export function RoiForm({ onCalculate, loading }: RoiFormProps) {
  const [inputs, setInputs] = useState({
    monthlyTraffic: 10000,
    conversionRate: 2.5,
    customerValue: 150,
    monthlyInvestment: 3000,
    monthlyGrowthRate: 5
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: Number(value) });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onCalculate(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tráfego Mensal (visitantes)</label>
          <input type="number" name="monthlyTraffic" value={inputs.monthlyTraffic} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Taxa de Conversão (%)</label>
          <input type="number" step="0.1" name="conversionRate" value={inputs.conversionRate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Cliente (R$)</label>
          <input type="number" name="customerValue" value={inputs.customerValue} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investimento Mensal (R$)</label>
          <input type="number" name="monthlyInvestment" value={inputs.monthlyInvestment} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Crescimento Mensal Esperado (%)</label>
          <input type="number" step="0.1" name="monthlyGrowthRate" value={inputs.monthlyGrowthRate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
        </div>
      </div>
      
      <button type="submit" disabled={loading} className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}>
        {loading ? 'Calculando...' : 'Calcular ROI'}
      </button>
    </form>
  );
}