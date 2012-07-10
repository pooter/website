#!/usr/bin/env python
# encoding: utf-8
"""
WebController.py

Created by Tom Flannery on 2011-01-02.
Copyright (c) 2010 Tutt. All rights reserved.
"""

import os
import logging
import hashlib
import wsgiref.handlers
import urllib

from google.appengine.api import users
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

from helpers.app_helpers import helper
from helpers.app_helpers import BaseHandler

from django.utils import simplejson as json
from google.appengine.api import urlfetch
from urllib import urlencode
from appengine_utilities import sessions

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
    template_args = dict(self.template_args, **json.loads(received_content))

    self.response.out.write(template.render(path, template_args))


class WebPootPageHandler(BaseHandler):
  def get(self, poot_key_name):
    url = POOTER_API_ENDPOINT + "poot/" + poot_key_name
    result = urlfetch.fetch(url)
    
    received_content = result.content
       
    path = helper.template_path("poot.tmpl")
    template_args = dict(self.template_args, **json.loads(received_content))
    template_args["poot_key"] = poot_key_name

    self.response.out.write(template.render(path, template_args))


class WebDispootHandler(BaseHandler):
  def post(self, poot_key_name):
    if self.current_user_key:
      url = POOTER_API_ENDPOINT + "poot/" + poot_key_name + "/dispoot"
      form_fields = {
        "points": self.request.get("points"),
        "reason": self.request.get("reason"),
      }
      form_data = urllib.urlencode(form_fields)
      result = urlfetch.fetch(url=url,
                              payload=form_data,
                              method=urlfetch.POST,
                              headers={'Content-Type': 'application/x-www-form-urlencoded'})
      received_content = result.content
      self.redirect(self.request.get("redirect_url"))
    self.response.out.write("You aren't a registered player, sorry")


class WebLoginPageHandler(BaseHandler):
  def get(self):
    path = helper.template_path("login.tmpl")
    template_args = {}
    if self.request.get("redirect_url"):
      template_args = { "redirect_url": self.request.get("redirect_url")}
    if self.request.get("message"):
      template_args["message"] = self.request.get("message")
    self.response.out.write(template.render(path, template_args))
    
  
  def post(self):
    url = POOTER_API_ENDPOINT + "auth/login?"
    form_fields = {
      "email": self.request.get("email"),
      "password": hashlib.md5(self.request.get("password")).hexdigest(),
    }
    form_data = urllib.urlencode(form_fields)
    result = urlfetch.fetch(url=url,
                            payload=form_data,
                            method=urlfetch.POST,
                            headers={'Content-Type': 'application/x-www-form-urlencoded'})
    received_content = json.loads(result.content)
    
    logging.info(received_content)
    if received_content["success"] == True:
      self.sess = sessions.Session()
      self.sess["user_key"] = received_content["user_key"]
      if self.request.get("redirect_url"):
        self.redirect(self.request.get("redirect_url"))
      else:
        self.redirect('/')
    else:
      redirect_url_string = None
      if self.request.get("redirect_url"):
        redirect_url_string = "&redirect_url=" + self.request.get("redirect_url")
      self.redirect('/login?message=' + received_content["error"] + redirect_url_string)

class WebLogoutHandler(BaseHandler):
  def get(self):
    self.sess = sessions.Session()
    self.sess.delete()
    self.redirect(self.request.get("redirect_url"))

application = webapp.WSGIApplication([
    ('/', WebIndexPageHandler),
    ('/prizes', WebPrizesPageHandler),
    ('/poots', WebPootsPageHandler),
    ('/poot/([a-zA-Z0-9-_]+)/dispoot', WebDispootHandler),
    ('/poot/([a-zA-Z0-9-_]+)', WebPootPageHandler),
    ('/login', WebLoginPageHandler),
    ('/logout', WebLogoutHandler),
], debug=True)


def main():
  run_wsgi_app(application)


if __name__ == '__main__':
  main()
