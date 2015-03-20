# -*- mode: python; encoding: utf-8 -*-
#
# Copyright 2015 the Critic contributors, Opera Software ASA
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy of
# the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.

import installation
import os
import shutil
import string

created_dir = []
created_file = []

# CommonJS module definition wrapper. See web/tools/require.js
module_head = "define('./%s', function(require, exports, module) {\n"
module_foot = "});\n"


def concat(sources, target):
    with open(target, "w") as outfile:
        for source in sources:
            with open(source, "r") as infile:
                shutil.copyfileobj(infile, outfile)

def skip(path):
    # Paths starting with _, such as __tests__, are private and ignored.
    return path.startswith("_")

def get_js(root):
    scripts = []
    for dirpath, dirnames, files in os.walk(root):
        dirnames[:] = [dirname for dirname in dirnames if not skip(dirname)]
        scripts = scripts + [(os.path.join(dirpath, filename))
            for filename in files if filename.endswith(".js") and not skip(filename)]
    return scripts

def get_css(root):
    stylesheets = []
    for dirpath, dirnames, files in os.walk(root):
        dirnames[:] = [dirname for dirname in dirnames if not skip(dirname)]
        stylesheets = stylesheets + [(os.path.join(dirpath, filename))
            for filename in files if filename.endswith(".css") and not skip(filename)]
    return stylesheets

def install(data):
    source_dir = os.path.join(installation.root_dir, "web")
    target_dir = os.path.join(installation.paths.install_dir, "web")

    os.mkdir(target_dir, 0755)
    created_dir.append(target_dir)

    def process_modules():
        target = os.path.join(target_dir, "critic.js")
        modules_source_dir = os.path.join(source_dir, "src")
        sources = get_js(modules_source_dir)
        with open(target, "w") as outfile:
            for source in sources:
                with open(source, "r") as infile:
                    relpath = os.path.relpath(source, modules_source_dir)
                    outfile.write(module_head % relpath)
                    shutil.copyfileobj(infile, outfile)
                    outfile.write(module_foot)
        created_file.append(target)

    def process_globals():
        target = os.path.join(target_dir, "tools.js")
        sources = get_js(os.path.join(source_dir, "tools"))
        sources.insert(0, os.path.join(source_dir, "production.js"))
        concat(sources, target)
        created_file.append(target)

    def process_styles():
        target = os.path.join(target_dir, "critic.css")
        sources = get_css(os.path.join(source_dir, "src"))
        concat(sources, target)
        created_file.append(target)

    def process_fonts():
        target = os.path.join(target_dir, "fonts")
        shutil.copytree(os.path.join(source_dir, "fonts"), target)
        created_dir.append(target)

    def process_index():
        target = os.path.join(target_dir, "index.html")
        source = os.path.join(source_dir, "src/index.html")
        with open(target, "w") as outfile:
            with open(source, "r") as infile:
                tmpl = string.Template(infile.read())
                outfile.write(tmpl.safe_substitute(WEB_ROOT="/dev/"))
        created_file.append(target)

    process_globals()
    process_modules()
    process_styles()
    process_index()

    return True

def upgrade(arguments, data):
    source_dir = os.path.join(installation.root_dir, "web")
    target_dir = os.path.join(data["installation.paths.install_dir"], "web")

    if not os.path.isdir(target_dir):
        os.mkdir(target_dir, 0755)
        created_dir.append(target_dir)
    os.chown(target_dir, installation.system.uid, installation.system.gid)

    def process_modules():
        target = os.path.join(target_dir, "critic.js")
        modules_source_dir = os.path.join(source_dir, "src")
        sources = get_js(modules_source_dir)
        with open(target, "w") as outfile:
            for source in sources:
                with open(source, "r") as infile:
                    relpath = os.path.relpath(source, modules_source_dir)
                    outfile.write(module_head % relpath)
                    shutil.copyfileobj(infile, outfile)
                    outfile.write(module_foot)
        if not os.path.isfile(target):
            created_file.append(target)

    def process_globals():
        target = os.path.join(target_dir, "tools.js")
        sources = get_js(os.path.join(source_dir, "tools"))
        sources.insert(0, os.path.join(source_dir, "production.js"))
        concat(sources, target)
        if not os.path.isfile(target):
            created_file.append(target)

    def process_styles():
        target = os.path.join(target_dir, "critic.css")
        sources = get_css(os.path.join(source_dir, "src"))
        concat(sources, target)
        if not os.path.isfile(target):
            created_file.append(target)

    def process_fonts():
        target = os.path.join(target_dir, "fonts")
        source = os.path.join(source_dir, "fonts")
        if not os.path.isdir(target_dir):
            shutil.copytree(source, target)
            created_dir.append(target_dir)
        else:
            for filename in os.listdir(source):
                filepath = os.path.join(source, filename)
                if (os.path.isfile(filepath)):
                    shutil.copy(filepath, target)
                    created_file.append(target)

    def process_index():
        target = os.path.join(target_dir, "index.html")
        source = os.path.join(source_dir, "src/index.html")
        with open(target, "w") as outfile:
            with open(source, "r") as infile:
                tmpl = string.Template(infile.read())
                outfile.write(tmpl.safe_substitute(WEB_ROOT="/dev/"))
        if not os.path.isfile(target):
            created_file.append(target)

    process_globals()
    process_modules()
    process_styles()
    process_index()

    return True

def undo():
    map(os.unlink, reversed(created_file))
    map(os.rmdir, reversed(created_dir))
