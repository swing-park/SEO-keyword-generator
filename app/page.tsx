"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Sparkles, BarChart3, Filter, RefreshCw, Eye, Zap, Target, TrendingUp } from "lucide-react"
import * as XLSX from "xlsx"

// 키워드 데이터
const keywordData = {
  baseKeywords: [
    "월렌트",
    "무심사 장기렌트",
    "신차 장기렌트",
    "중고차 장기렌트",
    "캐피탈 장기렌트",
    "재렌트",
    "사고대차",
    "슈퍼카 렌트",
    "승합차 렌트",
  ],
  regionsMajor: ["서울", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"],
  regionsMinor: [
    "강남",
    "강북",
    "강서",
    "강동",
    "송파",
    "마포",
    "서초",
    "종로",
    "중구",
    "용산",
    "성동",
    "광진",
    "동대문",
    "중랑",
    "성북",
    "노원",
    "도봉",
    "양천",
    "구로",
    "금천",
    "영등포",
    "동작",
    "관악",
    "서대문",
    "은평",
    "수원",
    "성남",
    "의정부",
    "안양",
    "부천",
    "광명",
    "평택",
    "과천",
    "오산",
    "시흥",
    "군포",
    "의왕",
    "하남",
    "용인",
    "파주",
    "이천",
    "안성",
    "김포",
    "화성",
    "광주",
    "여주",
    "부평",
    "계양",
    "남동",
    "연수",
    "남구",
    "동구",
    "미추홀",
    "강화",
    "옹진",
    "대구",
    "부산",
    "대전",
    "광주",
    "울산",
    "창원",
    "청주",
    "천안",
    "전주",
    "포항",
    "창원",
    "수원",
    "안산",
    "안양",
    "용인",
  ],
  rentalProducts: [
    "1개월 렌트",
    "3개월 렌트",
    "6개월 렌트",
    "12개월 렌트",
    "24개월 렌트",
    "36개월 렌트",
    "48개월 렌트",
    "60개월 렌트",
    "단기렌트",
    "1년 렌트",
    "2년 렌트",
    "3년 렌트",
    "4년 렌트",
    "5년 렌트",
  ],
  carGrades: ["경차", "소형차", "준중형차", "중형차", "준대형차", "대형차", "RV", "전기차", "SUV", "승합차"],
  carModels: [
    "아반떼",
    "K5",
    "쏘렌토",
    "그랜저",
    "쏘나타",
    "K3",
    "모닝",
    "레이",
    "스포티지",
    "셀토스",
    "투싼",
    "싼타페",
    "카니발",
    "K8",
    "K9",
    "더뉴K5",
    "더뉴K3",
    "더뉴모닝",
    "더뉴레이",
    "더뉴스포티지",
    "더뉴셀토스",
    "더뉴투싼",
    "더뉴싼타페",
    "더뉴카니발",
    "더뉴K8",
    "더뉴K9",
    "신형아반떼",
    "신형K5",
    "신형쏘렌토",
    "신형그랜저",
    "신형쏘나타",
    "신형K3",
    "신형모닝",
    "신형레이",
    "신형스포티지",
    "신형셀토스",
    "신형투싼",
    "신형싼타페",
    "신형카니발",
    "신형K8",
    "신형K9",
    "2024아반떼",
    "2024K5",
    "2024쏘렌토",
    "2024그랜저",
    "2024쏘나타",
    "2024K3",
    "2024모닝",
    "2024레이",
    "2024스포티지",
    "2024셀토스",
    "2024투싼",
    "2024싼타페",
    "2024카니발",
    "2024K8",
    "2024K9",
  ],
  customerTypes: [
    "신용불량",
    "저신용자",
    "개인파산",
    "개인회생",
    "주부",
    "개인사업자",
    "법인",
    "무직자",
    "프리랜서",
    "직장인",
    "군미필",
    "신용회복중",
    "파산신청",
    "저신용",
    "신용불량자",
    "개인회생자",
    "파산자",
    "신용회복자",
  ],
}

interface KeywordCombination {
  baseKeyword: string
  regionMajor: string
  regionMinor: string
  rentalProduct: string
  carGrade: string
  carModel: string
  customerType: string
  combinedKeyword: string
}

export default function SEOKeywordGenerator() {
  const [selectedFilters, setSelectedFilters] = useState({
    baseKeywords: [] as string[],
    regionsMajor: [] as string[],
    regionsMinor: [] as string[],
    rentalProducts: [] as string[],
    carGrades: [] as string[],
    carModels: [] as string[],
    customerTypes: [] as string[],
  })

  const [generatedKeywords, setGeneratedKeywords] = useState<KeywordCombination[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [maxCombinations, setMaxCombinations] = useState(1000)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("generator")

  // 필터된 키워드 조합 생성
  const generateCombinations = () => {
    setIsGenerating(true)

    setTimeout(() => {
      const combinations: KeywordCombination[] = []

      // 선택된 필터가 없으면 전체 사용
      const baseKeywords =
        selectedFilters.baseKeywords.length > 0 ? selectedFilters.baseKeywords : keywordData.baseKeywords
      const regionsMajor =
        selectedFilters.regionsMajor.length > 0 ? selectedFilters.regionsMajor : keywordData.regionsMajor
      const regionsMinor =
        selectedFilters.regionsMinor.length > 0 ? selectedFilters.regionsMinor : keywordData.regionsMinor
      const rentalProducts =
        selectedFilters.rentalProducts.length > 0 ? selectedFilters.rentalProducts : keywordData.rentalProducts
      const carGrades = selectedFilters.carGrades.length > 0 ? selectedFilters.carGrades : keywordData.carGrades
      const carModels = selectedFilters.carModels.length > 0 ? selectedFilters.carModels : keywordData.carModels
      const customerTypes =
        selectedFilters.customerTypes.length > 0 ? selectedFilters.customerTypes : keywordData.customerTypes

      // 랜덤 조합 생성
      for (let i = 0; i < maxCombinations; i++) {
        const baseKeyword = baseKeywords[Math.floor(Math.random() * baseKeywords.length)]
        const regionMajor = regionsMajor[Math.floor(Math.random() * regionsMajor.length)]
        const regionMinor = regionsMinor[Math.floor(Math.random() * regionsMinor.length)]
        const rentalProduct = rentalProducts[Math.floor(Math.random() * rentalProducts.length)]
        const carGrade = carGrades[Math.floor(Math.random() * carGrades.length)]
        const carModel = carModels[Math.floor(Math.random() * carModels.length)]
        const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)]

        const combinedKeyword = `${baseKeyword} ${regionMajor} ${regionMinor} ${rentalProduct} ${carGrade} ${carModel} ${customerType}`

        combinations.push({
          baseKeyword,
          regionMajor,
          regionMinor,
          rentalProduct,
          carGrade,
          carModel,
          customerType,
          combinedKeyword,
        })
      }

      setGeneratedKeywords(combinations)
      setIsGenerating(false)
    }, 1500)
  }

  // 필터된 키워드 목록
  const filteredKeywords = useMemo(() => {
    if (!searchTerm) return generatedKeywords
    return generatedKeywords.filter((keyword) =>
      keyword.combinedKeyword.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [generatedKeywords, searchTerm])

  // 엑셀 다운로드
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      generatedKeywords.map((item) => ({
        기본키워드: item.baseKeyword,
        지역대분류: item.regionMajor,
        지역소분류: item.regionMinor,
        이용상품: item.rentalProduct,
        차등급: item.carGrade,
        차종: item.carModel,
        고객특성: item.customerType,
        조합키워드: item.combinedKeyword,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "키워드조합")

    // 필터 옵션 시트
    const filterSheet = XLSX.utils.json_to_sheet([
      { 카테고리: "기본키워드", 옵션: keywordData.baseKeywords.join(", ") },
      { 카테고리: "지역대분류", 옵션: keywordData.regionsMajor.join(", ") },
      { 카테고리: "지역소분류", 옵션: keywordData.regionsMinor.join(", ") },
      { 카테고리: "이용상품", 옵션: keywordData.rentalProducts.join(", ") },
      { 카테고리: "차등급", 옵션: keywordData.carGrades.join(", ") },
      { 카테고리: "차종", 옵션: keywordData.carModels.join(", ") },
      { 카테고리: "고객특성", 옵션: keywordData.customerTypes.join(", ") },
    ])
    XLSX.utils.book_append_sheet(workbook, filterSheet, "필터옵션")

    XLSX.writeFile(workbook, `SEO_키워드_조합_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  // 필터 토글 함수
  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  // 통계 계산
  const stats = useMemo(() => {
    const totalPossible = Object.values(keywordData).reduce((acc, arr) => acc * arr.length, 1)
    const selectedCount = Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0)

    return {
      totalPossible,
      generated: generatedKeywords.length,
      filtered: filteredKeywords.length,
      selectedFilters: selectedCount,
    }
  }, [generatedKeywords, filteredKeywords, selectedFilters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI SEO 키워드 조합 생성기
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            7개 카테고리를 조합하여 수천 개의 SEO 키워드를 자동 생성하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">생성된 키워드</p>
                  <p className="text-2xl font-bold">{stats.generated.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">필터링된 결과</p>
                  <p className="text-2xl font-bold">{stats.filtered.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">선택된 필터</p>
                  <p className="text-2xl font-bold">{stats.selectedFilters}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">가능한 조합</p>
                  <p className="text-2xl font-bold">{(stats.totalPossible / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              키워드 생성
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              필터 설정
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              결과 보기
            </TabsTrigger>
          </TabsList>

          {/* 키워드 생성 탭 */}
          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  키워드 조합 생성
                </CardTitle>
                <CardDescription>원하는 개수만큼 키워드 조합을 생성하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="maxCombinations">생성할 키워드 개수:</Label>
                  <Select
                    value={maxCombinations.toString()}
                    onValueChange={(value) => setMaxCombinations(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100개</SelectItem>
                      <SelectItem value="500">500개</SelectItem>
                      <SelectItem value="1000">1,000개</SelectItem>
                      <SelectItem value="5000">5,000개</SelectItem>
                      <SelectItem value="10000">10,000개</SelectItem>
                      <SelectItem value="15000">15,000개</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={generateCombinations}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        키워드 생성
                      </>
                    )}
                  </Button>

                  {generatedKeywords.length > 0 && (
                    <Button onClick={downloadExcel} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      엑셀 다운로드
                    </Button>
                  )}
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={66} className="w-full" />
                    <p className="text-sm text-gray-500 text-center">AI가 키워드 조합을 생성하고 있습니다...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 필터 설정 탭 */}
          <TabsContent value="filters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(keywordData).map(([key, values], index) => {
                const categoryNames = {
                  baseKeywords: "기본키워드",
                  regionsMajor: "지역대분류",
                  regionsMinor: "지역소분류",
                  rentalProducts: "이용상품",
                  carGrades: "차등급",
                  carModels: "차종",
                  customerTypes: "고객특성",
                }

                const categoryKey = key as keyof typeof selectedFilters
                const categoryName = categoryNames[categoryKey]

                return (
                  <Card key={key} className="h-fit">
                    <CardHeader>
                      <CardTitle className="text-lg">{categoryName}</CardTitle>
                      <CardDescription>
                        {selectedFilters[categoryKey].length > 0
                          ? `${selectedFilters[categoryKey].length}개 선택됨`
                          : "전체 사용 (선택 안함)"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {values.map((value) => (
                            <div key={value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${key}-${value}`}
                                checked={selectedFilters[categoryKey].includes(value)}
                                onCheckedChange={() => toggleFilter(categoryKey, value)}
                              />
                              <Label htmlFor={`${key}-${value}`} className="text-sm cursor-pointer">
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* 결과 보기 탭 */}
          <TabsContent value="results" className="space-y-6">
            {generatedKeywords.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>생성된 키워드 검색</CardTitle>
                    <CardDescription>{filteredKeywords.length}개의 키워드가 표시됩니다</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="키워드 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>키워드 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {filteredKeywords.slice(0, 100).map((keyword, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-900">{keyword.combinedKeyword}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="secondary">{keyword.baseKeyword}</Badge>
                              <Badge variant="outline">{keyword.regionMajor}</Badge>
                              <Badge variant="outline">{keyword.regionMinor}</Badge>
                              <Badge variant="outline">{keyword.rentalProduct}</Badge>
                              <Badge variant="outline">{keyword.carGrade}</Badge>
                              <Badge variant="outline">{keyword.carModel}</Badge>
                              <Badge variant="outline">{keyword.customerType}</Badge>
                            </div>
                          </div>
                        ))}
                        {filteredKeywords.length > 100 && (
                          <p className="text-center text-gray-500 py-4">
                            ... 그리고 {filteredKeywords.length - 100}개 더 (엑셀 다운로드로 전체 확인)
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">키워드를 생성해주세요</h3>
                  <p className="text-gray-500 mb-4">'키워드 생성' 탭에서 원하는 개수의 키워드 조합을 생성하세요</p>
                  <Button onClick={() => setCurrentTab("generator")}>키워드 생성하러 가기</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
