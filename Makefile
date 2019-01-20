
dist: all
	echo

configure:
	sudo npm install

all:
	perl -pi -e 's/return (?:true|false);/return false;/sg' src/x_ite/DEBUG.js

	node_modules/requirejs/bin/r.js -o x_ite.build.js
	node_modules/uglify-js-es6/bin/uglifyjs --compress --mangle -- dist/x_ite.js > dist/x_ite.min.js
	node_modules/requirejs/bin/r.js -o cssIn=src/x_ite.css out=dist/x_ite.css

	node_modules/requirejs/bin/r.js -o cad-geometry.build.js
	node_modules/uglify-js-es6/bin/uglifyjs --compress --mangle -- dist/cad-geometry.js > dist/cad-geometry.min.js

	node_modules/requirejs/bin/r.js -o nurbs.build.js
	node_modules/uglify-js-es6/bin/uglifyjs --compress --mangle -- dist/nurbs.js > dist/nurbs.min.js

	node_modules/requirejs/bin/r.js -o rigid-body-physics.build.js
	node_modules/uglify-js-es6/bin/uglifyjs --mangle -- dist/rigid-body-physics.js > dist/rigid-body-physics.min.js

	node_modules/requirejs/bin/r.js -o texturing-3d.build.js
	node_modules/uglify-js-es6/bin/uglifyjs --compress --mangle -- dist/texturing-3d.js > dist/texturing-3d.min.js

	perl -pi -e 's|text/text!|text!|sg' dist/x_ite.js
	perl -pi -e 's|text/text!|text!|sg' dist/x_ite.min.js

	cp src/x_ite.html x_ite.min.html
	perl -pi -e 's|\s*<script type="text/javascript" src="\.\./node_modules/requirejs/require.js"></script>\n||sg' x_ite.min.html
	perl -pi -e 's|\s*<script type="text/javascript" src=".*?.config.js"></script>\n||sg'                          x_ite.min.html

	perl -pi -e 's|"x_ite.css"|"dist/x_ite.css"|sg'   x_ite.min.html
	perl -pi -e 's|"x_ite.js"|"dist/x_ite.min.js"|sg' x_ite.min.html

	perl -pi -e 's|"components/cad-geometry.js"|"dist/cad-geometry.min.js"|sg'             x_ite.min.html
	perl -pi -e 's|"components/nurbs.js"|"dist/nurbs.min.js"|sg'                           x_ite.min.html
	perl -pi -e 's|"components/rigid-body-physics.js"|"dist/rigid-body-physics.min.js"|sg' x_ite.min.html
	perl -pi -e 's|"components/texturing-3d.js"|"dist/texturing-3d.min.js"|sg'             x_ite.min.html

	perl -pi -e 's|\.\./x_ite.min.html|src/x_ite.html|sg'                       x_ite.min.html
	perl -pi -e 's|class="links"|class="links min-links"|sg'                    x_ite.min.html
	perl -pi -e 's|\>x_ite.min.html|>src/x_ite.html|sg'                         x_ite.min.html
	perl -pi -e 's|x_ite-dev|x_ite-min|sg'                                      x_ite.min.html
	perl -pi -e 's|"bookmarks.js"|"src/bookmarks.js"|sg'                        x_ite.min.html
	perl -pi -e 's|"examples.js"|"src/examples.js"|sg'                          x_ite.min.html
	perl -pi -e 's|"tests.js"|"src/tests.js"|sg'                                x_ite.min.html
	perl -pi -e 's|\.\./tests/|tests/|sg'                                       x_ite.min.html

	perl build/dist.pl

	echo
	ls -la dist/x_ite.min.js
	echo

	perl -pi -e 's/return (?:true|false);/return true;/sg' src/x_ite/DEBUG.js


version: all
	perl build/version.pl


clean:
	rm x_ite.min.html
	rm x_ite.uncompressed.js
	rm x_ite.min.js
