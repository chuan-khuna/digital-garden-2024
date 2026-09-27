# OG Image — รวมเป็น module เดียว (route, URL, style)

- **วันที่:** 2026-09-27
- **ที่มา:** candidate 2 ใน [garden architecture review](2026-09-27-garden-architecture-review.html)
- **สถานะ:** ทำแล้ว (2026-09-27) ดูการตัดสินใจใน [`docs/handoff/2026-09-27-og-image-plan.md`](../handoff/2026-09-27-og-image-plan.md) ข้อ 3.5 (font path) ไม่ได้ทำ เพราะ `import.meta.url` ชี้ไปที่ไฟล์ที่ bundle แล้วใน `dist/`
- **เอกสารที่เกี่ยวข้อง:** [`docs/architecture/og-image-generator.md`](../architecture/og-image-generator.md)

คำศัพท์ด้านสถาปัตยกรรม (module, interface, implementation, seam, adapter, depth, leverage, locality) ใช้ตาม skill `codebase-design` และคงเป็นภาษาอังกฤษไว้ เพื่อให้ตรงกับเอกสารอื่นใน repo

---

## 1. OG image ทำงานอย่างไรในตอนนี้

OG image คือรูปขนาด 1200×630 ที่ขึ้นเป็นพรีวิวเวลาแชร์ลิงก์ใน LINE, Facebook, X, Discord หรือ Slack ในโปรเจกต์นี้รูปถูกสร้างตอน build (`prerender = true`) ตามขั้นตอนนี้:

```
หน้าเว็บ (.astro)
  └─ ประกอบ URL ของรูปเอง ──► BaseLayout ──► <meta property="og:image">

route (.png.ts)
  └─ getStaticPaths จาก collection
       └─ generateOgImage(title, description, style)     src/lib/generate-og-image.ts
            ├─ โหลด font VictorMono ×3 (ตอน import module)
            ├─ OgImageTemplate({ style })                  src/components/og/og-template.tsx
            │    └─ เลือก theme: default | default-dark | particle
            ├─ satori  → SVG
            └─ sharp   → PNG
       └─ new Response(png, { 'Content-Type': 'image/png' })
```

ไฟล์ที่เกี่ยวข้องทั้งหมด:

| บทบาท | ไฟล์ |
|---|---|
| route สำหรับบทความ (posts, notes) | `src/pages/og/[articleType]/[...slug].png.ts` |
| route สำหรับหน้าเว็บทั่วไป | `src/pages/og/pages/[...slug].png.ts` |
| route แบบง่าย (ตัวอย่าง) | `src/pages/og/posts_/[...slug].png.ts` |
| สร้าง PNG | `src/lib/generate-og-image.ts` |
| เลือก theme | `src/components/og/og-template.tsx` |
| theme และ text helper | `src/components/og/_components/*.tsx` |
| ค่า style ที่อนุญาต (Zod enum) | `src/content/collection-definitions/common-fields/_og-styles.ts` |
| ข้อมูล OG ของหน้าเว็บทั่วไป | `src/content/og-images.json` |
| หน้าที่ประกอบ URL เอง | `src/pages/index.astro`, `resume.astro`, `uses.astro`, `posts/[...slug]/index.astro` |

ทั้งหมดรวมเป็นประมาณ **10 ไฟล์** แต่ละไฟล์รู้เรื่อง OG image แค่บางส่วน และไม่มี module ไหนเป็นเจ้าของเรื่องนี้ทั้งหมด

---

## 2. ปัญหา

### 2.1 Route `posts_/` ยังถูก build อยู่ ทำให้รูปโพสต์ถูก render สองรอบ

`src/pages/og/posts_/[...slug].png.ts` เป็น route แบบง่ายที่ `docs/architecture/og-image-generator.md` และโพสต์ `content/posts/opengraph/index.mdx` อธิบายไว้เป็น "Simple Version" เพื่อใช้เป็นตัวอย่างประกอบการสอน

