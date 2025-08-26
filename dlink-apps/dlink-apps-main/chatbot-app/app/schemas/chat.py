from pydantic import BaseModel
from typing import List, Optional, Dict


class ChatRequest(BaseModel):
    """채팅 요청을 위한 스키마"""
    message: str
    history: Optional[List[Dict[str, str]]] = None 