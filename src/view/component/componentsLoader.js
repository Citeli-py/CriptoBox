async function loadComponents() {
    const components = document.querySelectorAll("[data-component]");
    for (const element of components) {
        const component = element.getAttribute("data-component");
        const response = await fetch(`src/view/component/${component}.html`);
        element.innerHTML = await response.text();
    }
}
loadComponents();
