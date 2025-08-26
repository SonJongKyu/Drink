import json
import requests
import time
from deep_translator import GoogleTranslator

# 기본 API URL
BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1/"

# A~Z 전체 크롤링
LETTERS = [chr(i) for i in range(ord('a'), ord('z')+1)]
HIGHBALL_GLASS = "Highball glass"
BASE_LIQUORS = ["whiskey", "bourbon", "rum", "gin", "vodka", "tequila", "brandy", "scotch"]
CARBONATED_INGREDIENTS = ["soda", "tonic", "ginger ale", "cola", "sparkling", "carbonated", "fizzy", "sprite", "club soda", "lemonade"]

def crawlHighball():
    data = []
    print("🚀 [INFO] 하이볼 스타일 칵테일 크롤링 시작...")

    for letter in LETTERS:
        print(f"📌 [INFO] {letter.upper()} 페이지 크롤링 중...")
        list_url = f"{BASE_URL}search.php?f={letter}"
        response = requests.get(list_url)

        if response.status_code != 200:
            print(f"⚠️ [WARNING] {letter.upper()} 페이지 불러오기 실패")
            continue

        drinks = response.json().get("drinks", []) or []

        if not drinks:
            print(f"⚠️ [WARNING] {letter.upper()}로 시작하는 칵테일이 없음")
            continue

        for drink in drinks:
            try:
                name = drink["strDrink"]
                drink_id = drink["idDrink"]
                glass = drink.get("strGlass", "").strip()
                image_url = drink.get("strDrinkThumb", "")

                detail_url = f"{BASE_URL}lookup.php?i={drink_id}"
                detail_response = requests.get(detail_url)

                if detail_response.status_code != 200:
                    print(f"⚠️ [WARNING] {name} 상세 정보 불러오기 실패")
                    continue

                detail_data = detail_response.json().get("drinks", [])[0]

                ingredients = []
                has_base_liquor = False
                has_carbonated = False

                for i in range(1, 16):
                    ingredient = detail_data.get(f"strIngredient{i}")
                    measure = detail_data.get(f"strMeasure{i}")

                    if ingredient:
                        full_ingredient = f"{measure.strip() if measure else ''} {ingredient}".strip().lower()
                        ingredients.append(full_ingredient)

                        if any(liquor in ingredient.lower() for liquor in BASE_LIQUORS):
                            has_base_liquor = True

                        if any(carbonated in ingredient.lower() for carbonated in CARBONATED_INGREDIENTS):
                            has_carbonated = True

                if glass.lower() == HIGHBALL_GLASS.lower() and has_base_liquor and has_carbonated:
                    try:
                        eng_name = GoogleTranslator(source='en', target='ko').translate(name)
                    except Exception:
                        eng_name = "N/A"

                    data.append({
                        "korName": eng_name,
                        "engName": name,
                        "glass": glass,
                        "image": image_url,
                        "ingredients": ingredients
                    })
                    print(f"✅ [SUCCESS] {name} 크롤링 완료! 재료 개수: {len(ingredients)}")

                time.sleep(0.5)  # 요청 간격 조절
            except Exception as e:
                print(f"⚠️ [ERROR] {name} 처리 중 오류 발생: {e}")

    print(f"✅ [SUCCESS] 하이볼 칵테일 크롤링 완료! 총 {len(data)}개 수집됨.")
    return data

