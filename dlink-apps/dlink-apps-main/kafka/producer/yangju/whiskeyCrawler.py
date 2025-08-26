import os
import sys
import shutil
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator  # 영어 번역 라이브러리

# ✅ ChromeDriver 경로 설정 (환경 변수 또는 자동 검색)
chromedriver_path = os.environ.get("CHROMEDRIVER_PATH") or shutil.which("chromedriver") or "/usr/bin/chromedriver"

print(f"🔍 [INFO] ChromeDriver 경로: {chromedriver_path}")

# ✅ Chrome 옵션 설정
chromeOptions = Options()
chromeOptions.add_argument("--headless")  # UI 없이 실행
chromeOptions.add_argument("--disable-blink-features=AutomationControlled")
chromeOptions.add_argument("--no-sandbox")
chromeOptions.add_argument("--disable-dev-shm-usage")
chromeOptions.add_argument("--disable-gpu")
chromeOptions.add_argument("--disable-features=NetworkService")
chromeOptions.add_argument("--disable-software-rasterizer")

# ✅ 번역 함수 (재시도 지원)
def translateText(text, source='ko', target='en', retries=5, delay=1):
    """
    텍스트를 번역하는 함수입니다.
    번역에 실패할 경우 최대 retries번 재시도하며, 실패 시 원본 텍스트를 반환합니다.
    """
    for attempt in range(retries):
        try:
            translator = GoogleTranslator(source=source, target=target)
            result = translator.translate(text)
            if result and result.strip():
                return result
        except Exception as e:
            print(f"⚠️ 번역 오류 (시도 {attempt+1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(delay)
    return text

# ✅ Whiskey 크롤링 함수
def crawlWhiskey():
    """
    Whiskey 데이터를 크롤링하여 리스트(딕셔너리 형태)로 반환하는 함수.
    최종 컬럼: korName, engName, origin, percent, volume, price, image, explanation
    """
    service = Service(chromedriver_path)
    driver = webdriver.Chrome(service=service, options=chromeOptions)
    wait = WebDriverWait(driver, 10)

    baseUrl = "https://kaja2002.com/shop/shop/list.php?ca_id=20&sort=&sortodr=&page="
    productUrl = "https://kaja2002.com/shop/shop/item.php?it_id="
    countries = ["프랑스", "스페인", "이탈리아", "독일", "미국", "영국", "일본", "중국"]

    data = []

    # ✅ 1부터 23까지 페이지 크롤링
    for page in range(1, 24):
        try:
            driver.get(baseUrl + str(page))
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".list-item.position-relative.p-2.col-row-3")))

            soup = BeautifulSoup(driver.page_source, 'html.parser')
            items = soup.select(".list-item.position-relative.p-2.col-row-3")
            if not items:
                print(f"⚠️ Warning: 페이지 {page}에는 데이터가 없습니다.")
                continue

            for item in items:
                try:
                    nameTag = item.select_one(".item-name b")
                    if not nameTag:
                        continue
                    name = nameTag.text.strip()

                    # ✅ "셋트"가 포함된 상품 제외
                    if "셋트" in name:
                        print(f"⏩ Skip: {name} - '셋트' 포함된 상품")
                        continue

                    # ✅ 불필요한 정보 제거
                    name = re.sub(r'\((?!신형|구형).*?\)', '', name).strip()  # 괄호 안 표현 삭제 (신형, 구형 제외)
                    name = re.sub(r'\b\d{2,4}ml\b', '', name).strip()  # 용량(ml) 제거
                    name = re.sub(r'\s+', ' ', name).strip()  # 중복 공백 정리

                    linkTag = item.select_one("a.d-block")
                    if not linkTag:
                        continue
                    itemUrl = linkTag["href"]
                    itemId = itemUrl.split("it_id=")[-1]
                    fullItemUrl = productUrl + itemId

                    driver.get(fullItemUrl)
                    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody")))
                    itemSoup = BeautifulSoup(driver.page_source, 'html.parser')

                    # ✅ 원산지, 알콜도수, 용량 정보 추출
                    details = {"origin": "N/A", "percent": "N/A", "volume": "N/A"}
                    rows = itemSoup.find_all("tr")
                    for row in rows:
                        th = row.find("th")
                        td = row.find("td")
                        if th and td:
                            thText = th.text.strip()
                            tdText = td.text.strip()
                            if "원산지" in thText:
                                details["origin"] = tdText
                                for country in countries:
                                    if details["origin"].startswith(country):
                                        details["origin"] = country
                                        break
                            elif "알콜도수" in thText:
                                details["percent"] = re.sub(r'[^0-9.]', '', tdText)
                            elif "용량" in thText:
                                details["volume"] = re.sub(r'[^0-9.]', '', tdText)

                    # ✅ 가격 정보 추출
                    originalPrice = "N/A"
                    for row in rows:
                        th = row.find("th")
                        td = row.find("td")
                        if th and td and "시중가격" in th.text:
                            originalPrice = re.sub(r'[^0-9]', '', td.text.strip())
                            break

                    if details["percent"] == "N/A" or details["volume"] == "N/A" or originalPrice == "N/A":
                        print(f"⏩ Skip: {name} - 필수 정보 없음")
                        continue

                    # ✅ 이미지 및 설명 추출
                    imgTag = itemSoup.select_one(".carousel-item img")
                    imgUrl = imgTag["src"] if imgTag else "N/A"
                    explanationDiv = itemSoup.select_one("#sit_inf_explan")
                    explanation = explanationDiv.get_text(separator=" ", strip=True) if explanationDiv else "N/A"

                    # ✅ 번역 적용
                    engName = translateText(name)

                    data.append({
                        "korName": name,
                        "engName": engName,
                        "origin": details["origin"],
                        "percent": details["percent"],
                        "volume": details["volume"],
                        "price": originalPrice,
                        "image": imgUrl,
                        "explanation": explanation
                    })
                    print(f"✅ Success: {name} ({engName}) - {details} - {originalPrice}")

                except Exception as e:
                    print(f"❌ Error: {name} 처리 중 오류 발생: {e}")
        except Exception as e:
            print(f"❌ Error: 페이지 {page} 요청 중 오류 발생: {e}")

    driver.quit()
    return data

# ✅ 실행
if __name__ == "__main__":
    whiskeyData = crawlWhiskey()
    print(f"\n📊 총 {len(whiskeyData)}개의 데이터가 크롤링되었습니다.\n")
    for i, item in enumerate(whiskeyData[:3], 1):
        print(f"{i}. {item}\n")

