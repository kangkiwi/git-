# JavaScript DOM 조작법 정리

## 1. DOM(Document Object Model)이란?

**DOM**은 HTML 문서를 브라우저가 이해할 수 있도록 **객체(Object) 구조로 표현한 것**입니다.

브라우저는 HTML을 읽으면서 각 태그를 하나의 객체(노드, Node)로 만들고, 이 노드들을 부모-자식 관계의 **트리(Tree) 구조**로 연결합니다. JavaScript는 이 DOM을 통해 HTML 요소를 **찾고, 내용·스타일·속성을 바꾸고, 새로 만들거나 삭제**할 수 있습니다.

```html
<html>
  <body>
    <h1>제목</h1>
    <ul>
      <li>사과</li>
      <li>바나나</li>
    </ul>
  </body>
</html>
```

```
document
 └─ html
     └─ body
         ├─ h1  ─ "제목"
         └─ ul
             ├─ li ─ "사과"
             └─ li ─ "바나나"
```

- `document` : DOM 트리의 최상위 객체 (문서 전체)
- **요소 노드** : `<h1>`, `<li>` 같은 태그
- **텍스트 노드** : 태그 안의 글자
- **속성 노드** : `class`, `id` 같은 속성

> HTML 파일 자체를 바꾸는 게 아니라, 브라우저 메모리에 올라간 DOM을 바꾸는 것입니다. 그래서 새로고침하면 원래 HTML 상태로 돌아갑니다.

---

## 2. Selector(선택자)로 DOM 요소 가져오기

### 2-1. `querySelector` / `querySelectorAll` (권장)

CSS 선택자 문법 그대로 요소를 찾습니다.

| 메서드 | 반환값 |
| --- | --- |
| `document.querySelector(선택자)` | 조건에 맞는 **첫 번째** 요소 1개 (없으면 `null`) |
| `document.querySelectorAll(선택자)` | 조건에 맞는 **모든** 요소 (`NodeList`) |

```js
const title = document.querySelector("h1");          // 태그
const box = document.querySelector("#box");          // id
const firstItem = document.querySelector(".item");   // class (첫 번째)
const items = document.querySelectorAll(".item");    // class (전부)
const link = document.querySelector("nav a.active"); // 복합 선택자
const btn = document.querySelector('[data-id="3"]'); // 속성 선택자

items.forEach((item) => console.log(item.textContent)); // NodeList는 forEach 사용 가능
```

### 2-2. `getElement` 계열 (예전 방식)

```js
document.getElementById("box");            // id로 1개
document.getElementsByClassName("item");   // class로 여러 개 (HTMLCollection)
document.getElementsByTagName("li");       // 태그로 여러 개 (HTMLCollection)
```

- `HTMLCollection`은 `forEach`를 바로 쓸 수 없어 `Array.from()`으로 바꿔서 사용합니다.
- `getElementsBy...`는 DOM이 바뀌면 자동 반영(live)되고, `querySelectorAll`은 찾은 시점의 목록(static)입니다.

### 2-3. 가져온 요소 다루기

```js
const box = document.querySelector("#box");

// 내용
box.textContent = "텍스트만 변경";
box.innerHTML = "<strong>HTML 태그까지</strong> 변경";

// 스타일
box.style.color = "red";
box.style.backgroundColor = "yellow"; // CSS의 background-color → camelCase

// 클래스
box.classList.add("active");
box.classList.remove("active");
box.classList.toggle("active"); // 있으면 제거, 없으면 추가
box.classList.contains("active"); // true / false

// 속성
box.setAttribute("title", "안내");
box.getAttribute("title");
box.dataset.id; // data-id 속성 값

// 요소 생성 / 추가 / 삭제
const li = document.createElement("li");
li.textContent = "새 항목";
document.querySelector("ul").appendChild(li);
li.remove();
```

---

## 3. Event란?

**이벤트(Event)**는 웹 페이지에서 **발생하는 사건**을 말합니다. 사용자의 행동이나 브라우저의 상태 변화가 모두 이벤트입니다.

| 분류 | 이벤트 | 발생 시점 |
| --- | --- | --- |
| 마우스 | `click`, `dblclick` | 클릭, 더블클릭 |
| | `mouseover`, `mouseout` | 요소 위로 올라감 / 벗어남 |
| | `mousemove` | 마우스 이동 |
| 키보드 | `keydown`, `keyup` | 키를 누름 / 뗌 |
| 폼 | `input` | 입력값이 바뀔 때마다 |
| | `change` | 값이 바뀌고 포커스가 빠질 때 |
| | `submit` | 폼 제출 |
| | `focus`, `blur` | 포커스를 얻음 / 잃음 |
| 문서 | `DOMContentLoaded` | HTML 해석이 끝났을 때 |
| | `load` | 이미지 등 모든 리소스 로드 완료 |
| | `scroll`, `resize` | 스크롤, 창 크기 변경 |