ปัญหาคือ Astro จะข้ามเฉพาะไฟล์หรือโฟลเดอร์ที่ชื่อ **ขึ้นต้น** ด้วย `_` เท่านั้น แต่ `posts_` มี `_` อยู่**ท้าย**ชื่อ route นี้จึงเป็น route จริงใน production:

- ทุกโพสต์ได้รูปสองชุด คือ `/og/posts/<slug>.png` ซึ่งถูกใช้งาน และ `/og/posts_/<slug>.png` ซึ่งไม่มีใครลิงก์ไป
- satori และ sharp เป็นขั้นตอนที่ช้าที่สุดของการ build และตอนนี้ทำงานเป็น **สองเท่า** สำหรับทุกโพสต์
- ถ้าลองเทียบ (`diff`) กับ route `[articleType]` จะเห็นว่า logic เหมือนกัน ต่างกันแค่ hardcode collection เป็น `posts`

ถ้าอยากเก็บไว้เป็นตัวอย่าง ควรอยู่ในเอกสารหรือในโพสต์ ไม่ใช่เป็น route ที่ build จริง

### 2.2 หน้าเว็บประกอบ URL เอง โดยใช้ slug ที่พิมพ์มือ

```ts
// src/pages/index.astro:14-15
const ogImageSlug = 'index'
const ogImageUrl = new URL(`og/pages/${ogImageSlug}.png`, Astro.site)

// src/pages/resume.astro:30-31 และ uses.astro:8-9 เหมือนกันทุกตัวอักษร ต่างแค่ slug

// src/pages/posts/[...slug]/index.astro:9-12
const ogImageUrl = new URL(`og/${collectionName}/${Astro.params.slug}.png`, Astro.site)
```

ปัญหาที่ตามมา:

1. **ไม่มีอะไรตรวจ slug** `'resume'` ต้องตรงกับ `"slug": "resume"` ใน `og-images.json` ถ้าพิมพ์ `'resumes'` build ยังผ่าน หน้าเว็บยังแสดงปกติ แต่ `og:image` ชี้ไปที่ URL ที่ไม่มีอยู่ พรีวิวลิงก์จะไม่มีรูป และจะรู้ก็ต่อเมื่อมีคนแชร์ลิงก์แล้วเห็นว่ารูปหาย
2. **รูปแบบ URL ถูกเขียนซ้ำ 4 ที่** ทั้ง `og/pages/…` และ `og/posts/…` ถ้าวันหนึ่งเปลี่ยนโครงสร้าง route (เช่นย้ายไป `/og-image/`) ต้องไล่แก้ทุกหน้า และถ้าลืมหน้าไหนก็จะไม่มี error
3. **ความรู้รั่วข้าม seam** หน้าเว็บไม่ควรต้องรู้ว่ารูปถูกสร้างที่ path ไหน ควรรู้แค่ว่า "ขอ OG image ของหน้า resume"

### 2.3 Route ซ้ำ code กัน

ทั้ง 3 route มี code ส่วนท้ายเหมือนกัน:

```ts
const ogImage = await generateOgImage(
  x.data.title,
  x.data.description || '',
  x.data.ogStyle || 'default',
)
return new Response(ogImage, {
  status: 200,
  headers: { 'Content-Type': 'image/png' },
})
```

- `|| 'default'` ไม่จำเป็น เพราะ `ogStyleChoices` มี `.default('default')` ใน Zod อยู่แล้ว
- ถ้าจะเปลี่ยน header (เช่นเพิ่ม `Cache-Control`) ต้องแก้ 3 ที่

### 2.4 Style ถูกส่งต่อเป็น `string` ทำให้ compiler ช่วยไม่ได้

ค่า style ถูกเขียนไว้สองที่:

```ts
// _og-styles.ts — แหล่งจริง
z.enum(['default', 'default-dark', 'particle'])

// og-template.tsx — เขียนซ้ำอีกรอบ
const themeComponents = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}
const SelectedTheme = themeComponents[style as keyof typeof themeComponents] || OgDefaultTheme
```

