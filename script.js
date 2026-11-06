const canvas =
    document.getElementById("previewCanvas");

const ctx =
    canvas.getContext("2d");

const gridContainer =
    document.getElementById("gridContainer");

const topScale =
    document.getElementById("topScale");

const leftScale =
    document.getElementById("leftScale");

const textSizeSlider =
    document.getElementById("textSizeInput");

const textSizeLabel =
    document.getElementById("textSizeLabel");

const yearSizeSlider =
    document.getElementById("yearSize");

const yearSizeLabel =
    document.getElementById("yearSizeLabel");

textSizeSlider.addEventListener(
    "input",
    () => {
        textSizeLabel.textContent =
            textSizeSlider.value + "%";
    }
);

yearSizeSlider.addEventListener(
    "input",
    () => {
        yearSizeLabel.textContent =
            yearSizeSlider.value + "%";
    }
);

document
    .getElementById("generateBtn")
    .addEventListener(
        "click",
        generate
    );

generate();

/*
=====================
   定番色 → カラーピッカー連動
=====================
*/

function bindColorPreset(
    presetId,
    colorId
) {

    const preset =
        document.getElementById(
            presetId
        );

    const color =
        document.getElementById(
            colorId
        );

    if (!preset || !color) {
        return;
    }

    preset.addEventListener(
        "change",
        () => {

            color.value =
                preset.value;

            generate();
        }
    );

    color.addEventListener(
        "input",
        () => {

            preset.value =
                color.value;

            generate();
        }
    );
}

bindColorPreset(
    "textColorPreset",
    "textColor"
);

bindColorPreset(
    "bgColorPreset",
    "bgColor"
);

bindColorPreset(
    "frameColorPreset",
    "frameColor"
);

bindColorPreset(
    "yearColorPreset",
    "yearColor"
);

function craneSVG(colorClass) {
    return `
    <div class="crane ${colorClass}">
        <svg
            viewBox="0 0 100 200"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="
                M1 133
                L50 1
                L99 133
                L99 199
                L1 199
                Z
                "
                fill="currentColor"
                stroke="#000"
                stroke-width="6"
                stroke-linejoin="round"
            />
        </svg>
    </div>
    `;
}

function getSelectedColor(colorPickerId) {
    return document
        .getElementById(colorPickerId)
        .value;
}

