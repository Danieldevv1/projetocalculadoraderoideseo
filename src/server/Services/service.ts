// src/server/services/roi.service.ts

export interface RoiInput {
  monthlyTraffic: number;
  conversionRate: number;
  customerValue: number;
  monthlyInvestment: number;
  monthlyGrowthRate: number;
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  profit: number;
}

export interface RoiOutput {
  monthlyRevenue: number;
  netProfit: number;
  roiPercentage: number;
  projection: MonthlyProjection[];
}

export const calculateRoi = (data: RoiInput): RoiOutput => {
  const { 
    monthlyTraffic, 
    conversionRate, 
    customerValue, 
    monthlyInvestment, 
    monthlyGrowthRate 
  } = data;

  // 1. Receita Mensal Inicial
  // (Tráfego * (Taxa de Conversão / 100)) * Valor do Cliente
  const monthlyRevenue = monthlyTraffic * (conversionRate / 100) * customerValue;

  // 2. Lucro Líquido Inicial
  const netProfit = monthlyRevenue - monthlyInvestment;

  // 3. ROI (%)
  // (Lucro Líquido / Investimento) * 100
  const roiPercentage = monthlyInvestment > 0 
    ? (netProfit / monthlyInvestment) * 100 
    : 0;

  // 4. Projeção de 12 meses (Juros Compostos no tráfego)
  const projection: MonthlyProjection[] = [];
  const growthMultiplier = 1 + (monthlyGrowthRate / 100);

  for (let i = 1; i <= 12; i++) {
    // O tráfego cresce mês a mês
    const projectedRevenue = monthlyRevenue * Math.pow(growthMultiplier, i - 1);
    const projectedProfit = projectedRevenue - monthlyInvestment;

    projection.push({
      month: i,
      revenue: Number(projectedRevenue.toFixed(2)),
      profit: Number(projectedProfit.toFixed(2))
    });
  }

  return {
    monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    roiPercentage: Number(roiPercentage.toFixed(2)),
    projection
  };
};