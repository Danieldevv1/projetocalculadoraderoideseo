import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RoiForm } from './components/RoiForm';

export default function App() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  // 1. Função que chama o back-end
  const calcular = async (inputs: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculate-roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data: any = await response.json();
      setResult({ ...data, inputs });
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lê a URL ao carregar (para o Compartilhar Link funcionar)
  useEffect(() => {
    // @ts-ignore
    const params = new URLSearchParams(window.location.search);
    
    // Se a URL tiver os parâmetros, calcula automaticamente
    if (params.has('traffic')) {
      const inputsFromUrl = {
        monthlyTraffic: Number(params.get('traffic')),
        conversionRate: Number(params.get('conversion')),
        customerValue: Number(params.get('value')),
        monthlyInvestment: Number(params.get('investment')),
        monthlyGrowthRate: Number(params.get('growth')),
      };
      calcular(inputsFromUrl);
    }
  }, []);

  // 3. Função para Compartilhar o Link
  const compartilharLink = () => {
    if (!result) return;
    const { inputs } = result;
    
    // @ts-ignore
    const url = new URL(window.location.origin);
    url.searchParams.set('traffic', inputs.monthlyTraffic);
    url.searchParams.set('conversion', inputs.conversionRate);
    url.searchParams.set('value', inputs.customerValue);
    url.searchParams.set('investment', inputs.monthlyInvestment);
    url.searchParams.set('growth', inputs.monthlyGrowthRate);

    // Copia o link para a área de transferência
    // @ts-ignore
    navigator.clipboard.writeText(url.toString());
    
    // Mostra o aviso verde
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  // 4. Função para Exportar PDF
  const exportarPDF = () => {
    // @ts-ignore
    window.print();
  };

  // 5. Função para formatar os valores em Reais (R$)
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* 6. Aviso Flutuante (Toast) */}
      <div className={`fixed top-5 right-5 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium transition-all duration-300 transform ${toast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        ✅ Link copiado para a área de transferência!
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Calculadora de ROI de SEO
          </h1>
          <p className="mt-2 text-slate-500">Projete seus resultados e tome decisões baseadas em dados.</p>
        </div>
        
        {/* Componente do Formulário */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <RoiForm onCalculate={calcular} loading={loading} />
        </div>

        {/* Resultados */}
        {result && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
              <h2 className="text-xl font-semibold text-slate-800">Resultados da Simulação</h2>
              
              <div className="flex flex-wrap gap-3 print:hidden">
                <button 
                  onClick={exportarPDF}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Exportar PDF
                </button>
                <button 
                  onClick={compartilharLink}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  Compartilhar Link
                </button>
              </div>
            </div>
            
            {/* Cartões de Resultado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">Receita Mensal</p>
                <p className="text-3xl font-bold text-slate-900">{formatarMoeda(result.monthlyRevenue)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">Lucro Líquido</p>
                <p className="text-3xl font-bold text-emerald-600">{formatarMoeda(result.netProfit)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">ROI Estimado</p>
                <p className="text-3xl font-bold text-indigo-600">{result.roiPercentage}%</p>
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Projeção de 12 Meses</h3>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <LineChart data={result.projection} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <YAxis 
                      tick={{ fill: '#64748b' }} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => value >= 1000 ? `R$ ${(value/1000).toFixed(0)}k` : `R$ ${value}`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => formatarMoeda(Number(value))} 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="revenue" name="Receita" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="profit" name="Lucro" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}