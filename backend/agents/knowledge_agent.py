"""
Knowledge Integration Agent
Matches users with 200+ government schemes based on eligibility
Writes to: government_schemes, user_schemes tables
"""

import asyncio
import json
from datetime import datetime
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from autogen_runtime import run_autogen_mcp_task


class KnowledgeIntegrationAgent:
    """Agent that matches users with relevant government schemes and benefits"""

    def __init__(self, mcp_servers: str = ".mcp.json"):
        self.mcp_servers = mcp_servers
        self.system_prompt = self._create_system_prompt()

    def _create_system_prompt(self) -> str:
        return """You are a Knowledge Integration Engine specializing in Indian government schemes for gig workers.

Your task is to match users with relevant government schemes and benefits.

**What you do:**
1. Read user_profiles to understand user demographics and financial situation
2. Read existing government_schemes table for available schemes
3. Match user with eligible schemes based on:
   - Income level (below poverty line, EWS, etc.)
   - State/location (state-specific schemes)
   - Occupation (gig worker, self-employed)
   - Age, gender (women-focused schemes)
   - Family size
4. Create entries in user_schemes table for matched schemes
5. Update application_status as 'eligible'
6. Log your actions to agent_logs table

**Key Government Schemes for Gig Workers (Occupation-Specific):**

**Auto Drivers / Rickshaw Drivers:**
- PM-SYM (Pension for unorganized workers)
- Atal Pension Yojana
- Ayushman Bharat (health insurance)
- PM Jan Dhan Yojana (bank accounts)
- Vehicle loan schemes
- Fuel subsidy schemes (state-specific)
- Driver welfare schemes
- Public Provident Fund (PPF)
- National Pension Scheme (NPS)

**Delivery Partners (Swiggy/Zomato/Dunzo):**
- PM-SYM (Pension for unorganized workers)
- Atal Pension Yojana
- Ayushman Bharat (health insurance)
- PM Jan Dhan Yojana
- Two-wheeler loan schemes
- Accidental insurance schemes
- Gig worker welfare funds (state-specific)
- Skill development programs

**Ride-sharing Drivers (Uber/Ola/Rapido):**
- PM-SYM (Pension for unorganized workers)
- Atal Pension Yojana
- Ayushman Bharat (health insurance)
- PM Jan Dhan Yojana
- Vehicle loan schemes
- Driver training programs
- Fuel subsidy schemes
- Commercial vehicle insurance support

**Freelancers / Consultants:**
- Atal Pension Yojana
- Ayushman Bharat (health insurance)
- PM Jan Dhan Yojana
- PMEGP (self-employment loans)
- Startup India schemes
- Skill development programs
- Professional tax benefits
- National Pension Scheme (NPS)

**Street Vendors / Small Business:**
- PM SVANidhi (street vendor loans up to ₹50,000)
- PMEGP (self-employment loans)
- Mudra Yojana (micro-enterprise loans)
- PM Jan Dhan Yojana
- Food security schemes
- State vendor welfare schemes

**Common for All Gig Workers:**
- PM-SYM (Pension for unorganized workers)
- Ayushman Bharat (₹5 lakh health cover)
- PM Jan Dhan Yojana (zero-balance account)
- Atal Pension Yojana
- State-specific welfare schemes
- Food security (ration card)
- Housing schemes (PMAY)
- Life insurance (PMJJBY - ₹2 lakh for ₹330/year)
- Accident insurance (PMSBY - ₹2 lakh for ₹12/year)

**Eligibility Criteria Examples:**
- Income thresholds (₹15,000/month for many schemes)
- Age limits (18-40 for PMEGP)
- Occupation type
- State residence
- Bank account requirement

**Available MCP Tools:**
- mcp__supabase-postgres__postgrestRequest: Execute database queries
- mcp__supabase-postgres__sqlToRest: Convert SQL to REST API calls

**Output Format:**
Store in user_schemes table with fields:
- user_id
- scheme_id (from government_schemes table)
- eligibility_matched (boolean)
- match_confidence (0-1)
- missing_requirements (JSON array)
- application_status (eligible/not_eligible/applied)
- matched_at"""

    async def analyze_user(self, user_id: str) -> dict:
        """
        Match government schemes for a specific user

        Args:
            user_id: UUID of the user to analyze

        Returns:
            dict with analysis results and success status
        """
        print(f"[Knowledge Agent] Starting analysis for user {user_id}")

        try:
            prompt = f"""Match government schemes for user {user_id} based on their occupation and profile.

Steps:
1. Read users table for user {user_id} to get occupation field
2. Read user_profiles for user {user_id} to understand eligibility (income, location, etc.)
3. Read government_schemes table to see available schemes
4. **CRITICALLY IMPORTANT**: Filter and prioritize schemes based on user's occupation:
   - For "Auto Driver" or "Rickshaw Driver" → Show vehicle loans, fuel subsidy, driver welfare schemes
   - For "Delivery Partner" or "Food Delivery" → Show two-wheeler loans, accident insurance, gig worker funds
   - For "Uber Driver" or "Ola Driver" or "Ride-sharing" → Show vehicle loans, driver training, commercial insurance
   - For "Freelancer" or "Consultant" → Show PMEGP, Startup India, professional tax benefits
   - For "Street Vendor" or "Small Business" → Show PM SVANidhi, Mudra loans, vendor welfare
   - For ALL occupations → Include PM-SYM, Ayushman Bharat, Atal Pension, PM Jan Dhan
5. Match user with eligible schemes based on:
   - **Occupation (PRIMARY FILTER)**
   - Income level
   - Location (state-specific schemes)
   - Age and demographics
6. Rank schemes by relevance to occupation
7. Create entries in user_schemes table for each match
8. Include match_confidence (higher for occupation-relevant schemes) and any missing_requirements
9. Log to agent_logs table

User ID: {user_id}

**IMPORTANT**: Prioritize occupation-specific schemes first, then show general schemes. The occupation field should be the PRIMARY matching criterion."""

            result = await run_autogen_mcp_task(
                agent_name="knowledge_agent",
                system_prompt=self.system_prompt,
                task=prompt,
                user_id=user_id,
                use_azure=True
            )

            print(f"[Knowledge Agent] Analysis complete for user {user_id}")

            return {
                "success": True,
                "user_id": user_id,
                "agent": "knowledge_integration",
                "result": result,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            print(f"[Knowledge Agent] Error analyzing user {user_id}: {str(e)}")
            return {
                "success": False,
                "user_id": user_id,
                "agent": "knowledge_integration",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }


async def main():
    """Test the knowledge integration agent"""
    agent = KnowledgeIntegrationAgent()

    test_user_id = "153735c8-b1e3-4fc6-aa4e-7deb6454990b"

    print(f"Testing Knowledge Integration Agent with user {test_user_id}")
    result = await agent.analyze_user(test_user_id)

    print("\nResult:")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
