const fileInput = document.querySelector(".file-input"),
    chooseImgBtn = document.querySelector(".choose-img"),
    previewImg = document.querySelector(".preview-img img"),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    filterSlider = document.querySelector(".slider input"),
    filterValue = document.querySelector(".filter-info .value"),
    rotateBtn = document.getElementById("rotate-btn"),
    resizeWidthInput = document.getElementById("resize-width"),
    resizeHeightInput = document.getElementById("resize-height"),
    resizeBtn = document.getElementById("resize-btn"),
    angleInput = document.getElementById("rotate-angle"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    saveImgBtn = document.querySelector(".save-img"),
    horizontalFlipBtn = document.getElementById("horizontal"),
    verticalFlipBtn = document.getElementById("vertical");

let brightness = "100",
    grayscale = "0",
    blurry = "0",
    rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;

    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "grayscale") {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        } else if (option.id === "blur") {
            filterSlider.max = "50";
            filterSlider.value = blurry;
            filterValue.innerText = `${blurry}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "grayscale") {
        grayscale = filterSlider.value;
    } else if (selectedFilter.id === "blur") {
        blurry = filterSlider.value;
    }

    applyFilter();
}

const applyFilter = () => {
    previewImg.style.filter = `brightness(${brightness}%) grayscale(${grayscale}%) blur(${blurry}px)`;
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}

rotateBtn.addEventListener("click", () => {
    const angle = parseInt(angleInput.value) || 0;
    rotate = (rotate + angle) % 360;
    applyFilter();
});

resizeBtn.addEventListener("click", () => {
    const width = parseInt(resizeWidthInput.value) || previewImg.naturalWidth;
    const height = parseInt(resizeHeightInput.value) || previewImg.naturalHeight;
    previewImg.style.width = `${width}px`;
    previewImg.style.height = `${height}px`;
});

horizontalFlipBtn.addEventListener("click", () => {
    flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    applyFilter();
});

verticalFlipBtn.addEventListener("click", () => {
    flipVertical = flipVertical === 1 ? -1 : 1;
    applyFilter();
});

const resetFilter = () => {
    brightness = "100";
    grayscale = "0";
    blurry = "0";
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) grayscale(${grayscale}%) blur(${blurry}px)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    downloadImage(canvas);
}

const downloadImage = (canvas) => {
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

saveImgBtn.addEventListener("click", saveImage);
resetFilterBtn.addEventListener("click", resetFilter);
filterSlider.addEventListener("input", updateFilter);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());

