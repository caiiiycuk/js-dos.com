import { domToKeyCode } from "./keys";
import { Notyf } from "notyf";

// tslint:disable-next-line:no-var-requires
const elementResizeDetector = require("element-resize-detector");
const resizeDetector = elementResizeDetector({
});

export interface ControlSelector {
    select: () => HTMLSelectElement;
    input: () => HTMLInputElement;
    send: () => HTMLElement;
    save: () => HTMLElement;
    fullscreen: () => HTMLElement;
}

export function layers(root: HTMLDivElement, controlSelector?: ControlSelector) {
    return new Layers(root, controlSelector);
}

export class Layers {
    root: HTMLDivElement;
    loading: HTMLDivElement;
    canvas: HTMLCanvasElement;
    video: HTMLVideoElement;
    mouseOverlay: HTMLDivElement;
    controls: HTMLDivElement | null;
    controlSelector: ControlSelector;
    width: number;
    height: number;
    notyf = new Notyf();

    private clickToStart: HTMLDivElement;
    private loaderText: HTMLPreElement;
    private onResize: (width: number, height: number) => void;
    private onKeyDown: (keyCode: number) => void;
    private onKeyUp: (keyCode: number) => void;
    private onKeyPress: (keyCode: number) => void;
    private onSave: () => Promise<void>;
    private controlsOpened = false;
    private selectParentElement: HTMLElement;
    private selectParentDisplay: string;

    constructor(root: HTMLDivElement, controlSelector?: ControlSelector) {
        this.root = root;
        this.root.classList.add("emulator-root");

        this.canvas = document.createElement("canvas");
        this.canvas.className = "emulator-canvas";

        this.video = document.createElement("video");
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("playsinline", "");
        this.video.className = "emulator-video";

        this.loading = createLoadingLayer();
        this.loaderText = this.loading.querySelector(".emulator-loading-pre-2") as HTMLPreElement;
        this.mouseOverlay = createMouseOverlayLayer();

        this.clickToStart = createClickToStartLayer();
        this.clickToStart.onclick = () => {
            this.clickToStart.style.display = "none";
            this.video.play();
        };

        this.root.appendChild(this.canvas);
        this.root.appendChild(this.video);
        this.root.appendChild(this.mouseOverlay);
        this.root.appendChild(this.clickToStart);

        let exitFullscreen: HTMLDivElement | null = null;
        if (controlSelector !== undefined) {
            this.controls = null;
            this.controlSelector = controlSelector;
            exitFullscreen = createExitFullscreenElement();
            this.root.appendChild(exitFullscreen);
        } else {
            const controls = createControlsLayer();
            this.controls = controls;
            this.root.appendChild(controls);
            this.controlSelector = {
                select: () => controls.querySelector(".emulator-control-select") as HTMLSelectElement,
                send: () => controls.querySelector(".emulator-control-send-icon") as HTMLElement,
                input: () => controls.querySelector(".emulator-control-input-input") as HTMLInputElement,
                save: () => controls.querySelector(".emulator-control-save-icon") as HTMLElement,
                fullscreen: () => controls.querySelector(".emulator-control-fullscreen-icon") as HTMLElement,
            };
        }
        this.selectParentElement = this.controlSelector.select().parentElement as HTMLElement;
        this.selectParentDisplay = this.selectParentElement.style.display;
        this.root.appendChild(this.loading);

        this.width = root.offsetWidth;
        this.height = root.offsetHeight;

        this.onResize = () => { /**/ };
        this.onKeyDown = () => { /**/ };
        this.onKeyUp = () => { /**/ };
        this.onKeyPress = () => { /**/ };
        this.onSave = () => { return Promise.reject(new Error("Not implemented")); };

        resizeDetector.listenTo(this.root, (el: HTMLElement) => {
            if (el !== root) {
                return;
            }

            this.width = el.offsetWidth;
            this.height = el.offsetHeight;
            this.onResize(this.width, this.height);
        });

        window.addEventListener("keydown", (e) => {
            const keyCode = domToKeyCode(e.keyCode);
            this.onKeyDown(keyCode);
        });

        window.addEventListener("keyup", (e) => {
            const keyCode = domToKeyCode(e.keyCode);
            this.onKeyUp(keyCode);
        });

        const sendButton = this.controlSelector.send();
        const sendInput = this.controlSelector.input();
        const saveButton = this.controlSelector.save();
        const fullscreenButton = this.controlSelector.fullscreen();

        if (this.controls !== null) {
            const controls = this.controls;
            const controlToggle = controls.querySelector(".emulator-control-toggle") as HTMLDivElement;
            controlToggle.onclick = () => {
                this.controlsOpened = !this.controlsOpened;

                if (this.controlsOpened) {
                    controlToggle.innerHTML = "&#9650;";
                    controls.style.marginTop = "0px";

                    setTimeout(() => {
                        sendInput.focus();
                    }, 16);
                } else {
                    controlToggle.innerHTML = "&#9660;";
                    controls.style.marginTop = "-40px";
                }
            };
        }

        sendInput.addEventListener("keydown", (e) => e.stopPropagation());
        sendInput.addEventListener("keyup", (e) => e.stopPropagation());

        sendButton.onclick = () => {
            const intervalMs = 32;
            const toSend = sendInput.value.toUpperCase();
            let it = 0;

            const sendNext = () => {
                const charCode = toSend.charCodeAt(it / 2);
                const fn = it % 2 === 0 ? this.onKeyDown : this.onKeyUp;
                const keyCode = domToKeyCode(charCode);
                fn(keyCode);
                it++;

                if (it / 2 < toSend.length) {
                    setTimeout(sendNext, intervalMs);
                }
            };
            setTimeout(sendNext, intervalMs);

            sendInput.value = "";
        };

        saveButton.onclick = () => {
            this.onSave()
                .then(() => {
                    this.notyf.success("Saved");
                })
                .catch((error) => {
                    this.notyf.error(error.message);
                });
        };

        const toggleFullscreen = () => {
            if (fullscreenButton.classList.contains("emulator-enabled")) {
                fullscreenButton.classList.remove("emulator-enabled");
                if (this.root.classList.contains("emulator-fullscreen-workaround")) {
                    this.root.classList.remove("emulator-fullscreen-workaround");
                } else if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    (document as any).webkitExitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    (document as any).mozCancelFullScreen();
                } else if ((document as any).msExitFullscreen) {
                    (document as any).msExitFullscreen();
                }
                if (exitFullscreen !== null) {
                    exitFullscreen.style.display = "none";
                }
            } else {
                fullscreenButton.classList.add("emulator-enabled");
                const element = this.root as any;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.webkitEnterFullscreen) {
                    element.webkitEnterFullscreen();
                } else {
                    this.root.classList.add("emulator-fullscreen-workaround");
                }
                if (exitFullscreen !== null) {
                    exitFullscreen.style.display = "block";
                }
            }
        };

        fullscreenButton.onclick = toggleFullscreen;
        if (exitFullscreen !== null) {
            exitFullscreen.onclick = toggleFullscreen;
        }

        this.root.onfullscreenchange = () => {
            if (document.fullscreenElement !== this.root) {
                fullscreenButton.classList.remove("emulator-enabled");
            }
        }
    }

    setOnResize(handler: (width: number, height: number) => void) {
        this.onResize = handler;
    }

    setOnKeyDown(handler: (keyCode: number) => void) {
        this.onKeyDown = handler;
    }

    fireKeyDown(keyCode: number) {
        this.onKeyDown(keyCode);
    }

    setOnKeyUp(handler: (keyCode: number) => void) {
        this.onKeyUp = handler;
    }

    fireKeyUp(keyCode: number) {
        this.onKeyUp(keyCode);
    }

    setOnKeyPress(handler: (keyCode: number) => void) {
        this.onKeyPress = handler;
    }

    fireKeyPress(keyCode: number) {
        this.onKeyPress(keyCode);
    }

    setOnSave(handler: () => Promise<void>) {
        this.onSave = handler;
    }

    hideLoadingLayer() {
        this.loading.style.visibility = "hidden";
    }

    showLoadingLayer() {
        this.loading.style.visibility = "visible";
    }

    setLoadingMessage(message: string) {
        this.loaderText.innerHTML = message;
    }

    switchToVideo() {
        this.video.style.display = "block";
        this.canvas.style.display = "none";
    }

    showClickToStart() {
        this.clickToStart.style.display = "flex";
    }

    setControlLayers(layers: string[], onChange: (layer: string) => void) {
        const el = this.controlSelector.select();
        delete el.onchange;

        while (el.firstChild) {
            el.removeChild(el.lastChild as Node);
        }

        if (layers.length <= 1) {
            this.selectParentElement.style.display = "none";
            return;
        }

        for (const next of layers) {
            const option = document.createElement("option");
            option.value = next;
            option.innerHTML = next;
            el.appendChild(option);
        }

        el.onchange = (e: any) => {
            const layer = e.target.value;
            onChange(layer);
        };

        this.selectParentElement.style.display = this.selectParentDisplay;
    }
}

