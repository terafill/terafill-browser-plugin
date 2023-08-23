function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createTooltipForInput(input, uuid) {
    const computedStyles = window.getComputedStyle(input);
    const tooltip = document.createElement("span");
    tooltip.textContent = uuid;
    tooltip.style.position = "absolute";
    tooltip.style.top = "0";
    tooltip.style.right = "0";
    tooltip.style.backgroundColor = "white";
    tooltip.style.border = "1px solid black";
    tooltip.style.zIndex = "10000";
    tooltip.style.padding = "2px";
    tooltip.style.fontSize = "10px";

    if (["relative", "absolute", "fixed"].includes(computedStyles.position)) {
        input.parentElement.appendChild(tooltip);
    } else {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(tooltip);
    }
}


// const inputData =  {
//     result: "unknown",
//     id: uuid,
//     type: input.type,
//     attributes: Array.from(input.attributes).reduce((acc, attribute) => {
//         acc[attribute.name] = attribute.value;
//         return acc;
//     }, {}),
//     computedStyles: (() => {
//         const styles = window.getComputedStyle(input);
//         return {
//             display: styles.display,
//             opacity: styles.opacity,
//             visibility: styles.visibility,
//             width: styles.width,
//             height: styles.height,
//             position: styles.position,
//             left: styles.left,
//             top: styles.top
//         };
//     })(),
//     associatedLabel: input.labels?.[0]?.textContent || null,
//     placeholder: input.placeholder,
//     parentAttributes: Array.from(input.parentElement.attributes).reduce((acc, attribute) => {
//         acc[attribute.name] = attribute.value;
//         return acc;
//     }, {}),
//     domain: window.location.hostname
// };

// [
// "associatedLabel",
// "placeholder",
// "attributes.aria-label",
// "attributes.autocomplete",
// "attributes.class",
// "attributes.name",
// "parentAttributes.aria-hidden",
// "parentAttributes.autocomplete",
// "parentAttributes.class",
// ]


// "attributes.aria-hidden",
// "attributes.aria-required",
// "parentAttributes.aria-hidden",
function getInputData(input) {
    const uuid = generateUUID();

    const inputData =  {
        result: "unknown",
        id: uuid,
        type: input.type,
        attributes: Array.from(input.attributes).reduce((acc, attribute) => {
            acc[attribute.name] = attribute.value;
            return acc;
        }, {}),
        computedStyles: (() => {
            const styles = window.getComputedStyle(input);
            return {
                display: styles.display,
                opacity: styles.opacity,
                visibility: styles.visibility,
                width: styles.width,
                height: styles.height,
                position: styles.position,
                left: styles.left,
                top: styles.top
            };
        })(),
        associatedLabel: input.labels?.[0]?.textContent || null,
        placeholder: input.placeholder,
        parentAttributes: Array.from(input.parentElement.attributes).reduce((acc, attribute) => {
            acc[attribute.name] = attribute.value;
            return acc;
        }, {}),
        domain: window.location.hostname
    };

    createTooltipForInput(input, uuid);

    return inputData;
}

function downloadDataAsJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (new URL(window.location)).hostname + '.json';
    a.click();
}

const inputFieldsData = Array.from(document.querySelectorAll('input')).map(getInputData);

downloadDataAsJSON(inputFieldsData);