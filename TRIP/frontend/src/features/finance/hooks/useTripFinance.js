import { useState, useEffect, useCallback } from 'react';
import { financeService } from '../services/financeService';

export function useTripFinance(planId) {
  const [budget, setBudget] = useState({ total_estimated: 0, days_remaining: 0 });
  const [expenses, setExpenses] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(100);

  const fetchData = useCallback(async () => {
    if (!planId) return;
    try {
      setLoading(true);
      const [budgetData, expensesData, insightsData] = await Promise.all([
        financeService.getTripBudget(planId),
        financeService.getTripExpenses(planId),
        financeService.getAiInsights(planId)
      ]);
      
      setBudget(budgetData);
      setExpenses(expensesData.expenses || []);
      setAiInsights(insightsData.insights || []);
      setHealthScore(insightsData.health_score || 100);
    } catch (err) {
      console.error("Failed to fetch finance data", err);
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addExpense = async (expenseData) => {
    try {
      await financeService.addExpense(planId, expenseData);
      await fetchData(); // Refresh data to get new insights and updated totals
    } catch (err) {
      console.error("Failed to add expense", err);
      throw err;
    }
  };

  return {
    budget,
    expenses,
    aiInsights,
    healthScore,
    loading,
    addExpense,
    refresh: fetchData
  };
}