และตรงกลางระหว่างสองที่นี้ `generateOgImage(style: string)` กับ `OgTemplateProps.style: string` ทำให้ type หายไป

ข้อควรรู้: ถ้าพิมพ์ style ผิดใน **content** (frontmatter หรือ JSON) **Zod จับได้** และ build จะ fail อยู่แล้ว ส่วนนี้ปลอดภัย ช่องโหว่อยู่ที่ **code**:

- ถ้าเพิ่ม `'minimal'` ลงใน enum แต่ลืมเพิ่ม template ใน `themeComponents` จะไม่มี type error และ content ที่ใช้ `ogStyle: minimal` จะได้รูป theme default ไปเงียบ ๆ เพราะมี fallback `|| OgDefaultTheme`
- ถ้าเรียก `generateOgImage(…, 'partical')` จาก code ก็จะไม่มี error เหมือนกัน

### 2.5 Font path อิงกับ working directory และมี code ที่ไม่ได้ใช้

```ts
// src/lib/generate-og-image.ts:15-19
getFontDataFromFile('./src/assets/fonts/VictorMono-Regular.ttf')
```

- path เป็น relative กับ `process.cwd()` จะใช้ได้เฉพาะตอนรันคำสั่งจาก root ของ repo ถ้ารันจากที่อื่น (script, CI ที่ตั้ง cwd ต่างไป, monorepo) build จะพังด้วย error ว่าหา font ไม่เจอ
- font ถูกโหลดตอน import module (top-level await) ทุก route ที่ import จะจ่ายค่านี้ไม่ว่าจะได้ใช้หรือไม่
- `getFontData(url)` (ที่ใช้ `fetch`) ในบรรทัด 6-9 ไม่มีใครเรียกเลย

### 2.6 ภาพรวม: module ตื้น (shallow)

`generateOgImage` เป็นส่วนเดียวที่ดูเป็น module แต่ interface ของมันคือ `(title: string, description: string, style: string) → Buffer` ผู้เรียกยังต้องรู้เองว่า:

- ต้องห่อผลลัพธ์ด้วย `Response` และใส่ header เอง
- URL ของรูปมีรูปแบบอย่างไร
- slug ต้องตรงกับอะไร
- style ที่ใช้ได้มีอะไรบ้าง
- ต้องรันจาก root ของ repo

**Deletion test:** ถ้าลบ `generateOgImage` ทิ้ง ความซับซ้อน (satori + sharp + font) จะไปกระจายอยู่ใน 3 route แปลว่ามันยังมีประโยชน์ แต่ความรู้ส่วนที่เหลือ (URL, slug, response, style) **ไม่ได้อยู่ในนั้นเลย** มันกระจายอยู่ในผู้เรียกแล้ว นี่คือสิ่งที่ควรดึงเข้ามาไว้ใน module

---

## 3. วิธีแก้ที่เสนอ

### 3.1 ภาพรวม

รวมทุกอย่างที่เกี่ยวกับ OG image ไว้ใน module เดียวคือ `src/lib/og-image/` ให้มี interface เล็ก ๆ 2 ฟังก์ชัน:

```
          หน้าเว็บ ×4                      route ×2
              │                              │
   ogImageUrl(kind, slug)          ogImageResponse(meta)
╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌  ← seam
┌─────────────────────────────────────────────────────────┐
│  og-image module                                        │
│   • รูปแบบ URL: og/<kind>/<slug>.png                    │
│   • ตรวจ slug ของ pages กับ og-images.json              │
│   • resolveTitle ({{siteTitle}})                        │
│   • Record<OgStyle, Template> ที่สร้างจาก Zod enum      │
│   • โหลด font (path อิงกับตำแหน่งไฟล์ ไม่ใช่ cwd)        │
│   • satori → sharp → Response + header                  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Interface ที่หน้าเว็บใช้

```ts
// ก่อน
const ogImageSlug = 'resume'
const ogImageUrl = new URL(`og/pages/${ogImageSlug}.png`, Astro.site)

