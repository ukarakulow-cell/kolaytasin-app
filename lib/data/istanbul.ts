export type IstanbulDistrict = {
  name: string
  slug: string
}

export const DISTRICT_SLUG_SUFFIX = '-nakliye'

const DISTRICT_NAMES = [
  'Adalar',
  'Arnavutköy',
  'Ataşehir',
  'Avcılar',
  'Bağcılar',
  'Bahçelievler',
  'Bakırköy',
  'Başakşehir',
  'Bayrampaşa',
  'Beşiktaş',
  'Beykoz',
  'Beylikdüzü',
  'Beyoğlu',
  'Büyükçekmece',
  'Çatalca',
  'Çekmeköy',
  'Esenler',
  'Esenyurt',
  'Eyüpsultan',
  'Fatih',
  'Gaziosmanpaşa',
  'Güngören',
  'Kadıköy',
  'Kağıthane',
  'Kartal',
  'Küçükçekmece',
  'Maltepe',
  'Pendik',
  'Sancaktepe',
  'Sarıyer',
  'Silivri',
  'Sultanbeyli',
  'Sultangazi',
  'Şile',
  'Şişli',
  'Tuzla',
  'Ümraniye',
  'Üsküdar',
  'Zeytinburnu',
] as const

export function toDistrictBaseSlug(name: string): string {
  return name
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '')
}

export function toDistrictSlug(name: string): string {
  return `${toDistrictBaseSlug(name)}${DISTRICT_SLUG_SUFFIX}`
}

export const istanbulDistricts: IstanbulDistrict[] = DISTRICT_NAMES.map((name) => ({
  name,
  slug: toDistrictSlug(name),
}))

const districtBySlug = new Map(
  istanbulDistricts.map((district) => [district.slug, district]),
)

export function getDistrictBySlug(slug: string): IstanbulDistrict | undefined {
  return districtBySlug.get(slug)
}

/** URL parametresinden (örn. "kadikoy-nakliye") ilçe kaydını döndürür; ekranda district.name kullanılır. */
export function getDistrictFromRouteParam(param: string): IstanbulDistrict | undefined {
  if (districtBySlug.has(param)) {
    return districtBySlug.get(param)
  }

  if (!param.endsWith(DISTRICT_SLUG_SUFFIX)) {
    return districtBySlug.get(`${param}${DISTRICT_SLUG_SUFFIX}`)
  }

  return undefined
}
