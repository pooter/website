#!/usr/bin/env python
# encoding: utf-8
"""
WebController.py

Created by Tom Flannery on 2011-01-02.
Copyright (c) 2010 Tutt. All rights reserved.
"""

import os
import logging
import wsgiref.handlers

from google.appengine.api import users
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from helpers.app_helpers import helper
from helpers.app_helpers import BaseHandler


class WebIndexPageHandler(BaseHandler):
  def get(self):
    path = helper.template_path("index.tmpl")
    self.response.out.write(template.render(path, self.template_args))
    

class WebPrizesPageHandler(BaseHandler):
  def get(self):
    path = helper.template_path("prizes.tmpl")
    self.response.out.write(template.render(path, self.template_args))


class WebLoginHandler(BaseHandler):
  def get(self):
    redirect_to = self.request.get("redirect_to")
    self.redirect(users.create_login_url(redirect_to))


class WebLogoutHandler(BaseHandler):
  def get(self):
    redirect_to = self.request.get("redirect_to")
    self.redirect(users.create_logout_url(redirect_to))


application = webapp.WSGIApplication([
    ('/', WebIndexPageHandler),
    ('/login', WebLoginHandler),
    ('/logout', WebLogoutHandler),
    ('/prizes', WebPrizesPageHandler),
], debug=True)


def main():
  run_wsgi_app(application)


if __name__ == '__main__':
  main()
