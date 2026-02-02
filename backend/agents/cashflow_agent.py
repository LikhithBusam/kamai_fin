"""
Cash Flow Monitor Agent
Provides daily cash flow alerts to help users track if they're on track for monthly commitments
Writes to: agent_logs table with cash flow status
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Optional
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from autogen_runtime import run_autogen_mcp_task


class CashFlowMonitorAgent:
    """Cash Flow Monitor Agent for daily financial health alerts"""

    def __init__(self, mcp_servers=None):
        """Initialize the cash flow monitor agent"""
        self.agent_name = "cashflow_monitor"
        self.mcp_servers = mcp_servers
        self.system_prompt = self._create_system_prompt()

    def _create_system_prompt(self) -> str:
        """Create the system prompt for the cash flow monitor agent"""
        return """You are a Cash Flow Monitor Agent for gig workers in India.

Your task is to provide a DAILY CASH FLOW STATUS that answers the critical question:
"Am I on track to meet my monthly expenses?"

ANALYSIS STEPS:
1. Get today's date and calculate days remaining in the month
2. Query the user's transactions for this month
3. Calculate: total income this month, total expenses this month
4. Query upcoming bills from the bills table
5. Estimate if the user will have enough to cover remaining bills

OUTPUT FORMAT (JSON):
{
    "user_id": "uuid",
    "status": "on_track" | "at_risk" | "critical",
    "days_remaining_in_month": number,
    "month_to_date": {
        "income": number,
        "expenses": number,
        "net": number
    },
    "upcoming_bills": {
        "total_due": number,
        "count": number,
        "next_due_date": "date",
        "next_due_amount": number
    },
    "projected_gap": number,  // negative if shortfall expected
    "daily_earning_target": number,  // how much per day to stay on track
    "message": "string",  // human-readable status message
    "recommendations": ["action1", "action2"],
    "confidence_score": 0.0-1.0,
    "generated_at": "timestamp"
}

STATUS DEFINITIONS:
- "on_track": Income covers all upcoming bills with 20%+ buffer
- "at_risk": Income might not cover all bills (0-20% buffer)
- "critical": Income is insufficient for upcoming bills (negative projection)

MESSAGE EXAMPLES:
- "You're on track! At current pace, you'll have Rs 5,000 buffer after all bills."
- "Heads up: You need Rs 300/day for the next 10 days to cover rent on the 25th."
- "Critical: You're Rs 3,000 short for EMI due on 7th. Consider extra shifts."

Be direct, practical, and focused on what the user needs to do TODAY."""

    async def analyze_user(self, user_id: str) -> dict:
        """
        Analyze daily cash flow status for a specific user

        Args:
            user_id: UUID of the user to analyze

        Returns:
            dict with cash flow status and recommendations
        """
        print(f"[CashFlow Agent] Starting daily check for user {user_id}")

        try:
            # Get current date info
            today = datetime.now()
            days_in_month = (today.replace(month=today.month % 12 + 1, day=1) - timedelta(days=1)).day
            days_remaining = days_in_month - today.day
            month_start = today.replace(day=1).strftime('%Y-%m-%d')

            # Create the analysis prompt
            prompt = f"""Perform a daily cash flow check for user {user_id}.

TODAY: {today.strftime('%Y-%m-%d')}
DAYS REMAINING IN MONTH: {days_remaining}
MONTH START: {month_start}

STEPS:
1. Query transactions table for this user from {month_start} to today
   - Calculate total income (transaction_type = 'income')
   - Calculate total expenses (transaction_type = 'expense')

2. Query bills table for this user
   - Get bills with due_date >= today AND due_date <= end of month
   - Sum up all pending bill amounts

3. Calculate:
   - Net position = Income - Expenses
   - Projected gap = Net position - Upcoming bills
   - Daily earning target = Upcoming bills / {days_remaining} days

4. Determine status:
   - If projected gap > 20% of upcoming bills → "on_track"
   - If projected gap is 0-20% of upcoming bills → "at_risk"
   - If projected gap < 0 → "critical"

5. Generate a practical, direct message in simple language

6. Log the cash flow status to agent_logs table with:
   - agent_name: "cashflow_monitor"
   - status: the analysis status
   - output: full JSON response

User ID: {user_id}

Execute this analysis and provide the cash flow status."""

            result = await run_autogen_mcp_task(
                agent_name="cashflow_agent",
                system_prompt=self.system_prompt,
                task=prompt,
                user_id=user_id,
                use_azure=True
            )

            print(f"[CashFlow Agent] Daily check complete for user {user_id}")

            return {
                "success": True,
                "user_id": user_id,
                "agent": "cashflow_monitor",
                "result": result,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            print(f"[CashFlow Agent] Error checking user {user_id}: {str(e)}")
            return {
                "success": False,
                "user_id": user_id,
                "agent": "cashflow_monitor",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }


# For standalone testing
if __name__ == "__main__":
    import asyncio

    async def test():
        agent = CashFlowMonitorAgent()
        # Test with a sample user ID
        result = await agent.analyze_user("test-user-id")
        print(json.dumps(result, indent=2))

    asyncio.run(test())
