// =====================================
// querySelector + addEventListener 계산기
// =====================================

// ---------- 요소 선택 (querySelector) ----------
const resultEl = document.querySelector("#result");
const expressionEl = document.querySelector("#expression");
const buttonsEl = document.querySelector(".buttons");
const operatorBtns = document.querySelectorAll(".operator");

// ---------- 상태 ----------
let current = "0"; // 지금 입력 중인 숫자
let previous = null; // 앞에 입력한 숫자
let operator = null; // 선택한 연산자
let waitingForNext = false; // 연산자를 누른 직후인지

const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// ---------- 화면 갱신 ----------
const updateDisplay = () => {
  resultEl.textContent = current;
  expressionEl.textContent =
    previous !== null && operator ? `${previous} ${SYMBOLS[operator]}` : "";

  // 선택된 연산자 버튼 강조
  operatorBtns.forEach((btn) => {
    btn.classList.toggle(
      "active",
      waitingForNext && btn.dataset.operator === operator
    );
  });
};

// ---------- 계산 ----------
const calculate = (a, b, op) => {
  const x = Number(a);
  const y = Number(b);
  let value;

  switch (op) {
    case "+": value = x + y; break;
    case "-": value = x - y; break;
    case "*": value = x * y; break;
    case "/":
      if (y === 0) return "오류";
      value = x / y;
      break;
    default:
      return b;
  }

  // 0.1 + 0.2 같은 부동소수점 오차 정리
  return String(parseFloat(value.toPrecision(12)));
};

// ---------- 입력 처리 ----------
const inputNumber = (num) => {
  if (current === "오류" || waitingForNext) {
    current = num;
    waitingForNext = false;
  } else {
    current = current === "0" ? num : current + num;
  }
};

const inputDecimal = () => {
  if (current === "오류" || waitingForNext) {
    current = "0.";
    waitingForNext = false;
    return;
  }
  if (!current.includes(".")) current += ".";
};

const inputOperator = (nextOp) => {
  if (current === "오류") return;

  // 연산자를 연속으로 누르면 연산자만 교체
  if (operator && waitingForNext) {
    operator = nextOp;
    return;
  }

  // 3 + 4 × 처럼 이어서 계산
  if (previous !== null && operator) {
    current = calculate(previous, current, operator);
  }

  previous = current;
  operator = nextOp;
  waitingForNext = true;
};

const equal = () => {
  if (previous === null || !operator || waitingForNext) return;
  expressionEl.textContent = `${previous} ${SYMBOLS[operator]} ${current} =`;
  current = calculate(previous, current, operator);
  previous = null;
  operator = null;
  waitingForNext = true;
};

const clear = () => {
  current = "0";
  previous = null;
  operator = null;
  waitingForNext = false;
};

const toggleSign = () => {
  if (current === "0" || current === "오류") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
};

const percent = () => {
  if (current === "오류") return;
  current = String(parseFloat((Number(current) / 100).toPrecision(12)));
};

const backspace = () => {
  if (waitingForNext || current === "오류") return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
};

// ---------- 버튼 클릭 (addEventListener + 이벤트 위임) ----------
buttonsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const { number, operator: op, action } = btn.dataset;

  if (number !== undefined) inputNumber(number);
  else if (op) inputOperator(op);
  else if (action === "decimal") inputDecimal();
  else if (action === "equal") {
    equal();
    resultEl.textContent = current;
    operatorBtns.forEach((b) => b.classList.remove("active"));
    return; // 결과식(3 + 4 =)을 유지하기 위해 여기서 종료
  }
  else if (action === "clear") clear();
  else if (action === "sign") toggleSign();
  else if (action === "percent") percent();

  updateDisplay();
});

// ---------- 키보드 입력 (추가 기능) ----------
const KEY_MAP = {
  Enter: '[data-action="equal"]',
  "=": '[data-action="equal"]',
  Escape: '[data-action="clear"]',
  ".": '[data-action="decimal"]',
  "%": '[data-action="percent"]',
  "+": '[data-operator="+"]',
  "-": '[data-operator="-"]',
  "*": '[data-operator="*"]',
  "/": '[data-operator="/"]',
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    backspace();
    updateDisplay();
    return;
  }

  const selector = /^[0-9]$/.test(e.key)
    ? `[data-number="${e.key}"]`
    : KEY_MAP[e.key];
  if (!selector) return;

  e.preventDefault();
  const btn = document.querySelector(selector);
  btn.click(); // 버튼 클릭과 똑같이 처리

  // 눌린 버튼 효과
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 100);
});

updateDisplay();
