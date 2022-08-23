const textAreaArray = document.getElementsByClassName('Card__body__content');

// 변수 네이밍 컨벤션, 도메인과 관련된 용어를 미리 정의
// source: 번역할 텍스트와 관련된 명칭(안녕하세요를 번역하고 싶으면, 안녕하세요가 source)
// target: 번역된 결과와 관련된 명칭

const [sourceTextArea, targetTextArea] = textAreaArray; // [왼쪽 텍스트영역, 오른쪽 텍스트영역]
const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');

// 번역하고자 하는 언어의 타입(ko? en?, ja?)
let targetLanguage = 'en'; // 기본값으로 en

// 어떤 언어로 번역할지 선택하는 target selectbox의 선택지의 값이 바뀔 때마다 이벤트를 발생하도록, 지정한 언어의 타입 값을 targetLanguage 변수에 할당, 출력
// change 이벤트 사용, selectbox 객체가 가지고 있는 프로퍼티 활용
targetSelect.addEventListener('change', () => { 
    const targetValue = targetSelect.value;
    targetLanguage = targetValue;
    
    // // 내가 한 방법
    // const selectedIndex = targetSelect.selectedIndex;
    // targetLanguage = targetSelect.options[selectedIndex].value;
});

let debouncer;
sourceTextArea.addEventListener('input', (event) => {
    if(debouncer) { // debouncer 변수에 값이 있으면 true, 없으면 false
        clearTimeout(debouncer);
    }

    // setTimeout(콜백함수, 지연시킬 시간(ms),비동기적)
    // 콜백함수 : 지연된 시간 후에 동작할 코드
    debouncer = setTimeout(() => {
        const text = event.target.value; // sourceTextArea에 입력한 값
        console.log(text);

        // ajax 활용하여 비동기 HTTP 요청 전송
        const xhr = new XMLHttpRequest();

        const url = '/detectLangs'; // node 서버의 특정 url 주소

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 최종적으로 papago가 번역해준 번역된 텍스트 결과를 받는 부분(추후 작성) - 서버의 응답 결과 확인하는 부분
                const parsedData = JSON.parse(xhr.responseText);
                console.log(parsedData);
                
                const result = parsedData.message.result;

                const options = sourceSelect.options;

                for (let i = 0; i < options.length; i++) {
                    if(options[i].value === result.srcLangType) {
                        sourceSelect.selectedIndex = i;
                    }
                }

                targetTextArea.value = result.translatedText;
            }
        };

        // 요청 준비
        xhr.open('POST', url);

        // 요청을 보낼 때 동봉할 객체(object)
        const requestData = {
            text, // text: text // 프로퍼티와 변수명이 동일할 경우 하나만 써도 됨
            targetLanguage, // targetLanguage: targetLanguage와 같음
        };

        // 클라이언트가 서버에게 보내는 요청 데이터의 형식이 json 형식임을 명시
        xhr.setRequestHeader('Content-type', 'application/json'); // text/html 등 여러가지가 있음, header: 제품의 설명서

        // 보내기 전에 해야 할 일, JS object를 JSON으로 변환(직렬화)
        const jsonData = JSON.stringify(requestData);

        // 실제 요청 전송
        xhr.send(jsonData);

    }, 3000);
});