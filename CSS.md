# CSS 정리

## 1. CSS란?
CSS(Cascading Style Sheets)는 HTML 요소의 모양과 배치를 정하는 스타일 언어이다. 글자 색과 크기, 폰트, 여백, 정렬, 레이아웃 등을 지정하고 반응형 디자인을 구현할 수 있다.

기본 문법은 다음과 같다.

```css
선택자 {
  속성: 값;
}
```

예시:
```css
p {
  color: blue;
  font-size: 16px;
}
```

## 2. CSS를 적용하는 세 가지 방식

### 2-1. Inline CSS (인라인 CSS)
HTML 요소의 `style` 속성에 CSS를 직접 작성한다.

```html
<p style="font-size: 20px; font-weight: bold; text-align: center;">
  안녕하세요.
</p>
```

- 장점: 특정 요소에 빠르게 스타일을 적용할 수 있다.
- 단점: 여러 요소에 반복 작성하기 쉽고, HTML과 디자인이 섞여 유지보수가 어려워진다.

### 2-2. Internal CSS (내부 CSS)
HTML 문서의 `<head>` 안에 `<style>` 태그를 작성한다.

```html
<head>
  <style>
    p {
      color: red;
    }
  </style>
</head>
```

- 장점: 한 HTML 문서 안에서 여러 요소에 공통 스타일을 적용할 수 있다.
- 단점: 여러 HTML 파일에서 같은 스타일을 재사용하기 어렵다.

### 2-3. External CSS (외부 CSS)
스타일을 별도의 `.css` 파일에 작성한 뒤 HTML의 `<link>` 태그로 연결한다.

`index.html`
```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

`style.css`
```css
p {
  color: green;
}
```

- 장점: HTML과 CSS를 분리해 관리할 수 있고, 여러 페이지에서 재사용하기 좋다.
- 단점: CSS 파일의 경로가 올바르게 지정되어야 한다.
- 일반적으로 여러 페이지로 구성된 프로젝트에서는 외부 CSS를 많이 사용한다.

## 3. CSS Selector(선택자)
선택자는 **어떤 HTML 요소에 스타일을 적용할지** 지정하는 규칙이다.

| 선택자 종류 | 문법 | 의미 |
|---|---|---|
| 전체 선택자 | `*` | 모든 요소 선택 |
| 태그 선택자 | `p` | 모든 `<p>` 요소 선택 |
| 클래스 선택자 | `.notice` | `class="notice"`인 요소 선택 |
| ID 선택자 | `#header` | `id="header"`인 요소 선택 |
| 속성 선택자 | `input[type="text"]` | `type="text"`인 input 선택 |
| 자손 선택자 | `div p` | div 안의 모든 p 요소 선택 |
| 자식 선택자 | `div > p` | div의 바로 아래 자식인 p 선택 |
| 인접 형제 선택자 | `div + p` | div 바로 다음에 오는 형제 p 선택 |
| 일반 형제 선택자 | `div ~ p` | div 뒤에 오는 형제 p 선택 |
| 가상 클래스 | `a:hover` | 마우스를 올린 a 요소 선택 |
| 가상 클래스 | `input:focus` | 포커스를 받은 input 선택 |
| 가상 클래스 | `li:nth-child(2)` | 부모의 두 번째 자식인 li 선택 |

예시:
```css
* {
  box-sizing: border-box;
}

p {
  color: #333;
}

.notice {
  background-color: lightyellow;
}

#header {
  text-align: center;
}

a:hover {
  text-decoration: underline;
}
```

### 선택자 우선순위
일반적인 우선순위는 `!important` 선언, 인라인 스타일, ID 선택자, 클래스·속성·가상 클래스 선택자, 태그 선택자 순으로 높다. 같은 우선순위라면 보통 나중에 선언된 규칙이 적용된다.

## 4. `style` 속성과 자주 쓰는 속성

### 4-1. Text 관련 속성

| 속성 | 역할 | 예시 |
|---|---|---|
| `font-size` | 글자 크기 | `font-size: 20px;` |
| `font-weight` | 글자 굵기 | `font-weight: bold;` 또는 `font-weight: 700;` |
| `text-align` | 텍스트 가로 정렬 | `text-align: center;` |
| `color` | 글자 색상 | `color: navy;` |
| `font-family` | 글꼴 지정 | `font-family: Arial, sans-serif;` |

`text-align` 값 예시: `left`, `center`, `right`, `justify`

```html
<p style="font-size: 20px; font-weight: bold; text-align: center;">
  가운데 정렬된 굵은 글씨
</p>
```

### 4-2. Box Model(박스 모델)
CSS는 각 HTML 요소를 사각형 박스로 보고 크기와 여백을 계산한다. 바깥쪽부터 `margin → border → padding → content` 순서로 구성된다.

- **content**: 텍스트나 이미지 등 실제 내용이 들어가는 영역
- **padding**: 콘텐츠와 테두리 사이의 안쪽 여백
- **border**: 요소를 둘러싸는 테두리
- **margin**: 테두리 바깥쪽의 여백으로, 다른 요소와의 간격을 조절한다.
- **width / height**: 요소의 너비와 높이를 지정한다.
- **box-sizing**: `width`와 `height`에 어떤 영역까지 포함할지 정한다.

```css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
}
```

### 4-3. `box-sizing`
기본값인 `content-box`에서는 `width`와 `height`가 콘텐츠 영역만 지정한다. 따라서 padding과 border가 추가되면 실제 바깥 크기는 더 커진다.

- `content-box`: 콘텐츠 크기 기준
- `border-box`: 콘텐츠 + padding + border를 포함한 크기 기준

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

위처럼 설정하면 요소의 지정한 `width` 안에 padding과 border가 포함되어 크기를 계산하기 편리하다.

## 5. 간단한 종합 예제

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>CSS 연습</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1 id="header">CSS 연습</h1>
  <p class="notice">CSS로 글자와 박스 스타일을 바꿉니다.</p>
  <div class="box">박스 모델</div>
</body>
</html>
```

```css
* {
  box-sizing: border-box;
}

#header {
  text-align: center;
}

.notice {
  font-size: 18px;
  font-weight: bold;
}

.box {
  width: 200px;
  height: 100px;
  padding: 16px;
  border: 2px solid #333;
  margin: 20px;
}
```

## 6. 핵심 요약
- HTML은 웹 페이지의 구조, CSS는 모양과 배치를 담당한다.
- Inline은 요소의 `style` 속성, Internal은 `<style>`, External은 별도 `.css` 파일로 적용한다.
- 선택자는 스타일을 적용할 HTML 요소를 고른다.
- `font-size`, `font-weight`, `text-align`은 글자 모양과 정렬을 조절한다.
- Box Model은 `content`, `padding`, `border`, `margin`으로 구성된다.
- `box-sizing: border-box`를 사용하면 지정한 크기에 padding과 border가 포함된다.
