"""
StoreBuddy UAE - FastAPI Backend
Financial AI companion for UAE small shop owners

This backend:
1. Receives user_id from frontend login
2. Triggers UAE-specific agents for analysis
3. Agents push results to database via Supabase
4. Returns status to frontend
5. Frontend fetches results directly from database
"""

import os
import sys
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Load environment variables from .env file
load_dotenv()

# Add agents directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'agents'))

# Import UAE-specific agents
from profit_agent import ProfitAnalysisAgent
from credit_risk_agent import CreditRiskAgent
from vat_agent import VATAgent
from business_health_agent import BusinessHealthAgent
from reorder_agent import ReorderAgent
from uae_programs_agent import UAEProgramsAgent
from recommendation_agent_uae import RecommendationAgent
from sales_pattern_agent import SalesPatternAgent

# Initialize FastAPI
app = FastAPI(
    title="StoreBuddy UAE - AI Financial Companion",
    description="Financial analysis service for UAE small shop owners",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class AnalysisRequest(BaseModel):
    user_id: str

class AnalysisResponse(BaseModel):
    status: str
    message: str
    user_id: str
    analysis_started: str
    estimated_completion_minutes: int

class StatusResponse(BaseModel):
    user_id: str
    status: str
    agents_completed: int
    total_agents: int
    last_updated: str

# In-memory status tracking
analysis_status: Dict[str, Dict[str, Any]] = {}


class UAEAgentOrchestrator:
    """Orchestrates 8 UAE-specific agents for shop owner analysis"""

    def __init__(self):
        self.agents = {
            "profit": ProfitAnalysisAgent(),
            "credit_risk": CreditRiskAgent(),
            "vat": VATAgent(),
            "business_health": BusinessHealthAgent(),
            "reorder": ReorderAgent(),
            "uae_programs": UAEProgramsAgent(),
            "recommendation": RecommendationAgent(),
            "sales_pattern": SalesPatternAgent(),
        }

    async def run_all_agents(self, user_id: str) -> Dict[str, Any]:
        """Run all 8 UAE agents in sequence"""

        print(f"\n{'='*60}")
        print(f"Starting StoreBuddy UAE analysis for user {user_id}")
        print(f"{'='*60}\n")

        results = {
            "user_id": user_id,
            "analysis_started": datetime.now().isoformat(),
            "agents": {}
        }

        # Update status
        analysis_status[user_id] = {
            "status": "in_progress",
            "agents_completed": 0,
            "total_agents": 8,
            "last_updated": datetime.now().isoformat()
        }

        # UAE agent sequence
        agent_sequence = [
            ("profit", "Profit Analysis", "تحليل الأرباح"),
            ("sales_pattern", "Sales Patterns", "أنماط المبيعات"),
            ("credit_risk", "Credit Risk", "مخاطر الائتمان"),
            ("vat", "VAT Compliance", "امتثال ضريبة القيمة المضافة"),
            ("business_health", "Business Health", "صحة الأعمال"),
            ("reorder", "Inventory Reorder", "إعادة طلب المخزون"),
            ("uae_programs", "UAE Programs", "برامج الإمارات"),
            ("recommendation", "Recommendations", "التوصيات"),
        ]

        for idx, (agent_key, agent_name, agent_name_ar) in enumerate(agent_sequence, 1):
            print(f"\n[{idx}/8] Running {agent_name} Agent...")

            try:
                agent = self.agents[agent_key]
                
                # Call appropriate method based on agent
                if agent_key == "profit":
                    result = await agent.analyze(user_id)
                elif agent_key == "credit_risk":
                    result = await agent.get_collection_priority(user_id)
                elif agent_key == "vat":
                    result = await agent.calculate_vat_position(user_id)
                elif agent_key == "business_health":
                    result = await agent.calculate_health_score(user_id)
                elif agent_key == "reorder":
                    result = await agent.get_reorder_alerts(user_id)
                elif agent_key == "uae_programs":
                    result = await agent.find_matching_programs(user_id)
                elif agent_key == "recommendation":
                    result = await agent.get_daily_recommendations(user_id)
                elif agent_key == "sales_pattern":
                    result = await agent.analyze_patterns(user_id)
                else:
                    result = {"status": "unknown_agent"}

                results["agents"][agent_key] = result

                # Update status
                analysis_status[user_id]["agents_completed"] = idx
                analysis_status[user_id]["last_updated"] = datetime.now().isoformat()

                print(f"✓ {agent_name} completed")

            except Exception as e:
                print(f"✗ {agent_name} failed: {str(e)}")
                results["agents"][agent_key] = {
                    "status": "error",
                    "error": str(e)
                }

            await asyncio.sleep(0.5)

        results["analysis_completed"] = datetime.now().isoformat()

        # Update final status
        analysis_status[user_id]["status"] = "completed"
        analysis_status[user_id]["last_updated"] = datetime.now().isoformat()

        print(f"\n{'='*60}")
        print(f"Analysis complete for user {user_id}")
        print(f"{'='*60}\n")

        return results


# Global orchestrator instance
orchestrator = UAEAgentOrchestrator()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "StoreBuddy UAE - Financial AI Companion",
        "service_arabic": "ستور بادي الإمارات - مرافقك المالي الذكي",
        "status": "running",
        "version": "1.0.0",
        "agents": 8,
        "currency": "AED"
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def trigger_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Trigger complete financial analysis for a shop owner
    """
    user_id = request.user_id

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    if user_id in analysis_status and analysis_status[user_id]["status"] == "in_progress":
        raise HTTPException(
            status_code=409,
            detail=f"Analysis already in progress for user {user_id}"
        )

    background_tasks.add_task(orchestrator.run_all_agents, user_id)

    return AnalysisResponse(
        status="started",
        message=f"Analysis started for user {user_id}. Results will be written to database.",
        user_id=user_id,
        analysis_started=datetime.now().isoformat(),
        estimated_completion_minutes=3
    )


@app.get("/api/status/{user_id}", response_model=StatusResponse)
async def get_analysis_status(user_id: str):
    """Get current status of analysis for a user"""
    if user_id not in analysis_status:
        raise HTTPException(
            status_code=404,
            detail=f"No analysis found for user {user_id}"
        )

    status = analysis_status[user_id]

    return StatusResponse(
        user_id=user_id,
        status=status["status"],
        agents_completed=status["agents_completed"],
        total_agents=status["total_agents"],
        last_updated=status["last_updated"]
    )


# ===== PROFIT ENDPOINTS =====
@app.get("/api/profit/{user_id}")
async def get_profit_analysis(user_id: str):
    """Get profit analysis with UAE-specific insights"""
    try:
        result = await orchestrator.agents["profit"].analyze(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== CREDIT RISK ENDPOINTS =====
@app.get("/api/credit/trust-score/{user_id}/{customer_id}")
async def get_customer_trust_score(user_id: str, customer_id: str):
    """Calculate trust score for a customer"""
    try:
        result = await orchestrator.agents["credit_risk"].calculate_trust_score(user_id, customer_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/credit/collection-priority/{user_id}")
async def get_collection_priority(user_id: str):
    """Get prioritized list of customers for credit collection"""
    try:
        result = await orchestrator.agents["credit_risk"].get_collection_priority(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/credit/aging/{user_id}")
async def get_credit_aging(user_id: str):
    """Get credit aging analysis (30/60/90+ days)"""
    try:
        result = await orchestrator.agents["credit_risk"].analyze_credit_aging(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== VAT ENDPOINTS =====
@app.get("/api/vat/position/{user_id}")
async def get_vat_position(user_id: str, period: Optional[str] = None):
    """Calculate VAT position for filing period"""
    try:
        result = await orchestrator.agents["vat"].calculate_vat_position(user_id, period)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/vat/return/{user_id}")
async def generate_vat_return(user_id: str, period: Optional[str] = None):
    """Generate VAT return data for FTA filing"""
    try:
        result = await orchestrator.agents["vat"].generate_vat_return(user_id, period)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/vat/registration-status/{user_id}")
async def check_vat_registration_status(user_id: str):
    """Check if business needs to register for VAT"""
    try:
        result = await orchestrator.agents["vat"].check_registration_status(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class TRNValidationRequest(BaseModel):
    trn: str


@app.post("/api/vat/validate-trn")
async def validate_trn(request: TRNValidationRequest):
    """Validate UAE TRN format"""
    try:
        result = await orchestrator.agents["vat"].validate_trn(request.trn)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class VATCalculationRequest(BaseModel):
    amount: float
    category: str = "general_goods"
    is_inclusive: bool = True


@app.post("/api/vat/calculate")
async def calculate_vat(request: VATCalculationRequest):
    """Calculate VAT for a transaction"""
    try:
        result = orchestrator.agents["vat"].calculate_vat_for_transaction(
            request.amount, request.category, request.is_inclusive
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== BUSINESS HEALTH ENDPOINTS =====
@app.get("/api/health-score/{user_id}")
async def get_business_health_score(user_id: str):
    """Get comprehensive business health score (0-100)"""
    try:
        result = await orchestrator.agents["business_health"].calculate_health_score(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health-trend/{user_id}")
async def get_health_trend(user_id: str, months: int = 6):
    """Get health score trend over time"""
    try:
        result = await orchestrator.agents["business_health"].get_health_trend(user_id, months)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== REORDER ENDPOINTS =====
@app.get("/api/reorder/alerts/{user_id}")
async def get_reorder_alerts(user_id: str):
    """Get items that need to be reordered"""
    try:
        result = await orchestrator.agents["reorder"].get_reorder_alerts(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/reorder/predict/{user_id}/{item_id}")
async def predict_demand(user_id: str, item_id: str, days_ahead: int = 30):
    """Predict demand for a specific item"""
    try:
        result = await orchestrator.agents["reorder"].predict_demand(user_id, item_id, days_ahead)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/reorder/supplier-orders/{user_id}")
async def get_supplier_orders(user_id: str):
    """Get reorder alerts grouped by supplier"""
    try:
        result = await orchestrator.agents["reorder"].get_supplier_order_summary(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== UAE PROGRAMS ENDPOINTS =====
@app.get("/api/programs/match/{user_id}")
async def find_matching_programs(user_id: str):
    """Find UAE SME programs matching the business profile"""
    try:
        result = await orchestrator.agents["uae_programs"].find_matching_programs(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/programs/{program_id}")
async def get_program_details(program_id: str):
    """Get detailed information about a specific program"""
    try:
        result = await orchestrator.agents["uae_programs"].get_program_details(program_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/programs/apply/{user_id}/{program_id}")
async def apply_for_program(user_id: str, program_id: str):
    """Record interest in a program and get application guidance"""
    try:
        result = await orchestrator.agents["uae_programs"].apply_for_program(user_id, program_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== RECOMMENDATIONS ENDPOINTS =====
@app.get("/api/recommendations/{user_id}")
async def get_daily_recommendations(user_id: str):
    """Get prioritized daily recommendations"""
    try:
        result = await orchestrator.agents["recommendation"].get_daily_recommendations(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/recommendations/{user_id}/{category}")
async def get_recommendations_by_category(user_id: str, category: str):
    """Get recommendations for a specific category"""
    try:
        result = await orchestrator.agents["recommendation"].get_recommendation_by_category(user_id, category)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class RecommendationActionRequest(BaseModel):
    action: str  # 'completed', 'dismissed', 'snoozed'


@app.post("/api/recommendations/{user_id}/{recommendation_id}/action")
async def mark_recommendation_action(user_id: str, recommendation_id: str, request: RecommendationActionRequest):
    """Record action taken on a recommendation"""
    try:
        result = await orchestrator.agents["recommendation"].mark_recommendation_action(
            user_id, recommendation_id, request.action
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== SALES PATTERN ENDPOINTS =====
@app.get("/api/sales/patterns/{user_id}")
async def get_sales_patterns(user_id: str, days: int = 90):
    """Analyze sales patterns"""
    try:
        result = await orchestrator.agents["sales_pattern"].analyze_patterns(user_id, days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sales/peak-times/{user_id}")
async def get_peak_times(user_id: str):
    """Identify peak selling times"""
    try:
        result = await orchestrator.agents["sales_pattern"].get_peak_times(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sales/customers/{user_id}")
async def get_customer_segments(user_id: str):
    """Get customer segments based on transaction patterns"""
    try:
        result = await orchestrator.agents["sales_pattern"].get_customer_segments(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sales/forecast/{user_id}")
async def forecast_sales(user_id: str, days_ahead: int = 7):
    """Forecast sales for next N days"""
    try:
        result = await orchestrator.agents["sales_pattern"].forecast_sales(user_id, days_ahead)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== QUICK ANALYSIS =====
@app.post("/api/analyze-quick")
async def trigger_quick_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Quick analysis - runs only 3 essential agents
    Completes in ~1 minute
    """
    user_id = request.user_id

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    if user_id in analysis_status and analysis_status[user_id]["status"] == "in_progress":
        raise HTTPException(
            status_code=409,
            detail=f"Analysis already in progress for user {user_id}"
        )

    async def run_quick_agents(user_id: str):
        """Run only 3 essential agents"""
        print(f"\n{'='*60}")
        print(f"Starting QUICK analysis for user {user_id}")
        print(f"{'='*60}\n")

        analysis_status[user_id] = {
            "status": "in_progress",
            "agents_completed": 0,
            "total_agents": 3,
            "last_updated": datetime.now().isoformat()
        }

        quick_agents = [
            ("profit", "Profit Analysis"),
            ("credit_risk", "Credit Risk"),
            ("recommendation", "Recommendations"),
        ]

        for idx, (agent_key, agent_name) in enumerate(quick_agents, 1):
            print(f"\n[{idx}/3] Running {agent_name} Agent...")
            try:
                agent = orchestrator.agents[agent_key]
                if agent_key == "profit":
                    await agent.analyze(user_id)
                elif agent_key == "credit_risk":
                    await agent.get_collection_priority(user_id)
                elif agent_key == "recommendation":
                    await agent.get_daily_recommendations(user_id)
                    
                analysis_status[user_id]["agents_completed"] = idx
                analysis_status[user_id]["last_updated"] = datetime.now().isoformat()
                print(f"✓ {agent_name} completed")
            except Exception as e:
                print(f"✗ {agent_name} failed: {str(e)}")
            await asyncio.sleep(0.3)

        analysis_status[user_id]["status"] = "completed"
        analysis_status[user_id]["last_updated"] = datetime.now().isoformat()
        print(f"\n{'='*60}")
        print(f"Quick analysis complete for user {user_id}")
        print(f"{'='*60}\n")

    background_tasks.add_task(run_quick_agents, user_id)

    return {
        "status": "started",
        "message": f"Quick analysis started for user {user_id}",
        "user_id": user_id,
        "analysis_started": datetime.now().isoformat(),
        "estimated_completion_minutes": 1
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "StoreBuddy UAE",
        "service_arabic": "ستور بادي الإمارات",
        "agents": {
            "profit": "ready",
            "credit_risk": "ready",
            "vat": "ready",
            "business_health": "ready",
            "reorder": "ready",
            "uae_programs": "ready",
            "recommendation": "ready",
            "sales_pattern": "ready",
        },
        "total_agents": 8,
        "currency": "AED",
        "vat_rate": "5%",
        "timestamp": datetime.now().isoformat()
    }


if __name__ == "__main__":
    import uvicorn

    print("\n" + "="*60)
    print("Starting StoreBuddy UAE Backend")
    print("ستور بادي الإمارات - الخادم الخلفي")
    print("="*60)
    print("\nFrontend can connect to:")
    print("  > http://localhost:8000")
    print("  > http://127.0.0.1:8000")
    print("\nAPI Endpoints:")
    print("  POST /api/analyze           - Full analysis (async)")
    print("  POST /api/analyze-quick     - Quick analysis (3 agents)")
    print("  GET  /api/status/{user_id}  - Analysis status")
    print("  GET  /api/profit/{user_id}  - Profit analysis")
    print("  GET  /api/credit/*          - Credit management")
    print("  GET  /api/vat/*             - VAT compliance")
    print("  GET  /api/health-score/*    - Business health")
    print("  GET  /api/reorder/*         - Inventory reorder")
    print("  GET  /api/programs/*        - UAE SME programs")
    print("  GET  /api/recommendations/* - Daily recommendations")
    print("  GET  /api/sales/*           - Sales patterns")
    print("\nDocs available at:")
    print("  > http://localhost:8000/docs")
    print("="*60 + "\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
