import { Request, Response } from 'express';
import { z } from 'zod';
import { calculateRoi } from '../Services/service';

const roiSchema = z.object({
  monthlyTraffic: z.number().nonnegative("O tráfego não pode ser negativo"),
  conversionRate: z.number().nonnegative("A taxa não pode ser negativa"),
  customerValue: z.number().nonnegative("O valor não pode ser negativo"),
  monthlyInvestment: z.number().nonnegative("O investimento não pode ser negativo"),
  monthlyGrowthRate: z.number().nonnegative("O crescimento não pode ser negativo")
});

export const handleCalculateRoi = (req: Request, res: Response) => {
  try {
    const parsedData = roiSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({ 
        error: 'Dados inválidos. Verifique os campos enviados.',
        // A MUDANÇA ESTÁ AQUI: trocamos 'errors' por 'issues'
        details: parsedData.error.issues.map((err: any) => err.message)
      });
    }

    const result = calculateRoi(parsedData.data);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro no cálculo do ROI:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};