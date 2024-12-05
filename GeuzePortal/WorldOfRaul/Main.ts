/// <reference path="../Scripts/Libraries/jquery.d.ts" />
/// <reference path="../Scripts/Libraries/bootstrap.d.ts" />
/// <reference path="../Scripts/Libraries/knockout.d.ts" />
/// <reference path="../Scripts/Libraries/toastr.d.ts" />
/// <reference path="../Scripts/Libraries/three.d.ts" />
/// <reference path="../Scripts/Libraries/tween.js.d.ts" />
/// <reference path="../Scripts/Libraries/xt.browsers.d.ts" />
/// <reference path="../Scripts/Libraries/xt.microcache.d.ts" />
/// <reference path="../Scripts/Libraries/xt.webgldetector.d.ts" />
/// <reference path="../Scripts/Libraries/xt.windowresize.d.ts" />
/// <reference path="./Game/Resources.ts" />
/// <reference path="./Game/Animation.ts" />
/// <reference path="./Interface/Scene.ts" />
/// <reference path="./Skills/Skill.ts" />
/// <reference path="./Skills/Death.ts" />
/// <reference path="./Skills/Slash.ts" />
/// <reference path="./Game/Player.ts" />
/// <reference path="./Game/Enemy.ts" />
/// <reference path="./Managers/SceneManager.ts" />
/// <reference path="./Managers/ContentManager.ts" />
/// <reference path="./Managers/RuleManager.ts" />
/// <reference path="./Managers/WorldManager.ts" />
/// <reference path="./Interface/GameScene.ts" />

// .. 
// ..  Nieuwe naam voor de game: The Dark Days of ...
// ..


// Geuze Portal Entry point
module GP {

    // The cache
    export var CACHE: MicroCache = new MicroCache();

    // Get a random chance and call the win or fail methods
    export function Random(chance, win, fail) {
        // Check the required 'chance' and 'win' arguments
        var canContinue = chance && win ? true : false;
        if (canContinue) {
            var rnd = Math.random();
            if (rnd <= chance) {
                win();
            } else {
                if (fail) {
                    fail();
                }
            }
        }
    }

    // The Main Game class
    export class Main {
        contentManager: ContentManager;
        sceneManager: SceneManager;
        container: HTMLElement;
        renderer: THREE.WebGLRenderer;
        loadingComplete: boolean;
        resizer: THREEx.WindowResize;

        // Constructor
        constructor() {
            // Stop initializing if the browser is not compatible with WebGL
            if (!this.browserCompatible()) {
                console.log(Resources.browserIncompatible);
                return;
            }

            // Setup the game content
            this.contentManager = new ContentManager();
        }

        // Initialize the rest of the application
        initApplication() {
            // Initialize the variables
            this.container = document.body;
            
            // Initialize the scene manager and set the startup scene
            this.sceneManager = new GP.SceneManager();
            this.sceneManager.addScene(new GP.GameScene());
            this.sceneManager.gotoScene(GP.Resources.worldofraul_game);

            // Initialize the render engine
            var viewAngle = 75, near = 0.1, far = 100;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(new THREE.Color("#000000"), 1);
            
            // Append all controls to the DOM
            this.container.appendChild(this.renderer.domElement);

            // Set the window resize handler
            this.setWindowResizer();

            // Set loading complete
            this.loadingComplete = true;
        }

        // Check if the browser is compatible (Chrome/FF)
        browserCompatible() {
            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
            }

            return Detector.webgl;
        }

        // Check if loading is complete
        isLoadingComplete() {
            return this.contentManager.isLoadComplete();
        }

        // Set the window resize handler
        setWindowResizer() {
            if (this.resizer) {
                this.resizer.stop();
            }

            var activeScene = this.sceneManager.getActiveScene();
            this.resizer = new THREEx.WindowResize(this.renderer, activeScene.camera);
        }

        // Update the game
        update() {
            var self = this;

            // Don't update anything if the content is still being loaded
            if (!self.contentManager.isLoadComplete()) {
                return;
            }

            this.sceneManager.update();
            this.setWindowResizer();
        }

        // Render the game
        render() {
            var self = this;

            // Don't draw anything if the content is still being loaded
            if (!self.contentManager.isLoadComplete()) {
                return;
            }

            // Render the active scene
            var activeScene = self.sceneManager.getActiveScene();
            if (activeScene && activeScene.scene && activeScene.camera) {
                // Adjust the clear color for this scene
                this.renderer.setClearColor(activeScene.clearColor, 1);

                // Render the scene
                self.renderer.render(activeScene.scene, activeScene.camera);
            }
        }
    }
}

// Create new entry instance
var appInstance = new GP.Main();

var appLoop = function () {
    requestAnimationFrame(appLoop);

    // Check if loading is finished
    if (!appInstance.loadingComplete) {
        if (appInstance.isLoadingComplete()) {
            appInstance.initApplication();
        } else {
            // Loading is not complete.. wait some more ...
        }

    } else {
        appInstance.update();
        appInstance.render();
    }
};

$(document).ready(function () {
    appLoop();
});