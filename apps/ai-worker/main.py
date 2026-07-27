from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import datetime

app = FastAPI(
    title="EcoThread AI Segmentation & Pattern Worker",
    description="Computer Vision & Pattern Drafting AI microservice (Human-in-the-loop)",
    version="1.0.0"
)

class SegmentationRequest(BaseModel):
    image_url: str
    material_category: Optional[str] = "Denim"

class SegmentationResponse(BaseModel):
    job_id: str
    status: str
    mask_url: str
    detected_fabric: str
    color_palette: List[str]
    usability_score: float
    human_in_loop_required: bool

@app.get("/")
def read_root():
    return {"service": "EcoThread AI Worker", "status": "active", "timestamp": datetime.datetime.now().isoformat()}

@app.get("/health")
def health_check():
    return {"status": "ok", "human_in_loop_mode": True}

@app.post("/api/v1/ai/segment-material", response_model=SegmentationResponse)
def segment_material(req: SegmentationRequest):
    if not req.image_url:
        raise HTTPException(status_code=400, detail="image_url is required")

    return SegmentationResponse(
        job_id="JOB-AI-2026-0089",
        status="completed",
        mask_url=f"{req.image_url}?segmented=true",
        detected_fabric="Cotton Denim 14oz & Flannel Sisa",
        color_palette=["#1E3A8A", "#991B1B", "#F3F4F6"],
        usability_score=0.92,
        human_in_loop_required=True
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