function createDiv(className: string, innerHtml: string) {
    const el = document.createElement("div");
    el.className = className;
    el.innerHTML = innerHtml;
    return el;
}

function createLoadingLayer() {
    return createDiv("emulator-loading", `
<div class='emulator-loading-inner'>
<pre class='emulator-loading-pre-1'>
        _                __
       (_)____      ____/ /___  _____ _________  ____ ___
      / / ___/_____/ __  / __ \\/ ___// ___/ __ \\/ __ \`__ \\
     / (__  )_____/ /_/ / /_/ (__  )/ /__/ /_/ / / / / / /
  __/ /____/      \\__,_/\\____/____(_)___/\\____/_/ /_/ /_/
 /___/
</pre>
<pre class='emulator-loading-pre-2'>
</pre>
<div class='emulator-loader'>
</div>
</div>
`);
}

function createControlsLayer() {
    return createDiv("emulator-controls", `
<div class='emulator-control-pane'>
  <div class='emulator-control-select-wrapper'>
    <select class='emulator-control-select'>
    </select>
  </div>
  <div class='emulator-control-input'>
    <div class='emulator-control-input-icon'></div>
    <div class='emulator-control-input-wrapper'>
      <input class='emulator-control-input-input' type="text">
    </div>
    <div class='emulator-control-send-icon'></div>
  </div>
  <div class='emulator-control-save-icon'></div>
  <div class='emulator-control-fullscreen-icon'></div>
</div>

<div class='emulator-control-toggle'>
&#9660;
</div>
</div>
`);
}

function createExitFullscreenElement() {
    return createDiv("emulator-control-exit-fullscreen-icon", "");
}

function createMouseOverlayLayer() {
    return createDiv("emulator-mouse-overlay", "");
}

function createClickToStartLayer() {
    return createDiv("emulator-click-to-start-overlay", `
<div class="emulator-click-to-start-text">Press to start</div>
<div class="emulator-click-to-start-icon"></div>
`);
}
