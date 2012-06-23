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

from django.utils import simplejson as json
from google.appengine.api import urlfetch
from urllib import urlencode

template.register_template_library('helpers.app_filters')

POOTER_API_ENDPOINT = 'http://pooter-bee-live.appspot.com/'


class WebIndexPageHandler(BaseHandler):
  def get(self):
    path = helper.template_path("index.tmpl")
    self.response.out.write(template.render(path, self.template_args))


class WebPrizesPageHandler(BaseHandler):
  def get(self):
    path = helper.template_path("prizes.tmpl")
    self.response.out.write(template.render(path, self.template_args))


class WebPootsPageHandler(BaseHandler):
  def get(self):
    url = POOTER_API_ENDPOINT + "poot/all"
    result = urlfetch.fetch(url)

    received_content = result.content

    path = helper.template_path("poots.tmpl")
    template_args = json.loads(received_content)
    logging.info(template_args)

    self.response.out.write(template.render(path, template_args))


class WebPootPageHandler(BaseHandler):
  def get(self, poot_key_name):
    url = POOTER_API_ENDPOINT + "poot/" + poot_key_name
    result = urlfetch.fetch(url)
    
    received_content = result.content
       
    path = helper.template_path("poot.tmpl")
    template_args = json.loads(received_content)
    template_args["poot_key"] = poot_key_name

    self.response.out.write(template.render(path, template_args))


application = webapp.WSGIApplication([
    ('/', WebIndexPageHandler),
    ('/prizes', WebPrizesPageHandler),
    ('/poots', WebPootsPageHandler),
    ('/poot/([a-zA-Z0-9-_]+)', WebPootPageHandler),
], debug=True)


def main():
  run_wsgi_app(application)


if __name__ == '__main__':
  main()
