function toggleVisibility(now, end) {
    const nowDiv = document.getElementById(now);
    const endDiv = document.getElementById(end);
    nowDiv.classList.toggle('hide');
    endDiv.classList.toggle('hide');
}