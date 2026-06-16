from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ExpenseBase(BaseModel):
    category: str = Field(..., description="E.g., flights, food, transport, hotel, shopping, emergency")
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR")
    notes: Optional[str] = None
    location: Optional[str] = None
    day_index: Optional[int] = None

class ExpenseResponse(ExpenseBase):
    id: str
    created_at: datetime
    
class BudgetResponse(BaseModel):
    total_estimated: float
    total_actual: float
    days_remaining: int
    currency: str
    
class FinanceInsight(BaseModel):
    category: str
    message: str
    severity: str = Field(..., description="info, warning, critical")

class FinanceInsightsResponse(BaseModel):
    health_score: int = Field(..., ge=0, le=100)
    insights: List[FinanceInsight]