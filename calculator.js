// =====================================
// 콘솔창 계산기 프로그램
// - 사칙연산 (+, -, *, /)
// - 길이가 긴 계산식 계산
// - 연산자 우선순위 (*, / 를 +, - 보다 먼저 계산)
// - eval() 없이 직접 계산
// =====================================

// 1. 계산식 문자열을 숫자와 연산자로 나누기
//    "1 + 2 * -3" → [1, "+", 2, "*", -3]
function tokenize(expression) {
  const tokens = [];
  const str = expression.replace(/\s+/g, ""); // 공백 제거
  let i = 0;

  while (i < str.length) {
    const char = str[i];

    // 숫자 (앞에 붙은 - 부호 포함)
    // - 가 맨 앞이거나 연산자 바로 뒤에 오면 음수 부호로 봄
    const isSign =
      char === "-" &&
      (tokens.length === 0 || typeof tokens[tokens.length - 1] === "string");

    if (/[0-9.]/.test(char) || isSign) {
      let numStr = char;
      i++;
      while (i < str.length && /[0-9.]/.test(str[i])) {
        numStr += str[i];
        i++;
      }

      const num = Number(numStr);
      if (Number.isNaN(num) || numStr === "-") {
        throw new Error(`잘못된 숫자입니다: "${numStr}"`);
      }
      tokens.push(num);
      continue;
    }

    // 연산자
    if ("+-*/".includes(char)) {
      if (tokens.length === 0 || typeof tokens[tokens.length - 1] === "string") {
        throw new Error(`연산자 "${char}"의 위치가 잘못되었습니다.`);
      }
      tokens.push(char);
      i++;
      continue;
    }

    throw new Error(`사용할 수 없는 문자입니다: "${char}"`);
  }

  if (tokens.length === 0) {
    throw new Error("계산식이 비어 있습니다.");
  }
  if (typeof tokens[tokens.length - 1] === "string") {
    throw new Error("계산식이 연산자로 끝날 수 없습니다.");
  }

  return tokens;
}

// 2. 곱셈, 나눗셈 먼저 계산
//    [1, "+", 2, "*", 3] → [1, "+", 6]
function calcMulDiv(tokens) {
  const result = [tokens[0]];

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const num = tokens[i + 1];

    if (operator === "*") {
      result[result.length - 1] *= num;
    } else if (operator === "/") {
      if (num === 0) throw new Error("0으로 나눌 수 없습니다.");
      result[result.length - 1] /= num;
    } else {
      result.push(operator, num); // +, - 는 다음 단계로 넘김
    }
  }

  return result;
}

// 3. 덧셈, 뺄셈을 왼쪽부터 계산
//    [1, "+", 6] → 7
function calcAddSub(tokens) {
  let total = tokens[0];

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const num = tokens[i + 1];

    if (operator === "+") total += num;
    else if (operator === "-") total -= num;
  }

  return total;
}

// 4. 전체 계산
function calculate(expression) {
  const tokens = tokenize(expression);
  const afterMulDiv = calcMulDiv(tokens);
  const result = calcAddSub(afterMulDiv);

  // 0.1 + 0.2 = 0.30000000000000004 같은 부동소수점 오차 정리
  return parseFloat(result.toPrecision(12));
}

// 5. 콘솔에서 실행하는 함수
function start() {
  console.log("🧮 계산기를 시작합니다. (취소를 누르면 종료)");

  while (true) {
    const input = prompt("계산식을 입력하세요.(예: 1 + 1 * 4)");

    // 취소 버튼 또는 빈 입력 → 종료
    if (input === null || input.trim() === "") {
      console.log("👋 계산기를 종료합니다.");
      break;
    }

    try {
      const result = calculate(input);
      console.log(`${input} = ${result}`);
      alert(`${input} = ${result}`);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      alert(`오류: ${error.message}`);
    }
  }
}

console.log("콘솔에 start() 를 입력하면 계산기가 실행됩니다.");
