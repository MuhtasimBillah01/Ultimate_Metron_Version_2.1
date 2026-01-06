from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
import json
import os
import sys

router = APIRouter(prefix="/market", tags=["market"])

class AnalysisRequest(BaseModel):
    ticker: str

@router.post("/analyze")
async def analyze_market(request: AnalysisRequest):
    """
    Executes the Python Technical Analysis Engine
    """
    try:
        # Determine the correct path to the script
        # Current file is in apps/api/routers/
        # Target file is in apps/api/utils/technical_features.py
        
        # Robust path finding:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Go up one level to apps/api, then into utils
        script_path = os.path.join(current_dir, "..", "utils", "technical_features.py")
        script_path = os.path.abspath(script_path)
        
        if not os.path.exists(script_path):
             # Fallback or error logging
             print(f"Script not found at: {script_path}")
             # Check if we are in Docker container structure /app/...
             # Assuming standard structure persists
             raise HTTPException(status_code=500, detail=f"Analysis Engine Script not found at {script_path}")

        # Run the script as a subprocess
        # Use sys.executable to ensure we use the same python interpreter (within venv or container)
        result = subprocess.run(
            [sys.executable, script_path, request.ticker],
            capture_output=True,
            text=True,
            timeout=30 # Increased timeout slightly for yfinance download
        )

        if result.returncode != 0:
            print(f"Script Error Stderr: {result.stderr}")
            print(f"Script Error Stdout: {result.stdout}")
            raise HTTPException(status_code=500, detail=f"Analysis Engine Error: {result.stderr}")

        # Parse JSON output from Python
        # Sometime yfinance prints stuff to stdout even with progress=False?
        # We need to find the last valid JSON line or ensure only JSON is printed.
        # My script appends only print(json.dumps) at the end, but libraries might be noisy.
        # Let's try to parse the last non-empty line or the whole stdout if clean.
        
        output_str = result.stdout.strip()
        # Simple attempt
        try:
             data = json.loads(output_str)
        except json.JSONDecodeError:
             # If there's garbage, try to find the last JSON-looking line
             lines = output_str.split('\n')
             json_line = lines[-1] if lines else ""
             try:
                 data = json.loads(json_line)
             except:
                 raise HTTPException(status_code=500, detail="Invalid JSON output from Engine")
        
        if "error" in data:
            raise HTTPException(status_code=400, detail=data["error"])

        return data

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Analysis timed out")
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
