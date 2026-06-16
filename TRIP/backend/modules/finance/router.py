from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from backend.core.auth import get_current_user
from backend.modules.finance.schemas import ExpenseBase, ExpenseResponse, BudgetResponse, FinanceInsightsResponse

router = APIRouter(prefix="/api/finance", tags=["Finance"])

@router.get("/{plan_id}/budget", response_model=BudgetResponse)
async def get_budget(plan_id: str, current_user: str = Depends(get_current_user)):
    # TODO: Connect to actual database/Firebase wrapper
    # Mocking for architectural scaffold
    return {
        "total_estimated": 45000.0,
        "total_actual": 12500.0,
        "days_remaining": 4,
        "currency": "INR"
    }

@router.get("/{plan_id}/expenses")
async def get_expenses(plan_id: str, current_user: str = Depends(get_current_user)):
    return {
        "expenses": [
            {"id": "1", "category": "flights", "amount": 8500, "currency": "INR", "notes": "IndiGo to Goa", "created_at": "2026-06-16T10:00:00Z"},
            {"id": "2", "category": "food", "amount": 2500, "currency": "INR", "notes": "Dinner at Thalassa", "created_at": "2026-06-16T20:00:00Z"},
            {"id": "3", "category": "transport", "amount": 1500, "currency": "INR", "notes": "Airport Cab", "created_at": "2026-06-16T12:00:00Z"}
        ]
    }

@router.post("/{plan_id}/expenses")
async def add_expense(plan_id: str, expense: ExpenseBase, current_user: str = Depends(get_current_user)):
    # TODO: Insert into database
    return {"status": "success", "message": "Expense logged securely"}

@router.get("/{plan_id}/insights", response_model=FinanceInsightsResponse)
async def get_insights(plan_id: str, current_user: str = Depends(get_current_user)):
    # TODO: Trigger LangChain graph to analyze expenses against budget
    return {
        "health_score": 78,
        "insights": [
            {"category": "food", "message": "You are spending 20% more on food than the AI initially estimated for this region.", "severity": "warning"},
            {"category": "transport", "message": "Local transport costs are well within budget. Great job utilizing local routing.", "severity": "info"}
        ]
    }