// หลัง
import { ogImageUrl } from '@/lib/og-image'
const ogImage = await ogImageUrl('pages', 'resume')
```

- `kind` เป็น union type คือ `'pages' | 'posts' | 'notes'` ถ้าพิมพ์ผิด compiler จับได้ทันที
- ถ้า `kind === 'pages'` และ slug ไม่มีอยู่ใน `og-images.json` จะ throw และ build ไม่ผ่าน พร้อมข้อความเช่น `[og] No OG image config for page "resumes" in src/content/og-images.json`
- สำหรับโพสต์: `ogImageUrl('posts', entry.id)` หรือถ้าทำ article registry (candidate 3) ด้วย อาจเป็น `ogImageUrl(entry)` ที่รู้ collection เอง

### 3.3 Interface ที่ route ใช้

```ts
// src/pages/og/pages/[...slug].png.ts — หลัง
export async function GET({ props }: APIContext) {
  return ogImageResponse(props.config.data)   // { title, description, ogStyle }
}
```

- route เหลือแค่ `getStaticPaths` กับ GET บรรทัดเดียว
- การจัดการ `description || ''`, style default, header และ status อยู่ใน module ทั้งหมด

### 3.4 Style ที่ compiler บังคับให้ครบ

```ts
// _og-styles.ts
export const ogStyleChoices = z.enum(['default', 'default-dark', 'particle'])
export type OgStyle = z.infer<typeof ogStyleChoices>