---

## 4. EventListener(이벤트 리스너)

### 4-1. EventListener란?

**이벤트 리스너**는 특정 요소에서 **이벤트가 발생하기를 기다리고(listen)**, 발생하면 **지정한 함수를 실행**하는 장치입니다. 이때 실행되는 함수를 **이벤트 핸들러(Event Handler)** 또는 콜백 함수라고 합니다.

> "버튼이 **클릭되면** → 이 **함수를 실행**해줘" 라고 등록해두는 것

### 4-2. EventListener를 사용하는 목적, 이유

1. **사용자와 상호작용** : 클릭, 입력, 키보드 등 사용자 행동에 반응하는 동적인 페이지를 만들 수 있습니다.
2. **HTML과 JS의 분리** : `<button onclick="...">`처럼 HTML 안에 코드를 쓰지 않고, JS 파일에서 관리할 수 있어 유지보수가 쉽습니다.
3. **하나의 요소에 여러 핸들러 등록 가능** : `onclick` 속성은 마지막 하나만 남지만, `addEventListener`는 여러 개를 등록할 수 있습니다.
4. **세밀한 제어** : `removeEventListener`로 해제하거나, `once`, `capture` 같은 옵션을 줄 수 있습니다.

```js
// onclick 속성 : 덮어쓰기 → 두 번째만 실행됨
btn.onclick = () => console.log("1");
btn.onclick = () => console.log("2");

// addEventListener : 둘 다 실행됨
btn.addEventListener("click", () => console.log("1"));
btn.addEventListener("click", () => console.log("2"));
```

### 4-3. EventListener 정의하기

```js
요소.addEventListener("이벤트 종류", 실행할 함수, 옵션);
```

```js
const button = document.querySelector("#myBtn");

// 1) 익명 함수
button.addEventListener("click", function () {
  alert("클릭!");
});

// 2) 미리 만든 함수 전달 (함수 이름만 전달, () 붙이지 않기!)
function handleClick() {
  alert("클릭!");
}
button.addEventListener("click", handleClick);

// 3) 이벤트 해제 (등록할 때와 같은 함수여야 해제 가능)
button.removeEventListener("click", handleClick);

// 4) 옵션 : 한 번만 실행
button.addEventListener("click", handleClick, { once: true });
```

**이벤트 객체(event)**
핸들러의 첫 번째 매개변수로 이벤트 정보가 담긴 객체가 전달됩니다.

```js
button.addEventListener("click", (event) => {
  console.log(event.type);   // "click"
  console.log(event.target); // 실제로 클릭된 요소
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // 기본 동작(페이지 새로고침) 막기
});
```

### 4-4. EventListener 응용

**① 여러 버튼에 한 번에 등록**

```js
const buttons = document.querySelectorAll(".btn");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(btn.textContent);
  });
});
```

**② 이벤트 위임 (Event Delegation)**
이벤트는 클릭된 요소에서 부모 쪽으로 전파(버블링)됩니다. 이를 이용해 **부모 하나에만** 리스너를 등록하면, 자식이 많거나 나중에 추가되어도 모두 처리할 수 있습니다.

```js
const list = document.querySelector("ul");
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  li.classList.toggle("done");
});
```

**③ 실시간 입력 감지**

```js
const input = document.querySelector("#search");
input.addEventListener("input", (e) => {
  console.log("입력값:", e.target.value);
});
```

**④ 키보드 단축키**

```js
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") console.log("엔터!");
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    console.log("저장 단축키");
  }
});
```

**⑤ 다크 모드 토글**

```js
document.querySelector("#theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
```

---

## 5. 마우스 감지란?

**마우스 감지**는 마우스의 **클릭, 이동, 진입/이탈, 버튼 누름/뗌** 같은 동작을 이벤트로 감지해 반응하는 것입니다. 마우스 이벤트 객체에는 마우스 위치, 눌린 버튼 등의 정보가 담겨 있습니다.

| 이벤트 | 설명 |
| --- | --- |
| `click` | 클릭 (누르고 뗐을 때) |
| `dblclick` | 더블클릭 |
| `mousedown` / `mouseup` | 버튼을 누를 때 / 뗄 때 |
| `mousemove` | 마우스가 움직일 때마다 |
| `mouseenter` / `mouseleave` | 요소에 들어올 때 / 나갈 때 (자식에서는 발생 안 함) |
| `mouseover` / `mouseout` | 요소에 들어올 때 / 나갈 때 (자식 요소에서도 발생) |
| `contextmenu` | 우클릭 |
| `wheel` | 마우스 휠 |

