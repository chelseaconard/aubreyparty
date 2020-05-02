(function() {
    function ThemeUploader() {
        this.elements = {};
        this.state = {
            areDependenciesLoaded : false
        };
        this.dependencies = [
            "https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js",
            "https://www.gstatic.com/firebasejs/7.14.0/firebase-storage.js",
            "https://www.gstatic.com/firebasejs/7.14.1/firebase-firestore.js"
        ];
        this.config = {
            firebase : {
                apiKey: "AIzaSyBpQkBFFaM81E43kSjX6hg-LB--4S5dJeM",
                authDomain: "aubrey-s-photo-wall.firebaseapp.com",
                databaseURL: "https://aubrey-s-photo-wall.firebaseio.com",
                projectId: "aubrey-s-photo-wall",
                storageBucket: "aubrey-s-photo-wall.appspot.com",
                messagingSenderId: "201011707802",
                appId: "1:201011707802:web:ab325ab5a3d6af77b88423",
                measurementId: "G-H9LWBK5QKY"
            }
        };
        this.uploadThemeIdea = function(themeIdea) {
            if ( themeIdea != "" ) {
                var themeIdeaRecord = {
                    'theme' : themeIdea,
                    'created_at' : Date.now()
                };
                this.state.themeIdeasRef.add(themeIdeaRecord)
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                }.bind(this))
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                }.bind(this));
            } else {
                alert("You need to add a memory or upload a photo.");
            }
        };
        this.loadDependencies = function() {
            var promises = [];
            for ( var dependencyIndex = 0; dependencyIndex < this.dependencies.length; dependencyIndex++ ) {
                var dependencyPromise = new Promise(function(resolve, reject) {
                    var currentDependency = this.dependencies[dependencyIndex];
                    var dependencyScript = document.createElement('script');
                    dependencyScript.onload = function() {
                        resolve();
                    }.bind(this);
                    dependencyScript.src = currentDependency;
                    document.body.appendChild(dependencyScript);
                }.bind(this));
                promises.push(dependencyPromise);
            }

            Promise.all(promises).then(function() {
                this.state.areDependenciesLoaded = true;
                this.init();
            }.bind(this));
        };
        this.init = function() {
            if ( this.state.areDependenciesLoaded ) {
                firebase.initializeApp(this.config.firebase);

                this.state.db = firebase.firestore();
                this.state.themeIdeasRef = this.state.db.collection('theme-ideas');
            } else {
                this.loadDependencies();
            }
        };
    };

    var themeUploader = new ThemeUploader();

    document.addEventListener('DOMContentLoaded', function() {
        themeUploader.init();
        window.uploadThemeIdea = themeUploader.uploadThemeIdea.bind(themeUploader);
    });
})();