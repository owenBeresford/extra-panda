function HTMLDetailsTrap(e) {
  if (e.code === "Escape" || e.key === "Escape") {
    const tt = $("details[open]");
    if (tt.length) {
      tt[0].open = false;
    }
  }
  e.preventDefault();
}
function HTMLDetailsClick(e) {
  const find = function (ele, target) {
    if (ele.tagName === target) {
      return ele;
    }

    while (ele.tagName !== target) {
      // extra clause to allow links to exit this page
      if (ele.tagName === "A") {
        return ele;
      }
      if (ele.tagName === "BODY") {
        return undefined;
      }

      ele = ele.parentElement;
    }
    return ele;
  };

  const act = find(e.target, "DETAILS");
  if (act && act.tagName === "A") {
    return true;
  } else if (act && act.open) {
    act.open = false;
  } else if (act && !act.open) {
    act.open = true;
  } else if (!act) {
    const tt = document.querySelector("details[open]");
    if (tt) {
      tt.open = false;
    }
  }

  e.preventDefault();
}

function exec() {
  document.addEventListener("keydown", HTMLDetailsTrap);
  document.addEventListener("click", HTMLDetailsClick);
}

$(document).ready(exec);