function generate() {

    const text =
        document.getElementById(
            "textInput"
        ).value;

    const cols =
        parseInt(
            document.getElementById(
                "colsInput"
            ).value
        );

    const rows =
        parseInt(
            document.getElementById(
                "rowsInput"
            ).value
        );

    const textScale =
        parseInt(
            document.getElementById(
                "textSizeInput"
            ).value
        );

    const textOffsetX =
    parseInt(
        document.getElementById(
            "textOffsetX"
        ).value
    );

    const textOffsetY =
        parseInt(
            document.getElementById(
                "textOffsetY"
            ).value
        );

    const textColor =
        getSelectedColor(
            "textColor"
        );

    const bgColor =
        getSelectedColor(
            "bgColor"
        );

    const frameColor =
        getSelectedColor(
            "frameColor"
        );

    const frameEnabled =
        document.getElementById(
            "frameEnabled"
        ).checked;

    const frameWidth =
        parseInt(
            document.getElementById(
                "frameWidth"
            ).value
        );

    const yearEnabled =
        document.getElementById(
            "yearEnabled"
        ).checked;

    const yearValue =
        document.getElementById(
            "yearValue"
        ).value;

    const yearScale =
        parseInt(
            document.getElementById(
                "yearSize"
            ).value
        );

    const yearColor =
        getSelectedColor(
            "yearColor"
        );

    const yearPosition =
        document.getElementById(
            "yearPosition"
        ).value;

    

    document.documentElement.style.setProperty(
        "--text-color",
        textColor
    );

    document.documentElement.style.setProperty(
        "--bg-color",
        bgColor
    );

    document.documentElement.style.setProperty(
        "--frame-color",
        frameColor
    );

    document.documentElement.style.setProperty(
        "--year-color",
        yearColor
    );

    const grid =
        Array(rows)
            .fill()
            .map(() =>
                Array(cols).fill("bg")
            );

    /*
    =====================
       文字
    =====================
    */

    canvas.width = cols;
    canvas.height = rows;

    ctx.clearRect(
        0,
        0,
        cols,
        rows
    );

    ctx.fillStyle = "white";
    ctx.fillRect(
        0,
        0,
        cols,
        rows
    );

    const fontSize =
        Math.max(
            6,
            Math.floor(
                Math.min(cols, rows)
                * (textScale / 100)
            )
        );

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
        `bold ${fontSize}px sans-serif`;

    ctx.fillText(
        text,
        (cols / 2) +
        textOffsetX,
        (rows / 2) +
        textOffsetY
    );

    let imageData =
        ctx.getImageData(
            0,
            0,
            cols,
            rows
        );

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            const idx =
                (y * cols + x) * 4;

            if (
                imageData.data[idx]
                < 128
            ) {
                grid[y][x] =
                    "text";
            }
        }
    }

    /*
    =====================
       年度
    =====================
    */

    if (yearEnabled) {

        const NUMBER_FONT = {
            "0":["111","101","101","101","111"],
            "1":["010","110","010","010","111"],
            "2":["111","001","111","100","111"],
            "3":["111","001","111","001","111"],
            "4":["101","101","111","001","001"],
            "5":["111","100","111","001","111"],
            "6":["111","100","111","101","111"],
            "7":["111","001","001","001","001"],
            "8":["111","101","111","101","111"],
            "9":["111","101","111","001","111"]
        };

        const scale =
            Math.max(
                1,
                Math.round(
                    yearScale / 20
                )
            );

        const digitWidth =
            3 * scale;

        const digitHeight =
            5 * scale;

        const gap =
        scale;

        const yearW =
           (
            digitWidth *
            yearValue.length
            ) +
            (
                gap *
                (
                    yearValue.length - 1
                )
            );

        const yearH =
            digitHeight;

        const margin =
            frameEnabled
            ? frameWidth + 1
            : 1;

        let startX = margin;
        let startY = margin;

        switch (yearPosition) {

            case "top-center":
                startX =
                    Math.floor(
                        (cols - yearW) / 2
                    );
                break;

            case "top-right":
                startX =
                    cols -
                    yearW -
                    margin;
                break;

            case "middle-left":
                startY =
                    Math.floor(
                        (rows - yearH) / 2
                    );
                break;

            case "center":
                startX =
                    Math.floor(
                        (cols - yearW) / 2
                    );

                startY =
                    Math.floor(
                        (rows - yearH) / 2
                    );
                break;

            case "middle-right":
                startX =
                    cols -
                    yearW -
                    margin;

                startY =
                    Math.floor(
                        (rows - yearH) / 2
                    );
                break;

            case "bottom-left":
                startY =
                    rows -
                    yearH -
                    margin;
                break;

            case "bottom-center":
                startX =
                    Math.floor(
                        (cols - yearW) / 2
                    );

                startY =
                    rows -
                    yearH -
                    margin;
                break;

            case "bottom-right":
                startX =
                    cols -
                    yearW -
                    margin;

                startY =
                    rows -
                    yearH -
                    margin;
                break;
        }

        for (
            let i = 0;
            i < yearValue.length;
            i++
        ) {

            const pattern =
                NUMBER_FONT[
                    yearValue[i]
                ];

            if (!pattern) {
                continue;
            }

            for (
                let py = 0;
                py < pattern.length;
                py++
            ) {

                for (
                    let px = 0;
                    px < pattern[py].length;
                    px++
                ) {

                    if (
                        pattern[py][px] !== "1"
                    ) {
                        continue;
                    }

                    for (
                        let sy = 0;
                        sy < scale;
                        sy++
                    ) {

                        for (
                            let sx = 0;
                            sx < scale;
                            sx++
                        ) {

                            const gx =
                                startX +
                                (
                                    i *
                                    (
                                        digitWidth +
                                        gap
                                    )
                                ) +
                                (
                                    px *
                                    scale
                                ) +
                                sx;

                            const gy =
                                startY +
                                (
                                    py *
                                    scale
                                ) +
                                sy;

                            if (
                                gx >= 0 &&
                                gx < cols &&
                                gy >= 0 &&
                                gy < rows
                            ) {
                                grid[gy][gx] =
                                    "year";
                            }
                        }
                    }
                }
            }
        }
    }

    /*
    =====================
       枠
    =====================
    */

    if (frameEnabled) {

        for (
            let y = 0;
            y < rows;
            y++
        ) {

            for (
                let x = 0;
                x < cols;
                x++
            ) {

                if (
                    x < frameWidth ||
                    x >= cols - frameWidth ||
                    y < frameWidth ||
                    y >= rows - frameWidth
                ) {
                    grid[y][x] =
                        "frame";
                }
            }
        }
    }

    /*
    =====================
       目盛
    =====================
    */

    topScale.innerHTML = "";

    for (
        let x = 1;
        x <= cols;
        x++
    ) {

        const mark =
            document.createElement(
                "div"
            );

        mark.className =
            "topMark";

        if (
            x % 5 === 0
        ) {
            mark.textContent =
                x;
        }

        topScale.appendChild(
            mark
        );
    }

    leftScale.innerHTML = "";

    for (
        let y = 1;
        y <= rows;
        y++
    ) {

        const mark =
            document.createElement(
                "div"
            );

        mark.className =
            "leftMark";

        if (
            y % 5 === 0
        ) {
            mark.textContent =
                y;
        }

        leftScale.appendChild(
            mark
        );
    }

    /*
    =====================
       表示
    =====================
    */

    gridContainer.innerHTML =
        "";

    for (
        let x = 0;
        x < cols;
        x++
    ) {

        const column =
            document.createElement(
                "div"
            );

        column.className =
            "column";

        for (
            let y = 0;
            y < rows;
            y++
        ) {

            column.innerHTML +=
                craneSVG(
                    grid[y][x]
                );
        }

        gridContainer.appendChild(
            column
        );
    }

    adjustMobileScale();
}

function adjustMobileScale(){
    return;
}

window.addEventListener(
    "resize",
    adjustMobileScale
);