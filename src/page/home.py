# -*- mode: python; encoding: utf-8 -*-
#
# Copyright 2012 Jens Lindström, Opera Software ASA
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

import dbutils
import htmlutils
import page.utils
import gitutils
import configuration
import reviewing.filters
import profiling

from htmlutils import jsify
from textutils import json_encode

def renderHome(req, db, user):
    if user.isAnonymous(): raise page.utils.NeedLogin(req)

    profiler = profiling.Profiler()

    cursor = db.cursor()

    readonly = req.getParameter("readonly", "yes" if user.name != req.user else "no") == "yes"
    repository = req.getParameter("repository", None, gitutils.Repository.FromParameter(db))

    if not repository:
        repository = user.getDefaultRepository(db)

    title_fullname = user.fullname

    if title_fullname[-1] == 's': title_fullname += "'"
    else: title_fullname += "'s"

    cursor.execute("SELECT email FROM usergitemails WHERE uid=%s ORDER BY email ASC", (user.id,))
    gitemails = ", ".join([email for (email,) in cursor])

    document = htmlutils.Document(req)

    html = document.html()
    head = html.head()
    body = html.body()

    page.utils.generateHeader(body, db, user, current_page="home")

    document.addExternalStylesheet("resource/home.css")
    document.addExternalScript("resource/home.js")
    document.addExternalScript("resource/autocomplete.js")
    if repository: document.addInternalScript(repository.getJS())
    else: document.addInternalScript("var repository = null;")
    if user.name != req.user and req.getUser(db).hasRole(db, "administrator"):
        document.addInternalScript("var administrator = true;")
    else:
        document.addInternalScript("var administrator = false;")
    document.addInternalScript(user.getJS())
    document.addInternalScript("user.gitEmails = %s;" % jsify(gitemails))
    document.setTitle("%s Home" % title_fullname)

    target = body.div("main")

    basic = target.table('paleyellow basic', align='center')
    basic.tr().td('h1', colspan=3).h1().text("%s Home" % title_fullname)

    def row(heading, value, help=None, status_id=None):
        main_row = basic.tr('line')
        main_row.td('heading').text("%s:" % heading)
        value_cell = main_row.td('value', colspan=2)
        if callable(value): value(value_cell)
        else: value_cell.text(value)
        basic.tr('help').td('help', colspan=3).text(help)

    def renderFullname(target):
        if readonly: target.text(user.fullname)
        else:
            target.input("value", id="user_fullname", value=user.fullname)
            target.span("status", id="status_fullname")
            target.button(onclick="saveFullname();").text("Save")
            target.button(onclick="resetFullname();").text("Reset")

    def renderEmail(target):
        if readonly: target.text(user.email)
        else:
            target.input("value", id="user_email", value=user.email)
            target.span("status", id="status_email")
            target.button(onclick="saveEmail();").text("Save")
            target.button(onclick="resetEmail();").text("Reset")

    def renderGitEmails(target):
        if readonly: target.text(gitemails)
        else:
            target.input("value", id="user_gitemails", value=gitemails)
            target.span("status", id="status_gitemails")
            target.button(onclick="saveGitEmails();").text("Save")
            target.button(onclick="resetGitEmails();").text("Reset")

    def renderPassword(target):
        target.text("****")
        if not readonly:
            target.button(onclick="changePassword();").text("Change")

    row("User ID", str(user.id))
    row("User Name", user.name)
    row("Display Name", renderFullname, "This is the name used when displaying commits or comments.", status_id="status_fullname")
    row("Email", renderEmail, "This is the primary email address, to which emails are sent.", status_id="status_email")
    row("Git Emails", renderGitEmails, "These email addresses are used to map Git commits to the user.", status_id="status_gitemails")

    if configuration.base.AUTHENTICATION_MODE == "critic":
        row("Password", renderPassword)

    profiler.check("user information")

    filters = page.utils.PaleYellowTable(body, "Filters")
    filters.titleRight.a("button", href="/tutorial?item=filters").text("Tutorial")

    cursor.execute("""SELECT repositories.id, repositories.name, repositories.path,
                             filters.id, filters.type, filters.path, filters.delegate
                        FROM repositories
                        JOIN filters ON (filters.repository=repositories.id)
                       WHERE filters.uid=%s
                    ORDER BY repositories.name, filters.type, filters.path""",
                   (user.id,))

    rows = cursor.fetchall()

    if rows:
        repository = None
        repository_filters = None
        tbody_reviewer = None
        tbody_watcher = None
        tbody_ignored = None

        count_matched_files = {}

        for (repository_id, repository_name, repository_path,
             filter_id, filter_type, filter_path, filter_delegates) in rows:
            if not repository or repository.id != repository_id:
                repository = gitutils.Repository.fromId(db, repository_id)
                repository_url = repository.getURL(db, user)
                filters.addSection(repository_name, repository_url)
                repository_filters = filters.addCentered().table("filters callout", align="center")
                tbody_reviewer = tbody_watcher = tbody_ignored = None

            if filter_type == "reviewer":
                if not tbody_reviewer:
                    tbody_reviewer = repository_filters.tbody()
                    tbody_reviewer.tr().th(colspan=4).text("Reviewer")
                tbody = tbody_reviewer
            elif filter_type == "watcher":
                if not tbody_watcher:
                    tbody_watcher = repository_filters.tbody()
                    tbody_watcher.tr().th(colspan=4).text("Watcher")
                tbody = tbody_watcher
            else:
                if not tbody_ignored:
                    tbody_ignored = repository_filters.tbody()
                    tbody_ignored.tr().th(colspan=4).text("Ignored")
                tbody = tbody_ignored

            row = tbody.tr()
            row.td("path").text(filter_path)

            delegates = row.td("delegates")
            if filter_delegates:
                delegates.i().text("Delegates: ")
                delegates.span("names").text(", ".join(filter_delegates.split(",")))

            if filter_path == "/":
                row.td("files").text("all files")
            else:
                href = "javascript:void(showMatchedFiles(%s, %s));" % (jsify(repository.name), jsify(filter_path))
                row.td("files").a(href=href, id=("f%d" % filter_id)).text("? files")
                count_matched_files.setdefault(repository_id, []).append(filter_id)

            links = row.td("links")
            arguments = (jsify(repository.name),
                         filter_id,
                         jsify(filter_type),
                         jsify(filter_path),
                         jsify(filter_delegates))
            links.a(href="javascript:void(editFilter(%s, %d, %s, %s, %s));" % arguments).text("[edit]")
            links.a(href="javascript:if (deleteFilterById(%d)) location.reload(); void(0);" % filter_id).text("[delete]")
            links.a(href="javascript:location.href='/config?filter=%d';" % filter_id).text("[preferences]")

        document.addInternalScript("var count_matched_files = %s;" % json_encode(count_matched_files.values()))
    else:
        filters.addCentered().p().b().text("No filters")

        # Additionally check if there are in fact no repositories.
        cursor.execute("SELECT 1 FROM repositories")
        if not cursor.fetchone():
            document.addInternalScript("var no_repositories = true;")

    if not readonly:
        filters.addSeparator()
        filters.addCentered().button(onclick="editFilter();").text("Add filter")

    profiler.check("filters")

    hidden = body.div("hidden", style="display: none")

    with hidden.div("filterdialog") as dialog:
        paragraph = dialog.p()
        paragraph.b().text("Repository:")
        paragraph.br()
        page.utils.generateRepositorySelect(db, user, paragraph, name="repository")

        paragraph = dialog.p()
        paragraph.b().text("Filter type:")
        paragraph.br()
        filter_type = paragraph.select(name="type")
        filter_type.option(value="reviewer").text("Reviewer")
        filter_type.option(value="watcher").text("Watcher")
        filter_type.option(value="ignored").text("Ignored")

        paragraph = dialog.p()
        paragraph.b().text("Path:")
        paragraph.br()
        paragraph.input(name="path", type="text")
        paragraph.span("matchedfiles")

        paragraph = dialog.p()
        paragraph.b().text("Delegates:")
        paragraph.br()
        paragraph.input(name="delegates", type="text")

        paragraph = dialog.p()
        label = paragraph.label()
        label.input(name="apply", type="checkbox", checked="checked")
        label.b().text("Apply to existing reviews")

    profiler.output(db, user, document)

    return document
