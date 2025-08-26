import logging
import sys
from typing import Optional

def setup_logger(name: str, log_level: Optional[str] = None) -> logging.Logger:
    """
    애플리케이션 로거 설정
    
    Args:
        name: 로거 이름
        log_level: 로그 레벨 (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        
    Returns:
        구성된 로거 객체
    """
    if log_level is None:
        log_level = "INFO"
        
    # 로그 레벨 맵핑
    level_map = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL,
    }
    
    # 로거 생성
    logger = logging.getLogger(name)
    
    # 이미 핸들러가 설정되어 있으면 추가 설정하지 않음
    if logger.handlers:
        return logger
        
    # 로그 레벨 설정
    logger.setLevel(level_map.get(log_level.upper(), logging.INFO))
    
    # 콘솔 핸들러 설정
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
    )
    logger.addHandler(handler)
    
    return logger

# 기본 로거 생성
logger = setup_logger("app") 