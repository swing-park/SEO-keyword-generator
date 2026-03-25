import pandas as pd
import itertools
import random
import json

def generate_seo_keywords():
    """SEO 키워드 조합을 생성하고 JSON 파일로 만드는 함수"""
    
    # 기본 키워드 (A열)
    base_keywords = ["월렌트", "무심사 장기렌트", "신차 장기렌트", "중고차 장기렌트", 
                    "캐피탈 장기렌트", "재렌트", "사고대차", "슈퍼카 렌트", "승합차 렌트"]
    
    # 지역 대분류 (B열)
    regions_major = ["서울", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]
    
    # 지역 소분류 (C열)
    regions_minor = ["강남", "강북", "강서", "강동", "송파", "마포", "서초", "종로", "중구", "용산",
                    "성동", "광진", "동대문", "중랑", "성북", "노원", "도봉", "양천", "구로", "금천",
                    "영등포", "동작", "관악", "서대문", "은평", "수원", "성남", "의정부", "안양", "부천",
                    "광명", "평택", "과천", "오산", "시흥", "군포", "의왕", "하남", "용인", "파주",
                    "이천", "안성", "김포", "화성", "광주", "여주", "부평", "계양", "남동", "연수",
                    "남구", "동구", "미추홀", "강화", "옹진", "대구", "부산", "대전", "광주", "울산",
                    "창원", "청주", "천안", "전주", "포항", "창원", "수원", "안산", "안양", "용인"]
    
    # 이용 상품 (D열)
    rental_products = ["1개월 렌트", "3개월 렌트", "6개월 렌트", "12개월 렌트", "24개월 렌트", 
                      "36개월 렌트", "48개월 렌트", "60개월 렌트", "단기렌트", "1년 렌트", 
                      "2년 렌트", "3년 렌트", "4년 렌트", "5년 렌트"]
    
    # 차등급 (E열)
    car_grades = ["경차", "소형차", "준중형차", "중형차", "준대형차", "대형차", "RV", "전기차", "SUV", "승합차"]
    
    # 차종 (F열)
    car_models = ["아반떼", "K5", "쏘렌토", "그랜저", "쏘나타", "K3", "모닝", "레이", "스포티지", "셀토스",
                 "투싼", "싼타페", "카니발", "K8", "K9", "더뉴K5", "더뉴K3", "더뉴모닝", "더뉴레이", 
                 "더뉴스포티지", "더뉴셀토스", "더뉴투싼", "더뉴싼타페", "더뉴카니발", "더뉴K8", "더뉴K9", 
                 "신형아반떼", "신형K5", "신형쏘렌토", "신형그랜저", "신형쏘나타", "신형K3", "신형모닝", 
                 "신형레이", "신형스포티지", "신형셀토스", "신형투싼", "신형싼타페", "신형카니발", "신형K8", 
                 "신형K9", "2024아반떼", "2024K5", "2024쏘렌토", "2024그랜저", "2024쏘나타", "2024K3", 
                 "2024모닝", "2024레이", "2024스포티지", "2024셀토스", "2024투싼", "2024싼타페", 
                 "2024카니발", "2024K8", "2024K9"]
    
    # 고객 특성 (G열)
    customer_types = ["신용불량", "저신용자", "개인파산", "개인회생", "주부", "개인사업자", "법인", 
                     "무직자", "프리랜서", "직장인", "군미필", "신용회복중", "파산신청", "저신용",
                     "신용불량자", "개인회생자", "파산자", "신용회복자"]
    
    # 모든 조합 생성 (15,000개)
    all_combinations = []
    
    # 기본 키워드별로 조합 생성
    for base_keyword in base_keywords:
        # 각 카테고리에서 랜덤하게 선택하여 조합 생성
        for _ in range(1667):  # 9 * 1667 = 15,003개
            region_major = random.choice(regions_major)
            region_minor = random.choice(regions_minor)
            rental_product = random.choice(rental_products)
            car_grade = random.choice(car_grades)
            car_model = random.choice(car_models)
            customer_type = random.choice(customer_types)
            
            # 조합된 키워드 생성
            combined_keyword = f"{base_keyword} {region_major} {region_minor} {rental_product} {car_grade} {car_model} {customer_type}"
            
            all_combinations.append({
                'baseKeyword': base_keyword,
                'regionMajor': region_major,
                'regionMinor': region_minor,
                'rentalProduct': rental_product,
                'carGrade': car_grade,
                'carModel': car_model,
                'customerType': customer_type,
                'combinedKeyword': combined_keyword
            })
    
    # DataFrame 생성
    df = pd.DataFrame(all_combinations)
    
    # 엑셀 파일로 저장
    output_filename = 'seo_keywords_15000.xlsx'
    
    # ExcelWriter를 사용하여 여러 시트 생성
    with pd.ExcelWriter(output_filename, engine='openpyxl') as writer:
        # 메인 시트 (모든 조합)
        df.to_excel(writer, sheet_name='키워드조합', index=False)
        
        # 필터용 시트 (고유값들)
        filter_data = {
            '기본키워드': base_keywords,
            '지역대분류': regions_major,
            '지역소분류': regions_minor,
            '이용상품': rental_products,
            '차등급': car_grades,
            '차종': car_models,
            '고객특성': customer_types
        }
        
        # 가장 긴 리스트의 길이에 맞춰 DataFrame 생성
        max_length = max(len(v) for v in filter_data.values())
        filter_df = pd.DataFrame({
            key: value + [''] * (max_length - len(value)) 
            for key, value in filter_data.items()
        })
        filter_df.to_excel(writer, sheet_name='필터옵션', index=False)
        
        # 사용법 시트
        usage_data = {
            '사용법': [
                '1. "키워드조합" 시트에서 데이터 확인',
                '2. "필터옵션" 시트에서 원하는 옵션 선택',
                '3. 필터를 적용하여 원하는 조합 찾기',
                '4. "조합키워드" 열에서 최종 키워드 확인',
                '',
                '예시:',
                '기본키워드: 월렌트',
                '지역대분류: 서울',
                '지역소분류: 강남',
                '이용상품: 12개월 렌트',
                '차등급: 중형차',
                '차종: K5',
                '고객특성: 저신용자',
                '→ 결과: "월렌트 서울 강남 12개월 렌트 중형차 K5 저신용자"'
            ]
        }
        usage_df = pd.DataFrame(usage_data)
        usage_df.to_excel(writer, sheet_name='사용법', index=False)
    
    print(f"SEO 키워드 엑셀 파일이 생성되었습니다: {output_filename}")
    print(f"총 {len(df)}개의 키워드 조합이 생성되었습니다.")
    print(f"기본키워드: {len(base_keywords)}개")
    print(f"지역대분류: {len(regions_major)}개")
    print(f"지역소분류: {len(regions_minor)}개")
    print(f"이용상품: {len(rental_products)}개")
    print(f"차등급: {len(car_grades)}개")
    print(f"차종: {len(car_models)}개")
    print(f"고객특성: {len(customer_types)}개")
    
    # 샘플 데이터 출력
    print(f"\n=== 샘플 키워드 조합 (처음 5개) ===")
    for i, row in df.head().iterrows():
        print(f"{i+1}. {row['combinedKeyword']}")
    
    return df

def main():
    print("AI를 활용한 15,000개 이상의 SEO 키워드 조합을 생성합니다...")
    df = generate_seo_keywords()
    print("\n작업이 완료되었습니다!")

if __name__ == "__main__":
    main()
