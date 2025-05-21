(() => {
  const head = document.getElementsByTagName("head")[0];
  let animationId = 1;

  function CreateMagicDust(
    x1,
    x2,
    y1,
    y2,
    sizeRatio,
    fallingTime,
    animationDelay,
    node = "main"
  ) {
    let dust = document.createElement("span");
    let animation = document.createElement("style");
    animation.innerHTML =
      "\
        @keyframes blink" +
      animationId +
      "{\
            0% {\
                top: " +
      y1 +
      "px;\
                left: " +
      x1 +
      "px;\
                width: " +
      2 * sizeRatio +
      "px;\
                height: " +
      2 * sizeRatio +
      "px;\
                opacity: .4\
            }\
            20% {\
                width: " +
      4 * sizeRatio +
      "px;\
                height: " +
      4 * sizeRatio +
      "px;\
                opacity: .8\
            }\
            35% {\
                width: " +
      2 * sizeRatio +
      "px;\
                height: " +
      2 * sizeRatio +
      "px;\
                opacity: .5\
            }\
            55% {\
                width: " +
      3 * sizeRatio +
      "px;\
                height: " +
      3 * sizeRatio +
      "px;\
                opacity: .7\
            }\
            80% {\
                width: " +
      sizeRatio +
      "px;\
                height: " +
      sizeRatio +
      "px;\
                opacity: .3\
            }\
            100% {\
                top: " +
      y2 +
      "px;\
                left: " +
      x2 +
      "px;\
                width: " +
      0 +
      "px;\
                height: " +
      0 +
      "px;\
                opacity: .1\
            }}";
    head.appendChild(animation);
    dust.classList.add("dustDef");
    dust.setAttribute(
      "style",
      `animation: blink${animationId++} ${fallingTime}s cubic-bezier(.71, .11, .68, .83) infinite ${animationDelay}s`
    );
    document.getElementById(node).appendChild(dust);
  }

  // yes, I'm doing it manually to get the effect I want.. can be easily changed to render randomly
  [
    [130, 132, 150, 152, 0.15, 2.5, 0.1, "sub"],
    [65, 63, 300, 299, 0.5, 2, 0.2, "sub"],
    [70, 70, 150, 150, 0.45, 2, 0.5],
    [75, 78, 160, 170, 0.6, 2, 1],
    [80, 82, 160, 180, 0.6, 1, 0.4],
    [85, 100, 160, 170, 0.5, 2, 0.5],
    [125, 110, 170, 180, 0.25, 3, 1.5],
    [90, 90, 115, 115, 0.4, 2, 2],
    [93, 95, 200, 200, 0.4, 3, 1.5],
    [100, 100, 145, 155, 0.45, 1, 0.5],
    [100, 90, 170, 230, 0.35, 2, 0.75],
    [100, 102, 115, 112, 0.35, 3, 0.25],
    [100, 95, 170, 200, 0.55, 1.5, 0.75],
    [100, 97, 150, 190, 0.7, 2, 1.5],
    [105, 100, 160, 180, 0.5, 1.5, 0.725],
    [125, 125, 180, 190, 0.25, 1, 0.725],
    [130, 130, 135, 135, 0.45, 3, 1.5],
    [135, 132, 170, 190, 0.25, 2.5, 0.75],
    [135, 132, 320, 315, 0.2, 5, 0.3, "sub"],
  ].forEach((o) => CreateMagicDust(...o));
})();
