#!/bin/bash
echo "🚀 [INFO] 크롤러 실행 시작"

# 크롤러 실행 (Cron에 의해 실행될 수도 있음)
python3 brandyCrawler.py
python3 ginCrawler.py
python3 rumCrawler.py
python3 liqueurCrawler.py
python3 tequilaCrawler.py
python3 vodkaCrawler.py
python3 whiskeyCrawler.py

# 완료 플래그 파일 생성
touch ./crawler_done.flag
echo "✅ [SUCCESS] 크롤러 실행 완료, 플래그 파일 생성됨"

