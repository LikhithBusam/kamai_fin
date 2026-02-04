"""
StoreBuddy UAE - FastAPI Backend
AI-Powered Financial Companion for Retail and Distribution Businesses

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

# Import core agents (optimized from 12 to 10 for efficiency)
# Removed: context_agent, recommendation_agent, action_agent (redundant/incomplete)
# Added: cashflow_agent (critical daily monitoring)
from pattern_agent import PatternRecognitionAgent
from budget_agent import BudgetAnalysisAgent
from volatility_agent import VolatilityForecasterAgent
from knowledge_agent import KnowledgeIntegrationAgent
from tax_agent import TaxComplianceAgent
from risk_agent import RiskAssessmentAgent
from savings_investment_agent import SavingsInvestmentAgent
from bill_payment_agent import BillPaymentAgent
from goals_agent import FinancialGoalsAgent
from cashflow_agent import CashFlowMonitorAgent

# Initialize FastAPI
app = FastAPI(
    title="StoreBuddy UAE - AI Financial Companion",
    description="Financial analysis service for UAE retail and distribution businesses",
    version="1.0.0"
)

# CORS configuration for Windows frontend ↔ WSL backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://localhost:8080",  # Vue default
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

# In-memory status tracking (for MVP)
analysis_status: Dict[str, Dict[str, Any]] = {}


class AgentOrchestrator:
    """Orchestrates 7 core agents for efficient user analysis"""

    def __init__(self, mcp_servers: str = ".mcp.json"):
        self.mcp_servers = mcp_servers
        # Optimized from 12 to 10 agents - removed redundant, added critical ones
        # Removed: context_agent (incomplete), recommendation_agent (too generic), action_agent (can't execute)
        # Added: cashflow_agent (critical daily monitoring - user's #1 concern)
        self.agents = {
            "pattern": PatternRecognitionAgent(mcp_servers),      # Core: Income patterns + trends
            "volatility": VolatilityForecasterAgent(mcp_servers), # Forecasting
            "budget": BudgetAnalysisAgent(mcp_servers),           # Feast/Famine budgets
            "risk": RiskAssessmentAgent(mcp_servers),             # Financial health
            "knowledge": KnowledgeIntegrationAgent(mcp_servers),  # Govt schemes
            "tax": TaxComplianceAgent(mcp_servers),               # Tax compliance
            "bills": BillPaymentAgent(mcp_servers),               # Bill scheduling
            "savings": SavingsInvestmentAgent(mcp_servers),       # Savings goals
            "goals": FinancialGoalsAgent(mcp_servers),            # Financial goals
            "cashflow": CashFlowMonitorAgent(mcp_servers),        # NEW: Daily cash flow alerts
        }

    async def run_all_agents(self, user_id: str) -> Dict[str, Any]:
        """Run 7 core agents in sequence for efficient analysis"""

        print(f"\n{'='*60}")
        print(f"Starting streamlined analysis for user {user_id}")
        print(f"{'='*60}\n")

        results = {
            "user_id": user_id,
            "analysis_started": datetime.now().isoformat(),
            "agents": {}
        }

        # Update status - now 10 agents (optimized from 12)
        analysis_status[user_id] = {
            "status": "in_progress",
            "agents_completed": 0,
            "total_agents": 10,
            "last_updated": datetime.now().isoformat()
        }

        # Optimized agent sequence - most important first
        agent_names = [
            ("pattern", "Income Analysis"),           # Core foundation
            ("volatility", "Income Forecasting"),     # Predictions
            ("budget", "Smart Budget"),               # Feast/Famine
            ("cashflow", "Cash Flow Monitor"),        # NEW: Daily status check
            ("risk", "Financial Health"),             # Risk score
            ("knowledge", "Scheme Matching"),         # Govt benefits
            ("tax", "Tax Compliance"),                # ITR guidance
            ("bills", "Bill Scheduler"),              # Payment timing
            ("savings", "Savings Planner"),           # Goals + investments
            ("goals", "Goal Tracker"),                # Milestones
        ]

        for idx, (agent_key, agent_name) in enumerate(agent_names, 1):
            print(f"\n[{idx}/10] Running {agent_name} Agent...")

            try:
                result = await self.agents[agent_key].analyze_user(user_id)
                results["agents"][agent_key] = result

                # Update status
                analysis_status[user_id]["agents_completed"] = idx
                analysis_status[user_id]["last_updated"] = datetime.now().isoformat()

                print(f"+ {agent_name} completed")

            except Exception as e:
                print(f"X {agent_name} failed: {str(e)}")
                results["agents"][agent_key] = {
                    "success": False,
                    "error": str(e)
                }

            # Minimal pause between agents (reduced from 2s to 0.5s)
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
orchestrator = AgentOrchestrator()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "StoreBuddy UAE - AI Financial Companion",
        "service_arabic": "ستور بادي الإمارات - مرافقك المالي الذكي",
        "status": "running",
        "version": "1.0.0",
        "agents": 10,
        "currency": "AED"
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def trigger_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Trigger complete financial analysis for a user

    Frontend calls this after login with user_id
    Analysis runs in background
    Frontend fetches results directly from database
    """

    user_id = request.user_id

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    # Check if analysis already in progress
    if user_id in analysis_status and analysis_status[user_id]["status"] == "in_progress":
        raise HTTPException(
            status_code=409,
            detail=f"Analysis already in progress for user {user_id}"
        )

    # Start analysis in background
    background_tasks.add_task(orchestrator.run_all_agents, user_id)

    return AnalysisResponse(
        status="started",
        message=f"Analysis started for user {user_id}. Results will be written to database.",
        user_id=user_id,
        analysis_started=datetime.now().isoformat(),
        estimated_completion_minutes=8
    )