| 이벤트 객체 속성 | 의미 |
| --- | --- |
| `clientX`, `clientY` | 브라우저 화면 기준 좌표 |
| `pageX`, `pageY` | 문서 전체 기준 좌표 (스크롤 포함) |
| `offsetX`, `offsetY` | 이벤트가 발생한 요소 기준 좌표 |
| `button` | 눌린 버튼 (0: 왼쪽, 1: 휠, 2: 오른쪽) |

### 5-1. 마우스 감지 사용

**① 마우스 올리면 색 바꾸기**

```js
const box = document.querySelector(".box");

box.addEventListener("mouseenter", () => {
  box.style.backgroundColor = "skyblue";
});
box.addEventListener("mouseleave", () => {
  box.style.backgroundColor = "";
});
```

**② 마우스 좌표 표시**

```js
const pos = document.querySelector("#pos");
document.addEventListener("mousemove", (e) => {
  pos.textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
});
```

**③ 마우스를 따라다니는 원**

```js
const circle = document.querySelector(".circle"); // position: fixed 인 요소
document.addEventListener("mousemove", (e) => {
  circle.style.left = `${e.clientX}px`;
  circle.style.top = `${e.clientY}px`;
});
```

**④ 우클릭 메뉴 막기**

```js
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  console.log("우클릭 감지!");
});
```

---

## 6. 화살표 함수란?

**화살표 함수(Arrow Function)**는 ES6에서 추가된 문법으로, `function` 키워드 대신 `=>`를 사용해 **함수를 더 짧게 작성**하는 방법입니다.

```js
// 일반 함수
function add(a, b) {
  return a + b;
}

// 함수 표현식
const add2 = function (a, b) {
  return a + b;
};

// 화살표 함수
const add3 = (a, b) => {
  return a + b;
};

// 한 줄이면 { }와 return 생략 가능
const add4 = (a, b) => a + b;
```

**일반 함수와의 차이점**

| 구분 | 일반 함수 | 화살표 함수 |
| --- | --- | --- |
| `this` | 호출한 방식에 따라 결정 (이벤트 핸들러에서는 이벤트가 걸린 요소) | 자신만의 `this`가 없고, **바깥 스코프의 `this`를 그대로 사용** |
| `arguments` | 사용 가능 | 사용 불가 (나머지 매개변수 `...args` 사용) |
| 생성자(`new`) | 사용 가능 | 사용 불가 |
| 호이스팅 | 함수 선언문은 선언 전에 호출 가능 | 변수에 담기므로 선언 전에 호출 불가 |

### 6-1. 화살표 함수 사용

**① 문법 정리**

```js
const sayHi = () => console.log("안녕!");       // 매개변수 없음 → () 필수
const double = (n) => n * 2;                   // 매개변수 1개 → () 생략 가능: n => n * 2
const sum = (a, b) => a + b;                   // 매개변수 여러 개
const makeUser = (name) => ({ name, age: 20 }); // 객체 반환 → ( )로 감싸기
```

**② 배열 메서드와 함께**

```js
const nums = [1, 2, 3, 4, 5];

nums.map((n) => n * 2);           // [2, 4, 6, 8, 10]
nums.filter((n) => n % 2 === 0);  // [2, 4]
nums.reduce((acc, n) => acc + n, 0); // 15
```

**③ 이벤트 리스너와 함께**

```js
const btn = document.querySelector("#btn");

btn.addEventListener("click", (e) => {
  e.target.textContent = "클릭됨!";
});
```

**④ `this` 주의하기**

```js
btn.addEventListener("click", function () {
  console.log(this); // <button> (이벤트가 걸린 요소)
});

btn.addEventListener("click", () => {
  console.log(this); // window (바깥 스코프의 this)
});
```

> 이벤트 핸들러에서 화살표 함수를 쓸 때는 `this` 대신 **`e.target`이나 `e.currentTarget`**을 사용하면 됩니다.

---

## 7. 정리 (계산기 과제에 적용한 내용)

| 개념 | 계산기에서 사용한 부분 |
| --- | --- |
| `querySelector` | `#result`, `#expression`, `.buttons` 요소 가져오기 |
| `querySelectorAll` | 연산자 버튼(`.operator`)들을 가져와 선택 표시 |
| `addEventListener("click")` | 버튼 클릭 처리 |
| 이벤트 위임 | `.buttons` 부모에만 리스너를 달고 `e.target.closest("button")`으로 구분 |
| `dataset` | `data-number`, `data-operator`, `data-action`으로 버튼 종류 구분 |
| `keydown` | 키보드로 숫자·연산자 입력 |
| `classList` | 선택된 연산자 강조, 키 입력 시 눌림 효과 |
| 화살표 함수 | 모든 함수와 이벤트 핸들러를 화살표 함수로 작성 |
