CRITIC_CSS := $(shell find src -type f -name '*.css')
CRITIC_JS := $(shell find src -type f -name '*.js' -not -path "*/__tests__/*")
FONTS := fonts/*
SHELL := /bin/bash
TOOLS_JS := tools/*.js


all: build

.PHONY: all


build: static static/index.html static/tools.js static/critic.js static/critic.css static/fonts

.PHONY: build


clean:
	@rm -rf static

.PHONY: clean


watch:
	@# Linux users, please add inotify stuff
	@fswatch -o src -e \.sw.$ | xargs -n1 -I{} make

.PHONY: watch


test:
	@./node_modules/.bin/jest $(TESTS)

.PHONY: test


test-watch:
	@fswatch -o src -e \.sw.$ | xargs -n1 -I{} make test

.PHONY: test-watch


lint:
	@./node_modules/.bin/eslint .

.PHONY: lint


static:
	@mkdir -p $@


static/index.html: src/index.html
	$(info building $(@) ...)
	@cp $^ $@


static/tools.js: $(TOOLS_JS)
	$(info building $(@) ...)
	@cat development.js > $@
	@cat $^ >> $@


static/critic.js: $(CRITIC_JS)
	$(info building $(@) ...)
	@echo "" > $@
	@for file in $^; do \
	echo "define('./$${file:4}', function(require, exports, module) {" >> $@; \
	cat $${file} >> $@; \
	echo "});" >> $@; \
	done;


static/critic.css: $(CRITIC_CSS)
	$(info building $(@) ...)
	@cat $^ > $@


static/fonts: $(FONTS)
	$(info building $(@) ...)
	@mkdir -p $@
	@cp -n $^ $@/