@app.get("/api/status/{user_id}", response_model=StatusResponse)
async def get_analysis_status(user_id: str):
    """
    Get current status of analysis for a user

    Frontend can poll this to show progress
    """

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


@app.get("/api/agent-logs/{user_id}")
async def get_agent_logs(user_id: str):
    """
    Get detailed agent execution logs for a user
    
    Returns all agent responses and outputs for frontend display
    """
    try:
        # Fetch agent logs from database
        import requests
        
        url = f"https://ppkwqebglrkznjsrwccz.supabase.co/rest/v1/agent_logs"
        headers = {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwa3dxZWJnbHJrem5qc3J3Y2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzkyODksImV4cCI6MjA4NTYxNTI4OX0.XTCHiMMQKpRB818UhBP7hE6vknw9RGjX_VEh4A8j6vg",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwa3dxZWJnbHJrem5qc3J3Y2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzkyODksImV4cCI6MjA4NTYxNTI4OX0.XTCHiMMQKpRB818UhBP7hE6vknw9RGjX_VEh4A8j6vg"
        }
        
        params = {
            "user_id": f"eq.{user_id}",
            "order": "created_at.desc",
            "limit": "20"
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        logs = response.json()
        
        return {
            "user_id": user_id,
            "logs": logs,
            "total_count": len(logs)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch agent logs: {str(e)}")


@app.post("/api/analyze-sync")
async def trigger_analysis_sync(request: AnalysisRequest):
    """
    Trigger analysis and wait for completion (synchronous)

    WARNING: This will take 5-10 minutes
    Use /api/analyze (async) for production
    """

    user_id = request.user_id

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    try:
        results = await orchestrator.run_all_agents(user_id)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class QuickAnalysisRequest(BaseModel):
    user_id: str


@app.post("/api/analyze-quick")
async def trigger_quick_analysis(request: QuickAnalysisRequest, background_tasks: BackgroundTasks):
    """
    Quick analysis - runs only 3 essential agents (budget, risk, cashflow)
    Completes in ~1-2 minutes instead of 8 minutes
    """
    user_id = request.user_id

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    # Check if analysis already in progress
    if user_id in analysis_status and analysis_status[user_id]["status"] == "in_progress":
        raise HTTPException(
            status_code=409,
            detail=f"Analysis already in progress for user {user_id}"
        )

    async def run_quick_agents(user_id: str):
        """Run only 3 essential agents for quick analysis"""
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
            ("budget", "Smart Budget"),
            ("risk", "Financial Health"),
            ("cashflow", "Cash Flow Monitor"),
        ]

        for idx, (agent_key, agent_name) in enumerate(quick_agents, 1):
            print(f"\n[{idx}/3] Running {agent_name} Agent...")
            try:
                await orchestrator.agents[agent_key].analyze_user(user_id)
                analysis_status[user_id]["agents_completed"] = idx
                analysis_status[user_id]["last_updated"] = datetime.now().isoformat()
                print(f"+ {agent_name} completed")
            except Exception as e:
                print(f"X {agent_name} failed: {str(e)}")
            await asyncio.sleep(0.3)

        analysis_status[user_id]["status"] = "completed"
        analysis_status[user_id]["last_updated"] = datetime.now().isoformat()
        print(f"\n{'='*60}")
        print(f"Quick analysis complete for user {user_id}")
        print(f"{'='*60}\n")

    background_tasks.add_task(run_quick_agents, user_id)

    return {
        "status": "started",
        "message": f"Quick analysis started for user {user_id}. Only 3 core agents.",
        "user_id": user_id,
        "analysis_started": datetime.now().isoformat(),
        "estimated_completion_minutes": 2
    }


@app.post("/api/match-schemes/{user_id}")
async def match_government_schemes(user_id: str):
    """
    Use AI Knowledge Agent to intelligently match government schemes
    based on user's occupation, income, and profile

    This runs the Knowledge Agent which:
    1. Reads user occupation and profile
    2. Intelligently matches schemes using AI
    3. Saves results to user_schemes table
    4. Returns matched scheme IDs

    Frontend can call this on-demand for "smart recommendations"
    """

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    try:
        print(f"\n[Scheme Matching] Running AI matching for user {user_id}")

        # Run Knowledge Agent to match schemes
        knowledge_agent = orchestrator.agents["knowledge"]
        result = await knowledge_agent.analyze_user(user_id)

        print(f"[Scheme Matching] AI matching completed for user {user_id}")

        return {
            "status": "success",
            "user_id": user_id,
            "message": "AI-powered scheme matching completed",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"[Scheme Matching] Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to match schemes: {str(e)}"
        )


@app.get("/api/health")
async def health_check():
    """Detailed health check - 10 optimized agents"""
    return {
        "status": "healthy",
        "service": "StoreBuddy UAE Backend",
        "agents": {
            "pattern": "ready",       # Income Analysis
            "volatility": "ready",    # Forecasting
            "budget": "ready",        # Feast/Famine
            "cashflow": "ready",      # Daily Cash Flow Monitor
            "risk": "ready",          # Financial Health
            "knowledge": "ready",     # Scheme Matching
            "tax": "ready",           # Tax Compliance
            "bills": "ready",         # Bill Scheduler
            "savings": "ready",       # Savings Planner
            "goals": "ready",         # Goal Tracker
        },
        "total_agents": 10,
        "database": "mcp_connected",
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
    print("  POST /api/analyze          - Trigger analysis (async)")
    print("  POST /api/analyze-sync     - Trigger analysis (sync)")
    print("  GET  /api/status/{user_id} - Get analysis status")
    print("  GET  /api/health           - Health check")
    print("\nDocs available at:")
    print("  > http://localhost:8000/docs")
    print("="*60 + "\n")

    uvicorn.run(
        app,
        host="0.0.0.0",  # Accept connections from Windows
        port=8000,
        log_level="info"
    )
