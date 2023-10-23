window.onload = function () {
  // 안내창 닫기
  const cTap = document.getElementById("modal-close");
  window.addEventListener("click", function (cTap) {
    System.exit(0);
  });

  // 안내창 스크립트
  let modal = document.querySelector(".modal-wrap");
  modal.addEventListener("click", function () {
    modal.style.display = "none";
    fadeout(modal);
  });

  // AOS 적용
  AOS.init();

  // 메뉴 기능
  const nav = document.querySelector(".nav");
  const btMenu = document.querySelector(".bt-menu");
  const navClose = document.querySelector(".nav-close");

  btMenu.addEventListener("click", function () {
    // 클래스를 nav에 추가하고 싶다
    nav.classList.add("nav-active");
  });

  navClose.addEventListener("click", function () {
    // 클래스를 nav에 삭제하고 싶다
    nav.classList.remove("nav-active");
  });

  // nav 영역을 벗어나는 이벤트 발생 처리
  nav.addEventListener("mouseleave", function () {
    nav.classList.remove("nav-active");
  });

  // 스크롤 기능
  // 스크롤바의 상단위치
  let scy = 0;
  let scActive = 50;
  scy = window.document.documentElement.scrollTop;
  let header = document.querySelector(".header");
  let logoW = document.querySelector(".logo-w");
  let logoG = document.querySelector(".logo-g");

  header.addEventListener("mouseenter", function () {
    header.classList.add("header-active");
    logoW.style.display = "none";
    logoG.style.display = "block";
  });

  header.addEventListener("mouseleave", function () {
    if (scy < scActive) {
      header.classList.remove("header-active");
      logoW.style.display = "block";
      logoG.style.display = "none";
    }
  });

  window.addEventListener("scroll", function () {
    scy = window.document.documentElement.scrollTop;

    if (scy > scActive) {
      header.classList.add("header-active");
      logoW.style.display = "none";
      logoG.style.display = "block";
    } else {
      header.classList.remove("header-active");
      logoW.style.display = "block";
      logoG.style.display = "none";
    }
  });

  // 펼침 언어 기능
  const langWord = document.querySelector(".language-word");
  const language = document.querySelector(".language");
  const languageLi = document.querySelector(".language li");

  setTimeout(function () {
    languageLi.style.transition = "all 0.2s";
  }, 500);
  langWord.addEventListener("click", function () {
    language.classList.toggle("language-box-active");
  });

  // 비디오 항목을 체크(video 태그로 파악)
  // 모든 비디오 태그 videos 변수에 저장
  let videos = document.querySelectorAll(".swVisual video");
  // 비디오 시간 체크
  // 비디오를 재생기산을 보관할 배열 생성
  let videosTimeArr = [];

  for (let i = 0; i < videos.length; i++) {
    // 시간을 보관한다
    videosTimeArr[i] = Math.ceil(videos[i].duration); // duration: 재생하는 시간을 나타냄.
  }

  // 첫번째 비디오 자동 실행
  let videoIndex = 0;
  videos[videoIndex].play();

  // visual slide
  // swiper 슬라이드 초기화
  let swVisual = new Swiper(".swVisual", {
    loop: true,
  });

  // 슬라이드 변경 이벤트시 처리
  swVisual.on("slideChange", function () {
    // 진행 중인 비디오 멈춤
    videos[videoIndex].pause();

    // 다음 화면에 보이는 swiper 슬라이드 번호
    videoIndex = swVisual.realIndex;
    // 다음 비디오 재생
    // 처음으로 비디오 플레이헤드 이동
    // currentTime : 현재 비디오 재생 위치를 나타냄
    // 이 속성을 조작해서 비디오 재생 위치를 변경하고
    // 다음 슬라이드로 이동할 때마다 비디오를 처음부터 재생하기 위한 부분
    // 현재 보이는 슬라이드에 해당하는 비디오의 재생시간을 처음으로 설정
    videos[videoIndex].currentTime = 0;

    // https://solbel.tistory.com/1912
    // 간혹 가다가 에러가 발생하는 경우가 생기는데
    // 그거를 방지하기 위한 부분
    const playPromise = videos[videoIndex].play();
    if (playPromise !== undefined) {
      // 기다렸다가 에러메세지를 띄워라
      playPromise.then((_) => {}).catch((error) => {});
    }
    // 방어코드
    clearInterval(videoTimer);
    videoReset();
  });

  // 비디오 영상이 플레이가 끝나면 다음 슬라이드로 이동
  // 늘어나는 흰색 bar
  let bars = document.querySelectorAll(".bar");
  // 늘어나는 길이를 위한 값(최대 100)
  let barScaleW = 0;

  // 타이머 생성
  // 비디오 타이머 초기화 및 설정하는 부분
  let videoTimer;
  function videoReset() {
    // 처음에는 0%로 만들려고 한다
    barScaleW = 0;
    // 최초의 bar를 초기화 한다
    for (let i = 0; i < bars.length; i++) {
      let tag = bars[i];
      tag.style.width = `${barScaleW}%`;
    }

    // 활성화 될 때 bar 클래스 선택
    let activeBar = bars[videoIndex];

    // 일단 타이머를 청소한다
    // setTimeout : 1번 실행 clearTimeout()
    // setInterval : 시간마다 연속 실행 clearInterval()
    clearInterval(videoTimer);
    // 비디오 플레이 시간
    let videoTime = videosTimeArr[videoIndex];
    videoTimer = setInterval(() => {
      barScaleW++;
      activeBar.style.width = `${barScaleW}%`;

      // 재생이 끝나면 다음 bar 길이로 늘어나라(다음 bar로 넘어가라)는 부분
      if (barScaleW >= 100) {
        swVisual.slideNext();
        clearInterval(videoTimer);
        videoReset();
      }
    }, videoTime * 10); // 영상 재생 속도와 bar의 속도가 비슷해질 수 있도록 10을 곱해줌
  }
  videoReset();

  const visualControlLi = document.querySelectorAll(".visual-control > li");
  // 클릭 이벤트를 처리하는 이벤트 핸들러(약속된 함수)를 작성
  visualControlLi.forEach((item, index) => {
    item.addEventListener("click", function () {
      videoIndex = index;
      swVisual.slideTo(videoIndex);
    });
  });
};
