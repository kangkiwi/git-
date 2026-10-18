# HTML 태그 정리

## 1. HTML이란?
HTML(HyperText Markup Language)은 웹 페이지의 구조를 만드는 마크업 언어이다. 태그를 사용해 제목, 문단, 목록, 이미지 등 콘텐츠의 의미와 구조를 표현한다.

## 2. HTML 기본 구조
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>페이지 제목</h1>
  <p>본문 내용입니다.</p>
</body>
</html>
```

- `<!DOCTYPE html>`: HTML5 문서임을 브라우저에 알린다.
- `<html>`: HTML 문서의 최상위 요소이다.
- `<head>`: 문서 제목, 문자 인코딩, CSS 연결 등 화면에 직접 표시되지 않는 설정을 담는다.
- `<title>`: 브라우저 탭에 표시되는 문서 제목이다.
- `<body>`: 브라우저 화면에 표시되는 콘텐츠를 담는다.

## 3. 자주 사용하는 태그

### `<p>` — 문단
텍스트 문단을 나타낸다. 보통 블록 요소로 표시되어 앞뒤 문단과 구분된다.

```html
<p>첫 번째 문단입니다.</p>
<p>두 번째 문단입니다.</p>
```

### `<ul>` — 순서 없는 목록
항목을 글머리 기호로 나열한다. 목록 항목은 `<li>`로 작성한다.

```html
<ul>
  <li>사과</li>
  <li>바나나</li>
  <li>포도</li>
</ul>
```

### `<ol>` — 순서 있는 목록
항목을 번호 등 순서가 있는 형태로 나열한다. 각 항목은 `<li>`로 작성한다.

```html
<ol>
  <li>HTML 공부하기</li>
  <li>CSS 공부하기</li>
  <li>실습하기</li>
</ol>
```

### `<li>` — 목록 항목
`<ul>` 또는 `<ol>` 안에서 개별 목록 항목을 나타낸다.

### `<input>` — 입력 필드
사용자가 값을 입력할 수 있는 컨트롤이다. `type` 속성으로 입력 종류를 지정한다.

```html
<input type="text" placeholder="이름 입력">
<input type="email" placeholder="이메일 입력">
<input type="password" placeholder="비밀번호 입력">
<input type="checkbox"> 동의합니다
```

- `type`: 입력 종류를 지정한다. 예: `text`, `email`, `password`, `checkbox`, `radio`, `date`
- `placeholder`: 입력 전에 안내 문구를 표시한다.
- `required`: 필수 입력으로 지정한다.
- `name`: 입력값을 전송할 때 사용하는 이름이다.

### `<img>` — 이미지
웹 페이지에 이미지를 삽입한다. 일반적으로 닫는 태그 없이 사용한다.

```html
<img src="cat.jpg" alt="의자 위에 앉아 있는 고양이" width="300">
```

- `src`: 이미지 파일의 경로나 URL
- `alt`: 이미지가 표시되지 않을 때 대체할 설명이며, 접근성을 위해 작성한다.
- `width`, `height`: 이미지 크기를 지정한다.

### `<head>` — 문서 설정 영역
페이지의 메타데이터, 제목, 스타일시트 연결 등을 작성한다. 일반적으로 화면 본문에 직접 표시되지 않는다.

```html
<head>
  <meta charset="UTF-8">
  <title>HTML 연습</title>
  <link rel="stylesheet" href="style.css">
</head>
```

### `<body>` — 화면 콘텐츠 영역
브라우저에 실제로 표시할 제목, 문단, 이미지, 링크, 입력 폼 등을 작성한다.

```html
<body>
  <h1>환영합니다</h1>
  <p>HTML을 공부하고 있습니다.</p>
  <img src="cat.jpg" alt="고양이">
</body>
```

## 4. 태그와 속성
속성(attribute)은 태그에 추가 정보를 제공한다. 일반적으로 여는 태그 안에 `속성="값"` 형태로 작성한다.

```html
<p class="intro">소개 문단</p>
<a href="https://example.com">사이트 이동</a>
<img src="photo.jpg" alt="사진 설명">
```

- `class`: 여러 요소를 묶어 공통 스타일을 적용할 때 사용한다.
- `id`: 문서에서 특정 요소를 식별할 때 사용하며, 한 페이지에서 고유하게 사용하는 것이 원칙이다.
- `href`: 링크 목적지를 지정한다.
- `src`: 이미지 등 외부 리소스의 위치를 지정한다.

## 5. 기억할 점
- 태그는 요소의 구조와 의미를 표현한다.
- 대부분의 태그는 여는 태그와 닫는 태그를 사용하지만, `<img>`와 `<input>`처럼 별도의 닫는 태그가 없는 요소도 있다.
- 목록은 `<ul>` 또는 `<ol>` 안에 `<li>`를 넣어 구성한다.
- CSS는 HTML 요소의 색상, 글꼴, 여백, 배치 등 모양을 꾸민다.
