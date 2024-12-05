module GP {
    // The Content Manager
    export class ContentManager {
        // The array containing all the images
        imageArray: Array<string> = new Array();

        // The array containing all the models
        modelArray: Array<string> = new Array();

        loadedCount: number = 0;
        totalResourceCount: number = 5;

        // Constructor
        constructor() {
            // Set up the array containing all the images
            this.imageArray[GP.Resources.castlefloor] = 'Content/images/castlefloor.gif';
            this.imageArray[GP.Resources.grass] = 'Content/images/grass.gif';
            this.imageArray[GP.Resources.particle] = 'Content/images/particle.png';
            this.imageArray[GP.Resources.spear] = 'Content/images/spear.gif';

            // Set up the array containing all the models
            this.modelArray[GP.Resources.swordModel] = 'Content/models/sword.js';

            // Load all the images and models
            this.loadImagesToCache();
            this.loadModelsToCache();
        }

        // Check if the loading process is completed
        isLoadComplete() {
            var result = this.loadedCount === this.totalResourceCount;
            return result;
        }

        // Load the images and put them in cache
        loadImagesToCache() {
            var self = this;
            if (!self.imageArray) {
                return;
            }

            // Load every image
            for (var key in self.imageArray) {
                var value = self.imageArray[key];
                GP.CACHE.getSet(key, function () { return THREE.ImageUtils.loadTexture(value); });
                console.log("Texture '" + key + "' is loaded and saved to cache");
                self.loadedCount++;
            }
        }

        // Load the models and put them in cache
        loadModelsToCache() {
            var self = this;
            if (!self.modelArray) {
                return;
            }

            // Create the JSON loader
            var jsonLoader = new THREE.JSONLoader();

            // Load each model
            for (var key in self.modelArray) {
                var source = self.modelArray[key];
                console.log('trying to load ' + key);

                // Use try-catch in case a wrong input is given, which would make the loader fail.
                try {
                    jsonLoader.load(source, function (geometry, materials) {
                        // Step 1: Generate the mesh material
                        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, useScreenCoordinates: false, transparent: true });

                        // Step 2: Generate the mesh from geometry and material
                        var mesh = new THREE.Mesh(geometry, material);
                        mesh.scale.set(0.01, 0.01, 0.01);
                        mesh.position.set(0, -0.4, -2);

                        // Step 3: Add the mesh to the model object
                        var objectContainingMesh = new THREE.Object3D();
                        objectContainingMesh.add(mesh);

                        // Step 4: Add the model object to the cache
                        GP.CACHE.getSet(key, objectContainingMesh);

                        // Step 5: Increment the loaded count
                        console.log("Model '" + key + "' is loaded and saved to cache");
                        self.loadedCount++;
                    });
                } catch (e) {
                    console.log("Model '" + key + "' could not be loaded or put into cache");
                    self.loadedCount++;
                }
            }
        }
    }
}