// og-image/themes.tsx
const themes: Record<OgStyle, ThemeComponent> = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}
```

- ถ้าเพิ่มค่าใหม่ใน enum แต่ไม่เพิ่ม theme จะ **typecheck ไม่ผ่าน**
- ลบ fallback `|| OgDefaultTheme` ออก เพราะไม่มีกรณีที่ต้องใช้แล้ว
- `generateOgImage` และ `OgTemplateProps` รับ `OgStyle` แทน `string`

### 3.5 Font

```ts
const fontUrl = (file: string) => new URL(`../../assets/fonts/${file}`, import.meta.url)
```

หรืออ่านจาก `config.root` เพื่อให้ path ไม่ขึ้นกับ cwd และลบ `getFontData` ที่ไม่ได้ใช้ทิ้ง route เป็น `prerender = true` จึงรันบน Node ตอน build ไม่ได้รันบน Cloudflare Worker การอ่านไฟล์จาก disk จึงยังใช้ได้

### 3.6 ลบ route `posts_/`

- ลบ `src/pages/og/posts_/`
- ย้ายตัวอย่าง "Simple Version" ไปเป็น code block ใน `docs/architecture/og-image-generator.md` และในโพสต์ `opengraph` แทน เพื่อให้ยังมีตัวอย่างสำหรับอ่าน แต่ไม่ถูก build
- แก้ตาราง "Three Implementations" ในเอกสารให้เหลือ 2 route

ขั้นนี้ **ทำแยกได้ทันที** ไม่ต้องรอ refactor

### 3.7 โครงสร้างไฟล์หลัง refactor

```
src/lib/og-image/
├── index.ts          # adapter: ogImageUrl, ogImageResponse (อ่าน astro:content, site config)
├── url.ts            # pure: สร้าง URL, ตรวจ slug กับรายการที่ส่งเข้ามา, resolveTitle
├── url.test.ts
├── render.ts         # font + satori + sharp (ย้ายมาจาก generate-og-image.ts)
└── themes.tsx        # Record<OgStyle, Theme> (ย้ายมาจาก og-template.tsx)
```

ใช้รูปแบบเดียวกับ `src/lib/resume/` คือ `index.ts` เป็น adapter ที่คุยกับ `astro:content` ส่วนไฟล์ pure ไม่ import `astro:content` จึงเขียน test ด้วย Vitest ได้ (CLAUDE.md กำหนดไว้ว่า test import `astro:content` ไม่ได้)

---

## 4. ได้อะไร

| | ก่อน | หลัง |
|---|---|---|
| เวลา build รูปโพสต์ | render 2 รอบต่อโพสต์ | 1 รอบ |
| slug ของ page พิมพ์ผิด | build ผ่าน, พรีวิวลิงก์ไม่มีรูป | build fail พร้อมข้อความบอกสาเหตุ |
| เพิ่ม style ใหม่แต่ลืม template | ได้ theme default เงียบ ๆ | typecheck ไม่ผ่าน |
| เปลี่ยนรูปแบบ URL | แก้ 4 หน้า + route | แก้ที่เดียว |
| เปลี่ยน header ของ response | แก้ 3 route | แก้ที่เดียว |
| test | ไม่มี | test URL, slug validation, resolveTitle, text helper |
| ต้องรันจาก root | ใช่ | ไม่จำเป็น |

ในภาษาของ `codebase-design`:

- **Locality:** ความรู้เรื่อง OG image ทั้งหมดอยู่ใน module เดียว ถ้ามี bug ก็แก้ที่เดียว
- **Leverage:** interface 2 ฟังก์ชัน ใช้ได้กับผู้เรียก 6 ที่ (หน้า 4 + route 2)
- **Depth:** interface เล็กลง (ไม่ต้องรู้ URL, header, font, fallback) ขณะที่ implementation รับความซับซ้อนเหล่านี้ไว้เอง
- **Test surface:** test เรียกผ่าน interface เดียวกับที่หน้าเว็บใช้

---

## 5. สิ่งที่ไม่ทำ (ขอบเขต)

- **ไม่ test การ render ภาพ** satori + sharp ช้า และต้องใช้ snapshot ของภาพ ให้ `bun run build` เป็นตัวยืนยันแทน
- **ไม่เปลี่ยน format ของ `og-images.json`** ยังเป็น content collection เหมือนเดิม จึงไม่ต้องแก้ `docs/content/` ตาม schema-sync rule ทางเลือกที่ย้ายไปเป็น TS `as const` เพื่อให้ slug ตรวจได้ตอนพิมพ์ ปลอดภัยกว่าเล็กน้อย แต่ต้องเปลี่ยน content format และแจ้ง web-master จึงไม่แนะนำ
- **ไม่แตะการออกแบบ theme** (หน้าตาของรูป)
- **ไม่ทำ article registry** (candidate 3) แต่ออกแบบ `ogImageUrl` ให้ต่อยอดไปรับ `entry` ได้ในภายหลัง

---

## 6. ลำดับการทำที่แนะนำ

1. **`fix(og): remove duplicate posts_ route`** ลบ route แล้วย้ายตัวอย่างไปไว้ในเอกสารและโพสต์ `opengraph` (ทำได้ทันที ความเสี่ยงต่ำ)
2. **`refactor(og): type og styles end to end`** export `OgStyle`, ทำ `Record<OgStyle, …>` และลบ fallback
3. **`refactor(og): add og-image module`** สร้าง `ogImageUrl` และ `ogImageResponse` แล้วย้ายหน้าเว็บ 4 หน้าและ route 2 ตัวมาใช้, แก้ font path, ลบ `getFontData`
4. **`test(og): cover url and title resolution`** เพิ่ม Vitest
5. อัปเดต `docs/architecture/og-image-generator.md` ให้ตรงกับโครงสร้างใหม่

ทุกขั้นต้องผ่าน `bun run test` และ `bun run build`

---

## 7. คำถามที่ยังต้องตัดสินใจ

1. ต้องการเก็บ route "Simple Version" ไว้เป็นตัวอย่างที่ build จริงหรือไม่ หรือย้ายไปอยู่ในเอกสารอย่างเดียวได้ (แนะนำ: ย้ายไปเอกสาร)
2. ตรวจ slug ตอน build ด้วย `og-images.json` เดิม หรือย้ายเป็น TS `as const` (แนะนำ: ตอน build)
3. ลบ fallback theme ออกแล้วให้ compiler บังคับ หรือเก็บไว้ (แนะนำ: ลบ)
4. รวมการแก้ font path ในงานนี้ด้วยไหม (แนะนำ: รวม)
